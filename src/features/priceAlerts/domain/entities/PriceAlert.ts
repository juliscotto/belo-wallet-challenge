import { AssetSymbol } from "../../../market/domain/entities/Asset";

export type PriceAlertCondition = "ABOVE" | "BELOW";

export type PriceAlert = {
  id: string;
  symbol: AssetSymbol;
  targetPriceUsd: number;
  condition: PriceAlertCondition;
  createdAt: string;
  isActive: boolean;
  triggeredAt: string | null;
};
