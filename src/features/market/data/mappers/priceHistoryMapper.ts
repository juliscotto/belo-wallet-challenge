import { PricePoint } from "../../domain/entities/PricePoint";
import { CoinGeckoMarketChartDto } from "../dtos/CoinGeckoMarketChartDto";

export function mapPriceHistory(dto: CoinGeckoMarketChartDto): PricePoint[] {
  return dto.prices
    .filter(
      ([timestamp, price]) =>
        Number.isFinite(timestamp) && Number.isFinite(price) && price > 0,
    )
    .map(([timestamp, price]) => ({
      timestamp,
      priceUsd: price,
    }));
}
