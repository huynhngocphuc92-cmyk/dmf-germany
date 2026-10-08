import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ success: true, count: 1, resetIn: 60 }),
  getClientIp: () => "127.0.0.1",
  RATE_LIMITS: { CHAT: { limit: 10, windowSeconds: 60 }, API: { limit: 20, windowSeconds: 60 } },
}));

import { GET, POST } from "@/app/api/chat/route";
import { isGrokModelUnavailableError } from "@/lib/ai/grok";
import { getFallbackChatResponse } from "@/lib/chatbot/fallback";
import { PRIMARY_CONTACT } from "@/lib/company/contact";

describe("Chatbot & AI Fallback Suite", () => {
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

  it("generates structured fallback responses in German, English, and Vietnamese", () => {
    // German
    const deRes = getFallbackChatResponse("de", "Ich suche Pflegekräfte");
    expect(deRes).toContain("DMF Talents");
    expect(deRes).toContain("Pflege");
    expect(deRes).toContain("calendly.com");
    expect(deRes).toContain(PRIMARY_CONTACT.email);

    // English
    const enRes = getFallbackChatResponse("en", "Tell me about vocational training");
    expect(enRes).toContain("DMF Talents");
    expect(enRes).toContain("Vocational Training");
    expect(enRes).toContain("calendly.com");

    // Vietnamese
    const viRes = getFallbackChatResponse("vi", "Tôi muốn tìm hiểu về du học nghề");
    expect(viRes).toContain("DMF Talents");
    expect(viRes).toContain("Du học nghề");
    expect(viRes).toContain("Điều dưỡng");
  });

  it("handles pricing and booking questions with transparent links", () => {
    const priceRes = getFallbackChatResponse("de", "Wie viel kostet die Vermittlung?");
    expect(priceRes).toContain("Kostentransparenz");
    expect(priceRes).toContain("calendly.com");

    const bookRes = getFallbackChatResponse("en", "I want to schedule a meeting");
    expect(bookRes).toContain("Calendly");
    expect(bookRes).toContain(PRIMARY_CONTACT.email);
  });

  it("validates POST /api/chat rejects invalid or empty body", async () => {
    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("handles POST /api/chat gracefully with 200 even without external AI keys", async () => {
    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Hallo, ich interessiere mich für das Ausbildungsprogramm",
        language: "de",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.message).toBeDefined();
    expect(data.message.length).toBeGreaterThan(20);
    expect(data.message).toContain("DMF Talents");
  });

  it("returns health check from GET /api/chat", async () => {
    const res = await GET(new NextRequest("http://localhost/api/chat"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBeDefined();
    expect(data.providers).toBeDefined();
  });
});
