import { GoogleGenerativeAI } from "@google/generative-ai";

export const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_MODEL_FALLBACKS = [
  process.env.GEMINI_MODEL,
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
].filter(Boolean) as string[];

let cachedWorkingGeminiModel: string | null = null;

function getCandidateModels(): string[] {
  return Array.from(
    new Set([cachedWorkingGeminiModel, ...GEMINI_MODEL_FALLBACKS].filter(Boolean))
  ) as string[];
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
  userMessage: string
): Promise<{ text: string; modelName: string }> {
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: unknown;

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

      const result = await model.generateContent({ contents });
      const response = await result.response;
      const text = response.text() || "";

      cachedWorkingGeminiModel = modelName;
      return { text, modelName };
    } catch (error) {
      lastError = error;
      if (isGeminiModelUnavailableError(error)) {
        console.warn(`[Gemini] Model "${modelName}" unavailable, trying fallback.`);
        continue;
      }
      throw error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("No Gemini model available.");
}
