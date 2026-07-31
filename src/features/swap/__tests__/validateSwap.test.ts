import { validateSwap } from "../domain/useCases/validateSwap";

describe("validateSwap", () => {
  const validParams = {
    fromSymbol: "BTC" as const,
    toSymbol: "ETH" as const,
    amount: 0.01,
    availableBalance: 0.05,
    fromPriceUsd: 60_000,
    toPriceUsd: 3_000,
  };

  it("returns null for a valid swap", () => {
    expect(validateSwap(validParams)).toBeNull();
  });

  it("rejects an invalid amount", () => {
    expect(
      validateSwap({
        ...validParams,
        amount: 0,
      }),
    ).toBe("INVALID_AMOUNT");
  });

  it("rejects insufficient balance", () => {
    expect(
      validateSwap({
        ...validParams,
        amount: 0.1,
      }),
    ).toBe("INSUFFICIENT_BALANCE");
  });

  it("rejects equal assets", () => {
    expect(
      validateSwap({
        ...validParams,
        toSymbol: "BTC",
      }),
    ).toBe("SAME_ASSET");
  });

  it("rejects unavailable prices", () => {
    expect(
      validateSwap({
        ...validParams,
        toPriceUsd: undefined,
      }),
    ).toBe("INVALID_PRICE");
  });
});
