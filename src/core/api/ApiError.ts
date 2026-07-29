export type ApiErrorCode =
  | "network"
  | "unauthorized"
  | "forbidden"
  | "rate-limit"
  | "client"
  | "server"
  | "invalid-response"
  | "unknown";

export class ApiError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    public readonly status?: number,
    public readonly responseBody?: string,
    options?: ErrorOptions,
  ) {
    super(status ? `${code} - HTTP ${status}` : code, options);

    this.name = "ApiError";
  }
}
