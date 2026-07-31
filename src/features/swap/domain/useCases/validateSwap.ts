import { AssetSymbol } from "../../../market/domain/entities/Asset";

export type SwapValidationError =
  | "INVALID_AMOUNT"
  | "SAME_ASSET"
  | "INSUFFICIENT_BALANCE"
  | "INVALID_PRICE"
  | "BELOW_MINIMUM_AMOUNT";

type ValidateSwapParams = {
  fromSymbol: AssetSymbol;
  toSymbol: AssetSymbol;
  amount: number;
  availableBalance: number;
  fromPriceUsd?: number;
  toPriceUsd?: number;
};

export function validateSwap({
  fromSymbol,
  toSymbol,
  amount,
  availableBalance,
  fromPriceUsd,
  toPriceUsd,
}: ValidateSwapParams): SwapValidationError | null {
  if (!Number.isFinite(amount) || amount <= 0) {
    return "INVALID_AMOUNT";
  }

  if (fromSymbol === toSymbol) {
    return "SAME_ASSET";
  }

  if (amount > availableBalance) {
    return "INSUFFICIENT_BALANCE";
  }

  if (!fromPriceUsd || !toPriceUsd || fromPriceUsd <= 0 || toPriceUsd <= 0) {
    return "INVALID_PRICE";
  }

  const amountUsd = amount * fromPriceUsd;

  if (amountUsd < 1) {
    return "BELOW_MINIMUM_AMOUNT";
  }

  return null;
}
