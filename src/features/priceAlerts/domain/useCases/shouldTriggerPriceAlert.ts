import { PriceAlert } from "../entities/PriceAlert";

export function shouldTriggerPriceAlert(
  alert: PriceAlert,
  currentPriceUsd: number,
): boolean {
  if (
    !alert.isActive ||
    !Number.isFinite(currentPriceUsd) ||
    currentPriceUsd <= 0
  ) {
    return false;
  }

  if (alert.condition === "ABOVE") {
    return currentPriceUsd >= alert.targetPriceUsd;
  }

  return currentPriceUsd <= alert.targetPriceUsd;
}
