import { INITIAL_PORTFOLIO } from "../../portfolio/domain/entities/PortfolioBalance";
import { usePortfolioStore } from "../../portfolio/store/portfolioStore";

describe("portfolioStore.swapBalances", () => {
  beforeEach(() => {
    usePortfolioStore.setState({
      balances: { ...INITIAL_PORTFOLIO },
      hasHydrated: true,
    });
  });

  it("debits and credits both assets in one operation", () => {
    const result = usePortfolioStore
      .getState()
      .swapBalances("BTC", "ETH", 0.01, 0.2);

    const balances = usePortfolioStore.getState().balances;

    expect(result).toEqual({
      success: true,
    });

    expect(balances.BTC).toBeCloseTo(INITIAL_PORTFOLIO.BTC - 0.01);

    expect(balances.ETH).toBeCloseTo(INITIAL_PORTFOLIO.ETH + 0.2);
  });

  it("does not modify any balance when funds are insufficient", () => {
    const previousBalances = {
      ...usePortfolioStore.getState().balances,
    };

    const result = usePortfolioStore
      .getState()
      .swapBalances("BTC", "ETH", 100, 10);

    expect(result).toEqual({
      success: false,
      reason: "INSUFFICIENT_BALANCE",
    });

    expect(usePortfolioStore.getState().balances).toEqual(previousBalances);
  });
});
