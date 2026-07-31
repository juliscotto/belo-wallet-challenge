import { ApiError } from "@/src/core/api/ApiError";
import { useSettingsStore } from "@/src/features/settings/store/settingsStore";
import { useQuery } from "@tanstack/react-query";
import { AssetSymbol } from "../../domain/entities/Asset";
import { marketRepository } from "../../marketDependencies";
import { marketQueryKeys } from "../queryKeys/marketQueryKeys";

export function useAssetPrices(symbols: AssetSymbol[]) {
  const marketDataMode = useSettingsStore((state) => state.marketDataMode);
  return useQuery({
    queryKey: marketQueryKeys.prices(symbols, marketDataMode),
    queryFn: () => marketRepository.getPrices(symbols),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.code === "rate-limit") {
        return false;
      }

      return failureCount < 2;
    },
  });
}
