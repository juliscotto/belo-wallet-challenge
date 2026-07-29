import { AssetSymbol } from "../entities/Asset";
import { MarketPrice } from "../entities/MarketPrice";

export interface MarketRepository {
  getPrices(symbols: AssetSymbol[]): Promise<MarketPrice[]>;
}
