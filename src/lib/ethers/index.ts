import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { db } from '../db';
dotenv.config();

export const createWallet = async (userId: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return false;
    }
    const wallet = ethers.Wallet.createRandom();
    await db.wallet.create({
      data: {
        userId: userId,
        address: wallet.address,
        phrase: wallet.mnemonic?.phrase!,
      },
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getWallets = async (userId: string) => {
  const wallets = await db.wallet.findMany({
    where: {
      userId: userId,
    },
  });
  return wallets;
};
