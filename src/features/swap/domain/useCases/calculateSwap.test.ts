import { calculateSwap } from "./calculateSwap";

describe("calculateSwap", () => {
  it("calculates the target amount", () => {
    const result = calculateSwap({
      sourceAsset: "BTC",
      targetAsset: "ETH",
      sourceAmount: 0.01,
      sourceBalance: 0.05,
      sourcePriceUsd: 70_000,
      targetPriceUsd: 3_500,
      minimumUsd: 1,
    });

    expect(result.status).toBe("success");

    if (result.status !== "success") {
      throw new Error("Expected a successful swap");
    }

    expect(result.usdValue).toBeCloseTo(700);
    expect(result.targetAmount).toBeCloseTo(0.2);
  });

  it("returns insufficient funds when amount exceeds balance", () => {
    const result = calculateSwap({
      sourceAsset: "BTC",
      targetAsset: "ETH",
      sourceAmount: 0.1,
      sourceBalance: 0.05,
      sourcePriceUsd: 70_000,
      targetPriceUsd: 3_500,
      minimumUsd: 1,
    });

    expect(result).toEqual({
      status: "insufficient-funds",
      availableAmount: 0.05,
    });
  });

  it("rejects swaps below the minimum USD amount", () => {
    const result = calculateSwap({
      sourceAsset: "BTC",
      targetAsset: "USDT",
      sourceAmount: 0.000001,
      sourceBalance: 0.05,
      sourcePriceUsd: 70_000,
      targetPriceUsd: 1,
      minimumUsd: 1,
    });

    expect(result).toEqual({
      status: "below-minimum",
      minimumUsd: 1,
    });
  });

  it("rejects swaps between the same asset", () => {
    const result = calculateSwap({
      sourceAsset: "BTC",
      targetAsset: "BTC",
      sourceAmount: 0.01,
      sourceBalance: 0.05,
      sourcePriceUsd: 70_000,
      targetPriceUsd: 70_000,
      minimumUsd: 1,
    });

    expect(result).toEqual({
      status: "same-asset",
    });
  });

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid source amount: %s",
    (sourceAmount) => {
      const result = calculateSwap({
        sourceAsset: "BTC",
        targetAsset: "ETH",
        sourceAmount,
        sourceBalance: 0.05,
        sourcePriceUsd: 70_000,
        targetPriceUsd: 3_500,
        minimumUsd: 1,
      });

      expect(result).toEqual({
        status: "invalid-amount",
      });
    },
  );
});
