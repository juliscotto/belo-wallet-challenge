import { AssetSymbol } from "../../domain/entities/Asset";
import { CoinGeckoSimplePriceDto } from "../dtos/CoinGeckoDto";
import { CoinGeckoMarketChartDto } from "../dtos/CoinGeckoMarketChartDto";

export interface MarketDataSource {
  getPrices(symbols: AssetSymbol[]): Promise<CoinGeckoSimplePriceDto>;

  getPriceHistory(coinGeckoId: string): Promise<CoinGeckoMarketChartDto>;
}
