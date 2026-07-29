export type CoinGeckoSimplePriceItemDto = {
  usd: number;
  usd_24h_change?: number | null;
  last_updated_at?: number;
};

export type CoinGeckoSimplePriceDto = Record<
  string,
  CoinGeckoSimplePriceItemDto
>;
