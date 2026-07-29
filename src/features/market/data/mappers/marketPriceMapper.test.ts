import { mapCoinGeckoPrices } from "./marketPriceMapper";

describe("mapCoinGeckoPrices", () => {
  it("maps CoinGecko prices to domain entities", () => {
    const result = mapCoinGeckoPrices(
      {
        bitcoin: {
          usd: 70_000,
          usd_24h_change: 2.5,
          last_updated_at: 1_753_720_000,
        },
        ethereum: {
          usd: 3_500,
          usd_24h_change: -1.2,
          last_updated_at: 1_753_720_000,
        },
      },
      ["BTC", "ETH"],
    );

    expect(result).toEqual([
      {
        symbol: "BTC",
        priceUsd: 70_000,
        changePercentage24h: 2.5,
        updatedAt: new Date(1_753_720_000 * 1000).toISOString(),
      },
      {
        symbol: "ETH",
        priceUsd: 3_500,
        changePercentage24h: -1.2,
        updatedAt: new Date(1_753_720_000 * 1000).toISOString(),
      },
    ]);
  });

  it("maps a missing 24h change to null", () => {
    const result = mapCoinGeckoPrices(
      {
        bitcoin: {
          usd: 70_000,
          last_updated_at: 1_753_720_000,
        },
      },
      ["BTC"],
    );

    expect(result[0].changePercentage24h).toBeNull();
  });

  it("throws when a requested asset is missing", () => {
    expect(() => mapCoinGeckoPrices({}, ["BTC"])).toThrow(
      "Missing or invalid price for BTC",
    );
  });
});
