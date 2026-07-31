export type PriceAlertValidationError = "INVALID_TARGET_PRICE";

type ValidatePriceAlertParams = {
  targetPriceUsd: number;
};

export function validatePriceAlert({
  targetPriceUsd,
}: ValidatePriceAlertParams): PriceAlertValidationError | null {
  if (!Number.isFinite(targetPriceUsd) || targetPriceUsd <= 0) {
    return "INVALID_TARGET_PRICE";
  }

  return null;
}
