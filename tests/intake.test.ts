import { readJsonBody } from "@/lib/intake/body";
import { acceptIntake } from "@/lib/intake/route";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  rpc: vi.fn(),
  rate: vi.fn(),
  after: vi.fn(),
  dispatch: vi.fn(),
  mail: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/intake", () => ({ createIntakeClient: () => ({ rpc: mocks.rpc }) }));
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: mocks.rate,
  getClientIp: () => "fixture",
  RATE_LIMITS: { CONTACT: { limit: 5, windowSeconds: 60 } },
}));
vi.mock("next/server", async (original) => ({
  ...(await original<typeof import("next/server")>()),
  after: mocks.after,
}));
vi.mock("@/lib/intake/notifications", () => ({ dispatchSubmission: mocks.dispatch }));
const body = {
  name: "Test Employer",
  email: "test@example.invalid",
  message: "We need two qualified staff.",
  privacy: true,
};
const id = "10000000-0000-4000-8000-000000000001";
function request(value: unknown = body, key = id) {
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    headers: { "Idempotency-Key": key },
    body: JSON.stringify(value),
  });
}
beforeEach(() => {
  vi.clearAllMocks();
  mocks.rate.mockResolvedValue({ success: true, remaining: 4, resetIn: 60 });
  mocks.rpc.mockResolvedValue({ data: { duplicate: false }, error: null });
});

describe("durable request acceptance", () => {
  it("does not report success or schedule a notification when persistence fails", async () => {
    mocks.rpc.mockResolvedValue({ data: null, error: { code: "08006" } });
    const result = await acceptIntake(request(), "contact");
    expect(result.status).toBe(503);
    expect((await result.json()).success).toBe(false);
    expect(mocks.after).not.toHaveBeenCalled();
  });
  it("acknowledges a durable write before dispatch; pending jobs survive a provider failure", async () => {
    const result = await acceptIntake(request(), "contact");
    expect(result.status).toBe(200);
    expect(await result.json()).toMatchObject({ saved: true, success: true, duplicate: false });
    expect(mocks.after).toHaveBeenCalledOnce();
    expect(mocks.dispatch).not.toHaveBeenCalled();
    await mocks.after.mock.calls[0][0]();
    expect(mocks.dispatch).toHaveBeenCalledWith(id);
  });
  it("does not dispatch again for an identical retry", async () => {
    mocks.rpc.mockResolvedValue({ data: { duplicate: true }, error: null });
    expect((await acceptIntake(request(), "contact")).status).toBe(200);
    expect(mocks.after).not.toHaveBeenCalled();
  });
  it("rejects conflicting reuse, unavailable profiles and backend failures", async () => {
    for (const [code, status] of [
      ["23505", 409],
      ["P0002", 400],
      ["XX000", 503],
    ] as const) {
      mocks.rpc.mockResolvedValue({ error: { code }, data: null });
      expect((await acceptIntake(request(), "contact")).status).toBe(status);
    }
  });
  it("validates consent, body, profile IDs and idempotency IDs before persistence", async () => {
    for (const req of [
      request({ ...body, privacy: false }),
      request({ ...body, type: "profile", candidateCode: "FAKE" }),
      request(body, "invalid"),
    ])
      expect((await acceptIntake(req, "contact")).status).toBe(400);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it("returns retry guidance when the shared limit is exhausted", async () => {
    mocks.rate.mockResolvedValue({ success: false, resetIn: 25 });
    const result = await acceptIntake(request(), "contact");
    expect(result.status).toBe(429);
    expect(result.headers.get("retry-after")).toBe("25");
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it("fails closed when the limiter is unavailable", async () => {
    mocks.rate.mockRejectedValue(new Error("offline"));
    expect((await acceptIntake(request(), "contact")).status).toBe(503);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
});

it("bounds chunked bodies without trusting content-length", async () => {
  let cancelled = false;
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(100));
    },
    cancel() {
      cancelled = true;
    },
  });
  const req = new Request("http://localhost", {
    method: "POST",
    body: stream,
    duplex: "half",
  } as RequestInit);
  await expect(readJsonBody(req, 32)).rejects.toMatchObject({ status: 413 });
  expect(cancelled).toBe(true);
});

it("accepts hiring intent and profile context without allowing an owner or status to be forged", async () => {
  const result = await acceptIntake(
    request({
      ...body,
      company: "Fixture Works",
      service: "azubi",
      headcount: 2,
      candidateId: id,
      sourcePath: "/services/azubi",
      campaign: { source: "fixture" },
      assignedTo: id,
      status: "completed",
    }),
    "hiring"
  );
  expect(result.status).toBe(200);
  expect(await result.json()).toMatchObject({ requestId: id, saved: true });
  expect(mocks.rpc).toHaveBeenCalledWith("dmf_receive_intake", {
    p_id: id,
    p_kind: "profile",
    p_payload: expect.objectContaining({
      requestPurpose: "hiring",
      company: "Fixture Works",
      service: "azubi",
      candidateId: id,
      headcount: 2,
      sourcePath: "/services/azubi",
    }),
  });
  expect(mocks.rpc.mock.calls[0][1].p_payload).not.toHaveProperty("assignedTo");
  expect(mocks.rpc.mock.calls[0][1].p_payload).not.toHaveProperty("status");
});
