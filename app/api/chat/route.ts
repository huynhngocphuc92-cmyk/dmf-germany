import { NextRequest, NextResponse } from "next/server";
import { PRIMARY_CONTACT } from "@/lib/company/contact";
import { buildKnowledgeContext } from "@/lib/chatbot/knowledge-base";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { runWithGeminiModelFallback } from "@/lib/ai/gemini";

// ============================================
// TYPES
// ============================================

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  message: string;
  history?: ChatMessage[];
  language?: "de" | "en" | "vi" | "vn";
}

type SupportedChatLanguage = "de" | "en" | "vi";

// ============================================
// SYSTEM PROMPT
// ============================================

function normalizeChatLanguage(language?: string): SupportedChatLanguage {
  switch (language) {
    case "en":
      return "en";
    case "vi":
    case "vn":
      return "vi";
    case "de":
    default:
      return "de";
  }
}

function buildSystemPrompt(language: SupportedChatLanguage): string {
  const knowledgeContext = buildKnowledgeContext();

  const languageInstructions = {
    de: "Antworte auf Deutsch.",
    en: "Answer in English.",
    vi: "Trả lời bằng tiếng Việt.",
  };

  return `Du bist ein professioneller Berater für DMF Talents, eine Akademie für vietnamesische Talente.

## DEINE ROLLE
Du hilfst deutschen Unternehmen und Partnern, die nach qualifizierten Mitarbeitern aus Vietnam suchen.
Du bist freundlich, professionell und kompetent.

## SPRACHE
${languageInstructions[language]}
Halte die gesamte Antwort konsequent in dieser Sitzungssprache.
Wechsle die Sprache nicht automatisch, nur weil der Nutzer einzelne Wörter oder Sätze in einer anderen Sprache schreibt.
Wechsle die Sprache nur dann, wenn der Nutzer ausdrücklich darum bittet.

## REGELN
1. Sei höflich und professionell
2. Antworte präzise und hilfreich
3. Bei Preisfragen: Erkläre, dass wir nur für Bildung und rechtliche Begleitung berechnen, keine versteckten Vermittlungsgebühren. Für ein individuelles Angebot soll der Kunde uns kontaktieren.
4. Bei konkreten Anfragen: Leite zu einem Beratungsgespräch weiter (Calendly-Link: https://calendly.com/contact-dmf/30min)
5. Sammle wenn möglich Kontaktinformationen (Firma, E-Mail, Personalbedarf)
6. Wenn du etwas nicht weißt, sage es ehrlich und biete an, die Frage an einen Mitarbeiter weiterzuleiten
7. Halte Antworten kurz und prägnant (max. 3-4 Sätze pro Absatz)
8. Verwende Formatierung (Listen, Absätze) für bessere Lesbarkeit

## WICHTIGE LINKS
- Beratungstermin: https://calendly.com/contact-dmf/30min
- Kontakt: ${PRIMARY_CONTACT.email}
- Website: https://dmf-talents.de

## WISSENSBASIS
${knowledgeContext}

## KONVERSATIONSFÜHRUNG
- Begrüße neue Nutzer freundlich
- Frage nach dem Personalbedarf (Ausbildung, Fachkräfte, Studium)
- Erkläre unsere Vorteile gegenüber anderen Vermittlern
- Biete konkrete nächste Schritte an (Beratungsgespräch, Kandidatenprofile)
`;
}

// ============================================
// API HANDLER
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    const rateLimitResult = await checkRateLimit(`chat:${ip}`, RATE_LIMITS.CHAT);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Check API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not configured");
      return NextResponse.json({ error: "Chat service not configured" }, { status: 500 });
    }

    // Parse request
    const body: ChatRequest = await request.json();
    const { message, history = [], language = "de" } = body;
    const normalizedLanguage = normalizeChatLanguage(language);

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Limit message length
    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message too long (max 2000 characters)" },
        { status: 400 }
      );
    }

    // Limit history
    const limitedHistory = history.slice(-10); // Keep last 10 messages

    // Build chat history for Gemini (role: "user" | "model")
    const chatHistory = limitedHistory.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const { data: result } = await runWithGeminiModelFallback(
      apiKey,
      { systemInstruction: buildSystemPrompt(normalizedLanguage) },
      async (model) => {
        const chat = model.startChat({ history: chatHistory });
        return chat.sendMessage(message);
      }
    );

    const assistantMessage =
      result.response.text() || "Entschuldigung, ich konnte keine Antwort generieren.";

    // Return response
    return NextResponse.json({
      message: assistantMessage,
      usage: {
        inputTokens: result.response.usageMetadata?.promptTokenCount ?? 0,
        outputTokens: result.response.usageMetadata?.candidatesTokenCount ?? 0,
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);

    const errMsg = error instanceof Error ? error.message : "";
    if (errMsg.includes("429") || errMsg.toLowerCase().includes("quota")) {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again." },
        { status: 503 }
      );
    }
    if (errMsg.includes("401") || errMsg.toLowerCase().includes("api key")) {
      return NextResponse.json({ error: "Chat service configuration error" }, { status: 500 });
    }

    return NextResponse.json({ error: "An error occurred. Please try again." }, { status: 500 });
  }
}

// ============================================
// HEALTH CHECK
// ============================================

export async function GET() {
  const hasApiKey = !!process.env.GEMINI_API_KEY;
  return NextResponse.json({
    status: hasApiKey ? "ready" : "not_configured",
    message: hasApiKey ? "Chat API is ready" : "GEMINI_API_KEY not configured",
  });
}
