import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { runWithOpenRouterFallback } from "@/lib/ai/openrouter";
import type { HiringService } from "@/lib/validations/hiring";

const parseRequestSchema = z.object({
  text: z.string().trim().min(5).max(5000),
  lang: z.enum(["de", "en", "vn"]).optional(),
});

export interface ParsedHiringDraft {
  service: HiringService;
  headcount: string;
  location: string;
  timing: string;
  summaryMessage: string;
}

function deterministicParseHiringText(
  rawText: string,
  lang: "de" | "en" | "vn"
): ParsedHiringDraft {
  const lower = rawText.toLowerCase();

  let service: HiringService = "unsure";
  if (/azubi|ausbildung|auszubildende|lehrling|học nghề/.test(lower)) {
    service = "azubi";
  } else if (/saison|ernte|aushilfe|kurzfristig|thời vụ/.test(lower)) {
    service = "seasonal";
  } else if (
    /fachkraft|fachkräfte|pflege|mechaniker|cnc|koch|gastronomie|handwerk|ingenieur|it-|kỹ sư|điều dưỡng/.test(
      lower
    )
  ) {
    service = "skilled";
  }

  const countMatch = rawText.match(
    /\b(\d{1,3})\s*(?:fachkräfte|azubis|auszubildende|mitarbeiter|kräfte|personen|stellen|ứng viên|người|học viên)\b/i
  );
  const headcount = countMatch ? countMatch[1] : "";

  const cityMatch = rawText.match(
    /\b(?:in|raum|standort|near|tại)\s+([A-ZÄÖÜ][a-zäöüß-]+(?:\s+[A-ZÄÖÜ][a-zäöüß-]+)?)/
  );
  const location = cityMatch ? cityMatch[1].trim() : "";

  const timingMatch = rawText.match(
    /\b((?:ab\s+)?(?:sofort|herbst\s*202\d|frühjahr\s*202\d|sommer\s*202\d|winter\s*202\d|q[1-4]\s*202\d|\d{2}\.\d{2}\.202\d|202[6-9]))/i
  );
  const timing = timingMatch ? timingMatch[1].trim() : "";

  const trimmed = rawText.trim().slice(0, 900);
  const summaryMessage =
    lang === "de"
      ? `Anfrage basierend auf Stellenbeschreibung:\n${trimmed}`
      : lang === "en"
        ? `Inquiry based on job description:\n${trimmed}`
        : `Yêu cầu tuyển dụng trích xuất từ mô tả công việc:\n${trimmed}`;

  return {
    service,
    headcount,
    location,
    timing,
    summaryMessage,
  };
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = await checkRateLimit(`hiring-parse:${clientIp}`, RATE_LIMITS.CHAT);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es gleich erneut." },
        { status: 429 }
      );
    }

    const rawBody = await request.json().catch(() => null);
    const parsed = parseRequestSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Bitte geben Sie einen längeren Text oder eine Stellenbeschreibung ein." },
        { status: 400 }
      );
    }

    const { text, lang = "de" } = parsed.data;
    const fallback = deterministicParseHiringText(text, lang);
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json({ data: fallback, mode: "guided" });
    }

    const systemPrompt = `Du bist ein KI-Assistent für Arbeitgeberanfragen bei DMF Talents (Personalvermittlung Vietnam -> Deutschland).
Extrahiere aus dem vom Arbeitgeber eingefügten Text (Stellenanzeige oder Freitext-Bedarf) strukturierte Felder für das Anfrageformular:
- "service": Einer von ["skilled", "azubi", "seasonal", "unsure"] ("skilled" = Fachkräfte §18a/b, "azubi" = Auszubildende §16a, "seasonal" = Saisonkräfte).
- "headcount": Anzahl gesuchter Personen als Zahl-String (z.B. "2", oder "" falls unklar).
- "location": Arbeitsort / Stadt / Region in Deutschland (max. 80 Zeichen, oder "").
- "timing": Gewünschter Starttermin / Zeitraum (z.B. "Ab Herbst 2026", "Ab sofort", oder "").
- "summaryMessage": Eine prägnante, professionelle Zusammenfassung des Personalbedarfs (Berufsbild, Aufgaben, gewünschtes Deutschniveau, Rahmenbedingungen) in 2–4 Sätzen (${lang === "de" ? "auf Deutsch" : lang === "en" ? "in English" : "bằng tiếng Việt"}).

Antworte AUSSCHLIESSLICH als valides JSON-Objekt:
{"service": "skilled", "headcount": "2", "location": "...", "timing": "...", "summaryMessage": "..."}`;

    try {
      const { text: aiText } = await runWithOpenRouterFallback(
        apiKey,
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
        { maxTokens: 450, temperature: 0.2, timeoutMs: 12000 }
      );

      const cleaned = aiText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      const jsonStr =
        firstBrace !== -1 && lastBrace > firstBrace
          ? cleaned.slice(firstBrace, lastBrace + 1)
          : cleaned;
      const aiObj = JSON.parse(jsonStr);

      const validServices: HiringService[] = ["skilled", "azubi", "seasonal", "unsure"];
      const service: HiringService = validServices.includes(aiObj?.service)
        ? aiObj.service
        : fallback.service;

      return NextResponse.json({
        data: {
          service,
          headcount:
            typeof aiObj?.headcount === "string" || typeof aiObj?.headcount === "number"
              ? String(aiObj.headcount).replace(/[^\d]/g, "").slice(0, 4) || fallback.headcount
              : fallback.headcount,
          location:
            typeof aiObj?.location === "string" && aiObj.location.trim()
              ? aiObj.location.trim().slice(0, 180)
              : fallback.location,
          timing:
            typeof aiObj?.timing === "string" && aiObj.timing.trim()
              ? aiObj.timing.trim().slice(0, 180)
              : fallback.timing,
          summaryMessage:
            typeof aiObj?.summaryMessage === "string" && aiObj.summaryMessage.trim().length >= 10
              ? aiObj.summaryMessage.trim()
              : fallback.summaryMessage,
        },
        mode: "ai",
      });
    } catch {
      return NextResponse.json({ data: fallback, mode: "guided" });
    }
  } catch {
    return NextResponse.json({ error: "Interner Serverfehler." }, { status: 500 });
  }
}
