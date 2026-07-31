import { SwapQuote } from "../entities/SwapQuote";
import {
    getSwapQuoteRemainingSeconds,
    isSwapQuoteExpired,
} from "./swapQuoteExpiration";

const quote: SwapQuote = {
  fromSymbol: "BTC",
  toSymbol: "ETH",

  fromAmount: 0.01,
  toAmount: 0.2,

  fromPriceUsd: 60_000,
  toPriceUsd: 3_000,

  exchangeRate: 20,

  createdAt: "2026-07-31T12:00:00.000Z",

  expiresAt: "2026-07-31T12:00:30.000Z",
};

describe("swap quote expiration", () => {
  it("returns false before expiration", () => {
    const now = new Date("2026-07-31T12:00:20.000Z").getTime();

    expect(isSwapQuoteExpired(quote, now)).toBe(false);
  });

  it("returns true at expiration time", () => {
    const now = new Date("2026-07-31T12:00:30.000Z").getTime();

    expect(isSwapQuoteExpired(quote, now)).toBe(true);
  });

  it("returns true after expiration", () => {
    const now = new Date("2026-07-31T12:00:31.000Z").getTime();

    expect(isSwapQuoteExpired(quote, now)).toBe(true);
  });

  it("calculates remaining seconds", () => {
    const now = new Date("2026-07-31T12:00:12.000Z").getTime();

    expect(getSwapQuoteRemainingSeconds(quote, now)).toBe(18);
  });

  it("never returns negative seconds", () => {
    const now = new Date("2026-07-31T12:01:00.000Z").getTime();

    expect(getSwapQuoteRemainingSeconds(quote, now)).toBe(0);
  });
});
