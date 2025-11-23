import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const runMigrations = async () => {
  await sleep(5000); // Add a 5-second delay

  const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(migrationClient);

  console.log("Running migrations...");

  await migrate(db, { migrationsFolder: "migrations" });

  console.log("Migrations completed!");

  await migrationClient.end();
};

runMigrations().catch((err) => {
  console.error(err);
  process.exit(1);
});