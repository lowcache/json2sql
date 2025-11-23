import { z } from "zod";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";

// Drizzle schema
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").unique(),
  premium: boolean("premium").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const purchases = pgTable(
  "purchases",
  {
    userId: text("user_id").references(() => users.id),
    stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
    amount: integer("amount"),
    purchasedAt: timestamp("purchased_at").defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.stripePaymentIntentId] }),
    };
  },
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = typeof purchases.$inferInsert;

// Conversion result types
export const conversionResultSchema = z.object({
  output: z.string(),
  format: z.enum(["sql", "csv"]),
  lineCount: z.number(),
  statistics: z.object({
    tablesCreated: z.number().optional(),
    headersDetected: z.number().optional(),
    rowsProcessed: z.number(),
  }),
});

export type ConversionResult = z.infer<typeof conversionResultSchema>;

// Conversion request schema
export const conversionRequestSchema = z.object({
  jsonData: z.string(),
  format: z.enum(["sql", "csv"]),
  options: z.object({
    tableName: z.string().optional(),
    sqlDialect: z.enum(["mysql", "postgresql", "sqlite"]).optional(),
    csvDelimiter: z.string().optional(),
    flattenNested: z.boolean().optional(),
  }).optional(),
});

export type ConversionRequest = z.infer<typeof conversionRequestSchema>;

// Purchase schema
export const purchaseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  amount: z.number(),
  stripePaymentIntentId: z.string(),
  purchasedAt: z.date(),
});

// Payment intent creation
export const createPaymentIntentSchema = z.object({
  email: z.string().email(),
});

export type CreatePaymentIntent = z.infer<typeof createPaymentIntentSchema>;
