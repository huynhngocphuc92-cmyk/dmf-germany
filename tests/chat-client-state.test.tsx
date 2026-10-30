import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { withDeadline } from "@/lib/requests/deadline";
import { useSubmissionKey } from "@/lib/intake/client";
import {
  boundMessages,
  HistoryWriter,
  HISTORY_DEADLINE_MS,
  isSavedLead,
  LEAD_DEADLINE_MS,
  postJson,
  RequestLane,
  retryAfterUntil,
} from "@/lib/chatbot/client-state";
import { chatHistorySchema } from "@/lib/validations/public-intake";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("chat request admission and lifecycle", () => {
  it("admits only one same-tick click/Enter and does not release a newer request", () => {
    const lane = new RequestLane();
    const first = lane.begin()!;
    expect(lane.begin()).toBeNull();
    lane.cancel(); // Close/language change/unmount invalidates the old generation.
    const reopened = lane.begin()!;
    expect(first.signal.aborted).toBe(true);
    expect(lane.isCurrent(first)).toBe(false);
    lane.finish(first);
    expect(lane.isCurrent(reopened)).toBe(true);
    expect(lane.begin()).toBeNull();
  });

  it("bounds a hung transport and suppresses late success after abort", async () => {
    vi.useFakeTimers();
    const transport = deferred<string>();
    const controller = new AbortController();
    const accepted = vi.fn();
    const result = withDeadline(() => transport.promise, 1000, controller).then(accepted);
    const rejected = expect(result).rejects.toMatchObject({ name: "TimeoutError" });
    await vi.advanceTimersByTimeAsync(1000);
    await rejected;
    transport.resolve("late answer");
    await Promise.resolve();
    expect(accepted).not.toHaveBeenCalled();
    expect(controller.signal.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("aborts immediately on close while an old body read resolves after reopening", async () => {
    const body = deferred<unknown>();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: () => body.promise }));
    const lane = new RequestLane();
    const first = lane.begin()!;
    const success = vi.fn();
    const result = withDeadline((signal) => postJson("/api/chat", {}, signal), 15000, first).then(
      success
    );
    const rejected = expect(result).rejects.toMatchObject({ name: "AbortError" });
    await Promise.resolve();
    lane.cancel();
    const next = lane.begin()!;
    await rejected;
    body.resolve({ mode: "guided", message: "old answer" });
    await Promise.resolve();
    expect(success).not.toHaveBeenCalled();
    expect(lane.isCurrent(next)).toBe(true);
  });

  it("bounds a stalled JSON body and avoids starting already-aborted work", async () => {
    vi.useFakeTimers();
    const body = deferred<unknown>();
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: () => body.promise });
    vi.stubGlobal("fetch", fetch);
    const result = withDeadline((signal) => postJson("/api/chat", {}, signal), 1000);
    const rejected = expect(result).rejects.toMatchObject({ name: "TimeoutError" });
    await vi.advanceTimersByTimeAsync(1000);
    await rejected;
    const controller = new AbortController();
    controller.abort();
    await expect(
      withDeadline((signal) => postJson("/api/chat", {}, signal), 1000, controller)
    ).rejects.toMatchObject({ name: "AbortError" });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("honors seconds and HTTP-date cooldowns without automatic requests", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-30T00:00:00Z"));
    const lane = new RequestLane();
    const fetch = vi
      .fn()
      .mockResolvedValue(
        new Response("not JSON", { status: 429, headers: { "Retry-After": "42" } })
      );
    vi.stubGlobal("fetch", fetch);
    const { response, data } = await postJson("/api/chat", {}, new AbortController().signal);
    expect(data).toBeNull();
    lane.coolDown(response.headers.get("Retry-After"));
    expect(lane.begin()).toBeNull();
    await vi.advanceTimersByTimeAsync(41999);
    expect(lane.begin()).toBeNull();
    await vi.advanceTimersByTimeAsync(1);
    expect(lane.begin()).not.toBeNull();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(retryAfterUntil("Fri, 30 Oct 2026 00:02:00 GMT")).toBe(
      Date.parse("2026-10-30T00:02:00Z")
    );
    expect(retryAfterUntil("invalid")).toBe(Date.now() + 5000);
  });
});

