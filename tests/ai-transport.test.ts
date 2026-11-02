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
  it("builds the 3-tier OpenRouter model chain (2 free + DeepSeek V4.1 Flash backup)", () => {
    vi.stubEnv("OPENROUTER_PRIMARY_MODEL", "");
    vi.stubEnv("OPENROUTER_FREE_FALLBACK_MODEL", "");
    vi.stubEnv("OPENROUTER_PAID_BACKUP_MODEL", "");
    expect(getOpenRouterCandidateModels()).toEqual([
      DEFAULT_OPENROUTER_PRIMARY_MODEL,
      DEFAULT_OPENROUTER_FREE_FALLBACK_MODEL,
      DEFAULT_OPENROUTER_PAID_BACKUP_MODEL,
    ]);
  });

  it("sends the OpenRouter 3-model fallback array with reasoning disabled and falls back to paid backup if needed", async () => {
    vi.stubEnv("OPENROUTER_PRIMARY_MODEL", "google/gemma-4-26b-a4b-it:free");
    vi.stubEnv("OPENROUTER_FREE_FALLBACK_MODEL", "nvidia/nemotron-3.5-super-vl:free");
    vi.stubEnv("OPENROUTER_PAID_BACKUP_MODEL", "deepseek/deepseek-v4.1-flash");

    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response("{}", { status: 429 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            model: "deepseek/deepseek-v4.1-flash",
            choices: [{ message: { content: "Antwort von DeepSeek Backup" } }],
            usage: { prompt_tokens: 42, completion_tokens: 18 },
          }),
          { status: 200 }
        )
      );
    vi.stubGlobal("fetch", fetch);

    const result = await runWithOpenRouterFallback("fixture-or-key", messages);
    expect(result).toEqual({
      text: "Antwort von DeepSeek Backup",
      usage: { inputTokens: 42, outputTokens: 18 },
      modelName: "deepseek/deepseek-v4.1-flash",
    });
    expect(fetch).toHaveBeenCalledTimes(2);
    const firstPayload = JSON.parse(fetch.mock.calls[0][1].body);
    expect(firstPayload.models).toEqual([
      "google/gemma-4-26b-a4b-it:free",
      "nvidia/nemotron-3.5-super-vl:free",
      "deepseek/deepseek-v4.1-flash",
    ]);
    expect(firstPayload.reasoning).toEqual({ effort: "none" });
    expect(firstPayload.max_tokens).toBe(450);

    const secondPayload = JSON.parse(fetch.mock.calls[1][1].body);
    expect(secondPayload.model).toBe("deepseek/deepseek-v4.1-flash");
    expect(secondPayload.models).toBeUndefined();
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
