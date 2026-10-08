import { SITE_URL } from "@/lib/site";
import { GrokMessage, runWithGrokModelFallback } from "@/lib/ai/grok";
import { runWithGeminiFallback } from "@/lib/ai/gemini";
import { getFallbackChatResponse, SupportedChatLanguage } from "@/lib/chatbot/fallback";
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
Du hilfst deutschen Unternehmen und Partnern, die nach qualifizierten Mitarbeitern aus Vietnam suchen, sowie Talenten, die eine Ausbildung oder ein Studium in Deutschland anstreben.
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
1. Sei höflich und professionell.
2. Antworte präzise, hilfreich und strukturiert.
3. Bei Preisfragen: Verweise auf ein individuelles Angebot. Nenne keine nicht bestätigten Preise, Gebührenmodelle oder Garantien.
4. Bei konkreten Anfragen: Verweise auf das Anfrageformular im Chat oder das Kontaktformular unter ${SITE_URL}/#contact. Für eine gespeicherte Anfrage ist eine gültige E-Mail-Adresse erforderlich; die Telefonnummer ist optional.
5. Eine normale Chatnachricht ist noch keine bestätigte Kontaktanfrage. Versprich keinen Rückruf, keine E-Mail und keine Weiterleitung allein aufgrund von Kontaktdaten im Chat. Die Anfrage gilt erst nach der Erfolgsbestätigung des Formulars als gespeichert.
6. Wenn du etwas nicht weißt, sage es ehrlich und verweise für eine verbindliche Antwort auf das Kontaktformular oder die Kontakt-E-Mail (${PRIMARY_CONTACT.email}).
7. Halte Antworten prägnant (max. 3-4 Sätze pro Absatz).
8. Verwende Formatierung (Listen, Markdown-Links, Absätze) für beste Lesbarkeit.
9. Nenne bei allgemeinen Antworten nur die Marke DMF Talents; nenne den rechtlichen Betreiber nur bei ausdrücklichen Fragen zu Impressum, Unternehmen oder Rechtlichem.

## WICHTIGE LINKS
- Kontaktanfrage: ${SITE_URL}/#contact
- Beratungstermin vereinbaren: https://calendly.com/contact-dmf/30min
- E-Mail: ${PRIMARY_CONTACT.email}
- Website: ${SITE_URL}

## WISSENSBASIS
${knowledgeContext}

## KONVERSATIONSFÜHRUNG
- Begrüße neue Nutzer freundlich.
- Frage nach dem konkreten Bedarf (Ausbildung, Fachkräfte, Studium).
- Erkläre unsere Vorteile gegenüber herkömmlichen Agenturen (eigene Akademie, Sprachzertifizierung B1/B2, Rundumbetreuung).
- Biete konkrete nächste Schritte an: Beratungstermin buchen, Kontaktformular nutzen oder Kontaktdaten im Chat hinterlassen.
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

    const limitedHistory = history.slice(-10); // Keep last 10 messages
    const systemPrompt = buildSystemPrompt(normalizedLanguage);

    let assistantMessage = "";
    let usage = { inputTokens: 0, outputTokens: 0 };
    let provider = "none";

    // 1. Try Grok (xAI) first if key is present
    const xaiApiKey = process.env.XAI_API_KEY;
    if (xaiApiKey) {
      try {
        const grokMessages: GrokMessage[] = [
          { role: "system", content: systemPrompt },
          ...limitedHistory.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          { role: "user", content: message },
        ];

        const grokResult = await runWithGrokModelFallback(xaiApiKey, grokMessages);
        if (grokResult.text) {
          assistantMessage = grokResult.text;
          usage = grokResult.usage;
          provider = `grok (${grokResult.modelName})`;
        }
      } catch (grokError) {
        console.warn(
          "[Chat] Grok provider failed, checking fallback:",
          grokError instanceof Error ? grokError.message : grokError
        );
      }
    }

    // 2. Try Gemini if Grok didn't succeed and GEMINI_API_KEY is present
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!assistantMessage && geminiApiKey) {
      try {
        const geminiResult = await runWithGeminiFallback(
          geminiApiKey,
          systemPrompt,
          limitedHistory,
          message
        );
        if (geminiResult.text) {
          assistantMessage = geminiResult.text;
          provider = `gemini (${geminiResult.modelName})`;
        }
      } catch (geminiError) {
        console.warn(
          "[Chat] Gemini provider failed, switching to deterministic fallback:",
          geminiError instanceof Error ? geminiError.message : geminiError
        );
      }
    }

    // 3. Fallback responder if AI providers failed or were not configured
    if (!assistantMessage) {
      assistantMessage = getFallbackChatResponse(normalizedLanguage, message);
      provider = "fallback_engine";
    }

    return NextResponse.json({
      message: assistantMessage,
      usage,
      provider,
    });
  } catch (error) {
    if (error instanceof InvalidBody)
      return NextResponse.json({ error: "Invalid chat request" }, { status: error.status });

    console.error(
      "[Chat] Unhandled POST exception:",
      error instanceof Error ? error.stack || error.message : error
    );

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

    // Even on unhandled error, provide a safe fallback response so user is never stranded
    const safeFallback = getFallbackChatResponse("de", "");
    return NextResponse.json({
      message: safeFallback,
      provider: "safe_error_fallback",
    });
  }
}

// ============================================
// HEALTH CHECK
// ============================================

export async function GET(request: NextRequest) {
  const hasXai = !!process.env.XAI_API_KEY;
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const isReady = hasXai || hasGemini;

  const { searchParams } = new URL(request.url);
  const runDiagnostics = searchParams.get("diagnostics") === "1";

  let xaiDiagnostic: string | null = null;
  if (runDiagnostics && hasXai) {
    try {
      const res = await runWithGrokModelFallback(process.env.XAI_API_KEY!, [
        { role: "user", content: "Test ping" },
      ]);
      xaiDiagnostic = `OK (${res.modelName})`;
    } catch (err) {
      xaiDiagnostic = err instanceof Error ? err.message : String(err);
    }
  }

  return NextResponse.json({
    status: isReady ? "ready" : "fallback_mode",
    providers: {
      xai: hasXai,
      gemini: hasGemini,
    },
    xaiDiagnostic: runDiagnostics ? xaiDiagnostic : undefined,
    message: isReady ? "Chat API is ready" : "Chat running in fallback mode",
  });
}
