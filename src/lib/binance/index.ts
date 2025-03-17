export const getTokenInformation = async (symbol: string) => {
  const [tokenPriceInformation, tokenTrickInformation] = await Promise.all([
    fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol.toUpperCase()}`),
    fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.toUpperCase()}`)
  ]);
  const [tokenPrice, tokenTrick] = await Promise.all([tokenPriceInformation.json(), tokenTrickInformation.json()]);
  return {
    symbol: symbol.toUpperCase(),
    upOrDown: tokenTrick.priceChangePercent > 0 ? 'up' : 'down',
    price: tokenPrice.price,
    priceChangePercent: tokenTrick.priceChangePercent,
    quoteVolume: tokenTrick.quoteVolume
  };
};


