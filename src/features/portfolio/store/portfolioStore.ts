import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { AssetSymbol } from "../../market/domain/entities/Asset";
import {
    INITIAL_PORTFOLIO,
    PortfolioBalance,
} from "../domain/entities/PortfolioBalance";

export type SwapExecutionResult =
  | {
      success: true;
    }
  | {
      success: false;
      reason: "INVALID_AMOUNT" | "SAME_ASSET" | "INSUFFICIENT_BALANCE";
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
      swapBalances: (fromSymbol, toSymbol, fromAmount, toAmount) => {
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

          if (fromAmount <= 0 || toAmount <= 0) {
            result = {
              success: false,
              reason: "INVALID_AMOUNT",
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
