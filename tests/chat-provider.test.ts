import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks = vi.hoisted(() => ({ grok: vi.fn(), gemini: vi.fn(), admin: vi.fn(), rate: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/ai/grok", () => ({ runWithGrokModelFallback: mocks.grok }));
vi.mock("@/lib/ai/gemini", () => ({ runWithGeminiFallback: mocks.gemini }));
vi.mock("@/lib/auth/admin", () => ({ requireAdmin: mocks.admin }));
vi.mock("@/lib/auth/admin-http", () => ({ adminAuthorizationResponse: () => null }));
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: mocks.rate,
  getClientIp: () => "127.0.0.1",
  RATE_LIMITS: { CHAT: {}, API: {} },
}));
import { GET, POST } from "@/app/api/chat/route";
import { ProviderError } from "@/lib/ai/provider-runtime";
const request = (language = "en") =>
  new NextRequest("https://example.invalid/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "What services do you offer?", language }),
  });
beforeEach(() => {
  vi.stubEnv("XAI_API_KEY", "fixture-key");
  vi.stubEnv("GEMINI_API_KEY", "");
  mocks.grok.mockReset();
  mocks.gemini.mockReset();
  mocks.admin.mockReset();
  mocks.rate.mockReset();
  mocks.rate.mockResolvedValue({ success: true, resetIn: 60 });
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});
describe("Chat provider readiness and failures", () => {
  it("does not claim operational readiness merely because a key exists", async () => {
    const response = await GET(new NextRequest("https://example.invalid/api/chat"));
    expect((await response.json()).status).toBe("configured");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(mocks.grok).not.toHaveBeenCalled();
  });
  it("returns real provider output and passes a finite cancellation deadline", async () => {
    mocks.grok.mockResolvedValue({
      text: "Provider answer",
      modelName: "fixture-model",
      usage: { inputTokens: 5, outputTokens: 2 },
    });
    const response = await POST(request());
    const body = await response.json();
    expect(body).toMatchObject({
      message: "Provider answer",
      mode: "ai",
      provider: "grok (fixture-model)",
    });
    expect(body.requestId).toEqual(expect.any(String));
    expect(mocks.grok.mock.calls[0][2]).toMatchObject({
      signal: expect.any(AbortSignal),
      timeoutMs: 8000,
    });
  });
  it("labels deterministic fallback and never logs raw provider errors or keys", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mocks.grok.mockRejectedValue(new Error("credential fixture-key and private user payload"));
    const body = await (await POST(request("vi"))).json();
    expect(body).toMatchObject({ mode: "fallback", provider: "fallback_engine" });
    expect(JSON.stringify(warn.mock.calls)).not.toContain("fixture-key");
    expect(JSON.stringify(body)).not.toContain("private user payload");
    expect(body.message).toContain("DMF Talents");
  });
  it("tries the configured secondary provider after the first fails", async () => {
    vi.stubEnv("GEMINI_API_KEY", "fixture-gemini");
    mocks.grok.mockRejectedValue(new ProviderError("rate_limited", 429));
    mocks.gemini.mockResolvedValue({ text: "Secondary answer", modelName: "fixture-secondary" });
    expect(await (await POST(request())).json()).toMatchObject({
      mode: "ai",
      message: "Secondary answer",
    });
  });
  it("does not bypass a failed rate-limit backend by returning a success", async () => {
    mocks.rate.mockRejectedValue(new Error("backend unavailable"));
    expect((await POST(request())).status).toBe(503);
    expect(mocks.grok).not.toHaveBeenCalled();
  });
  it("requires admin authorization before performing paid diagnostics", async () => {
    mocks.admin.mockRejectedValue(new Error("denied"));
    expect(
      (await GET(new NextRequest("https://example.invalid/api/chat?diagnostics=1"))).status
    ).toBe(503);
    expect(mocks.grok).not.toHaveBeenCalled();
  });
  it("reports diagnostic provider failure as degraded using a safe error code", async () => {
    mocks.admin.mockResolvedValue({ user: { id: "fixture-admin" } });
    mocks.grok.mockRejectedValue(new ProviderError("authentication", 401));
    const body = await (
      await GET(new NextRequest("https://example.invalid/api/chat?diagnostics=1"))
    ).json();
    expect(body).toMatchObject({
      status: "degraded",
      diagnostics: { xai: { status: "degraded", code: "authentication" } },
    });
    expect(JSON.stringify(body)).not.toContain("fixture-key");
  });
});
