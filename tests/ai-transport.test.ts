import { afterEach, describe, expect, it, vi } from "vitest";
import { runWithGrokModelFallback } from "@/lib/ai/grok";
import {
  DEFAULT_OPENROUTER_FREE_FALLBACK_MODEL,
  DEFAULT_OPENROUTER_PAID_BACKUP_MODEL,
  DEFAULT_OPENROUTER_PRIMARY_MODEL,
  getOpenRouterCandidateModels,
  runWithOpenRouterFallback,
} from "@/lib/ai/openrouter";
const messages = [{ role: "user" as const, content: "Synthetic test only" }];
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
describe("bounded provider transport", () => {
  it("builds the 3-tier OpenRouter model chain (DeepSeek V4.1 Flash 1017 + Gemma 4 paid ZDR + Gemma 4 free)", () => {
    vi.stubEnv("OPENROUTER_PRIMARY_MODEL", "");
    vi.stubEnv("OPENROUTER_FREE_FALLBACK_MODEL", "");
    vi.stubEnv("OPENROUTER_PAID_BACKUP_MODEL", "");
    expect(getOpenRouterCandidateModels()).toEqual([
      DEFAULT_OPENROUTER_PRIMARY_MODEL,
      DEFAULT_OPENROUTER_PAID_BACKUP_MODEL,
      DEFAULT_OPENROUTER_FREE_FALLBACK_MODEL,
    ]);
    expect(getOpenRouterCandidateModels()).toEqual([
      "deepseek/deepseek-v4.1-flash-1017",
      "google/gemma-4-26b-a4b-it",
      "google/gemma-4-26b-a4b-it:free",
    ]);
  });

  it("enforces ZDR provider routing and price ceiling on paid OpenRouter models and falls back to :free on error", async () => {
    vi.stubEnv("OPENROUTER_PRIMARY_MODEL", "deepseek/deepseek-v4.1-flash-1017");
    vi.stubEnv("OPENROUTER_PAID_BACKUP_MODEL", "google/gemma-4-26b-a4b-it");
    vi.stubEnv("OPENROUTER_FREE_FALLBACK_MODEL", "google/gemma-4-26b-a4b-it:free");

    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response("{}", { status: 402 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            model: "google/gemma-4-26b-a4b-it:free",
            choices: [{ message: { content: "Antwort von Gemma Free Fallback" } }],
            usage: { prompt_tokens: 42, completion_tokens: 18 },
          }),
          { status: 200 }
        )
      );
    vi.stubGlobal("fetch", fetch);

    const result = await runWithOpenRouterFallback("fixture-or-key", messages);
    expect(result).toEqual({
      text: "Antwort von Gemma Free Fallback",
      usage: { inputTokens: 42, outputTokens: 18 },
      modelName: "google/gemma-4-26b-a4b-it:free",
    });
    expect(fetch).toHaveBeenCalledTimes(2);
    const firstPayload = JSON.parse(fetch.mock.calls[0][1].body);
    expect(firstPayload.model).toBe("deepseek/deepseek-v4.1-flash-1017");
    expect(firstPayload.models).toEqual([
      "deepseek/deepseek-v4.1-flash-1017",
      "google/gemma-4-26b-a4b-it",
    ]);
    expect(firstPayload.reasoning).toEqual({ effort: "none" });
    expect(firstPayload.max_tokens).toBe(450);
    expect(firstPayload.provider).toMatchObject({
      zdr: true,
      data_collection: "deny",
      max_price: { prompt: 0.25, completion: 1.0 },
    });
    expect(firstPayload.provider.ignore).toEqual(
      expect.arrayContaining(["baidu", "alibaba", "deepseek"])
    );

    const secondPayload = JSON.parse(fetch.mock.calls[1][1].body);
    expect(secondPayload.model).toBe("google/gemma-4-26b-a4b-it:free");
    expect(secondPayload.models).toBeUndefined();
    expect(secondPayload.provider).toBeUndefined();
  });

  it("honors the configured model before fallbacks and never exposes raw error details", async () => {
    vi.stubEnv("XAI_MODEL", "configured-model");
    vi.stubEnv("XAI_FALLBACK_MODELS", "alternate-model,third-model");
    const fetch = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ error: { message: "fixture-secret" } }), { status: 401 })
      );
    vi.stubGlobal("fetch", fetch);
    await expect(runWithGrokModelFallback("fixture-secret", messages)).rejects.toMatchObject({
      code: "authentication",
      message: "authentication",
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(JSON.parse(fetch.mock.calls[0][1].body).model).toBe("configured-model");
  });
  it("limits explicitly configured unavailable-model fallbacks to two attempts", async () => {
    vi.stubEnv("XAI_MODEL", "missing-model");
    vi.stubEnv("XAI_FALLBACK_MODELS", "alternate-model,third-model");
    const fetch = vi.fn().mockResolvedValue(new Response("{}", { status: 404 }));
    vi.stubGlobal("fetch", fetch);
    await expect(runWithGrokModelFallback("fixture-key", messages)).rejects.toMatchObject({
      code: "model_unavailable",
    });
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it("aborts an unresponsive provider at its deadline", async () => {
    const fetch = vi.fn(
      (_url, init: { signal: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener("abort", () => reject(init.signal.reason), { once: true });
        })
    );
    vi.stubGlobal("fetch", fetch);
    await expect(
      runWithGrokModelFallback("fixture-key", messages, { timeoutMs: 20 })
    ).rejects.toMatchObject({ name: "TimeoutError" });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it("rejects empty provider completions rather than claiming AI success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [] })))
    );
    await expect(runWithGrokModelFallback("fixture-key", messages)).rejects.toMatchObject({
      code: "invalid_response",
    });
  });
});
