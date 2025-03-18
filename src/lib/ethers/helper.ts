import BigNumber from 'bignumber.js';
export const getTokenQuantity = (balance: string, decimals: number) => {
  return new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals)).toString();
};

export const caculate24hrPNL = (tokens: { quote: number, quote_24h: number; }[]) => {
  const totalQuote = tokens.reduce((acc, curr) => acc.plus(curr.quote), new BigNumber(0));
  const totalQuote24h = tokens.reduce((acc, curr) => acc.plus(curr.quote_24h), new BigNumber(0));
  if (totalQuote24h.eq(0)) {
    return '0';
  }
  return totalQuote.minus(totalQuote24h).dividedBy(totalQuote24h).multipliedBy(100).toFixed(3);
};
