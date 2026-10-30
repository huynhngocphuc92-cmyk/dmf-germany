import { afterEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/intake", () => ({
  createIntakeClient: () => {
    throw new Error("local limiter must not access backend");
  },
  getIntakeKey: () => {
    throw new Error("local limiter must not access credentials");
  },
}));
import { POST } from "@/app/api/chat/route";
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});
it("enforces actual local chat quota and recovers after expiry with zero provider tokens", async () => {
  vi.useFakeTimers();
  for (const key of ["VERCEL_ENV", "SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY"])
    vi.stubEnv(key, "");
  const request = () =>
    new NextRequest("http://localhost/api/chat", {
      method: "POST",
      headers: { "x-forwarded-for": "p1-memory-only" },
      body: JSON.stringify({ message: "Kosten", bypassRateLimit: true }),
    });
  for (let i = 0; i < 20; i++) {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect((await response.json()).usage).toEqual({ inputTokens: 0, outputTokens: 0 });
  }
  const denied = await POST(request());
  expect(denied.status).toBe(429);
  expect(denied.headers.get("retry-after")).toBe("60");
  expect(await denied.json()).not.toHaveProperty("message");
  await vi.advanceTimersByTimeAsync(60000);
  expect((await POST(request())).status).toBe(200);
});
