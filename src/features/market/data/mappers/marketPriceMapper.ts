import { AssetSymbol, SUPPORTED_ASSETS } from "../../domain/entities/Asset";
import { MarketPrice } from "../../domain/entities/MarketPrice";
import { CoinGeckoSimplePriceDto } from "../remote/CoinGeckoDto";

export function mapCoinGeckoPrices(
  dto: CoinGeckoSimplePriceDto,
  symbols: AssetSymbol[],
): MarketPrice[] {
  return symbols.map((symbol) => {
    const asset = SUPPORTED_ASSETS[symbol];
    const item = dto[asset.coinGeckoId];

    if (!item || !Number.isFinite(item.usd)) {
      throw new Error(`Missing or invalid price for ${symbol}`);
    }

    const updatedAt = item.last_updated_at
      ? new Date(item.last_updated_at * 1000).toISOString()
      : new Date().toISOString();

    return {
      symbol,
      priceUsd: item.usd,
      changePercentage24h: item.usd_24h_change ?? null,
      updatedAt,
    };
  });
}

export class MarketMappingError extends Error {
  constructor(public readonly symbol: AssetSymbol) {
    super(`Invalid market response for ${symbol}`);
    this.name = "MarketMappingError";
  }
}
