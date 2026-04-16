import express from 'express';
import type { Request, Response, Application } from 'express';
import { prisma } from './lib/prismaInstance.js';

const app: Application = express();
const PORT = 3000;

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello from TypeScript Express!');
});

app.get('/users', async (_: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
