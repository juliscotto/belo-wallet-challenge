import { render, userEvent } from "@testing-library/react-native";

import { useNotificationStore } from "../../notifications/store/notificationStore";
import { INITIAL_PORTFOLIO } from "../../portfolio/domain/entities/PortfolioBalance";
import { usePortfolioStore } from "../../portfolio/store/portfolioStore";
import { useSwapStore } from "../store/swapStore";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },

  useLocalSearchParams: jest.fn(() => ({
    fromSymbol: "BTC",
  })),
}));

jest.mock("../../market/presentation/hooks/useAssetPrices", () => ({
  useAssetPrices: () => ({
    data: [
      {
        symbol: "BTC",
        priceUsd: 60_000,
        changePercentage24h: 1.5,
        updatedAt: "2026-07-31T00:00:00.000Z",
      },
      {
        symbol: "ETH",
        priceUsd: 3_000,
        changePercentage24h: 2,
        updatedAt: "2026-07-31T00:00:00.000Z",
      },
      {
        symbol: "USDT",
        priceUsd: 1,
        changePercentage24h: 0,
        updatedAt: "2026-07-31T00:00:00.000Z",
      },
      {
        symbol: "USDC",
        priceUsd: 1,
        changePercentage24h: 0,
        updatedAt: "2026-07-31T00:00:00.000Z",
      },
      {
        symbol: "DAI",
        priceUsd: 1,
        changePercentage24h: 0,
        updatedAt: "2026-07-31T00:00:00.000Z",
      },
    ],

    isPending: false,
    isFetching: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

jest.mock("../../../core/haptics/haptics", () => ({
  triggerSelectionHaptic: jest.fn(),
  triggerSuccessHaptic: jest.fn(),
  triggerErrorHaptic: jest.fn(),
}));

import { SwapConfirmationScreen } from "../presentation/screens/SwapConfirmationScreen";
import { SwapScreen } from "../presentation/screens/SwapScreen";

type MockExpoRouter = {
  router: {
    push: jest.Mock;
    replace: jest.Mock;
    back: jest.Mock;
  };
};

const mockedExpoRouter = jest.requireMock("expo-router") as MockExpoRouter;

const mockRouter = mockedExpoRouter.router;

describe("complete swap flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    usePortfolioStore.setState({
      balances: {
        ...INITIAL_PORTFOLIO,
      },
      hasHydrated: true,
    });

    useSwapStore.setState({
      pendingQuote: null,
      completedSwap: null,
    });

    useNotificationStore.setState({
      notifications: [],
    });
  });

  it("creates a quote, confirms the swap, updates balances and creates a notification", async () => {
    const user = userEvent.setup();

    const swapView = await render(<SwapScreen />);

    const amountInput = await swapView.findByTestId("swap-amount-input");

    await user.type(amountInput, "0.01");

    expect(await swapView.findByText(/0\.20000000 ETH/)).toBeTruthy();

    const continueButton = swapView.getByRole("button", {
      name: "Continue",
    });

    await user.press(continueButton);

    expect(mockRouter.push).toHaveBeenCalledWith("/swap/confirm");

    const pendingQuote = useSwapStore.getState().pendingQuote;

    expect(pendingQuote).toMatchObject({
      fromSymbol: "BTC",
      toSymbol: "ETH",
      fromAmount: 0.01,
      toAmount: 0.2,
      fromPriceUsd: 60_000,
      toPriceUsd: 3_000,
    });

    await swapView.rerender(<SwapConfirmationScreen />);

    expect(await swapView.findByText(/0\.01\s+BTC/)).toBeTruthy();

    expect(await swapView.findByText(/0\.20000000\s+ETH/)).toBeTruthy();

    const confirmButton = swapView.getByRole("button", {
      name: "Confirm swap",
    });

    await user.press(confirmButton);

    const portfolioState = usePortfolioStore.getState();

    expect(portfolioState.balances.BTC).toBeCloseTo(
      INITIAL_PORTFOLIO.BTC - 0.01,
    );

    expect(portfolioState.balances.ETH).toBeCloseTo(
      INITIAL_PORTFOLIO.ETH + 0.2,
    );

    const notificationState = useNotificationStore.getState();

    expect(notificationState.notifications).toHaveLength(1);

    const notification = notificationState.notifications[0];

    expect(notification.type).toBe("SWAP_COMPLETED");

    expect(notification.isRead).toBe(false);

    expect(notification.data).toEqual({
      fromSymbol: "BTC",
      toSymbol: "ETH",
      fromAmount: 0.01,
      toAmount: 0.2,
    });

    const swapState = useSwapStore.getState();

    expect(swapState.pendingQuote).toBeNull();

    expect(swapState.completedSwap).toMatchObject({
      fromSymbol: "BTC",
      toSymbol: "ETH",
      fromAmount: 0.01,
      toAmount: 0.2,
    });

    expect(mockRouter.replace).toHaveBeenCalledWith("/swap/result");
  });
});
