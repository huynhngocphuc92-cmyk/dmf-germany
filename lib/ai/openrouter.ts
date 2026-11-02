import {
  ProviderError,
  providerHttpError,
  providerSignal,
  type ProviderRequestOptions,
} from "./provider-runtime";
import { SITE_URL } from "@/lib/site";

export const DEFAULT_OPENROUTER_PRIMARY_MODEL = "google/gemma-4-26b-a4b-it:free";
export const DEFAULT_OPENROUTER_FREE_FALLBACK_MODEL = "nvidia/nemotron-3.5-super-vl:free";
export const DEFAULT_OPENROUTER_PAID_BACKUP_MODEL = "deepseek/deepseek-v4.1-flash";

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
 * 1. Primary Free Model (:free)
 * 2. Secondary Free Model from an independent upstream provider (:free)
 * 3. Ultra-low-cost Paid Backup Model (DeepSeek V4.1 Flash)
 */
export function getOpenRouterCandidateModels(): string[] {
  const primary = process.env.OPENROUTER_PRIMARY_MODEL?.trim() || DEFAULT_OPENROUTER_PRIMARY_MODEL;
  const freeFallback =
    process.env.OPENROUTER_FREE_FALLBACK_MODEL?.trim() || DEFAULT_OPENROUTER_FREE_FALLBACK_MODEL;
  const paidBackup =
    process.env.OPENROUTER_PAID_BACKUP_MODEL?.trim() || DEFAULT_OPENROUTER_PAID_BACKUP_MODEL;

  return Array.from(new Set([primary, freeFallback, paidBackup].filter(Boolean))).slice(0, 3);
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
    status === 400 || status === 404 || status === 408 || status === 429 || (status ?? 0) >= 500
  );
}

async function requestOpenRouterCompletion(
  apiKey: string,
  models: string[],
  messages: OpenRouterMessage[],
  signal: AbortSignal,
  options: ProviderRequestOptions = {}
): Promise<OpenRouterResponseData> {
  const [primaryModel] = models;
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": SITE_URL,
      "X-Title": "DMF Talents",
    },
    body: JSON.stringify({
      model: primaryModel,
      ...(models.length > 1 ? { models } : {}),
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
 * Executes an OpenRouter chat completion using OpenRouter's native 3-model routing array
 * (`[primaryFree, secondaryFree, paidDeepSeekBackup]`). If the native multi-model array fails
 * due to a model-specific parameter/availability issue or empty completion, falls back
 * directly to the paid backup model before throwing.
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

  try {
    return await requestOpenRouterCompletion(apiKey, candidates, messages, signal, options);
  } catch (firstError) {
    const paidBackup = candidates[candidates.length - 1];
    if (
      !signal.aborted &&
      candidates.length > 1 &&
      paidBackup &&
      isOpenRouterRetryableError(firstError)
    ) {
      return await requestOpenRouterCompletion(apiKey, [paidBackup], messages, signal, options);
    }
    throw firstError;
  }
}
