import { SITE_URL } from "@/lib/site";
import { GrokMessage, runWithGrokModelFallback } from "@/lib/ai/grok";
import { buildKnowledgeContext } from "@/lib/chatbot/knowledge-base";
import { PRIMARY_CONTACT } from "@/lib/company/contact";
import { InvalidBody, readJsonBody } from "@/lib/intake/body";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// ============================================
// TYPES
// ============================================

const chatSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(10000) }))
    .max(200)
    .default([]),
  language: z.enum(["de", "en", "vi", "vn"]).default("de"),
});

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
Du trittst als virtueller Assistent von DMF Talents auf.

## SPRACHE
${languageInstructions[language]}
Halte die gesamte Antwort konsequent in dieser Sitzungssprache.
Wechsle die Sprache nicht automatisch, nur weil der Nutzer einzelne Wörter oder Sätze in einer anderen Sprache schreibt.
Wechsle die Sprache nur dann, wenn der Nutzer ausdrücklich darum bittet.

## IDENTITÄT & MARKENREGELN
- Verwende für die öffentliche Marke immer den Namen "DMF Talents".
- Verwende niemals die Bezeichnung "DMF Germany" und nenne niemals die Domain dmf-germany.de.
- Wenn nach rechtlichen Unternehmensdaten, Impressum oder Betreiber gefragt wird, erkläre:
  Die Website/Marke DMF Talents wird laut Impressum von "DMF VIETNAM JOINT STOCK COMPANY" betrieben.
- Behaupte nicht, du seist ein Mensch. Du bist der virtuelle Assistent von DMF Talents.

## QUELLENREGELN
- Verwende nur Informationen aus der WISSENSBASIS, den unten stehenden Kontaktdaten und den angegebenen Links.
- Erfinde keine weiteren Standorte, Ansprechpartner, Preise, Erfolgszahlen, Garantien oder rechtlichen Zusagen.
- Wenn Informationen fehlen oder unklar sind, sage das offen und verweise an einen Mitarbeiter oder ein Beratungsgespräch.

## REGELN
1. Sei höflich und professionell
2. Antworte präzise und hilfreich
3. Bei Preisfragen: Verweise auf ein individuelles Angebot. Nenne keine nicht bestätigten Preise, Gebührenmodelle oder Garantien.
4. Bei konkreten Anfragen: Verweise auf das Anfrageformular im Chat oder das Kontaktformular unter /#contact. Für eine gespeicherte Anfrage ist eine gültige E-Mail-Adresse erforderlich; die Telefonnummer ist optional.
5. Eine normale Chatnachricht ist noch keine bestätigte Kontaktanfrage. Versprich keinen Rückruf, keine E-Mail und keine Weiterleitung allein aufgrund von Kontaktdaten im Chat. Die Anfrage gilt erst nach der Erfolgsbestätigung des Formulars als gespeichert.
6. Wenn du etwas nicht weißt, sage es ehrlich und verweise für eine verbindliche Antwort auf das Kontaktformular oder die Kontakt-E-Mail.
7. Halte Antworten kurz und prägnant (max. 3-4 Sätze pro Absatz)
8. Verwende Formatierung (Listen, Absätze) für bessere Lesbarkeit
9. Nenne bei allgemeinen Antworten nur die Marke DMF Talents; nenne den rechtlichen Betreiber nur bei ausdrücklichen Fragen zu Impressum, Unternehmen oder Rechtlichem.

## WICHTIGE LINKS
- Kontaktanfrage: ${SITE_URL}/#contact; eine Rückrufbitte kann im Formular mit optionaler Telefonnummer angegeben werden
- Kontakt: ${PRIMARY_CONTACT.email}
- Website: ${SITE_URL}

## WISSENSBASIS
${knowledgeContext}

## KONVERSATIONSFÜHRUNG
- Begrüße neue Nutzer freundlich
- Frage nach dem Personalbedarf (Ausbildung, Fachkräfte, Studium)
- Erkläre unsere Vorteile gegenüber anderen Vermittlern
- Biete konkrete nächste Schritte über die Formulare an (Rückruf anfragen, Kandidatenprofile anfordern); bestätige keine Aktion, die nicht durch das Formular gespeichert wurde.
`;
}

// ============================================
// API HANDLER
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Parse request
    const parsed = chatSchema.safeParse(await readJsonBody(request, 100000));
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid chat request" }, { status: 400 });
    const { message, history, language } = parsed.data;
    const normalizedLanguage = normalizeChatLanguage(language);

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
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      console.error("XAI_API_KEY not configured");
      return NextResponse.json({ error: "Chat service not configured" }, { status: 500 });
    }

    // Limit history
    const limitedHistory = history.slice(-10); // Keep last 10 messages

    // Build chat history for Grok model structure
    const grokMessages: GrokMessage[] = [
      { role: "system", content: buildSystemPrompt(normalizedLanguage) },
      ...limitedHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    const result = await runWithGrokModelFallback(apiKey, grokMessages);

    const assistantMessage = result.text || "Entschuldigung, ich konnte keine Antwort generieren.";

    // Return response
    return NextResponse.json({
      message: assistantMessage,
      usage: result.usage,
    });
  } catch (error) {
    if (error instanceof InvalidBody)
      return NextResponse.json({ error: "Invalid chat request" }, { status: error.status });
    console.error("[Chat] Request failed");

    const errMsg = error instanceof Error ? error.message : "";
    if (errMsg.includes("429") || errMsg.toLowerCase().includes("quota")) {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again." },
        { status: 503 }
      );
    }
    if (
      errMsg.includes("401") ||
      errMsg.toLowerCase().includes("api key") ||
      errMsg.includes("403")
    ) {
      return NextResponse.json({ error: "Chat service configuration error" }, { status: 500 });
    }

    return NextResponse.json({ error: "An error occurred. Please try again." }, { status: 500 });
  }
}

// ============================================
// HEALTH CHECK
// ============================================

export async function GET() {
  const hasApiKey = !!process.env.XAI_API_KEY;
  return NextResponse.json({
    status: hasApiKey ? "ready" : "not_configured",
    message: hasApiKey ? "Chat API is ready" : "XAI_API_KEY not configured",
  });
}
