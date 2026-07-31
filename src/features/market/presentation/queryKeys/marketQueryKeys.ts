import { MarketDataMode } from "@/src/features/settings/store/settingsStore";
import { AssetSymbol } from "../../domain/entities/Asset";

export const marketQueryKeys = {
  all: ["market"] as const,

  prices: (symbols: AssetSymbol[], mode: MarketDataMode) =>
    [...marketQueryKeys.all, "prices", [...symbols].sort(), mode] as const,
};
