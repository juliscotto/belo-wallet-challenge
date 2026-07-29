import { HttpClient } from "@/src/core/api/httpClient";
import { AssetSymbol, SUPPORTED_ASSETS } from "../../domain/entities/Asset";
import { MarketDataSource } from "../dataSources/MarketDataSource";
import { CoinGeckoSimplePriceDto } from "./CoinGeckoDto";

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
}
