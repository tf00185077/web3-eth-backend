import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { db } from '../db';
import { Token } from '../type-helper/token';
import { getTokenQuantity, caculate24hrPNL } from './helper';
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
        phrase: wallet.mnemonic!.phrase!,
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
  wallets.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
  return wallets;
};

export const getWalletErc20Information = async (address: string) => {
  const url = `https://api.covalenthq.com/v1/1/address/${address}/balances_v2/?key=${process.env.COVALENT_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  const tokens = data.data.items.map((token: Token) => {
    return {
      contract_logo: token.logo_urls.token_logo_url,
      contract_name: token.contract_name,
      contract_ticker_symbol: token.contract_ticker_symbol,
      balance: ethers.formatUnits(token.balance, token.contract_decimals),
      pretty_qoute: token.pretty_quote,
      pretty_quote_24h: token.pretty_quote_24h,
      quote: Number(Number(token.quote).toFixed(2)),
      quote_24h: Number(Number(token.quote_24h).toFixed(2)),
      token_quantity: getTokenQuantity(token.balance, token.contract_decimals),
    };
  });
  const pnl = caculate24hrPNL(tokens);
  return { tokens, pnl };
};
