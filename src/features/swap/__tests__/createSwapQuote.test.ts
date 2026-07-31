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
});
