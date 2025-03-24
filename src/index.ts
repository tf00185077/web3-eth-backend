import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { createWallet, getWallets, getWalletErc20Information, transferToken, getWallet, getWalletTradeHistory } from './lib/ethers';
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

app.post('/transfer-token', async (req: Request, res: Response) => {
  const { contract, recipient, amount, walletAddress, userId } = req.body;
  try {
    const walletPhrase = await prisma.wallet.findFirst({
      where: {
        address: walletAddress,
        userId: userId,
      },
    });
    if (!walletPhrase) {
      res.status(400).json({ status: 'fail', message: 'Wallet not found' });
      return;
    }
    const wallet = await getWallet(walletPhrase.phrase);
    if (!wallet) {
      res.status(400).json({ status: 'fail', message: 'Wallet not found' });
      return;
    }
    const isSuccess = await transferToken(contract, recipient, amount, wallet);
    if (isSuccess) {
      res.status(200).json({ status: 'success', message: 'Transfer successful' });
    } else {
      res.status(400).json({ status: 'fail', message: 'Transfer failed' });
    }
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Transfer failed' });
  }
});

app.get('/get-wallet-trade-history/:address', async (req: Request, res: Response) => {
  const { address } = req.params;
  try { 
    const tradeHistory = await getWalletTradeHistory(address);
    if (tradeHistory.status === 'success') {
      res.status(200).json({ status: 'success', data: tradeHistory.data });
    } else {
      res.status(400).json({ status: 'fail', message: 'Get trade history failed' });
    }
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Get trade history failed' });
  }
});

app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT}`);
});
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
