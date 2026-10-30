import { expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ after: vi.fn(), dispatch: vi.fn(), rpc: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("next/server", async (original) => ({
  ...(await original<typeof import("next/server")>()),
  after: mocks.after,
}));
vi.mock("@/lib/intake/notifications", () => ({ dispatchSubmission: mocks.dispatch }));
vi.mock("@/lib/supabase/intake", () => ({
  createIntakeClient: () => ({
    rpc: (...args: unknown[]) => ({ abortSignal: () => mocks.rpc(...args) }),
  }),
}));
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: async () => ({ success: true }),
  getClientIp: () => "fixture",
  RATE_LIMITS: { CONTACT: {} },
}));
import { NextRequest } from "next/server";
import { acceptIntake } from "@/lib/intake/route";
it.each(["contact", "hiring", "lead"] as const)(
  "preserves successful %s acceptance and logs safely when deferred delivery fails",
  async (route) => {
    mocks.after.mockClear();
    mocks.rpc.mockResolvedValue({ data: { duplicate: false }, error: null });
    mocks.dispatch.mockRejectedValue(new Error("secret=private-provider-error"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const id = "10000000-0000-4000-8000-000000000001";
    const response = await acceptIntake(
      new NextRequest("http://localhost/api/contact", {
        method: "POST",
        headers: { "Idempotency-Key": id },
        body: JSON.stringify({
          name: "Fixture Employer",
          email: "fixture@example.invalid",
          message: "Please contact our company",
          privacy: true,
          company: "Fixture",
          service: "skilled",
          headcount: 2,
          location: "Berlin",
          timing: "Soon",
          interest: "Hiring",
        }),
      }),
      route
    );
    expect(response.status).toBe(200);
    await expect(mocks.after.mock.calls[0][0]()).resolves.toBeUndefined();
    expect(await response.json()).toMatchObject({ success: true, saved: true });
    const serialized = JSON.stringify(log.mock.calls);
    expect(serialized).toContain("correlation");
    expect(serialized).not.toContain(id);
    expect(serialized).not.toContain("private-provider-error");
    expect(serialized).not.toContain("fixture@example.invalid");
    log.mockRestore();
  }
);
