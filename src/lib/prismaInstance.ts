import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

// Read database connection string from environment.
// Prisma uses this to connect to PostgreSQL through `pg`.
const connectionString = process.env["DATABASE_URL"];

// Fail fast during startup if DATABASE_URL is missing.
// This gives a clear error early instead of runtime query failures later.
if (!connectionString) {
  throw new Error("DATABASE_URL is required.");
}

// Shared PostgreSQL connection pool.
// Pooling avoids creating a new connection for every query.
const pool = new Pool({ connectionString });

// Prisma adapter that tells Prisma Client to use the `pg` pool above.
const adapter = new PrismaPg(pool);

// Application-wide Prisma Client instance.
// Export and reuse this instance to keep DB access consistent.
const prisma = new PrismaClient({ adapter });

export { pool, prisma };
