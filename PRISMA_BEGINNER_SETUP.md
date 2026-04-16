# Prisma Beginner Setup Guide (PostgreSQL + Node.js)

This guide walks you from installing Prisma to creating and using the shared Prisma instance we set up in this project.

## 1. Install dependencies

Run these in your project root:

```bash
npm install prisma --save-dev
npm install @prisma/client pg @prisma/adapter-pg
```

What each package does:
- `prisma`: CLI tools (`init`, `migrate`, `generate`, etc.)
- `@prisma/client`: generated client used in app code
- `pg`: PostgreSQL driver
- `@prisma/adapter-pg`: adapter so Prisma can use `pg` pool

## 2. Initialize Prisma

```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma`
- `.env` (if missing)

## 3. Add your database URL

In `.env`, set:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
```

Example local URL:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/prisma_orm_demo?schema=public"
```

## 4. Define your schema

Edit `prisma/schema.prisma`. Example:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

Important for your current setup:
- In Prisma 7, `datasource.url` can be provided from `prisma.config.ts`.
- So your schema can keep only:
  - `datasource db { provider = "postgresql" }`
- `DATABASE_URL` is still required in `.env` for both Prisma config and runtime app code.

## 5. Create and apply migration

```bash
npx prisma migrate dev --name init
```

This does 2 things:
- creates SQL migration files
- applies migration to DB

Then generate Prisma Client:

```bash
npx prisma generate
```

## 6. Create shared Prisma instance (what we implemented)

Create `src/lib/prismaInstance.ts`:

```ts
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const connectionString = process.env["DATABASE_URL"];

if (!connectionString) {
  throw new Error("DATABASE_URL is required.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { pool, prisma };
```

Why this is good:
- `pool`: shared PostgreSQL connection pool (better performance)
- `prisma`: one reusable Prisma client for your app
- clear naming (`pool`, `prisma`) keeps usage simple

## 7. Use Prisma in your code

Example:

```ts
import { prisma } from "../lib/prismaInstance";

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main().catch(console.error);
```

## 8. Useful Prisma commands

```bash
# open Prisma Studio (GUI)
npx prisma studio

# regenerate client after schema changes (Prisma 7)
npx prisma generate

# create and apply new migration after schema changes
npx prisma migrate dev --name describe_change
```

## 9. Common beginner issues

- `DATABASE_URL is required.`
  - `.env` is missing or variable not loaded.

- `PrismaClientInitializationError`
  - DB URL is wrong, DB server is down, or credentials invalid.

- model/property not found in code
  - run `npx prisma generate` after editing schema.

## 10. Quick checklist

- Installed `prisma`, `@prisma/client`, `pg`, `@prisma/adapter-pg`
- Set `DATABASE_URL` in `.env`
- Added models in `prisma/schema.prisma`
- Ran `npx prisma migrate dev --name init`
- Created `src/lib/prismaInstance.ts`
- Imported `prisma` where needed
