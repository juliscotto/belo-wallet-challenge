import { AssetSymbol } from "./Asset";

export type MarketPrice = {
  symbol: AssetSymbol;
  priceUsd: number;
  changePercentage24h: number | null;
  updatedAt: string;
};
