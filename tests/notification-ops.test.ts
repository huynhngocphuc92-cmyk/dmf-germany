import { afterEach, beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ rpc: vi.fn(), batch: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/intake", () => ({ createIntakeClient: () => ({ rpc: mocks.rpc }) }));
vi.mock("@/lib/intake/notifications", () => ({ dispatchNotificationBatch: mocks.batch }));
import { GET } from "@/app/api/ops/health/route";
import { POST } from "@/app/api/ops/notifications/route";
const request = (token = "fixture-token", body?: string) =>
  new Request("http://localhost/api/ops", {
    method: body === undefined ? "GET" : "POST",
    headers: { authorization: `Bearer ${token}` },
    ...(body === undefined ? {} : { body }),
  });
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("DMF_OPS_TOKEN", "fixture-token");
  for (const key of [
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SECRET_KEY",
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASSWORD",
    "CONTACT_EMAIL",
    "TELEGRAM_BOT_TOKEN",
    "TELEGRAM_CHAT_ID",
  ])
    vi.stubEnv(key, "fixture");
  vi.stubEnv("VERCEL_ENV", "production");
});
afterEach(() => vi.unstubAllEnvs());
it("fails closed for missing config, absent credentials and wrong tokens before any dependency access", async () => {
  for (const req of [new Request("http://localhost"), request("wrong"), request("")]) {
    expect((await GET(req)).status).toBe(401);
    expect((await POST(req)).status).toBe(401);
  }
  vi.stubEnv("DMF_OPS_TOKEN", "");
  expect((await GET(request())).status).toBe(401);
  expect(mocks.rpc).not.toHaveBeenCalled();
  expect(mocks.batch).not.toHaveBeenCalled();
});
it("returns only aggregate health with no-store and degrades for a missing migration", async () => {
  mocks.rpc.mockReturnValue({
    abortSignal: async () => ({ data: null, error: { message: "sensitive database detail" } }),
  });
  const response = await GET(request());
  expect(response.status).toBe(503);
  expect(response.headers.get("cache-control")).toBe("no-store");
  const data = await response.json();
  expect(data.checks.database.status).toBe("degraded");
  expect(data.checks.notifications.pending).toBeNull();
  expect(JSON.stringify(data)).not.toContain("sensitive");
  expect(JSON.stringify(data)).not.toContain("fixture");
});
it("reports healthy aggregates and configuration failures truthfully without sending", async () => {
  mocks.rpc.mockReturnValue({
    abortSignal: async () => ({
      data: { pending: 1, failed: 0, staleSending: 0, exhausted: 0, oldestPendingSeconds: 5 },
      error: null,
    }),
  });
  expect((await GET(request())).status).toBe(200);
  vi.stubEnv("SMTP_PASSWORD", "");
  expect((await GET(request())).status).toBe(503);
  expect(mocks.batch).not.toHaveBeenCalled();
});
it("degrades for a backlog or backend exception", async () => {
  mocks.rpc.mockReturnValueOnce({
    abortSignal: async () => ({
      data: { pending: 1, failed: 1, staleSending: 0, exhausted: 0, oldestPendingSeconds: 1000 },
      error: null,
    }),
  });
  expect((await GET(request())).status).toBe(503);
  mocks.rpc.mockImplementationOnce(() => {
    throw new Error("private");
  });
  expect((await GET(request())).status).toBe(503);
});
it("rejects caller-selected payloads and handles unavailable and partially completed batches", async () => {
  expect((await POST(request("fixture-token", '{"jobIDs":[]}'))).status).toBe(400);
  expect(mocks.batch).not.toHaveBeenCalled();
  mocks.batch.mockRejectedValueOnce(new Error("private provider detail"));
  expect((await POST(request())).status).toBe(503);
  mocks.batch.mockResolvedValueOnce({ processed: 3, sent: 1, failed: 1, skipped: 0, errors: 1 });
  expect((await POST(request())).status).toBe(503);
});

it("never probes a backend from preview even with configured credentials", async () => {
  vi.stubEnv("VERCEL_ENV", "preview");
  expect((await GET(request())).status).toBe(503);
  expect(mocks.rpc).not.toHaveBeenCalled();
});

it("keeps an intentionally unconfigured optional Telegram channel informational", async () => {
  vi.stubEnv("TELEGRAM_BOT_TOKEN", "");
  vi.stubEnv("TELEGRAM_CHAT_ID", "");
  mocks.rpc.mockReturnValue({
    abortSignal: async () => ({
      data: { pending: 0, failed: 0, staleSending: 0, exhausted: 0, oldestPendingSeconds: 0 },
      error: null,
    }),
  });
  const response = await GET(request());
  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body.checks.configuration.telegramConfigured).toBe(false);
  expect(body.checks.configuration.status).toBe("ok");
});

it("accepts a zero-byte POST stream from the deployment adapter and rejects any payload", async () => {
  mocks.batch.mockResolvedValue({ processed: 0, sent: 0, failed: 0, skipped: 0, errors: 0 });
  const empty = new Request("https://www.dmf-talents.de/api/ops/notifications", {
    method: "POST",
    headers: { authorization: "Bearer fixture-token" },
    body: "",
  });
  expect(empty.body).not.toBeNull();
  expect((await POST(empty)).status).toBe(200);
  mocks.batch.mockClear();
  expect((await POST(request("fixture-token", " "))).status).toBe(400);
  expect(mocks.batch).not.toHaveBeenCalled();
});
