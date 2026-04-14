export const DEFAULT_GROK_MODEL = "grok-2-latest";
const GROK_MODEL_FALLBACKS = [DEFAULT_GROK_MODEL, "grok-2"];

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

  return (
    (message.includes("404") && message.includes("model")) ||
    message.includes("not found") ||
    message.includes("model does not exist")
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
        throw new Error(data.error?.message || `API Error: ${response.status}`);
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
        console.warn(`[Grok] Model "${modelName}" unavailable, trying fallback.`);
        continue;
      }

      throw error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("No Grok model available.");
}
