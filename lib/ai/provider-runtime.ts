export type ProviderFailureCode =
  | "timeout"
  | "authentication"
  | "rate_limited"
  | "model_unavailable"
  | "invalid_response"
  | "unavailable";

export class ProviderError extends Error {
  constructor(
    public readonly code: ProviderFailureCode,
    public readonly status?: number
  ) {
    super(code);
    this.name = "ProviderError";
  }
}

export interface ProviderRequestOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

export function providerSignal(options: ProviderRequestOptions = {}) {
  const timeout = AbortSignal.timeout(options.timeoutMs ?? 12000);
  return options.signal ? AbortSignal.any([options.signal, timeout]) : timeout;
}

// Never include a provider's raw response: it can contain credentials or user input.
export function providerFailure(error: unknown): ProviderFailureCode {
  if (error instanceof ProviderError) return error.code;
  const value = error as { name?: string; status?: number };
  if (value?.name === "AbortError" || value?.name === "TimeoutError") return "timeout";
  if (value?.status === 401 || value?.status === 403) return "authentication";
  if (value?.status === 429) return "rate_limited";
  if (value?.status === 404) return "model_unavailable";
  return "unavailable";
}

export function providerHttpError(status: number): ProviderError {
  const code =
    status === 401 || status === 403
      ? "authentication"
      : status === 429
        ? "rate_limited"
        : status === 404
          ? "model_unavailable"
          : "unavailable";
  return new ProviderError(code, status);
}
