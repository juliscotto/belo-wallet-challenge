import { createSwapQuote } from "../domain/useCases/createSwapQuote";

describe("createSwapQuote", () => {
  it("calculates the destination amount", () => {
    const quote = createSwapQuote({
      fromSymbol: "BTC",
      toSymbol: "ETH",
      fromAmount: 0.01,
      fromPriceUsd: 60_000,
      toPriceUsd: 3_000,
    });

    expect(quote.toAmount).toBeCloseTo(0.2);
    expect(quote.exchangeRate).toBeCloseTo(20);
  });

  it("creates a swap quote with expiration", () => {
    const now = new Date("2026-07-31T12:00:00.000Z").getTime();

    const quote = createSwapQuote({
      fromSymbol: "BTC",
      toSymbol: "ETH",
      fromAmount: 0.01,
      fromPriceUsd: 60_000,
      toPriceUsd: 3_000,
      now,
    });

    expect(quote).toMatchObject({
      fromSymbol: "BTC",
      toSymbol: "ETH",
      fromAmount: 0.01,
      toAmount: 0.2,
      exchangeRate: 20,

      createdAt: "2026-07-31T12:00:00.000Z",

      expiresAt: "2026-07-31T12:00:30.000Z",
    });
  });
});
