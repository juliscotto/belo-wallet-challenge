import { MarketDataSource } from "../dataSources/MarketDataSource";
import { MarketRepositoryImpl } from "./MarketRepositoryImpl";

describe("MarketRepositoryImpl", () => {
  const remoteDataSource: jest.Mocked<MarketDataSource> = {
    getPrices: jest.fn(),
    getPriceHistory: jest.fn(),
  };

  const mockDataSource: jest.Mocked<MarketDataSource> = {
    getPrices: jest.fn(),
    getPriceHistory: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPrices", () => {
    it("uses the remote data source when mock mode is disabled", async () => {
      remoteDataSource.getPrices.mockResolvedValue({
        bitcoin: {
          usd: 70_000,
          usd_24h_change: 2.5,
          last_updated_at: 1_753_720_000,
        },
      });

      const repository = new MarketRepositoryImpl(
        remoteDataSource,
        mockDataSource,
        () => false,
      );

      const result = await repository.getPrices(["BTC"]);

      expect(remoteDataSource.getPrices).toHaveBeenCalledWith(["BTC"]);
      expect(mockDataSource.getPrices).not.toHaveBeenCalled();

      expect(result[0]).toMatchObject({
        symbol: "BTC",
        priceUsd: 70_000,
      });
    });

    it("uses the mock data source when mock mode is enabled", async () => {
      mockDataSource.getPrices.mockResolvedValue({
        bitcoin: {
          usd: 65_000,
          usd_24h_change: 1,
          last_updated_at: 1_753_720_000,
        },
      });

      const repository = new MarketRepositoryImpl(
        remoteDataSource,
        mockDataSource,
        () => true,
      );

      const result = await repository.getPrices(["BTC"]);

      expect(mockDataSource.getPrices).toHaveBeenCalledWith(["BTC"]);
      expect(remoteDataSource.getPrices).not.toHaveBeenCalled();

      expect(result[0].priceUsd).toBe(65_000);
    });

    it("propagates errors from the selected data source", async () => {
      remoteDataSource.getPrices.mockRejectedValue(new Error("Network error"));

      const repository = new MarketRepositoryImpl(
        remoteDataSource,
        mockDataSource,
        () => false,
      );

      await expect(repository.getPrices(["BTC"])).rejects.toThrow(
        "Network error",
      );
    });
  });

  describe("getPriceHistory", () => {
    it("uses the remote data source when mock mode is disabled", async () => {
      remoteDataSource.getPriceHistory.mockResolvedValue({
        prices: [
          [1_753_720_000_000, 70_000],
          [1_753_723_600_000, 71_000],
        ],
        market_caps: [],
        total_volumes: [],
      });

      const repository = new MarketRepositoryImpl(
        remoteDataSource,
        mockDataSource,
        () => false,
      );

      const result = await repository.getPriceHistory("bitcoin");

      expect(remoteDataSource.getPriceHistory).toHaveBeenCalledWith("bitcoin");

      expect(mockDataSource.getPriceHistory).not.toHaveBeenCalled();

      expect(result).toEqual([
        {
          timestamp: 1_753_720_000_000,
          priceUsd: 70_000,
        },
        {
          timestamp: 1_753_723_600_000,
          priceUsd: 71_000,
        },
      ]);
    });

    it("uses the mock data source when mock mode is enabled", async () => {
      mockDataSource.getPriceHistory.mockResolvedValue({
        prices: [
          [1_753_720_000_000, 65_000],
          [1_753_723_600_000, 65_500],
        ],
        market_caps: [],
        total_volumes: [],
      });

      const repository = new MarketRepositoryImpl(
        remoteDataSource,
        mockDataSource,
        () => true,
      );

      const result = await repository.getPriceHistory("bitcoin");

      expect(mockDataSource.getPriceHistory).toHaveBeenCalledWith("bitcoin");

      expect(remoteDataSource.getPriceHistory).not.toHaveBeenCalled();

      expect(result[0]).toEqual({
        timestamp: 1_753_720_000_000,
        priceUsd: 65_000,
      });
    });

    it("propagates price history errors from the selected data source", async () => {
      remoteDataSource.getPriceHistory.mockRejectedValue(
        new Error("History request failed"),
      );

      const repository = new MarketRepositoryImpl(
        remoteDataSource,
        mockDataSource,
        () => false,
      );

      await expect(repository.getPriceHistory("bitcoin")).rejects.toThrow(
        "History request failed",
      );
    });
  });
});
