const coinGeckoApiKey = process.env.EXPO_PUBLIC_COINGECKO_API_KEY;

if (!coinGeckoApiKey) {
  console.warn("EXPO_PUBLIC_COINGECKO_API_KEY is not configured");
}

export const environment = {
  coinGeckoBaseUrl:
    process.env.EXPO_PUBLIC_COINGECKO_BASE_URL ??
    "https://api.coingecko.com/api/v3/",

  coinGeckoApiKey,
};
