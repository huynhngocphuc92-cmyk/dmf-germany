export const DEFAULT_GROK_MODEL = process.env.XAI_MODEL || "grok-2-latest";

const GROK_MODEL_FALLBACKS = [
  process.env.XAI_MODEL,
  "grok-2-latest",
  "grok-2",
  "grok-2-1212",
  "grok-beta",
  "grok-3",
  "grok-3-mini",
  "grok-4-fast-non-reasoning",
].filter(Boolean) as string[];

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

let cachedWorkingModel: string | null = null;

function getCandidateModels(): string[] {
  return Array.from(
    new Set([cachedWorkingModel, ...GROK_MODEL_FALLBACKS].filter(Boolean))
  ) as string[];
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
  messages: GrokMessage[]
): Promise<GrokResponseData> {
  let lastError: unknown;

  for (const modelName of getCandidateModels()) {
    try {
      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
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

      const data = await response.json();

      if (!response.ok) {
        const errorMsg =
          typeof data.error === "string"
            ? data.error
            : data.error?.message || `API Error: ${response.status} ${response.statusText}`;
        const err = new Error(errorMsg);
        (err as unknown as { status: number }).status = response.status;
        throw err;
      }

      const text = data.choices[0]?.message?.content || "";
      const usage = {
        inputTokens: data.usage?.prompt_tokens ?? 0,
        outputTokens: data.usage?.completion_tokens ?? 0,
      };

      cachedWorkingModel = modelName;

      return { text, usage, modelName };
    } catch (error) {
      lastError = error;

      if (isGrokModelUnavailableError(error)) {
        console.warn(
          `[Grok] Model "${modelName}" unavailable, trying fallback:`,
          error instanceof Error ? error.message : error
        );
        continue;
      }

      throw error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("No Grok model available.");
}
