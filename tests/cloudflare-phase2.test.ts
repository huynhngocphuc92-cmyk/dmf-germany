import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resolveAiGatewayEndpoint } from "@/lib/ai/cloudflare-gateway";
import { runWithGrokModelFallback } from "@/lib/ai/grok";
import { runWithOpenRouterFallback } from "@/lib/ai/openrouter";
import { extractTurnstileToken, verifyTurnstileToken } from "@/lib/cloudflare/turnstile";

const intakeMocks = vi.hoisted(() => ({
  rpc: vi.fn(),
  rate: vi.fn(),
  after: vi.fn(),
  dispatch: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/intake", () => ({
  createIntakeClient: () => ({
    rpc: (...args: unknown[]) => ({ abortSignal: () => intakeMocks.rpc(...args) }),
  }),
}));
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: intakeMocks.rate,
  getClientIp: () => "203.0.113.10",
  RATE_LIMITS: { CONTACT: { limit: 5, windowSeconds: 60 } },
}));
vi.mock("next/server", async (original) => ({
  ...(await original<typeof import("next/server")>()),
  after: intakeMocks.after,
}));
vi.mock("@/lib/intake/notifications", () => ({ dispatchSubmission: intakeMocks.dispatch }));

import { acceptIntake } from "@/lib/intake/route";

