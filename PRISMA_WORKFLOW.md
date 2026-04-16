# Prisma Migrate + Seed Workflow Guide

This guide is a practical step-by-step playbook for your current project.
It explains exactly what to run, when to run it, and what each command does.

## Project setup (current)

Your project is using Prisma 7 config in `prisma.config.ts`:

- migration folder: `prisma/migrations`
- seed command: `tsx prisma/seed.ts`

That means:
- `npx prisma db seed` runs `prisma/seed.ts`
- `npx prisma migrate reset` resets schema/data from migrations
- seed is run separately with `npx prisma db seed`

## 1. Normal schema change flow (most common)

Use this when you add or change models/fields in `prisma/schema.prisma`.

### Step 1: Edit schema

Example:
- add a new field to `User`
- add a new model

### Step 2: Create and apply migration

```bash
npx prisma migrate dev --name your_change_name
```

What this does:
- compares schema vs current migration history
- creates a new migration SQL file in `prisma/migrations/...`
- applies migration to your dev database
- does not auto-run seed
- in Prisma 7, does not auto-run `prisma generate`

If you see:

```text
Already in sync, no schema change or pending migration was found.
```

That means your schema has no new changes. This is normal.

## 2. Run seed data manually

Use this when you want sample/test data inserted or updated.

```bash
npx prisma db seed
```

What this does:
- executes configured seed command from `prisma.config.ts`
- in your project, runs: `tsx prisma/seed.ts`

It does NOT:
- create migrations
- alter DB schema

## 3. Reset database (dangerous, dev-only)

Use this when you intentionally want a clean database.

```bash
npx prisma migrate reset
```

What this does:
- drops existing data
- recreates DB schema from migration history
- does not auto-run seed in Prisma 7

If you want sample data after reset, run:

```bash
npx prisma db seed
```

## 4. When does `migrate dev` run seed?

In Prisma 7, `migrate dev` does not auto-run seed.
Run seed explicitly with:

```bash
npx prisma db seed
```

## 5. Common reset triggers

Prisma may ask to reset when it detects mismatch between DB state and migration history, for example:

1. schema drift (manual DB changes, or mixed `db push` usage)
2. edited/deleted old migration files
3. switching to a different DB with different existing schema
4. failed or partially-applied migration history

## 6. Safe daily workflow (recommended)

1. Confirm your `.env` points to correct dev DB (`DATABASE_URL`).
2. Update `prisma/schema.prisma`.
3. Run:

```bash
npx prisma migrate dev --name describe_change
```

4. If needed, run seed:

```bash
npx prisma db seed
```

5. Start/test app.

## 7. Command quick reference

```bash
# check migration state
npx prisma migrate status

# create/apply migration for schema changes
npx prisma migrate dev --name change_name

# run seed script configured in prisma.config.ts
npx prisma db seed

# reset DB + re-apply migrations
npx prisma migrate reset

# run seed after reset (or any time you need sample data)
npx prisma db seed

# regenerate Prisma Client manually (recommended after schema changes in Prisma 7)
npx prisma generate
```

## 8. FAQ

### Q: Do I need `npx prisma generate` after every `migrate dev`?

In Prisma 7, yes, run `npx prisma generate` after schema changes if your app needs updated Prisma Client types/code.

### Q: If I remove `migrations.seed` from `prisma.config.ts`, can I still run `npx prisma db seed`?

No. It will fail because Prisma has no seed command configured.
You can still run the file directly:

```bash
tsx prisma/seed.ts
```

(or `npm run seed:direct` in this project)

### Q: Why does `migrate dev` say "Already in sync"?

Because there is no schema difference to migrate.

## 9. Team safety notes

- Never run reset commands on production.
- Use separate databases for local/dev/staging/prod.
- Commit both schema and migration files together.
- Do not edit old migration files after they are applied.
