import { AssetSymbol } from "../entities/Asset";
import { MarketPrice } from "../entities/MarketPrice";
import { PricePoint } from "../entities/PricePoint";

export interface MarketRepository {
  getPrices(symbols: AssetSymbol[]): Promise<MarketPrice[]>;

  getPriceHistory(coinGeckoId: string): Promise<PricePoint[]>;
}
