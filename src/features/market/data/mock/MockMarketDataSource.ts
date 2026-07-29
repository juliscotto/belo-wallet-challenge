import { AssetSymbol, SUPPORTED_ASSETS } from "../../domain/entities/Asset";
import { MarketDataSource } from "../dataSources/MarketDataSource";
import { CoinGeckoSimplePriceDto } from "../remote/CoinGeckoDto";

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
}
