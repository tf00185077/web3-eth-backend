import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { createWallet, getWallets, getWalletErc20Information } from './lib/ethers';
import { getTokenInformation } from './lib/binance';
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.BACKEND_PORT || 3001;

// 中間件
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// 測試
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Express + Prisma + TypeScript API' });
});

// 啟動伺服器

app.post('/create-wallet', async (req: Request, res: Response) => {
  const { userId } = req.body;
  console.log(req.body);
  if (!userId) {
    res.status(400).json({ message: 'User ID is required' });
    return;
  }
  const isSuccess = await createWallet(userId);
  if (isSuccess) {
    res.status(200).json({ message: 'Wallet created successfully' });
  } else {
    res.status(400).json({ message: 'Failed to create wallet' });
  }
});

app.get('/get-wallet-list/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const wallets = await getWallets(userId);
  res.status(200).json({ wallets });
});

app.get('/get-token-information', async (req: Request, res: Response) => {
  const { symbol } = req.query;
  const tokens = await getTokenInformation(symbol as string);
  res.status(200).json(tokens);
});

app.post('/get-wallet-erc20-information', async (req: Request, res: Response) => {
  const { address } = req.body;
  const walletInformation = await getWalletErc20Information(address as string);
  res.status(200).json(walletInformation);
});

app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT}`);
});
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
