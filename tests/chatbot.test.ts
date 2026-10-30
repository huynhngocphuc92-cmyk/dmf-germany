import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ success: true, count: 1, resetIn: 60 }),
  getClientIp: () => "127.0.0.1",
  RATE_LIMITS: { CHAT: { limit: 10, windowSeconds: 60 }, API: { limit: 20, windowSeconds: 60 } },
}));

import { isGrokModelUnavailableError } from "@/lib/ai/grok";
import { getFallbackChatResponse } from "@/lib/chatbot/fallback";
import { PRIMARY_CONTACT } from "@/lib/company/contact";

describe("Curated public FAQ and shared model error detection", () => {
  it("detects model unavailable errors reliably", () => {
    expect(
      isGrokModelUnavailableError(new Error("Model grok-4-fast-non-reasoning does not exist"))
    ).toBe(true);
    expect(isGrokModelUnavailableError(new Error("404 Not Found: model xyz"))).toBe(true);
    expect(isGrokModelUnavailableError(new Error("HTTP 400 Bad Request"))).toBe(true);
    expect(isGrokModelUnavailableError({ status: 400 })).toBe(true);
    expect(isGrokModelUnavailableError({ status: 404 })).toBe(true);
    expect(isGrokModelUnavailableError(new Error("unauthorized invalid api key"))).toBe(false);
  });

  it.each([
    [
      "de",
      [
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
      ],
      [
        "Ausbildung",
        "Fachkräfte",
        "Saisonarbeit",
        "Studium",
        "Ablauf",
        "Unterlagen",
        "Visum und Anerkennung",
        "Kosten",
        "Kontakt und Beratung",
        "Guten Tag",
      ],
    ],
    [
      "en",
      [
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
      ],
      [
        "Vocational Training",
        "Skilled Workers",
        "Seasonal work",
        "University",
        "Process",
        "Documents",
        "Visa and recognition",
        "Pricing",
        "Contact and booking",
        "Hello",
      ],
    ],
    [
      "vi",
      [
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
      ],
      [
        "Du học nghề",
        "Lao động chuyên môn",
        "Lao động thời vụ",
        "Đại học",
        "Quy trình",
        "Hồ sơ",
        "Visa và công nhận bằng",
        "Chi phí",
        "Liên hệ và đặt lịch",
        "Xin chào",
      ],
    ],
  ] as const)("covers every curated topic in %s", (language, questions, headings) => {
    questions.forEach((question, index) => {
      const answer = getFallbackChatResponse(language, question);
      expect(answer.startsWith(index === 9 ? headings[index] : `**${headings[index]}:`)).toBe(true);
      expect(answer).toContain(`(${"mailto:" + PRIMARY_CONTACT.email})`);
      expect(answer).toContain("https://www.dmf-talents.de/#contact");
      expect(answer).not.toMatch(
        /24 Stunden|24 hours|3-Jahres|3-year|keine versteckten|no hidden|guaranteed/
      );
    });
  });

  it.each([
    ["de", "AUSBILDUNG KOSTEN", "Kosten"],
    ["en", "nursing visa", "Visa and recognition"],
    ["en", "seasonal documents", "Documents"],
    ["vi", "CHI PHI DU HOC NGHE", "Chi phí"],
    ["vi", "giay to lao dong thoi vu", "Hồ sơ"],
    ["vi", "visa dieu duong", "Visa và công nhận bằng"],
    ["de", "Unterlagen für Fachkräfte", "Unterlagen"],
    ["en", "vocational training process", "Process"],
  ] as const)("prioritizes the actual question: %s %s", (language, question, heading) => {
    expect(getFallbackChatResponse(language, question).startsWith(`**${heading}:`)).toBe(true);
  });

  it.each([
    ["du hoc nghe", "Du học nghề"],
    ["lao dong thoi vu", "Lao động thời vụ"],
    ["dai hoc", "Đại học"],
    ["cong nhan bang", "Visa và công nhận bằng"],
    ["quy trinh", "Quy trình"],
    ["lien he", "Liên hệ và đặt lịch"],
  ])("supports accentless Vietnamese: %s", (question, heading) => {
    expect(getFallbackChatResponse("vi", question).startsWith(`**${heading}:`)).toBe(true);
  });

  it("provides correct service and audience links", () => {
    for (const [question, path] of [
      ["Ausbildung", "/services/azubi"],
      ["Fachkräfte", "/services/skilled-workers"],
      ["seasonal work", "/services/seasonal"],
      ["university", "/ueber-uns/studium"],
    ]) {
      expect(getFallbackChatResponse("en", question)).toContain(
        `https://www.dmf-talents.de${path}`
      );
    }
    expect(getFallbackChatResponse("de", "Kosten für mein Unternehmen")).toContain(
      "/fuer-arbeitgeber/personalbedarf"
    );
    expect(getFallbackChatResponse("en", "university contact")).toContain("prospective students");
    expect(getFallbackChatResponse("en", "book a meeting")).toContain(
      "calendly.com/contact-dmf/30min"
    );
  });

  it.each([
    "this is jobless",
    "spaceships",
    "person@example.invalid",
    "hi there, what is the weather?",
  ])("hands off unknown questions without false claims: %s", (question) => {
    const answer = getFallbackChatResponse("en", question);
    expect(answer.startsWith("I have no prepared answer")).toBe(true);
    expect(answer).toContain(PRIMARY_CONTACT.email);
    expect(answer).toContain("not a submitted inquiry");
    expect(answer).not.toMatch(/we (will|have)|has been saved|we'll/i);
  });

  it.each([
    ["Ausbildung Kosten", "/services/azubi", "Kosten"],
    ["seasonal documents", "/services/seasonal", "Unterlagen"],
    ["nursing visa", "/services/skilled-workers", "Visum und Anerkennung"],
    ["university contact", "/ueber-uns/studium", "Kontakt und Beratung"],
  ])(
    "keeps the related service link after resolving the question: %s",
    (question, path, heading) => {
      const answer = getFallbackChatResponse("de", question);
      expect(answer.startsWith(`**${heading}:`)).toBe(true);
      expect(answer).toContain(`https://www.dmf-talents.de${path}`);
    }
  );

  it.each([
    "person@example.invalid",
    "my email is person@example.invalid",
    "Please contact me at person@example.invalid",
  ])("never confirms inquiry submission from pasted contact details: %s", (message) => {
    const answer = getFallbackChatResponse("en", message);
    expect(answer).toContain("not a submitted inquiry");
    expect(answer).not.toMatch(
      /your inquiry (has been|is) saved|we will (call|email|contact)|we'll (call|email|contact)/i
    );
  });
  it.each([
    ["de", "Zu dieser Frage habe ich keine vorbereitete Antwort"],
    ["en", "I have no prepared answer"],
    ["vi", "Tôi chưa có câu trả lời soạn sẵn"],
  ] as const)("localizes unknown handoff in %s", (language, prefix) => {
    expect(getFallbackChatResponse(language, "xyzzy").startsWith(prefix)).toBe(true);
  });

  it("distinguishes greetings and general services from unknown questions", () => {
    expect(getFallbackChatResponse("en", "HI!")).toContain("Hello!");
    expect(getFallbackChatResponse("de", "Welche Leistungen bieten Sie?")).toContain(
      "automatische FAQ"
    );
    expect(getFallbackChatResponse("vi", "dich vu")).toContain("chatbot tự động");
  });
});
