import { INITIAL_PORTFOLIO } from "../entities/PortfolioBalance";
import { calculatePortfolioTotal } from "./calculatePortfolioTotal";

describe("calculatePortfolioTotal", () => {
  it("calculates the total portfolio value in USD", () => {
    const result = calculatePortfolioTotal(INITIAL_PORTFOLIO, [
      {
        symbol: "USDT",
        priceUsd: 1,
        changePercentage24h: 0,
        updatedAt: "2026-07-29T00:00:00.000Z",
      },
      {
        symbol: "USDC",
        priceUsd: 1,
        changePercentage24h: 0,
        updatedAt: "2026-07-29T00:00:00.000Z",
      },
      {
        symbol: "DAI",
        priceUsd: 1,
        changePercentage24h: 0,
        updatedAt: "2026-07-29T00:00:00.000Z",
      },
      {
        symbol: "BTC",
        priceUsd: 70_000,
        changePercentage24h: 2.5,
        updatedAt: "2026-07-29T00:00:00.000Z",
      },
      {
        symbol: "ETH",
        priceUsd: 3_500,
        changePercentage24h: -1.2,
        updatedAt: "2026-07-29T00:00:00.000Z",
      },
    ]);

    expect(result).toBeCloseTo(10_750);
  });

  it("returns zero when prices are empty", () => {
    const result = calculatePortfolioTotal(INITIAL_PORTFOLIO, []);

    expect(result).toBe(0);
  });
});
