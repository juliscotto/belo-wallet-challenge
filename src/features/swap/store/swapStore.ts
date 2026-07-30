import { create } from "zustand";

import { SwapQuote } from "../domain/entities/SwapQuote";

export type CompletedSwap = SwapQuote & {
  completedAt: string;
};

type SwapState = {
  pendingQuote: SwapQuote | null;
  completedSwap: CompletedSwap | null;

  setPendingQuote: (quote: SwapQuote) => void;

  completeSwap: (quote: SwapQuote) => void;

  clearPendingQuote: () => void;
  clearCompletedSwap: () => void;
};

export const useSwapStore = create<SwapState>()((set) => ({
  pendingQuote: null,
  completedSwap: null,

  setPendingQuote: (pendingQuote) => {
    set({ pendingQuote });
  },

  completeSwap: (quote) => {
    set({
      pendingQuote: null,

      completedSwap: {
        ...quote,
        completedAt: new Date().toISOString(),
      },
    });
  },

  clearPendingQuote: () => {
    set({ pendingQuote: null });
  },

  clearCompletedSwap: () => {
    set({ completedSwap: null });
  },
}));
