import { ApiError } from "./ApiError";

type HttpClientOptions = RequestInit & {
  query?: Record<string, string | number | boolean>;
};

function buildUrl(
  baseUrl: string,
  path: string,
  query?: Record<string, string | number | boolean>,
): string {
  const url = new URL(path, baseUrl);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

export class HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly defaultHeaders: HeadersInit = {},
  ) {}

  async get<T>(path: string, options: HttpClientOptions = {}): Promise<T> {
    const url = buildUrl(this.baseUrl, path, options.query);

    let response: Response;
    console.log("Request URL:", url);
    try {
      response = await fetch(url, {
        ...options,
        method: "GET",
        headers: {
          Accept: "application/json",
          ...this.defaultHeaders,
          ...options.headers,
        },
      });
    } catch (error) {
      throw new ApiError("network", undefined, undefined, { cause: error });
    }

    if (!response.ok) {
      throw mapStatusToApiError(response.status);
    }

    try {
      return (await response.json()) as T;
    } catch (error) {
      throw new ApiError("invalid-response", response.status, undefined, {
        cause: error,
      });
    }
  }
}

function mapStatusToApiError(status: number): ApiError {
  if (status === 429) {
    return new ApiError("rate-limit", status);
  }

  if (status >= 400 && status < 500) {
    return new ApiError("client", status);
  }

  if (status >= 500) {
    return new ApiError("server", status);
  }

  return new ApiError("unknown", status);
}
