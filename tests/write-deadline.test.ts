import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { withDeadline } from "@/lib/requests/deadline";

const mocks = vi.hoisted(() => ({ client: vi.fn(), after: vi.fn(), dispatch: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/intake", () => ({ createIntakeClient: mocks.client }));
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: async () => ({ success: true }),
  getClientIp: () => "fixture",
  RATE_LIMITS: { API: {}, CONTACT: {} },
}));
vi.mock("next/server", async (original) => ({
  ...(await original<typeof import("next/server")>()),
  after: mocks.after,
}));
vi.mock("@/lib/intake/notifications", () => ({ dispatchSubmission: mocks.dispatch }));
import { acceptIntake } from "@/lib/intake/route";
import { POST as saveHistory } from "@/app/api/chat/history/route";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());
const key = "10000000-0000-4000-8000-000000000001";
const lead = { email: "deadline@example.invalid" };
const owner = "a".repeat(64);
function request(path: string, body: unknown) {
  return new NextRequest(`http://localhost${path}`, {
    method: "POST",
    headers: { "Idempotency-Key": key, Cookie: `dmf_chat_owner=${owner}` },
    body: JSON.stringify(body),
  });
}
function client(fetch: typeof globalThis.fetch) {
  return createClient("http://127.0.0.1:1", "synthetic-key", {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch },
  });
}

for (const route of ["history", "lead"] as const) {
  for (const mode of ["abort-fetch", "ignore-abort", "body-read"] as const) {
    it(`${route}: bounds ${mode}, signals the actual SDK fetch and never retries POST`, async () => {
      let signal!: AbortSignal;
      let observedAbort = false;
      const transport = vi.fn<typeof fetch>(async (_url, init) => {
        signal = init!.signal!;
        signal.addEventListener("abort", () => {
          observedAbort = true;
        });
        if (mode === "body-read") {
          const response = new Response("", { status: 200 });
          vi.spyOn(response, "text").mockImplementation(() => new Promise(() => {}));
          return response;
        }
        return new Promise<Response>((_resolve, reject) => {
          if (mode === "abort-fetch")
            signal.addEventListener("abort", () => reject(signal.reason), { once: true });
        });
      });
      mocks.client.mockReturnValue(client(transport));
      const result =
        route === "history"
          ? saveHistory(
              request("/api/chat/history", {
                sessionId: "deadline-session",
                messages: [
                  { id: "1", role: "user", content: "Hallo", timestamp: "2026-10-30T00:00:00Z" },
                ],
              })
            )
          : acceptIntake(request("/api/leads", lead), "lead");
      let settled = false;
      void result.then(() => {
        settled = true;
      });
      const deadline = route === "history" ? 3000 : 10000;
      await vi.advanceTimersByTimeAsync(deadline - 1);
      expect(transport).toHaveBeenCalledOnce();
      expect(settled).toBe(false);
      expect(signal.aborted).toBe(false);
      expect(transport.mock.calls[0][1]?.method).toBe("POST");
      await vi.advanceTimersByTimeAsync(1);
      const response = await result;
      expect(response.status).toBe(503);
      expect(await response.json()).toEqual(
        route === "history"
          ? { error: "Chat could not be saved" }
          : {
              success: false,
              error:
                "Anfrage konnte nicht gespeichert werden. Bitte versuchen Sie es später erneut.",
            }
      );
      expect(response.headers.get("set-cookie")).toBeNull();
      if (route === "lead") expect(response.headers.get("cache-control")).toBe("no-store");
      expect(signal.aborted).toBe(true);
      expect(observedAbort).toBe(true);
      expect(mocks.after).not.toHaveBeenCalled();
      expect(mocks.dispatch).not.toHaveBeenCalled();
      await vi.advanceTimersByTimeAsync(30000);
      expect(transport).toHaveBeenCalledOnce();
      expect(vi.getTimerCount()).toBe(0);
    });
  }
}

it("retains an uncertain committed intake and its key; late success and exact retry never enqueue dispatch", async () => {
  let complete!: (response: Response) => void;
  const transport = vi
    .fn<typeof fetch>()
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          complete = resolve;
        })
    )
    .mockResolvedValueOnce(Response.json({ duplicate: true }));
  mocks.client.mockReturnValue(client(transport));
  const result = acceptIntake(request("/api/leads", lead), "lead");
  await vi.advanceTimersByTimeAsync(10000);
  const response = await result;
  expect(response.status).toBe(503);
  complete(Response.json({ duplicate: false })); // Server may already have committed.
  await vi.advanceTimersByTimeAsync(0);
  expect(mocks.after).not.toHaveBeenCalled();
  const retry = await acceptIntake(request("/api/leads", lead), "lead");
  expect(await retry.json()).toMatchObject({ saved: true, duplicate: true, requestId: key });
  expect(transport).toHaveBeenCalledTimes(2);
  expect(transport.mock.calls.map((call) => JSON.parse(call[1]!.body as string).p_id)).toEqual([
    key,
    key,
  ]);
  expect(mocks.after).not.toHaveBeenCalled();
});

it("clears deadline resources on success and synchronous failure", async () => {
  await expect(withDeadline(async () => 42, 100)).resolves.toBe(42);
  await expect(
    withDeadline(() => {
      throw new Error("fixture");
    }, 100)
  ).rejects.toThrow("fixture");
  expect(vi.getTimerCount()).toBe(0);
});

it("rejects prior and in-flight external cancellation and clears timers", async () => {
  const controller = new AbortController();
  const task = vi.fn(() => new Promise<never>(() => {}));
  const result = withDeadline(task, 100, controller);
  const rejected = expect(result).rejects.toThrow("cancelled");
  controller.abort(new Error("cancelled"));
  await rejected;
  expect(vi.getTimerCount()).toBe(0);
  task.mockClear();
  await expect(withDeadline(task, 100, controller)).rejects.toThrow("cancelled");
  expect(task).not.toHaveBeenCalled();
  expect(vi.getTimerCount()).toBe(0);
});
