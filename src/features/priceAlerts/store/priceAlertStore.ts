import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { PriceAlert } from "../domain/entities/PriceAlert";

type PriceAlertState = {
  alerts: PriceAlert[];
  hasHydrated: boolean;

  addAlert: (alert: PriceAlert) => void;

  removeAlert: (alertId: string) => void;

  markAsTriggered: (alertId: string, triggeredAt: string) => void;

  setHasHydrated: (hasHydrated: boolean) => void;
};

export const usePriceAlertStore = create<PriceAlertState>()(
  persist(
    (set) => ({
      alerts: [],
      hasHydrated: false,

      addAlert: (alert) => {
        set((state) => ({
          alerts: [alert, ...state.alerts],
        }));
      },

      removeAlert: (alertId) => {
        set((state) => ({
          alerts: state.alerts.filter((alert) => alert.id !== alertId),
        }));
      },

      markAsTriggered: (alertId, triggeredAt) => {
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === alertId
              ? {
                  ...alert,
                  isActive: false,
                  triggeredAt,
                }
              : alert,
          ),
        }));
      },

      setHasHydrated: (hasHydrated) => {
        set({ hasHydrated });
      },
    }),

    {
      name: "price-alert-storage",

      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        alerts: state.alerts,
      }),

      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error("Failed to hydrate price alerts:", error);
          }

          state?.setHasHydrated(true);
        };
      },
    },
  ),
);
