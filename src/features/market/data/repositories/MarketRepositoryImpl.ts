import { AssetSymbol } from "../../domain/entities/Asset";
import { MarketPrice } from "../../domain/entities/MarketPrice";
import { PricePoint } from "../../domain/entities/PricePoint";
import { MarketRepository } from "../../domain/repositories/MarketRepository";
import { MarketDataSource } from "../dataSources/MarketDataSource";
import { mapCoinGeckoPrices } from "../mappers/marketPriceMapper";
import { mapPriceHistory } from "../mappers/priceHistoryMapper";

export class MarketRepositoryImpl implements MarketRepository {
  constructor(
    private readonly remoteDataSource: MarketDataSource,
    private readonly mockDataSource: MarketDataSource,
    private readonly isMockModeEnabled: () => boolean,
  ) {}

  async getPrices(symbols: AssetSymbol[]): Promise<MarketPrice[]> {
    const dataSource = this.isMockModeEnabled()
      ? this.mockDataSource
      : this.remoteDataSource;

    const dto = await dataSource.getPrices(symbols);

    return mapCoinGeckoPrices(dto, symbols);
  }

  async getPriceHistory(coinGeckoId: string): Promise<PricePoint[]> {
    const dataSource = this.isMockModeEnabled()
      ? this.mockDataSource
      : this.remoteDataSource;

    const dto = await dataSource.getPriceHistory(coinGeckoId);

    return mapPriceHistory(dto);
  }
}
