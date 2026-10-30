import { withDeadline } from "@/lib/requests/deadline";
import { getGuidedChatResponse, type SupportedChatLanguage } from "@/lib/chatbot/fallback";

export const HISTORY_DEADLINE_MS = 8000;
export const LEAD_DEADLINE_MS = 20000;

type LocalFaqResult =
  | { status: "empty" }
  | { status: "duplicate" }
  | { status: "throttled"; cooldownUntil: number }
  | { status: "answered"; message: string; answer: string; cooldownUntil: number };

/** Synchronous FAQ admission and answers: no transport, timer or backend dependency. */
export class LocalFaq {
  private acceptedAt: number[] = [];
  private lastAction: { key: string; at: number } | null = null;

  resetDuplicate() {
    // Visibility/language changes may start a fresh action, but never reset the quota.
    this.lastAction = null;
  }

  answer(language: SupportedChatLanguage | "vn", input: string, now = Date.now()): LocalFaqResult {
    const message = input.trim().slice(0, 2000);
    if (!message) return { status: "empty" };
    const normalizedLanguage = language === "vn" ? "vi" : language;
    const key = JSON.stringify([normalizedLanguage, message]);
    // Retain admission across React renders: a synchronous answer has no in-flight lane.
    // Different questions are immediately usable; duplicates don't extend this window.
    if (this.lastAction?.key === key && now - this.lastAction.at < 600)
      return { status: "duplicate" };
    this.acceptedAt = this.acceptedAt.filter((at) => now - at < 60000);
    if (this.acceptedAt.length >= 20)
      return { status: "throttled", cooldownUntil: this.acceptedAt[0] + 60000 };
    this.acceptedAt.push(now);
    this.lastAction = { key, at: now };
    return {
      status: "answered",
      message,
      answer: getGuidedChatResponse(normalizedLanguage, message),
      cooldownUntil: this.acceptedAt.length === 20 ? this.acceptedAt[0] + 60000 : 0,
    };
  }
}

/** Admission is synchronous; React state alone cannot exclude same-tick events. */
export class RequestLane {
  private active: AbortController | null = null;
  private cooldownUntil = 0;

  begin() {
    if (this.active || Date.now() < this.cooldownUntil) return null;
    const controller = new AbortController();
    this.active = controller;
    return controller;
  }
  isCurrent(controller: AbortController) {
    return this.active === controller && !controller.signal.aborted;
  }
  owns(controller: AbortController) {
    return this.active === controller;
  }
  finish(controller: AbortController) {
    if (this.owns(controller)) this.active = null;
  }
  cancel() {
    this.active?.abort();
    this.active = null;
  }
  coolDown(value: string | null) {
    this.cooldownUntil = Math.max(this.cooldownUntil, retryAfterUntil(value));
    return this.cooldownUntil;
  }
}

export function retryAfterUntil(value: string | null, now = Date.now()) {
  const seconds = value && /^\d+(\.\d+)?$/.test(value.trim()) ? Number(value) : NaN;
  const until = Number.isFinite(seconds) ? now + seconds * 1000 : Date.parse(value || "");
  // Missing/invalid Retry-After still gets a short manual-retry cooldown.
  return Number.isFinite(until) && until > now ? until : now + 5000;
}

// Keep well below both the server's 200-message and 1 MB request caps,
// including worst-case JSON escaping and UTF-8 expansion.
export function boundMessages<T extends { content: string }>(messages: T[]): T[] {
  let characters = 0;
  const bounded: T[] = [];
  for (const message of messages.slice(-100).reverse()) {
    const content = message.content.slice(0, 10000);
    if (characters + content.length > 100000) break;
    bounded.push({ ...message, content });
    characters += content.length;
  }
  return bounded.reverse();
}

/** One in-flight write plus one latest snapshot; never let saves overtake each other. */
export class HistoryWriter<T> {
  private pending: T | undefined;
  private running = false;
  private stopped = false;
  private controller: AbortController | null = null;

  constructor(private readonly write: (snapshot: T, signal: AbortSignal) => Promise<void>) {}

  enqueue(snapshot: T) {
    if (this.stopped) return;
    this.pending = snapshot;
    void this.drain();
  }
  cancelPending() {
    if (this.running) this.stop();
  }
  stop() {
    this.stopped = true;
    this.pending = undefined;
    this.controller?.abort();
  }
  private async drain() {
    if (this.running) return;
    this.running = true;
    try {
      while (!this.stopped && this.pending !== undefined) {
        const snapshot = this.pending;
        this.pending = undefined;
        this.controller = new AbortController();
        await withDeadline(
          (signal) => this.write(snapshot, signal),
          HISTORY_DEADLINE_MS,
          this.controller
        );
      }
    } catch {
      // An aborted HTTP request may still commit on the server. Stop here rather
      // than letting that older write race a newer snapshot. UI/session stay intact.
      this.stop();
    } finally {
      this.controller = null;
      this.running = false;
    }
  }
}

export async function postJson<T>(
  url: string,
  body: unknown,
  signal: AbortSignal,
  headers = {}
): Promise<{ response: Response; data: T }> {
  const response = await fetch(url, {
    method: "POST",
    signal,
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  // Error responses may be HTML or have no body; status/Retry-After remain usable.
  const data = response.ok ? await response.json() : null;
  signal.throwIfAborted();
  return { response, data };
}

export function isSavedLead(
  response: Response,
  result: { success?: boolean; saved?: boolean } | null
) {
  return response.ok && result?.success === true && result.saved === true;
}
