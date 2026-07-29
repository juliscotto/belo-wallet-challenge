import { MarketDataSource } from "../dataSources/MarketDataSource";
import { MarketRepositoryImpl } from "./MarketRepositoryImpl";

describe("MarketRepositoryImpl", () => {
  const remoteDataSource: jest.Mocked<MarketDataSource> = {
    getPrices: jest.fn(),
  };

  const mockDataSource: jest.Mocked<MarketDataSource> = {
    getPrices: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

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
