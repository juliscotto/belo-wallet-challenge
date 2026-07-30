import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { AssetSymbol } from "../../market/domain/entities/Asset";
import {
    INITIAL_PORTFOLIO,
    PortfolioBalance,
} from "../domain/entities/PortfolioBalance";

type PortfolioState = {
  balances: PortfolioBalance;
  hasHydrated: boolean;

  updateBalance: (symbol: AssetSymbol, amount: number) => void;

  resetPortfolio: () => void;

  setHasHydrated: (hasHydrated: boolean) => void;
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