describe("Phase 2: Cloudflare AI Gateway & Turnstile Verification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    intakeMocks.rate.mockResolvedValue({ success: true, remaining: 4, resetIn: 60 });
    intakeMocks.rpc.mockResolvedValue({ data: { duplicate: false }, error: null });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("routes OpenRouter & Grok through AI Gateway when account, gateway ID, and token are set", async () => {
    vi.stubEnv("CF_AI_GATEWAY_ACCOUNT_ID", "acct-123");
    vi.stubEnv("CF_AI_GATEWAY_ID", "dmf-ai-gateway");
    vi.stubEnv("CF_AI_GATEWAY_TOKEN", "gw-secret-token");

    const openRouterEndpoint = resolveAiGatewayEndpoint(
      "openrouter",
      "https://openrouter.ai/api/v1/chat/completions",
      { cacheTtlSeconds: 1800, metadata: { surface: "chat" } }
    );
    expect(openRouterEndpoint.viaGateway).toBe(true);
    expect(openRouterEndpoint.url).toBe(
      "https://gateway.ai.cloudflare.com/v1/acct-123/dmf-ai-gateway/openrouter/v1/chat/completions"
    );
    expect(openRouterEndpoint.headers["cf-aig-authorization"]).toBe("Bearer gw-secret-token");
    expect(openRouterEndpoint.headers["cf-aig-cache-ttl"]).toBe("1800");
    expect(JSON.parse(openRouterEndpoint.headers["cf-aig-metadata"])).toMatchObject({
      app: "dmf-talents",
      provider: "openrouter",
      surface: "chat",
    });

    const grokEndpoint = resolveAiGatewayEndpoint("grok", "https://api.x.ai/v1/chat/completions", {
      skipCache: true,
    });
    expect(grokEndpoint.viaGateway).toBe(true);
    expect(grokEndpoint.url).toBe(
      "https://gateway.ai.cloudflare.com/v1/acct-123/dmf-ai-gateway/grok/v1/chat/completions"
    );
    expect(grokEndpoint.headers["cf-aig-skip-cache"]).toBe("true");
    expect(grokEndpoint.headers["cf-aig-cache-ttl"]).toBeUndefined();

    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            model: "test-model",
            choices: [{ message: { content: "Gateway response" } }],
            usage: { prompt_tokens: 10, completion_tokens: 5 },
          }),
          { status: 200 }
        )
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    await runWithOpenRouterFallback("or-key", [{ role: "user", content: "Hallo" }]);
    await runWithGrokModelFallback("xai-key", [{ role: "user", content: "Hallo" }]);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://gateway.ai.cloudflare.com/v1/acct-123/dmf-ai-gateway/openrouter/v1/chat/completions"
    );
    expect((fetchMock.mock.calls[0][1].headers as Record<string, string>).Authorization).toBe(
      "Bearer or-key"
    );
    expect(
      (fetchMock.mock.calls[0][1].headers as Record<string, string>)["cf-aig-authorization"]
    ).toBe("Bearer gw-secret-token");

    expect(fetchMock.mock.calls[1][0]).toBe(
      "https://gateway.ai.cloudflare.com/v1/acct-123/dmf-ai-gateway/grok/v1/chat/completions"
    );
    expect(
      (fetchMock.mock.calls[1][1].headers as Record<string, string>)["cf-aig-authorization"]
    ).toBe("Bearer gw-secret-token");
  });

  it("falls back directly to provider URLs without gateway headers when AI Gateway token is unset", () => {
    vi.stubEnv("CF_AI_GATEWAY_ACCOUNT_ID", "acct-123");
    vi.stubEnv("CF_AI_GATEWAY_ID", "dmf-ai-gateway");
    vi.stubEnv("CF_AI_GATEWAY_TOKEN", "");

    const endpoint = resolveAiGatewayEndpoint(
      "openrouter",
      "https://openrouter.ai/api/v1/chat/completions"
    );
    expect(endpoint).toEqual({
      url: "https://openrouter.ai/api/v1/chat/completions",
      headers: {},
      viaGateway: false,
    });
  });

  it("skips Turnstile verification outside production when TURNSTILE_SECRET is unset", async () => {
    vi.stubEnv("APP_ENV", "");
    vi.stubEnv("VERCEL_ENV", "");
    vi.stubEnv("TURNSTILE_SECRET", "");

    await expect(verifyTurnstileToken({ token: "", expectedAction: "contact" })).resolves.toEqual({
      ok: true,
    });
  });

  it("fails closed in production when secret or hostnames are missing or Siteverify rejects", async () => {
    vi.stubEnv("APP_ENV", "production");
    vi.stubEnv("TURNSTILE_SECRET", "");
    vi.stubEnv("TURNSTILE_HOSTNAMES", "www.dmf-talents.de");

    await expect(
      verifyTurnstileToken({ token: "valid-token", expectedAction: "contact" })
    ).resolves.toEqual({ ok: false, reason: "invalid_input" });

    vi.stubEnv("TURNSTILE_SECRET", "turnstile-secret-fixture");
    vi.stubEnv("TURNSTILE_HOSTNAMES", "");
    await expect(
      verifyTurnstileToken({ token: "valid-token", expectedAction: "contact" })
    ).resolves.toEqual({ ok: false, reason: "invalid_input" });

    vi.stubEnv("TURNSTILE_HOSTNAMES", "www.dmf-talents.de,dmf-talents.de");
    await expect(
      verifyTurnstileToken({ token: "x".repeat(2049), expectedAction: "contact" })
    ).resolves.toEqual({ ok: false, reason: "invalid_input" });

    // Network outage fails closed
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("timeout")));
    await expect(
      verifyTurnstileToken({ token: "tok", expectedAction: "contact" })
    ).resolves.toEqual({ ok: false, reason: "siteverify_error" });

    // Wrong action / hostname / success=false all fail closed
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({ success: true, action: "hiring", hostname: "www.dmf-talents.de" }),
            { status: 200 }
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({ success: true, action: "contact", hostname: "evil.example" }),
            { status: 200 }
          )
        )
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: false }), { status: 200 }))
    );

    await expect(
      verifyTurnstileToken({ token: "tok", expectedAction: "contact" })
    ).resolves.toEqual({ ok: false, reason: "verification_failed" });
    await expect(
      verifyTurnstileToken({ token: "tok", expectedAction: "contact" })
    ).resolves.toEqual({ ok: false, reason: "verification_failed" });
    await expect(
      verifyTurnstileToken({ token: "tok", expectedAction: "contact" })
    ).resolves.toEqual({ ok: false, reason: "verification_failed" });
  });

  it("extracts token and accepts valid Siteverify responses in acceptIntake while stripping token before DB write", async () => {
    vi.stubEnv("APP_ENV", "production");
    vi.stubEnv("TURNSTILE_SECRET", "turnstile-secret-fixture");
    vi.stubEnv("TURNSTILE_HOSTNAMES", "www.dmf-talents.de,dmf-talents.de");

    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({ success: true, action: "contact", hostname: "www.dmf-talents.de" }),
          { status: 200 }
        )
      );
    vi.stubGlobal("fetch", fetchMock);

    const id = "20000000-0000-4000-8000-000000000002";
    const missingTokenReq = new NextRequest("https://www.dmf-talents.de/api/contact", {
      method: "POST",
      headers: { "Idempotency-Key": id },
      body: JSON.stringify({
        name: "Max Mustermann",
        email: "max@klinik.de",
        message: "Wir brauchen drei Pflegekraefte.",
        privacy: true,
      }),
    });
    const blocked = await acceptIntake(missingTokenReq, "contact");
    expect(blocked.status).toBe(403);
    expect(intakeMocks.rpc).not.toHaveBeenCalled();

    const validReq = new NextRequest("https://www.dmf-talents.de/api/contact", {
      method: "POST",
      headers: { "Idempotency-Key": id },
      body: JSON.stringify({
        name: "Max Mustermann",
        email: "max@klinik.de",
        message: "Wir brauchen drei Pflegekraefte.",
        privacy: true,
        "cf-turnstile-response": "valid-turnstile-token",
      }),
    });
    expect(extractTurnstileToken({ "cf-turnstile-response": "  abc  " }, validReq)).toBe("abc");

    const accepted = await acceptIntake(validReq, "contact");
    expect(accepted.status).toBe(200);
    expect(intakeMocks.rpc).toHaveBeenCalledTimes(1);
    const dbPayload = intakeMocks.rpc.mock.calls[0][1].p_payload;
    expect(dbPayload).not.toHaveProperty("cf-turnstile-response");
  });
});
