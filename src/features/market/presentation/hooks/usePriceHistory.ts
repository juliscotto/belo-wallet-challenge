import { useQuery } from "@tanstack/react-query";

import { useSettingsStore } from "../../../../features/settings/store/settingsStore";
import { marketRepository } from "../../marketDependencies";
import { marketQueryKeys } from "../queryKeys/marketQueryKeys";

export function usePriceHistory(coinGeckoId: string) {
  const marketDataMode = useSettingsStore((state) => state.marketDataMode);

  return useQuery({
    queryKey: marketQueryKeys.priceHistory(coinGeckoId, marketDataMode),

    queryFn: () => marketRepository.getPriceHistory(coinGeckoId),

    enabled: coinGeckoId.length > 0,

    staleTime: 5 * 60 * 1000,

    gcTime: 30 * 60 * 1000,

    retry: 1,
  });
}
