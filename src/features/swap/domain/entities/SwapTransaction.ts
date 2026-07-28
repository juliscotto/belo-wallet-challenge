import { AssetSymbol } from "@/src/features/market/domain/entities/Asset";

export type SwapTransaction = {
  id: string;
  sourceAsset: AssetSymbol;
  targetAsset: AssetSymbol;
  sourceAmount: number;
  targetAmount: number;
  sourcePriceUsd: number;
  targetPriceUsd: number;
  usdValue: number;
  createdAt: string;
};
