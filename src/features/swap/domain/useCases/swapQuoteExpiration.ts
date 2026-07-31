import { SwapQuote } from "../entities/SwapQuote";

export function isSwapQuoteExpired(
  quote: SwapQuote,
  now = Date.now(),
): boolean {
  const expirationTime = new Date(quote.expiresAt).getTime();

  return now >= expirationTime;
}

export function getSwapQuoteRemainingSeconds(
  quote: SwapQuote,
  now = Date.now(),
): number {
  const expirationTime = new Date(quote.expiresAt).getTime();

  const remainingMilliseconds = expirationTime - now;

  return Math.max(0, Math.ceil(remainingMilliseconds / 1000));
}
