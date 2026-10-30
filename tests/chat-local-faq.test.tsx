import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { boundMessages, HistoryWriter, LocalFaq, postJson } from "@/lib/chatbot/client-state";
import { getGuidedChatResponse } from "@/lib/chatbot/fallback";
import { renderMessageContent } from "@/lib/chatbot/message-content";

// The existing curated-topic, precedence, accentless, privacy and handoff scenarios.
const questions = [
  "Ausbildung",
  "Fachkräfte",
  "Saisonarbeit",
  "Studium",
  "Ablauf",
  "Unterlagen",
  "Visum",
  "Kosten",
  "Kontakt",
  "Hallo",
  "vocational training",
  "skilled workers",
  "seasonal work",
  "university",
  "process",
  "documents",
  "recognition",
  "pricing",
  "book consultation",
  "hello",
  "du học nghề",
  "lao động chuyên môn",
  "thời vụ",
  "đại học",
  "quy trình",
  "giấy tờ",
  "công nhận bằng",
  "chi phí",
  "đặt lịch",
  "xin chào",
  "AUSBILDUNG KOSTEN",
  "nursing visa",
  "seasonal documents",
  "CHI PHI DU HOC NGHE",
  "giay to lao dong thoi vu",
  "visa dieu duong",
  "Unterlagen für Fachkräfte",
  "vocational training process",
  "du hoc nghe",
  "lao dong thoi vu",
  "dai hoc",
  "cong nhan bang",
  "quy trinh",
  "lien he",
  "Kosten für mein Unternehmen",
  "university contact",
  "book a meeting",
  "this is jobless",
  "spaceships",
  "person@example.invalid",
  "hi there, what is the weather?",
  "Ausbildung Kosten",
  "my email is person@example.invalid",
  "Please contact me at person@example.invalid",
  "xyzzy",
  "HI!",
  "Welche Leistungen bieten Sie?",
  "dich vu",
  "Học phí du học nghề?",
  "Hoc phi du hoc nghe?",
  "How long does hiring a nurse take?",
  "Wie lange dauert die Vermittlung von Pflegekräften?",
  "Please delete my personal data",
  "Ich möchte meine personenbezogenen Daten löschen lassen",
  "Tôi muốn xóa dữ liệu cá nhân",
  "giáo dục",
];

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("local curated FAQ", () => {
  it.each(["de", "en", "vi", "vn"] as const)(
    "matches every existing curated scenario in %s without networking or timers",
    (language) => {
      const fetch = vi.fn(() => {
        throw new Error("offline / chat API disabled");
      });
      vi.stubGlobal("fetch", fetch);
      vi.stubGlobal("navigator", { onLine: false });
      vi.useFakeTimers();
      for (const question of questions) {
        const result = new LocalFaq().answer(language, question);
        expect(result.status).toBe("answered");
        if (result.status !== "answered") throw new Error("Missing synchronous answer");
        expect(result.answer).toBe(
          getGuidedChatResponse(language === "vn" ? "vi" : language, question)
        );
      }
      expect(fetch).not.toHaveBeenCalled();
      expect(vi.getTimerCount()).toBe(0);
    }
  );

  it("deduplicates same-action double clicks across ticks, expires without extending, and resets", () => {
    const faq = new LocalFaq();
    expect(faq.answer("en", "pricing", 0).status).toBe("answered");
    expect(faq.answer("en", " pricing ", 1).status).toBe("duplicate");
    expect(faq.answer("en", "pricing", 599).status).toBe("duplicate");
    expect(faq.answer("en", "pricing", 600).status).toBe("answered");
    faq.resetDuplicate();
    expect(faq.answer("en", "pricing", 601).status).toBe("answered");
    expect(faq.answer("en", "documents", 601).status).toBe("answered");
    expect(faq.answer("en", "pricing", 601).status).toBe("answered");
    expect(faq.answer("de", "pricing", 601).status).toBe("answered");
    expect(faq.answer("vi", "pricing", 601).status).toBe("answered");
    expect(faq.answer("vn", "pricing", 601).status).toBe("duplicate");
  });

  it("allows 20/min, preserves quota through lifecycle resets and releases without an automatic request", () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const faq = new LocalFaq();
    for (let i = 0; i < 20; i++) {
      const result = faq.answer("en", `pricing ${i}`);
      expect(result).toMatchObject({ status: "answered", cooldownUntil: i === 19 ? 60000 : 0 });
      faq.resetDuplicate();
    }
    expect(faq.answer("de", "documents")).toEqual({ status: "throttled", cooldownUntil: 60000 });
    vi.advanceTimersByTime(59999);
    expect(faq.answer("vi", "documents").status).toBe("throttled");
    vi.advanceTimersByTime(1);
    expect(faq.answer("vn", "documents").status).toBe("answered");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("uses a rolling window rather than resetting the entire quota at once", () => {
    const faq = new LocalFaq();
    for (let i = 0; i < 20; i++) faq.answer("en", `pricing ${i}`, i * 1000);
    expect(faq.answer("en", "documents", 60000).status).toBe("answered");
    expect(faq.answer("en", "visa", 60000)).toEqual({ status: "throttled", cooldownUntil: 61000 });
    expect(faq.answer("en", "visa", 61000).status).toBe("answered");
  });

  it("caps input and history, skips blanks, and escapes raw HTML in the existing renderer", () => {
    const faq = new LocalFaq();
    expect(faq.answer("de", "   ")).toEqual({ status: "empty" });
    const result = faq.answer("en", ' <script>alert("x")</script>' + "x".repeat(3000));
    if (result.status !== "answered") throw new Error("Missing answer");
    expect(result.message).toHaveLength(2000);
    expect(result.answer).not.toContain("<script>");
    const html = renderToStaticMarkup(<p>{renderMessageContent(result.message)}</p>);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(
      boundMessages(Array.from({ length: 300 }, () => ({ content: result.message })))
    ).toHaveLength(50);
  });

  it("keeps answering when best-effort history fails offline, without chat POSTs or history retries", async () => {
    const fetch = vi.fn().mockRejectedValue(new TypeError("offline"));
    vi.stubGlobal("fetch", fetch);
    const writer = new HistoryWriter<string>(async (snapshot, signal) => {
      await postJson("/api/chat/history", { snapshot }, signal);
    });
    const faq = new LocalFaq();
    const first = faq.answer("en", "pricing");
    expect(first.status).toBe("answered");
    writer.enqueue("first");
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(faq.answer("de", "documents").status).toBe("answered");
    writer.enqueue("second");
    await Promise.resolve();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toBe("/api/chat/history");
    writer.stop();
  });

  it("cancels active and queued history on close without writing again on reopen", async () => {
    let signal!: AbortSignal;
    const write = vi.fn((_snapshot: number, activeSignal: AbortSignal) => {
      signal = activeSignal;
      return new Promise<void>(() => {});
    });
    const writer = new HistoryWriter(write);
    writer.enqueue(1);
    writer.enqueue(2);
    writer.cancelPending();
    expect(signal.aborted).toBe(true);
    writer.enqueue(3);
    await Promise.resolve();
    expect(write).toHaveBeenCalledTimes(1);
  });
});
