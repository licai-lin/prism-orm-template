# Node.js + Express + TypeScript Beginner Guide

This guide helps you create a simple Express server with TypeScript from scratch, with fixes for common errors.

## 1. Create Project Folder

```bash
mkdir my-express-server
cd my-express-server
```

## 2. Initialize npm

```bash
npm init -y
```

## 3. Install Dependencies

```bash
# Runtime dependency
npm install express

# Dev dependencies
npm install --save-dev typescript @types/express @types/node ts-node nodemon
```

## 4. Initialize TypeScript

```bash
npx tsc --init
```

## 5. Update `tsconfig.json`

Replace your `tsconfig.json` with this beginner-safe config:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["src"]
}
```

## 6. Create Source Folder and File

```bash
mkdir src
touch src/index.ts
```

## 7. Add Server Code

Paste this into `src/index.ts`:

```ts
import express from 'express';
import type { Request, Response, Application } from 'express';

const app: Application = express();
const PORT = 3000;

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello from TypeScript Express!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 8. Update `package.json`

Set your `package.json` like this (important: `"type": "module"`):

```json
{
  "name": "my-express-server",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon --watch src --ext ts --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

## 9. Run in Dev Mode

```bash
npm run dev
```

You should see:

```text
Server running at http://localhost:3000
```

Open:

```text
http://localhost:3000
```

## 10. Build and Run Production Mode

```bash
npm run build
npm start
```

## Common Errors and Fixes

- Error: `ECMAScript imports and exports cannot be written in a CommonJS file...`
  - Fix: add `"type": "module"` in `package.json`.

- Error: `Request is a type and must be imported using a type-only import`
  - Fix: use `import type { Request, Response, Application } from 'express'`.

- Error: `Cannot find module 'express'`
  - Fix: run `npm install express`.

- Error: `Cannot find name 'process'` or Node globals missing
  - Fix: install `@types/node` and ensure `types: ["node"]` in `tsconfig.json`.
