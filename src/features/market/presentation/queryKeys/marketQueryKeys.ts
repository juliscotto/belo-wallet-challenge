import { AssetSymbol } from "../../domain/entities/Asset";

export const marketQueryKeys = {
  all: ["market"] as const,

  prices: (symbols: AssetSymbol[]) =>
    [...marketQueryKeys.all, "prices", [...symbols].sort()] as const,
};