describe("bounded ordered best-effort history", () => {
  it("serializes writes and coalesces waiting snapshots to the newest", async () => {
    const first = deferred<void>();
    const write = vi
      .fn()
      .mockImplementationOnce(() => first.promise)
      .mockResolvedValue(undefined);
    const writer = new HistoryWriter<number>(write);
    writer.enqueue(1);
    writer.enqueue(2);
    writer.enqueue(3);
    expect(write.mock.calls.map(([snapshot]) => snapshot)).toEqual([1]);
    first.resolve();
    await vi.waitFor(() => expect(write).toHaveBeenCalledTimes(2));
    expect(write.mock.calls.map(([snapshot]) => snapshot)).toEqual([1, 3]);
    writer.stop();
  });

  it("halts after uncertain timeout so a late older commit cannot overwrite a newer write", async () => {
    vi.useFakeTimers();
    const late = deferred<void>();
    const write = vi.fn<(snapshot: number, signal: AbortSignal) => Promise<void>>(
      () => late.promise
    );
    const writer = new HistoryWriter<number>(write);
    writer.enqueue(1);
    writer.enqueue(2);
    await vi.advanceTimersByTimeAsync(HISTORY_DEADLINE_MS);
    expect(write.mock.calls[0][1].aborted).toBe(true);
    late.resolve();
    writer.enqueue(3);
    await Promise.resolve();
    expect(write).toHaveBeenCalledTimes(1);
  });

  it("does not retry or rotate ownership after a forbidden history save", async () => {
    const sessionId = "same-owned-session";
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 403 }));
    vi.stubGlobal("fetch", fetch);
    const writer = new HistoryWriter<number>(async (snapshot, signal) => {
      const { response } = await postJson("/api/chat/history", { sessionId, snapshot }, signal);
      if (!response.ok) throw new Error("History unavailable");
    });
    writer.enqueue(1);
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await Promise.resolve();
    writer.enqueue(2);
    await Promise.resolve();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(JSON.parse(fetch.mock.calls[0][1].body).sessionId).toBe(sessionId);
    writer.stop();
  });

  it("bounds real serialized payloads below server byte/message caps", () => {
    const messages = Array.from({ length: 1000 }, (_, i) => ({
      id: String(i),
      role: "user" as const,
      content: "\u0000".repeat(10000),
      timestamp: new Date().toISOString(),
    }));
    const payload = { sessionId: "unchanged-session", messages: boundMessages(messages) };
    expect(chatHistorySchema.safeParse(payload).success).toBe(true);
    expect(Buffer.byteLength(JSON.stringify(payload))).toBeLessThan(1000000);
    expect(payload.messages.at(-1)?.id).toBe("999");
    expect(messages).toHaveLength(1000);
  });
});

describe("explicit lead retry", () => {
  it("retains the same idempotency key after timeout and accepts success only after saved", async () => {
    vi.useFakeTimers();
    let keys!: ReturnType<typeof useSubmissionKey>;
    function Harness() {
      keys = useSubmissionKey();
      return null;
    }
    renderToStaticMarkup(createElement(Harness));
    const payload = { email: "person@example.invalid", sessionId: "same-session" };
    const late = deferred<Response>();
    const fetch = vi
      .fn()
      .mockReturnValueOnce(late.promise)
      .mockResolvedValueOnce(Response.json({ success: true, saved: true }));
    vi.stubGlobal("fetch", fetch);
    let saved = false;
    const submit = () =>
      withDeadline(
        (signal) =>
          postJson<{ success?: boolean; saved?: boolean }>("/api/leads", payload, signal, {
            "Idempotency-Key": keys.forPayload(payload),
          }),
        LEAD_DEADLINE_MS
      ).then(({ response, data }) => {
        saved = isSavedLead(response, data);
      });
    const first = submit();
    const rejected = expect(first).rejects.toMatchObject({ name: "TimeoutError" });
    await vi.advanceTimersByTimeAsync(LEAD_DEADLINE_MS);
    await rejected;
    expect(saved).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(1);
    late.resolve(Response.json({ success: true, saved: true }));
    await Promise.resolve();
    expect(saved).toBe(false);
    await submit();
    expect(fetch.mock.calls[0][1].headers["Idempotency-Key"]).toBe(
      fetch.mock.calls[1][1].headers["Idempotency-Key"]
    );
    expect(saved).toBe(true);
    expect(isSavedLead(Response.json({}), { success: true })).toBe(false);
    expect(isSavedLead(Response.json({}), { saved: true })).toBe(false);
    expect(isSavedLead(new Response(null, { status: 503 }), { success: true, saved: true })).toBe(
      false
    );
  });
});
