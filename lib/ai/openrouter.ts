import { resolveAiGatewayEndpoint } from "./cloudflare-gateway";
import {
  ProviderError,
  providerHttpError,
  providerSignal,
  type ProviderRequestOptions,
} from "./provider-runtime";
import { SITE_URL } from "@/lib/site";

export const DEFAULT_OPENROUTER_PRIMARY_MODEL = "deepseek/deepseek-v4.1-flash-1017";
export const DEFAULT_OPENROUTER_PAID_BACKUP_MODEL = "google/gemma-4-26b-a4b-it";
export const DEFAULT_OPENROUTER_FREE_FALLBACK_MODEL = "google/gemma-4-26b-a4b-it:free";

export const OPENROUTER_IGNORED_PROVIDERS = [
  "alibaba",
  "antdigital",
  "baidu",
  "deepseek",
  "novita",
  "siliconflow",
  "stepfun",
] as const;

export interface OpenRouterProviderPreferences {
  zdr?: boolean;
  data_collection?: "allow" | "deny";
  ignore?: string[];
  max_price?: {
    prompt?: number;
    completion?: number;
  };
}

export const OPENROUTER_ZDR_PROVIDER_PREFERENCES: OpenRouterProviderPreferences = {
  zdr: true,
  data_collection: "deny",
  ignore: [...OPENROUTER_IGNORED_PROVIDERS],
  max_price: {
    prompt: 0.25,
    completion: 1.0,
  },
};

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterResponseData {
  text: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
  modelName: string;
}

/**
 * Returns up to 3 deduplicated models in priority order:
 * 1. Primary Model (DeepSeek V4.1 Flash 1017 with ZDR routing)
 * 2. Paid ZDR Backup Model (Gemma 4 26B A4B)
 * 3. Emergency Free Fallback Model (:free)
 */
export function getOpenRouterCandidateModels(): string[] {
  const primary = process.env.OPENROUTER_PRIMARY_MODEL?.trim() || DEFAULT_OPENROUTER_PRIMARY_MODEL;
  const paidBackup =
    process.env.OPENROUTER_PAID_BACKUP_MODEL?.trim() || DEFAULT_OPENROUTER_PAID_BACKUP_MODEL;
  const freeFallback =
    process.env.OPENROUTER_FREE_FALLBACK_MODEL?.trim() || DEFAULT_OPENROUTER_FREE_FALLBACK_MODEL;

  return Array.from(new Set([primary, paidBackup, freeFallback].filter(Boolean))).slice(0, 3);
}

export function isOpenRouterRetryableError(error: unknown): boolean {
  if (error instanceof ProviderError) {
    return (
      error.code === "model_unavailable" ||
      error.code === "rate_limited" ||
      error.code === "invalid_response" ||
      error.code === "unavailable"
    );
  }
  const status = (error as { status?: number })?.status;
  return (
    status === 400 ||
    status === 402 ||
    status === 404 ||
    status === 408 ||
    status === 429 ||
    (status ?? 0) >= 500
  );
}

async function requestOpenRouterCompletion(
  apiKey: string,
  models: string[],
  messages: OpenRouterMessage[],
  signal: AbortSignal,
  options: ProviderRequestOptions = {},
  provider?: OpenRouterProviderPreferences
): Promise<OpenRouterResponseData> {
  const [primaryModel] = models;
  const endpoint = resolveAiGatewayEndpoint(
    "openrouter",
    "https://openrouter.ai/api/v1/chat/completions",
    { cacheTtlSeconds: 3600 }
  );
  const response = await fetch(endpoint.url, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": SITE_URL,
      "X-Title": "DMF Talents",
      ...endpoint.headers,
    },
    body: JSON.stringify({
      model: primaryModel,
      ...(models.length > 1 ? { models } : {}),
      ...(provider ? { provider } : {}),
      messages,
      max_tokens: options.maxTokens ?? 450,
      temperature: options.temperature ?? 0.3,
      reasoning: { effort: "none" },
    }),
  });

  if (!response.ok) {
    throw providerHttpError(response.status);
  }

  const data = await response.json().catch(() => {
    throw new ProviderError("invalid_response");
  });

  if (data?.error) {
    const errorCode = Number(data.error.code);
    if (Number.isFinite(errorCode) && errorCode >= 400) {
      throw providerHttpError(errorCode);
    }
    throw new ProviderError("unavailable");
  }

  const text = data?.choices?.[0]?.message?.content;
  const usage = {
    inputTokens: data?.usage?.prompt_tokens ?? 0,
    outputTokens: data?.usage?.completion_tokens ?? 0,
  };

  if (typeof text !== "string" || !text.trim()) {
    throw new ProviderError("invalid_response");
  }

  return {
    text: text.trim(),
    usage,
    modelName: typeof data?.model === "string" && data.model.trim() ? data.model : primaryModel,
  };
}

/**
 * Executes an OpenRouter chat completion enforcing DSGVO-safe ZDR routing when the primary
 * model is paid (`[primary, paidBackup]` with ZDR + price cap), falling back to `:free`
 * models without ZDR constraints on credits exhaustion (`402`), rate limiting, or upstream errors.
 */
export async function runWithOpenRouterFallback(
  apiKey: string,
  messages: OpenRouterMessage[],
  options: ProviderRequestOptions = {}
): Promise<OpenRouterResponseData> {
  const candidates = getOpenRouterCandidateModels();
  if (!candidates.length) {
    throw new ProviderError("model_unavailable");
  }

  const signal = providerSignal(options);

  if (!candidates[0].endsWith(":free")) {
    const zdrCandidates = candidates.filter((m) => !m.endsWith(":free"));
    const freeCandidates = candidates.filter((m) => m.endsWith(":free"));

    try {
      return await requestOpenRouterCompletion(
        apiKey,
        zdrCandidates,
        messages,
        signal,
        options,
        OPENROUTER_ZDR_PROVIDER_PREFERENCES
      );
    } catch (firstError) {
      if (!signal.aborted && isOpenRouterRetryableError(firstError)) {
        if (freeCandidates.length > 0) {
          return await requestOpenRouterCompletion(
            apiKey,
            freeCandidates,
            messages,
            signal,
            options
          );
        }
        if (zdrCandidates.length > 1) {
          return await requestOpenRouterCompletion(
            apiKey,
            [zdrCandidates[zdrCandidates.length - 1]],
            messages,
            signal,
            options,
            OPENROUTER_ZDR_PROVIDER_PREFERENCES
          );
        }
      }
      throw firstError;
    }
  }

  try {
    return await requestOpenRouterCompletion(apiKey, candidates, messages, signal, options);
  } catch (firstError) {
    const fallbackModel = candidates[candidates.length - 1];
    if (
      !signal.aborted &&
      candidates.length > 1 &&
      fallbackModel &&
      isOpenRouterRetryableError(firstError)
    ) {
      return await requestOpenRouterCompletion(apiKey, [fallbackModel], messages, signal, options);
    }
    throw firstError;
  }
}
