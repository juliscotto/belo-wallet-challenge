import { AssetSymbol } from "../../../market/domain/entities/Asset";

import { SwapQuote } from "../entities/SwapQuote";

type CreateSwapQuoteParams = {
  fromSymbol: AssetSymbol;
  toSymbol: AssetSymbol;
  fromAmount: number;
  fromPriceUsd: number;
  toPriceUsd: number;
};

export function createSwapQuote({
  fromSymbol,
  toSymbol,
  fromAmount,
  fromPriceUsd,
  toPriceUsd,
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
  };
}
