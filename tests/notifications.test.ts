import { deliverNotification, dispatchNotification } from "@/lib/intake/notifications";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ send: vi.fn(), rpc: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/email/transporter", () => ({
  getMailTransporter: () => ({ sendMail: mocks.send }),
}));
vi.mock("@/lib/supabase/intake", () => ({ createIntakeClient: () => ({ rpc: mocks.rpc }) }));
const job = {
  id: "10000000-0000-4000-8000-000000000001",
  attemptToken: "20000000-0000-4000-8000-000000000001",
  channel: "email" as const,
  kind: "contact" as const,
  payload: {
    email: "test@example.invalid",
    name: "<img src=x onerror=alert(1)>",
    message: "<script>bad</script>",
  },
};
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("VERCEL_ENV", "production");
  vi.stubEnv("SMTP_USER", "from@example.invalid");
  vi.stubEnv("CONTACT_EMAIL", "admin@example.invalid");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
it("does not send from preview even with production-like credentials present", async () => {
  vi.stubEnv("VERCEL_ENV", "preview");
  expect(await deliverNotification(job)).toEqual({ status: "skipped", error: "non_production" });
  expect(mocks.send).not.toHaveBeenCalled();
});
it("records a failed delivery, without including provider secrets in its error", async () => {
  mocks.send.mockRejectedValue(new Error("SMTP password=SECRET"));
  expect(await deliverNotification(job)).toEqual({
    status: "failed",
    error: "provider_unavailable",
  });
});
it("escapes customer text and uses the configured recipient", async () => {
  mocks.send.mockResolvedValue({ accepted: ["admin@example.invalid"] });
  expect((await deliverNotification(job)).status).toBe("sent");
  const sent = mocks.send.mock.calls[0][0];
  expect(sent.html).not.toContain("<script>");
  expect(sent.html).toContain("&lt;script&gt;");
  expect(sent.to.address).toBe("admin@example.invalid");
});
it("treats missing configuration as skipped, not sent", async () => {
  vi.stubEnv("TELEGRAM_BOT_TOKEN", "");
  expect(await deliverNotification({ ...job, channel: "telegram" })).toEqual({
    status: "skipped",
    error: "telegram_not_configured",
  });
});
it("checks Telegram's application-level result, even for HTTP 200", async () => {
  vi.stubEnv("TELEGRAM_BOT_TOKEN", "fixture");
  vi.stubEnv("TELEGRAM_CHAT_ID", "fixture");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response('{"ok":false}', { status: 200 })));
  expect((await deliverNotification({ ...job, channel: "telegram" })).status).toBe("failed");
});
it("does not dispatch a job already claimed by another request", async () => {
  mocks.rpc.mockResolvedValue({ data: null, error: null });
  await dispatchNotification(job.id);
  expect(mocks.send).not.toHaveBeenCalled();
});
it("stores the channel result against the matching lease token", async () => {
  mocks.rpc
    .mockResolvedValueOnce({ data: job, error: null })
    .mockResolvedValueOnce({ data: true, error: null });
  mocks.send.mockResolvedValue({ accepted: ["admin@example.invalid"] });
  await dispatchNotification(job.id);
  expect(mocks.rpc).toHaveBeenLastCalledWith("dmf_finish_notification", {
    p_id: job.id,
    p_attempt_token: job.attemptToken,
    p_status: "sent",
    p_error: null,
  });
});
