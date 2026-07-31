import { validatePriceAlert } from "./validatePriceAlert";

describe("validatePriceAlert", () => {
  it("accepts a positive finite price", () => {
    expect(
      validatePriceAlert({
        targetPriceUsd: 70_000,
      }),
    ).toBeNull();
  });

  it("rejects zero", () => {
    expect(
      validatePriceAlert({
        targetPriceUsd: 0,
      }),
    ).toBe("INVALID_TARGET_PRICE");
  });

  it("rejects invalid numbers", () => {
    expect(
      validatePriceAlert({
        targetPriceUsd: Number.NaN,
      }),
    ).toBe("INVALID_TARGET_PRICE");
  });
});
