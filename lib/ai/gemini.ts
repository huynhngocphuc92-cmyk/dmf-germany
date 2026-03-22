import { GoogleGenerativeAI } from "@google/generative-ai";

export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_MODEL_FALLBACKS = [DEFAULT_GEMINI_MODEL, "gemini-flash-latest"];

type GenerativeModelOptions = Omit<
  Parameters<GoogleGenerativeAI["getGenerativeModel"]>[0],
  "model"
>;
type GeminiModel = ReturnType<GoogleGenerativeAI["getGenerativeModel"]>;

let cachedWorkingModel: string | null = null;

function getCandidateModels(preferredModel = process.env.GEMINI_MODEL): string[] {
  return Array.from(
    new Set([cachedWorkingModel, preferredModel, ...GEMINI_MODEL_FALLBACKS].filter(Boolean))
  ) as string[];
}

export function isGeminiModelUnavailableError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  return (
    (message.includes("404") && message.includes("model")) ||
    message.includes("no longer available") ||
    message.includes("not found")
  );
}

export async function runWithGeminiModelFallback<T>(
  apiKey: string,
  modelOptions: GenerativeModelOptions,
  task: (model: GeminiModel, modelName: string) => Promise<T>
): Promise<{ data: T; modelName: string }> {
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: unknown;

  for (const modelName of getCandidateModels()) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        ...modelOptions,
      });

      const data = await task(model, modelName);
      cachedWorkingModel = modelName;

      return { data, modelName };
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
