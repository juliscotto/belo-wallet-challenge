import { AssetSymbol } from "../../../market/domain/entities/Asset";
import { SWAP_QUOTE_DURATION_MS } from "../constants/swapConstants";

import { SwapQuote } from "../entities/SwapQuote";

type CreateSwapQuoteParams = {
  fromSymbol: AssetSymbol;
  toSymbol: AssetSymbol;
  fromAmount: number;
  fromPriceUsd: number;
  toPriceUsd: number;
  now?: number;
};

export function createSwapQuote({
  fromSymbol,
  toSymbol,
  fromAmount,
  fromPriceUsd,
  toPriceUsd,
  now = Date.now(),
}: CreateSwapQuoteParams): SwapQuote {
  const valueUsd = fromAmount * fromPriceUsd;

  const toAmount = valueUsd / toPriceUsd;

  const exchangeRate = fromPriceUsd / toPriceUsd;

  return {
    fromSymbol,
    toSymbol,
    fromAmount,
    toAmount,
    fromPriceUsd,
    toPriceUsd,
    exchangeRate,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SWAP_QUOTE_DURATION_MS).toISOString(),
  };
}
