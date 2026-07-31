import { render, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import { usePortfolioStore } from "../../portfolio/store/portfolioStore";
import { SwapScreen } from "../presentation/screens/SwapScreen";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  },
  useLocalSearchParams: () => ({
    fromSymbol: "BTC",
  }),
}));

jest.mock("@/features/market/presentation/hooks/useAssetPrices", () => ({
  useAssetPrices: () => ({
    data: [
      {
        symbol: "BTC",
        priceUsd: 60_000,
        changePercentage24h: 1,
        updatedAt: "2026-07-30T00:00:00.000Z",
      },
      {
        symbol: "ETH",
        priceUsd: 3_000,
        changePercentage24h: 1,
        updatedAt: "2026-07-30T00:00:00.000Z",
      },
    ],
    isPending: false,
    isError: false,
  }),
}));

describe("SwapScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    usePortfolioStore.setState({
      balances: {
        USDT: 1000,
        USDC: 500,
        DAI: 500,
        BTC: 0.05,
        ETH: 1.5,
      },
      hasHydrated: true,
    });
  });

  it("shows the estimated amount and continues", async () => {
    const user = userEvent.setup();

    const { getByTestId, findByText, getByRole } = await render(<SwapScreen />);

    const amountInput = getByTestId("swap-amount-input");

    await user.type(amountInput, "0.01");

    expect(await findByText(/0\.20000000 ETH/)).toBeTruthy();

    await user.press(
      getByRole("button", {
        name: "Continue",
      }),
    );

    expect(router.push).toHaveBeenCalledWith("/swap/confirm");
  });
});
