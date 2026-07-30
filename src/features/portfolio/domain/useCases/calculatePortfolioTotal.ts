import { AssetSymbol } from "../../../market/domain/entities/Asset";
import { MarketPrice } from "../../../market/domain/entities/MarketPrice";
import { PortfolioBalance } from "../entities/PortfolioBalance";

export function calculatePortfolioTotal(
  balances: PortfolioBalance,
  prices: MarketPrice[],
): number {
  const pricesBySymbol = Object.fromEntries(
    prices.map((price) => [price.symbol, price.priceUsd]),
  ) as Partial<Record<AssetSymbol, number>>;

  return Object.entries(balances).reduce((total, [symbol, amount]) => {
    const assetSymbol = symbol as AssetSymbol;
    const priceUsd = pricesBySymbol[assetSymbol];

    if (priceUsd === undefined) {
      return total;
    }

    return total + amount * priceUsd;
  }, 0);
}
