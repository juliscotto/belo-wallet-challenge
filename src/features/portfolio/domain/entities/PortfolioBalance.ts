import { AssetSymbol } from "../../../market/domain/entities/Asset";

export type PortfolioBalance = Record<AssetSymbol, number>;

export const INITIAL_PORTFOLIO: PortfolioBalance = {
  USDT: 1_000,
  USDC: 500,
  DAI: 500,
  BTC: 0.05,
  ETH: 1.5,
};
