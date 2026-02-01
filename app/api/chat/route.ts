import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildKnowledgeContext } from "@/lib/chatbot/knowledge-base";

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
  language?: "de" | "en" | "vi";
}

// ============================================
// RATE LIMITING (Simple in-memory)
// ============================================

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// ============================================
// SYSTEM PROMPT
// ============================================

function buildSystemPrompt(language: string): string {
  const knowledgeContext = buildKnowledgeContext();

  const languageInstructions = {
    de: "Antworte auf Deutsch.",
    en: "Answer in English.",
    vi: "Trả lời bằng tiếng Việt.",
  };

  return `Du bist ein professioneller Berater für DMF Germany, eine Akademie für vietnamesische Talente.

## DEINE ROLLE
Du hilfst deutschen Unternehmen und Partnern, die nach qualifizierten Mitarbeitern aus Vietnam suchen.
Du bist freundlich, professionell und kompetent.

## SPRACHE
${languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.de}
Wenn der Nutzer in einer anderen Sprache schreibt, antworte in dieser Sprache.

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
- Kontakt: contact@dmf-germany.de
- Website: https://dmf-germany.de

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
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Check API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY not configured");
      return NextResponse.json({ error: "Chat service not configured" }, { status: 500 });
    }

    // Parse request
    const body: ChatRequest = await request.json();
    const { message, history = [], language = "de" } = body;

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

    // Initialize Anthropic client (with optional custom base URL)
    const clientConfig: { apiKey: string; baseURL?: string } = { apiKey };
    if (process.env.ANTHROPIC_BASE_URL) {
      clientConfig.baseURL = process.env.ANTHROPIC_BASE_URL;
    }
    const anthropic = new Anthropic(clientConfig);

    // Build messages for API
    const messages: Anthropic.MessageParam[] = [
      ...limitedHistory.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      {
        role: "user" as const,
        content: message,
      },
    ];

    // Call Claude API
    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
      max_tokens: 1024,
      system: buildSystemPrompt(language),
      messages,
    });

    // Extract text response
    const textContent = response.content.find((block) => block.type === "text");
    const assistantMessage =
      textContent?.type === "text"
        ? textContent.text
        : "Entschuldigung, ich konnte keine Antwort generieren.";

    // Return response
    return NextResponse.json({
      message: assistantMessage,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);

    // Handle specific Anthropic errors
    if (error instanceof Anthropic.APIError) {
      if (error.status === 429) {
        return NextResponse.json(
          { error: "Service temporarily unavailable. Please try again." },
          { status: 503 }
        );
      }
      if (error.status === 401) {
        return NextResponse.json({ error: "Chat service configuration error" }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "An error occurred. Please try again." }, { status: 500 });
  }
}

// ============================================
// HEALTH CHECK
// ============================================

export async function GET() {
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
  return NextResponse.json({
    status: hasApiKey ? "ready" : "not_configured",
    message: hasApiKey ? "Chat API is ready" : "ANTHROPIC_API_KEY not configured",
  });
}
