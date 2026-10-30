import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ dispatch: vi.fn(), admin: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/admin", () => ({ requireAdmin: mocks.admin }));
vi.mock("@/lib/intake/notifications", () => ({ dispatchNotification: mocks.dispatch }));
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: async () => ({ success: true }),
  RATE_LIMITS: { API: {} },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
import { retryNotification } from "@/app/admin/notifications/actions";
const payload = () => {
  const data = new FormData();
  data.set("id", "00000000-0000-4000-8000-000000000001");
  return data;
};
beforeEach(() => {
  vi.resetAllMocks();
  mocks.admin.mockResolvedValue({ user: { id: "fixture-admin" } });
});
it.each(["failed", "skipped"])(
  "never reports a %s notification retry as successful",
  async (status) => {
    mocks.dispatch.mockResolvedValue({ status, error: "provider_unavailable" });
    expect(await retryNotification({}, payload())).toEqual({ error: expect.any(String) });
  }
);
it("reports successful provider acceptance separately from an unclaimed job", async () => {
  mocks.dispatch.mockResolvedValueOnce({ status: "sent", error: null });
  expect(await retryNotification({}, payload())).toEqual({ success: true });
  mocks.dispatch.mockResolvedValueOnce(null);
  expect(await retryNotification({}, payload())).toEqual({ info: expect.any(String) });
});
it("does not dispatch without an authorized admin", async () => {
  mocks.admin.mockRejectedValue(new Error("denied"));
  expect(await retryNotification({}, payload())).toEqual({ error: expect.any(String) });
  expect(mocks.dispatch).not.toHaveBeenCalled();
});
