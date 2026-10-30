import { afterEach, describe, expect, it, vi } from "vitest";
import { runWithGrokModelFallback } from "@/lib/ai/grok";
const messages = [{ role: "user" as const, content: "Synthetic test only" }];
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
describe("bounded provider transport", () => {
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
