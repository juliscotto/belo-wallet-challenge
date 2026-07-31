import { AssetSymbol, SUPPORTED_ASSETS } from "../../domain/entities/Asset";
import { MarketDataSource } from "../dataSources/MarketDataSource";
import { CoinGeckoSimplePriceDto } from "../dtos/CoinGeckoDto";
import { CoinGeckoMarketChartDto } from "../dtos/CoinGeckoMarketChartDto";

const MOCK_PRICES: CoinGeckoSimplePriceDto = {
  tether: {
    usd: 1,
    usd_24h_change: 0.01,
    last_updated_at: 1_753_720_000,
  },
  "usd-coin": {
    usd: 1,
    usd_24h_change: -0.01,
    last_updated_at: 1_753_720_000,
  },
  dai: {
    usd: 1,
    usd_24h_change: 0.02,
    last_updated_at: 1_753_720_000,
  },
  bitcoin: {
    usd: 70_000,
    usd_24h_change: 2.5,
    last_updated_at: 1_753_720_000,
  },
  ethereum: {
    usd: 3_500,
    usd_24h_change: -1.2,
    last_updated_at: 1_753_720_000,
  },
};

export class MockMarketDataSource implements MarketDataSource {
  async getPrices(symbols: AssetSymbol[]): Promise<CoinGeckoSimplePriceDto> {
    return Object.fromEntries(
      symbols.map((symbol) => {
        const id = SUPPORTED_ASSETS[symbol].coinGeckoId;
        return [id, MOCK_PRICES[id]];
      }),
    );
  }

  async getPriceHistory(coinGeckoId: string): Promise<CoinGeckoMarketChartDto> {
    const basePrices: Record<string, number> = {
      tether: 1,
      "usd-coin": 1,
      dai: 1,
      bitcoin: 64_000,
      ethereum: 1_900,
    };

    const basePrice = basePrices[coinGeckoId] ?? 100;

    const now = Date.now();

    const prices: [number, number][] = Array.from(
      {
        length: 24,
      },
      (_, index) => {
        const hoursAgo = 23 - index;

        const timestamp = now - hoursAgo * 60 * 60 * 1000;

        const variation = Math.sin(index / 3) * 0.012;

        return [timestamp, basePrice * (1 + variation)];
      },
    );

    return {
      prices,
      market_caps: [],
      total_volumes: [],
    };
  }
}
