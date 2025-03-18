export type Token = {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: null;
  logo_url: string;
  contract_display_name: string;
  logo_urls: {
    token_logo_url: string;
    protocol_logo_url: null;
    chain_logo_url: string;
  },
  last_transferred_at: null;
  native_token: true;
  type: string;
  is_spam: boolean;
  balance: string;
  balance_24h: string;
  quote_rate: number;
  quote_rate_24h: number;
  quote: number;
  pretty_quote: string;
  quote_24h: number;
  pretty_quote_24h: string;
  protocol_metadata: null;
  nft_data: null;
};