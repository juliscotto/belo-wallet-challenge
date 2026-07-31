import { mapPriceHistory } from "./priceHistoryMapper";

describe("mapPriceHistory", () => {
  it("maps valid CoinGecko price points", () => {
    const result = mapPriceHistory({
      prices: [
        [1000, 60_000],
        [2000, 61_000],
      ],
      market_caps: [],
      total_volumes: [],
    });

    expect(result).toEqual([
      {
        timestamp: 1000,
        priceUsd: 60_000,
      },
      {
        timestamp: 2000,
        priceUsd: 61_000,
      },
    ]);
  });

  it("removes invalid price points", () => {
    const result = mapPriceHistory({
      prices: [
        [1000, 60_000],
        [2000, -1],
        [3000, Number.NaN],
      ],
      market_caps: [],
      total_volumes: [],
    });

    expect(result).toEqual([
      {
        timestamp: 1000,
        priceUsd: 60_000,
      },
    ]);
  });
});
