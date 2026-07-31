import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { AssetSymbol } from "../../market/domain/entities/Asset";
import {
    INITIAL_PORTFOLIO,
    PortfolioBalance,
} from "../domain/entities/PortfolioBalance";

const MINIMUM_SWAP_AMOUNT_USD = 1;

export type SwapExecutionResult =
  | {
      success: true;
    }
  | {
      success: false;
      reason:
        | "INVALID_AMOUNT"
        | "SAME_ASSET"
        | "INSUFFICIENT_BALANCE"
        | "INVALID_PRICE"
        | "BELOW_MINIMUM_AMOUNT";
    };

type PortfolioState = {
  balances: PortfolioBalance;
  hasHydrated: boolean;

  updateBalance: (symbol: AssetSymbol, amount: number) => void;

  resetPortfolio: () => void;

  setHasHydrated: (hasHydrated: boolean) => void;

  swapBalances: (
    fromSymbol: AssetSymbol,
    toSymbol: AssetSymbol,
    fromAmount: number,
    toAmount: number,
    fromPriceUsd: number,
  ) => SwapExecutionResult;
};

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      balances: INITIAL_PORTFOLIO,

      hasHydrated: false,

      updateBalance: (symbol, amount) => {
        set((state) => ({
          balances: {
            ...state.balances,
            [symbol]: amount,
          },
        }));
      },

      resetPortfolio: () => {
        set({
          balances: INITIAL_PORTFOLIO,
        });
      },

      setHasHydrated: (hasHydrated) => {
        set({ hasHydrated });
      },

      swapBalances: (
        fromSymbol,
        toSymbol,
        fromAmount,
        toAmount,
        fromPriceUsd,
      ) => {
        let result: SwapExecutionResult = {
          success: false,
          reason: "INVALID_AMOUNT",
        };

        set((state) => {
          if (fromSymbol === toSymbol) {
            result = {
              success: false,
              reason: "SAME_ASSET",
            };

            return state;
          }

          if (
            !Number.isFinite(fromAmount) ||
            !Number.isFinite(toAmount) ||
            fromAmount <= 0 ||
            toAmount <= 0
          ) {
            result = {
              success: false,
              reason: "INVALID_AMOUNT",
            };

            return state;
          }

          if (!Number.isFinite(fromPriceUsd) || fromPriceUsd <= 0) {
            result = {
              success: false,
              reason: "INVALID_PRICE",
            };

            return state;
          }

          const amountUsd = fromAmount * fromPriceUsd;

          if (amountUsd < MINIMUM_SWAP_AMOUNT_USD) {
            result = {
              success: false,
              reason: "BELOW_MINIMUM_AMOUNT",
            };

            return state;
          }

          const fromBalance = state.balances[fromSymbol];

          if (fromAmount > fromBalance) {
            result = {
              success: false,
              reason: "INSUFFICIENT_BALANCE",
            };

            return state;
          }

          result = {
            success: true,
          };

          return {
            balances: {
              ...state.balances,

              [fromSymbol]: fromBalance - fromAmount,

              [toSymbol]: state.balances[toSymbol] + toAmount,
            },
          };
        });

        return result;
      },
    }),

    {
      name: "portfolio-storage",

      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        balances: state.balances,
      }),

      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error("Failed to hydrate portfolio:", error);
          }

          state?.setHasHydrated(true);
        };
      },
    },
  ),
);
