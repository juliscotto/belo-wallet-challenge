import { create } from "zustand";

export type MarketDataMode = "remote" | "mock";

type SettingsState = {
  marketDataMode: MarketDataMode;
  setMarketDataMode: (mode: MarketDataMode) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  marketDataMode: "remote",

  setMarketDataMode: (marketDataMode) => {
    set({ marketDataMode });
  },
}));
