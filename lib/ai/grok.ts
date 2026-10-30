import {
  ProviderError,
  providerHttpError,
  providerSignal,
  type ProviderRequestOptions,
} from "./provider-runtime";

export const DEFAULT_GROK_MODEL = process.env.XAI_MODEL || "grok-2-latest";

export interface GrokMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GrokResponseData {
  text: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
  modelName: string;
}

function getCandidateModels(): string[] {
  // A configured model is always first. At most one explicitly configured fallback.
  return Array.from(
    new Set([
      process.env.XAI_MODEL || DEFAULT_GROK_MODEL,
      ...(process.env.XAI_FALLBACK_MODELS || "")
        .split(",")
        .map((model) => model.trim())
        .filter(Boolean),
    ])
  ).slice(0, 2);
}

export function isGrokModelUnavailableError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  const status = (error as { status?: number })?.status;

  return (
    status === 400 ||
    status === 404 ||
    message.includes("404") ||
    message.includes("not found") ||
    message.includes("not_found") ||
    message.includes("model does not exist") ||
    message.includes("does not exist") ||
    message.includes("invalid model") ||
    message.includes("unknown model") ||
    message.includes("unsupported") ||
    message.includes("400") ||
    message.includes("bad request")
  );
}

export async function runWithGrokModelFallback(
  apiKey: string,
  messages: GrokMessage[],
  options: ProviderRequestOptions = {}
): Promise<GrokResponseData> {
  let lastError: unknown;
  const signal = providerSignal(options);

  for (const modelName of getCandidateModels()) {
    try {
      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: messages,
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw providerHttpError(response.status);
      const data = await response.json().catch(() => {
        throw new ProviderError("invalid_response");
      });

      const text = data.choices?.[0]?.message?.content || "";
      const usage = {
        inputTokens: data.usage?.prompt_tokens ?? 0,
        outputTokens: data.usage?.completion_tokens ?? 0,
      };

      if (typeof text !== "string" || !text.trim()) throw new ProviderError("invalid_response");

      return { text, usage, modelName };
    } catch (error) {
      lastError = error;

      if (
        !signal.aborted &&
        (error instanceof ProviderError
          ? error.code === "model_unavailable"
          : isGrokModelUnavailableError(error))
      ) {
        continue;
      }

      throw error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("No Grok model available.");
}
