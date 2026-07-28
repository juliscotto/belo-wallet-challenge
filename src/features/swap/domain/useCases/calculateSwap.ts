import { AssetSymbol } from "@/src/features/market/domain/entities/Asset";

type CalculateSwapInput = {
  sourceAsset: AssetSymbol;
  targetAsset: AssetSymbol;
  sourceAmount: number;
  sourceBalance: number;
  sourcePriceUsd: number;
  targetPriceUsd: number;
  minimumUsd: number;
};

export type SwapCalculationResult =
  | {
      status: "success";
      sourceAmount: number;
      targetAmount: number;
      usdValue: number;
    }
  | {
      status: "invalid-amount";
    }
  | {
      status: "same-asset";
    }
  | {
      status: "insufficient-funds";
      availableAmount: number;
    }
  | {
      status: "below-minimum";
      minimumUsd: number;
    }
  | {
      status: "invalid-price";
    };

export function calculateSwap({
  sourceAsset,
  targetAsset,
  sourceAmount,
  sourceBalance,
  sourcePriceUsd,
  targetPriceUsd,
  minimumUsd,
}: CalculateSwapInput): SwapCalculationResult {
  if (!Number.isFinite(sourceAmount) || sourceAmount <= 0) {
    return {
      status: "invalid-amount",
    };
  }

  if (sourceAsset === targetAsset) {
    return {
      status: "same-asset",
    };
  }

  if (sourceAmount > sourceBalance) {
    return {
      status: "insufficient-funds",
      availableAmount: sourceBalance,
    };
  }

  if (sourcePriceUsd <= 0 || targetPriceUsd <= 0) {
    return {
      status: "invalid-price",
    };
  }

  const usdValue = sourceAmount * sourcePriceUsd;

  if (usdValue < minimumUsd) {
    return {
      status: "below-minimum",
      minimumUsd,
    };
  }

  const targetAmount = usdValue / targetPriceUsd;

  return {
    status: "success",
    sourceAmount,
    targetAmount,
    usdValue,
  };
}
