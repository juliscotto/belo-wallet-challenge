export type AssetSymbol = "USDT" | "USDC" | "DAI" | "BTC" | "ETH";

export type Asset = {
  symbol: AssetSymbol;
  name: string;
  coinGeckoId: string;
  decimals: number;
};

export const SUPPORTED_ASSETS = {
  USDT: {
    symbol: "USDT",
    name: "Tether",
    coinGeckoId: "tether",
    decimals: 2,
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    coinGeckoId: "usd-coin",
    decimals: 2,
  },
  DAI: {
    symbol: "DAI",
    name: "Dai",
    coinGeckoId: "dai",
    decimals: 2,
  },
  BTC: {
    symbol: "BTC",
    name: "Bitcoin",
    coinGeckoId: "bitcoin",
    decimals: 8,
  },
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    coinGeckoId: "ethereum",
    decimals: 8,
  },
} satisfies Record<AssetSymbol, Asset>;
