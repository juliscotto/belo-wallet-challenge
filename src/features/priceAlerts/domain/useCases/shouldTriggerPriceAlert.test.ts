import { PriceAlert } from "../entities/PriceAlert";
import { shouldTriggerPriceAlert } from "./shouldTriggerPriceAlert";

const baseAlert: PriceAlert = {
  id: "alert-1",
  symbol: "BTC",
  targetPriceUsd: 70_000,
  condition: "ABOVE",
  createdAt: "2026-07-31T12:00:00.000Z",
  isActive: true,
  triggeredAt: null,
};

describe("shouldTriggerPriceAlert", () => {
  it("triggers an ABOVE alert when current price reaches the target", () => {
    expect(shouldTriggerPriceAlert(baseAlert, 70_000)).toBe(true);
  });

  it("does not trigger an ABOVE alert below the target", () => {
    expect(shouldTriggerPriceAlert(baseAlert, 69_999)).toBe(false);
  });

  it("triggers a BELOW alert when current price reaches the target", () => {
    expect(
      shouldTriggerPriceAlert(
        {
          ...baseAlert,
          condition: "BELOW",
        },
        70_000,
      ),
    ).toBe(true);
  });

  it("does not trigger inactive alerts", () => {
    expect(
      shouldTriggerPriceAlert(
        {
          ...baseAlert,
          isActive: false,
        },
        80_000,
      ),
    ).toBe(false);
  });

  it("rejects invalid current prices", () => {
    expect(shouldTriggerPriceAlert(baseAlert, Number.NaN)).toBe(false);
  });
});
