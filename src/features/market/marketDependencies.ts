import { environment } from "@/src/app/config/environment";
import { HttpClient } from "@/src/core/api/httpClient";
import { useSettingsStore } from "../settings/store/settingsStore";
import { MockMarketDataSource } from "./data/mock/MockMarketDataSource";
import { CoinGeckoRemoteDataSource } from "./data/remote/CoinGeckoRemoteDataSource";
import { MarketRepositoryImpl } from "./data/repositories/MarketRepositoryImpl";

const coinGeckoHttpClient = new HttpClient(
  environment.coinGeckoBaseUrl,
  environment.coinGeckoApiKey
    ? {
        "x-cg-demo-api-key": environment.coinGeckoApiKey,
      }
    : {},
);

const remoteDataSource = new CoinGeckoRemoteDataSource(coinGeckoHttpClient);

const mockDataSource = new MockMarketDataSource();

export const marketRepository = new MarketRepositoryImpl(
  remoteDataSource,
  mockDataSource,
  () => useSettingsStore.getState().marketDataMode === "mock",
);
