import { randomUUID } from "node:crypto";
import { providerFailure } from "@/lib/ai/provider-runtime";
import { SITE_URL } from "@/lib/site";
import { GrokMessage, runWithGrokModelFallback } from "@/lib/ai/grok";
import { runWithGeminiFallback } from "@/lib/ai/gemini";
import { requireAdmin } from "@/lib/auth/admin";
import { adminAuthorizationResponse } from "@/lib/auth/admin-http";
import { getFallbackChatResponse, SupportedChatLanguage } from "@/lib/chatbot/fallback";
import { buildKnowledgeContext } from "@/lib/chatbot/knowledge-base";
import { PRIMARY_CONTACT } from "@/lib/company/contact";
import { InvalidBody, readJsonBody } from "@/lib/intake/body";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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
  const requestId = randomUUID();
  const startedAt = Date.now();
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
    const providerDeadline = AbortSignal.timeout(15000);

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

        const grokResult = await runWithGrokModelFallback(xaiApiKey, grokMessages, {
          signal: providerDeadline,
          timeoutMs: 8000,
        });
        if (grokResult.text) {
          assistantMessage = grokResult.text;
          usage = grokResult.usage;
          provider = `grok (${grokResult.modelName})`;
        }
      } catch (grokError) {
        console.warn("[Chat] Provider failed", {
          requestId,
          provider: "xai",
          code: providerFailure(grokError),
        });
      }
    }

    // 2. Try Gemini if Grok didn't succeed and GEMINI_API_KEY is present
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!assistantMessage && geminiApiKey && !providerDeadline.aborted) {
      try {
        const geminiResult = await runWithGeminiFallback(
          geminiApiKey,
          systemPrompt,
          limitedHistory,
          message,
          { signal: providerDeadline, timeoutMs: 8000 }
        );
        if (geminiResult.text) {
          assistantMessage = geminiResult.text;
          provider = `gemini (${geminiResult.modelName})`;
        }
      } catch (geminiError) {
        console.warn("[Chat] Provider failed", {
          requestId,
          provider: "gemini",
          code: providerFailure(geminiError),
        });
      }
    }

    // 3. Fallback responder if AI providers failed or were not configured
    if (!assistantMessage) {
      assistantMessage = getFallbackChatResponse(normalizedLanguage, message);
      provider = "fallback_engine";
    }

    const mode = provider === "fallback_engine" ? "fallback" : "ai";

    return NextResponse.json(
      {
        message: assistantMessage,
        usage,
        provider,
        mode,
        requestId,
        durationMs: Date.now() - startedAt,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof InvalidBody)
      return NextResponse.json({ error: "Invalid chat request" }, { status: error.status });

    console.error("[Chat] Request failed", { requestId, code: providerFailure(error) });
    return NextResponse.json(
      { error: "Chat service temporarily unavailable. Please try again.", requestId },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}

// ============================================
// HEALTH CHECK
// ============================================

export async function GET(request: NextRequest) {
  const hasXai = !!process.env.XAI_API_KEY;
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const configured = hasXai || hasGemini;
  const responseHeaders = { "Cache-Control": "no-store" };
  const runDiagnostics = request.nextUrl.searchParams.get("diagnostics") === "1";
  const diagnostics: Record<
    string,
    { status: "operational" | "degraded"; code?: string; model?: string }
  > = {};

  if (runDiagnostics) {
    try {
      const { user } = await requireAdmin();
      const rate = await checkRateLimit(`chat-diagnostics:${user.id}`, RATE_LIMITS.API);
      if (!rate.success)
        return NextResponse.json(
          { error: "Too many diagnostic requests" },
          { status: 429, headers: { ...responseHeaders, "Retry-After": String(rate.resetIn) } }
        );
    } catch (error) {
      const denied = adminAuthorizationResponse(error);
      if (denied) return denied;
      return NextResponse.json(
        { error: "Diagnostics unavailable" },
        { status: 503, headers: responseHeaders }
      );
    }

    const signal = AbortSignal.timeout(15000);
    if (hasXai) {
      try {
        const result = await runWithGrokModelFallback(
          process.env.XAI_API_KEY!,
          [{ role: "user", content: "Reply with OK." }],
          { signal, timeoutMs: 8000 }
        );
        diagnostics.xai = { status: "operational", model: result.modelName };
      } catch (error) {
        diagnostics.xai = { status: "degraded", code: providerFailure(error) };
      }
    }
    if (hasGemini) {
      try {
        const result = await runWithGeminiFallback(
          process.env.GEMINI_API_KEY!,
          "Reply briefly.",
          [],
          "Reply with OK.",
          { signal, timeoutMs: 8000 }
        );
        diagnostics.gemini = { status: "operational", model: result.modelName };
      } catch (error) {
        diagnostics.gemini = { status: "degraded", code: providerFailure(error) };
      }
    }
  }

  // Key presence means configured, never proof of a successful provider request.
  const status = !configured
    ? "fallback_mode"
    : !runDiagnostics
      ? "configured"
      : Object.values(diagnostics).some((value) => value.status === "operational")
        ? "ready"
        : "degraded";
  return NextResponse.json(
    {
      status,
      providers: { xai: hasXai, gemini: hasGemini },
      ...(runDiagnostics ? { diagnostics } : {}),
      message:
        status === "configured"
          ? "AI configured; operational status has not been verified."
          : status === "ready"
            ? "At least one AI provider passed diagnostics."
            : "Chat can use the fallback responder.",
    },
    { headers: responseHeaders }
  );
}
