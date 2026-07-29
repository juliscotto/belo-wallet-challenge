import { AssetSymbol } from "../../domain/entities/Asset";
import { MarketPrice } from "../../domain/entities/MarketPrice";
import { MarketRepository } from "../../domain/repositories/MarketRepository";
import { MarketDataSource } from "../dataSources/MarketDataSource";
import { mapCoinGeckoPrices } from "../mappers/marketPriceMapper";

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
}
