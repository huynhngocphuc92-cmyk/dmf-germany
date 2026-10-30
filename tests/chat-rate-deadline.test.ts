import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({ rpc: vi.fn(), signals: [] as AbortSignal[] }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/intake", () => ({
  createIntakeClient: () => ({ rpc: mocks.rpc }),
  getIntakeKey: () => "test-only-key",
}));
vi.mock("@/lib/auth/admin", () => ({ requireAdmin: vi.fn() }));
vi.mock("@/lib/auth/admin-http", () => ({ adminAuthorizationResponse: vi.fn() }));
import { POST } from "@/app/api/chat/route";

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubEnv("VERCEL_ENV", "test");
  mocks.signals.length = 0;
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});
const request = () =>
  new NextRequest("https://example.invalid/api/chat", {
    method: "POST",
    body: JSON.stringify({ message: "Kosten", language: "de" }),
  });

describe("shared limiter deadline on public guided chat", () => {
  it("cancels a hung RPC and fails closed within 3 seconds, even if transport ignores abort", async () => {
    let finish!: (result: unknown) => void;
    mocks.rpc.mockImplementation(() => ({
      abortSignal: (signal: AbortSignal) => {
        mocks.signals.push(signal);
        return new Promise((resolve) => {
          finish = resolve;
        });
      },
    }));
    const result = POST(request());
    await vi.advanceTimersByTimeAsync(0);
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
    expect(mocks.signals[0].aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(3000);
    const response = await result;
    expect(response.status).toBe(503);
    expect(mocks.signals[0].aborted).toBe(true);
    expect(await response.json()).not.toHaveProperty("message");
    finish({ data: { success: true, remaining: 1, resetIn: 60 }, error: null });
    await Promise.resolve();
    expect(response.status).toBe(503);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("requires a valid shared limiter success before returning a guided answer", async () => {
    mocks.rpc.mockImplementation(() => ({
      abortSignal: (signal: AbortSignal) => {
        mocks.signals.push(signal);
        return Promise.resolve({
          data: { success: true, remaining: 19, resetIn: 60 },
          error: null,
        });
      },
    }));
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      mode: "guided",
      provider: "guided_engine",
      usage: { inputTokens: 0, outputTokens: 0 },
    });
    expect(mocks.rpc).toHaveBeenCalledWith(
      "dmf_check_rate_limit",
      expect.objectContaining({ p_limit: 20, p_window_seconds: 60 })
    );
    expect(mocks.signals[0].aborted).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
});
