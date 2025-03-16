import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// 中間件
app.use(cors());
app.use(express.json());

// 測試
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Express + Prisma + TypeScript API' });
});

interface UserInput {
  name: string;
  email: string;
  password: string;
}

app.get('/users', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
});

app.post('/users', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as UserInput;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
    });

    res.status(201).json(newUser);
    return;
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    } else {
      res.status(400).json({ error: 'Unknown error occurred' });
      return;
    }
  }
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
