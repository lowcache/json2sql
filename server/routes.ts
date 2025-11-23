import type { Express } from "express";
import { createServer, type Server } from "http";
import {
  conversionRequestSchema,
  createPaymentIntentSchema,
} from "@shared/schema";
import { jsonToSql } from "./utils/json-to-sql";
import { jsonToCsv } from "./utils/json-to-csv";
import {
  createPaymentIntent,
  createStripeCustomer,
  getStripeCustomerByEmail,
  stripe,
} from "./stripe";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

const TRIAL_LIMIT = 50;

export async function registerRoutes(app: Express): Promise<Server> {
  // Conversion API endpoint
  app.post("/api/convert", async (req, res) => {
    try {
      // Validate request body
      const validationResult = conversionRequestSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          error: "Invalid request",
          details: validationResult.error.errors,
        });
      }

      const { jsonData, format, options = {} } = validationResult.data;

      // Parse JSON
      try {
        JSON.parse(jsonData);
      } catch (error) {
        return res.status(400).json({
          error: "Invalid JSON",
          message: "The provided data is not valid JSON",
        });
      }

      // Perform conversion first to get actual row count
      let result;

      // TODO: Get user from request when authentication is implemented
      const user = await db.query.users.findFirst();
      const isPremium = user?.premium ?? false;

      if (format === "sql") {
        const { sql, tablesCreated, rowsProcessed } = jsonToSql(jsonData, {
          tableName: options.tableName || "data_table",
          sqlDialect: options.sqlDialect || "postgresql",
          flattenNested: options.flattenNested ?? true,
        });

        // Enforce trial limit based on actual rows processed
        if (!isPremium && rowsProcessed > TRIAL_LIMIT) {
          return res.status(403).json({
            error: "Trial limit exceeded",
            message: `Free trial is limited to ${TRIAL_LIMIT} records. Your conversion would process ${rowsProcessed} records. Please upgrade for unlimited access.`,
            rowsProcessed,
            limit: TRIAL_LIMIT,
          });
        }

        result = {
          output: sql,
          format: "sql" as const,
          lineCount: sql.split("\n").length,
          statistics: {
            tablesCreated,
            rowsProcessed,
          },
        };
      } else {
        const { csv, headersDetected, rowsProcessed } = jsonToCsv(jsonData, {
          delimiter: options.csvDelimiter || ",",
          flattenNested: options.flattenNested ?? true,
        });

        // Enforce trial limit based on actual rows processed
        if (!isPremium && rowsProcessed > TRIAL_LIMIT) {
          return res.status(403).json({
            error: "Trial limit exceeded",
            message: `Free trial is limited to ${TRIAL_LIMIT} records. Your conversion would process ${rowsProcessed} records. Please upgrade for unlimited access.`,
            rowsProcessed,
            limit: TRIAL_LIMIT,
          });
        }

        result = {
          output: csv,
          format: "csv" as const,
          lineCount: csv.split("\n").length,
          statistics: {
            headersDetected,
            rowsProcessed,
          },
        };
      }

      return res.json(result);
    } catch (error) {
      console.error("Conversion error:", error);

      if (error instanceof Error) {
        return res.status(400).json({
          error: "Conversion failed",
          message: error.message,
        });
      }

      return res.status(500).json({
        error: "Internal server error",
        message: "An unexpected error occurred",
      });
    }
  });

  app.post("/api/stripe/create-payment-intent", async (req, res) => {
    try {
      const validationResult = createPaymentIntentSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          error: "Invalid request",
          details: validationResult.error.errors,
        });
      }

      const { email } = validationResult.data;

      let customer = await getStripeCustomerByEmail(email);

      if (!customer) {
        customer = await createStripeCustomer(email);
      }

      const paymentIntent = await createPaymentIntent(customer.id, 2900);

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Stripe error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/stripe/webhook", async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      res.status(400).send(`Webhook Error: ${errorMessage}`);
      return;
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const customerId = paymentIntent.customer as string;
      const customer = await stripe.customers.retrieve(customerId);

      if (customer && "email" in customer && customer.email) {
        const user = await db.query.users.findFirst({
          where: eq(users.username, customer.email),
        });

        if (user) {
          await db
            .update(users)
            .set({ premium: true })
            .where(eq(users.id, user.id));
        }
      }
    }

    res.json({ received: true });
  });

  const httpServer = createServer(app);

  return httpServer;
}
