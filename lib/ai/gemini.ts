import { ProviderError, providerSignal, type ProviderRequestOptions } from "./provider-runtime";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";
function getCandidateModels(): string[] {
  return Array.from(
    new Set([
      process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL,
      ...(process.env.GEMINI_FALLBACK_MODELS || "")
        .split(",")
        .map((model) => model.trim())
        .filter(Boolean),
    ])
  ).slice(0, 2);
}

export function isGeminiModelUnavailableError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  return (
    message.includes("404") ||
    message.includes("not found") ||
    message.includes("not supported") ||
    message.includes("unsupported") ||
    message.includes("deprecated")
  );
}

export async function runWithGeminiFallback(
  apiKey: string,
  systemPrompt: string,
  history: { role: "user" | "assistant"; content: string }[],
  userMessage: string,
  options: ProviderRequestOptions = {}
): Promise<{ text: string; modelName: string }> {
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: unknown;
  const signal = providerSignal(options);

  for (const modelName of getCandidateModels()) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
      });

      const contents = [
        ...history.map((h) => ({
          role: h.role === "assistant" ? ("model" as const) : ("user" as const),
          parts: [{ text: h.content }],
        })),
        {
          role: "user" as const,
          parts: [{ text: userMessage }],
        },
      ];

      const result = await model.generateContent(
        { contents },
        { signal, timeout: options.timeoutMs ?? 12000 }
      );
      const response = await result.response;
      const text = response.text() || "";

      if (!text.trim()) throw new ProviderError("invalid_response");
      return { text, modelName };
    } catch (error) {
      lastError = error;
      if (!signal.aborted && isGeminiModelUnavailableError(error)) {
        continue;
      }
      throw error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("No Gemini model available.");
}
