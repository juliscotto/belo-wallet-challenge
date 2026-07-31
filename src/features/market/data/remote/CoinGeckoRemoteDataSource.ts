import { HttpClient } from "@/src/core/api/httpClient";
import { AssetSymbol, SUPPORTED_ASSETS } from "../../domain/entities/Asset";
import { MarketDataSource } from "../dataSources/MarketDataSource";
import { CoinGeckoSimplePriceDto } from "../dtos/CoinGeckoDto";
import { CoinGeckoMarketChartDto } from "../dtos/CoinGeckoMarketChartDto";

export interface MarketRemoteDataSource {
  getPrices(symbols: AssetSymbol[]): Promise<CoinGeckoSimplePriceDto>;
}

export class CoinGeckoRemoteDataSource implements MarketDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  async getPrices(symbols: AssetSymbol[]): Promise<CoinGeckoSimplePriceDto> {
    const ids = symbols
      .map((symbol) => SUPPORTED_ASSETS[symbol].coinGeckoId)
      .join(",");

    return this.httpClient.get<CoinGeckoSimplePriceDto>("simple/price", {
      query: {
        ids,
        vs_currencies: "usd",
        include_24hr_change: true,
        include_last_updated_at: true,
      },
    });
  }

  async getPriceHistory(coinGeckoId: string): Promise<CoinGeckoMarketChartDto> {
    return this.httpClient.get<CoinGeckoMarketChartDto>(
      `coins/${coinGeckoId}/market_chart`,
      {
        query: {
          vs_currency: "usd",
          days: "1",
        },
      },
    );
  }
}
