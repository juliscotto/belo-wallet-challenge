import { AssetSymbol } from "../../../market/domain/entities/Asset";

export type SwapQuote = {
  fromSymbol: AssetSymbol;
  toSymbol: AssetSymbol;

  fromAmount: number;
  toAmount: number;

  fromPriceUsd: number;
  toPriceUsd: number;

  exchangeRate: number;

  createdAt: string;
  expiresAt: string;
};
