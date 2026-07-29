import { AssetSymbol } from "../../domain/entities/Asset";
import { CoinGeckoSimplePriceDto } from "../remote/CoinGeckoDto";

export interface MarketDataSource {
  getPrices(symbols: AssetSymbol[]): Promise<CoinGeckoSimplePriceDto>;
}
