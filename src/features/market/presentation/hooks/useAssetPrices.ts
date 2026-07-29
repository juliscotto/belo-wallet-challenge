import { ApiError } from "@/src/core/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import { AssetSymbol } from "../../domain/entities/Asset";
import { marketRepository } from "../../marketDependencies";
import { marketQueryKeys } from "../queryKeys/marketQueryKeys";

export function useAssetPrices(symbols: AssetSymbol[]) {
  return useQuery({
    queryKey: marketQueryKeys.prices(symbols),
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
