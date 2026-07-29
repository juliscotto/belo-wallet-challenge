import { environment } from "@/src/app/config/environment";
import { HttpClient } from "@/src/core/api/httpClient";

export const coinGeckoHttpClient = new HttpClient(
  environment.coinGeckoBaseUrl,
  environment.coinGeckoApiKey
    ? {
        "x-cg-demo-api-key": environment.coinGeckoApiKey,
      }
    : {},
);
