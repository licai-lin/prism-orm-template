# Prisma ORM Template (Node + Express + TypeScript)

A starter API project with `Express`, `TypeScript`, and `Prisma` on PostgreSQL.

## Prerequisites

- Node.js 18+
- npm
- A PostgreSQL database

## Environment Setup

Create your local `.env` file from the template:

```bash
cp .env.example .env
```

Set `DATABASE_URL` in `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?sslmode=require"
```

## Install

```bash
npm install
```

## Database Setup (Prisma)

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Seed database:

```bash
npm run seed
```

## Run the App

Development:

```bash
npm run dev
```

Production:

```bash
npm run build
npm start
```

Default route:

```text
GET / -> Hello from TypeScript Express!
```

## Scripts

- `npm run dev`: Start dev server with auto-reload
- `npm run build`: Compile TypeScript to `dist/`
- `npm start`: Run compiled server
- `npm run seed`: Run Prisma seed command
- `npm run seed:direct`: Run seed script directly with `tsx`
