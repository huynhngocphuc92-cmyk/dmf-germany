import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { runWithOpenRouterFallback } from "@/lib/ai/openrouter";
import { getFeaturedCandidates } from "@/lib/supabase/candidates";
import {
  findDmfPoolCandidateById,
  mergeWithDmfFeaturedCandidates,
} from "@/lib/candidates/dmf-pool-data";
import { siteUrl } from "@/lib/site";

const candidateInputSchema = z.object({
  id: z.string().min(1).max(100),
  display_code: z.string().max(40).nullish(),
  category: z.enum(["azubi", "skilled", "seasonal"]),
  profession: z.string().nullish(),
  experience_years: z.number().nonnegative().nullish(),
  german_level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).nullish(),
  visa_status: z.boolean(),
});

const matchRequestSchema = z.object({
  query: z.string().trim().min(2).max(600),
  candidates: z.array(candidateInputSchema).max(60).optional(),
  lang: z.enum(["de", "en", "vn"]).optional(),
});

export interface CandidateMatchItem {
  id: string;
  code?: string;
  profession?: string | null;
  category?: "azubi" | "skilled" | "seasonal";
  german_level?: string | null;
  matchScore: number;
  reason: string;
  handoffUrl?: string;
}

const DEFAULT_AUTONOMOUS_CANDIDATE_POOL: z.infer<typeof candidateInputSchema>[] = [
  {
    id: "dmf-nursing-b2-01",
    category: "skilled",
    profession: "Pflegefachkraft (B.Sc. Nursing / § 18a & § 16d AufenthG)",
    experience_years: 3,
    german_level: "B2",
    visa_status: true,
  },
  {
    id: "dmf- nursing-azubi-b2-02".replace(/\s+/g, ""),
    category: "azubi",
    profession: "Auszubildende zur Pflegefachfrau (§ 16a AufenthG)",
    experience_years: 1,
    german_level: "B2",
    visa_status: true,
  },
  {
    id: "dmf-elektro-shk-b1-03",
    category: "skilled",
    profession: "Elektroniker für Energie- und Gebäudetechnik / SHK (§ 18a AufenthG)",
    experience_years: 4,
    german_level: "B1",
    visa_status: true,
  },
  {
    id: "dmf-cnc-industrie-b1-04",
    category: "skilled",
    profession: "CNC-Zerspanungsmechaniker & ISO 9606-1 Schweißer",
    experience_years: 5,
    german_level: "B1",
    visa_status: true,
  },
  {
    id: "dmf-gastro-azubi-b1-05",
    category: "azubi",
    profession: "Auszubildender Koch & Hotelfachmann (DEHOGA / § 16a AufenthG)",
    experience_years: 1,
    german_level: "B1",
    visa_status: true,
  },
];

const GERMAN_RANK: Record<string, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

function resolveCandidateCode(candidate: z.infer<typeof candidateInputSchema>): string {
  if (candidate.display_code) return candidate.display_code;
  const poolMatch = findDmfPoolCandidateById(candidate.id);
  if (poolMatch?.display_code) return poolMatch.display_code;
  return candidate.id.slice(0, 8).toUpperCase();
}

function buildCandidateHandoffUrl(candidate: z.infer<typeof candidateInputSchema>): string {
  const code = resolveCandidateCode(candidate);
  const label = `#${code} (${candidate.profession || candidate.category})`;
  const params = new URLSearchParams({
    service: candidate.category,
    candidates: label,
  });
  return `${siteUrl("/fuer-arbeitgeber/personalbedarf")}?${params.toString()}`;
}

function computeDeterministicMatches(
  query: string,
  candidates: z.infer<typeof candidateInputSchema>[],
  lang: "de" | "en" | "vn"
): { matches: CandidateMatchItem[]; summary: string } {
  const q = query.toLowerCase();
  const wantsB2 = /\bb2\b|\bc1\b/.test(q);
  const wantsB1 = /\bb1\b/.test(q);
  const wantsAzubi = /azubi|ausbildung|lehrling|học nghề/.test(q);
  const wantsSkilled =
    /fachkraft|fachkräfte|skilled|anerkennung|18a|18b|kỹ sư|điều dưỡng viên/.test(q);
  const wantsSeasonal = /saison|seasonal|ernte|lager|thời vụ/.test(q);

  const tokens = q
    .replace(
      /[^a-z0-9äöüßàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s-]/gi,
      " "
    )
    .split(/\s+/)
    .filter((w) => w.length >= 3);

  const scored = candidates.map((c) => {
    let score = 68;
    const prof = (c.profession || "").toLowerCase();
    const levelRank = c.german_level ? GERMAN_RANK[c.german_level] || 2 : 2;

    if (wantsAzubi && c.category === "azubi") score += 14;
    if (wantsSkilled && c.category === "skilled") score += 14;
    if (wantsSeasonal && c.category === "seasonal") score += 14;

    for (const token of tokens) {
      if (prof.includes(token)) {
        score += 12;
      }
    }

    if (wantsB2 && levelRank >= 4) score += 10;
    else if (wantsB1 && levelRank >= 3) score += 8;
    else if (levelRank >= 4) score += 5;

    if ((c.experience_years ?? 0) >= 2) score += 5;
    if (c.visa_status) score += 4;

    const finalScore = Math.min(99, Math.max(55, score));
    const expText =
      c.experience_years && c.experience_years > 0
        ? lang === "de"
          ? `${c.experience_years} J. Erfahrung`
          : lang === "en"
            ? `${c.experience_years} yrs experience`
            : `${c.experience_years} năm kinh nghiệm`
        : lang === "de"
          ? "Praxiserprobt"
          : lang === "en"
            ? "Practice-ready"
            : "Sẵn sàng thực hành";

    const reason =
      lang === "de"
        ? `Passendes Profil (${c.profession || c.category}) mit Deutsch ${c.german_level || "B1"} und ${expText}.`
        : lang === "en"
          ? `Strong fit (${c.profession || c.category}) with German ${c.german_level || "B1"} and ${expText}.`
          : `Hồ sơ phù hợp (${c.profession || c.category}) với tiếng Đức ${c.german_level || "B1"} và ${expText}.`;

    return {
      id: c.id,
      code: resolveCandidateCode(c),
      profession: c.profession,
      category: c.category,
      german_level: c.german_level,
      matchScore: finalScore,
      reason,
      handoffUrl: buildCandidateHandoffUrl(c),
    };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  const topMatches = scored.slice(0, 6);

  const summary =
    lang === "de"
      ? `Wir haben ${topMatches.length} passende Kandidatenprofile für Ihre Anfrage „${query}“ nach Qualifikation, Sprachniveau und Erfahrung priorisiert.`
      : lang === "en"
        ? `We prioritized ${topMatches.length} matching candidate profiles for "${query}" based on qualification, German level, and experience.`
        : `Hệ thống đã chọn lọc và xếp hạng ${topMatches.length} ứng viên phù hợp nhất với yêu cầu "${query}" theo chuyên môn, trình độ tiếng Đức và kinh nghiệm.`;

  return { matches: topMatches, summary };
}

async function resolveAutonomousCandidatePool(): Promise<z.infer<typeof candidateInputSchema>[]> {
  try {
    const { data } = await getFeaturedCandidates();
    const merged = mergeWithDmfFeaturedCandidates(data, 40);
    if (merged.length > 0) {
      return merged.slice(0, 40).map((c) => ({
        id: c.id,
        display_code: c.display_code,
        category: c.category,
        profession: c.profession,
        experience_years: c.experience_years,
        german_level: c.german_level,
        visa_status: Boolean(c.visa_status),
      }));
    }
  } catch {
    // Fallback to deterministic pool when DB is not reachable
  }
  const fallbackPool = mergeWithDmfFeaturedCandidates(null, 40);
  if (fallbackPool.length > 0) {
    return fallbackPool.slice(0, 40).map((c) => ({
      id: c.id,
      display_code: c.display_code,
      category: c.category,
      profession: c.profession,
      experience_years: c.experience_years,
      german_level: c.german_level,
      visa_status: Boolean(c.visa_status),
    }));
  }
  return DEFAULT_AUTONOMOUS_CANDIDATE_POOL;
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const explicitQuery = sp.get("query")?.trim() || "";
  const role = sp.get("role")?.trim() || "";
  const minGermanLevelRaw = sp.get("minGermanLevel")?.trim() || "";
  const minGermanLevel = /^(A1|A2|B1|B2|C1|C2)$/i.test(minGermanLevelRaw)
    ? minGermanLevelRaw.toUpperCase()
    : minGermanLevelRaw;
  const categoryRaw = sp.get("category")?.trim().toLowerCase() || "";
  const category =
    categoryRaw === "azubi" || categoryRaw === "skilled" || categoryRaw === "seasonal"
      ? categoryRaw
      : "";
  const countRaw = sp.get("count")?.trim() || "";
  const count = /^\d{1,4}$/.test(countRaw) ? countRaw : "";

  const builtQuery = [count, role, minGermanLevel, category].filter(Boolean).join(" ").trim();
  const query = explicitQuery || builtQuery || "Fachkräfte und Azubis B1/B2";

  const rawLang = sp.get("lang");
  const lang: "de" | "en" | "vn" = rawLang === "en" || rawLang === "vn" ? rawLang : "de";

  const pool = await resolveAutonomousCandidatePool();
  const result = computeDeterministicMatches(query.slice(0, 600), pool, lang);

  const inferredService =
    category ||
    (/azubi|ausbildung|lehrling|học nghề/i.test(query)
      ? "azubi"
      : /saison|seasonal|ernte|lager|thời vụ/i.test(query)
        ? "seasonal"
        : explicitQuery || role
          ? "skilled"
          : "unsure");

  const prefillParams = new URLSearchParams({ service: inferredService });
  if (count && Number(count) >= 1 && Number(count) <= 1000) {
    prefillParams.set("headcount", count);
  }
  const prefillSubject = explicitQuery || [role, minGermanLevel].filter(Boolean).join(" ").trim();
  if (prefillSubject) {
    const messageText =
      lang === "de"
        ? `Personalbedarf (${prefillSubject})${count ? ` – ${count} Position(en)` : ""}`
        : lang === "en"
          ? `Staffing request (${prefillSubject})${count ? ` – ${count} position(s)` : ""}`
          : `Yêu cầu nhân sự (${prefillSubject})${count ? ` – ${count} vị trí` : ""}`;
    prefillParams.set("message", messageText.slice(0, 600));
  }
  const prefillUrl = `${siteUrl("/fuer-arbeitgeber/personalbedarf")}?${prefillParams.toString()}`;

  return NextResponse.json({
    ...result,
    prefillUrl,
    mode: "guided",
  });
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = await checkRateLimit(`candidate-match:${clientIp}`, RATE_LIMITS.CHAT);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es gleich erneut." },
        { status: 429 }
      );
    }

    const rawBody = await request.json().catch(() => null);
    const parsed = matchRequestSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: "Ungültige Suchanfrage." }, { status: 400 });
    }

    const { query, lang = "de" } = parsed.data;
    if (Array.isArray(parsed.data.candidates) && parsed.data.candidates.length === 0) {
      return NextResponse.json({ matches: [], summary: "", mode: "guided" });
    }

    const candidates = parsed.data.candidates ?? (await resolveAutonomousCandidatePool());

    const fallback = computeDeterministicMatches(query, candidates, lang);
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json({ ...fallback, mode: "guided" });
    }

    const langInstruction =
      lang === "de"
        ? "Schreibe 'summary' und jedes 'reason' auf professionellem Deutsch (max. 1 kurzer Satz pro Kandidat)."
        : lang === "en"
          ? "Write 'summary' and each 'reason' in professional English (max 1 short sentence per candidate)."
          : "Viết 'summary' và mỗi 'reason' bằng tiếng Việt chuyên nghiệp (tối đa 1 câu ngắn cho mỗi ứng viên).";

    const systemPrompt = `Du bist der KI-Recruiting-Berater von DMF Talents (Vermittlung vietnamesischer Fachkräfte & Auszubildender nach Deutschland).
Analysiere die Suchanfrage des deutschen Arbeitgebers und bewerte die bereitgestellten Kandidatenprofile.
Wähle die besten passenden Kandidaten (maximal 6 Profile) aus, vergib einen realistischen "matchScore" (60 bis 99) und erkläre kurz den Grund.
${langInstruction}
Antworte AUSSCHLIESSLICH als valides JSON-Objekt:
{
  "summary": "...",
  "matches": [
    { "id": "...", "matchScore": 95, "reason": "..." }
  ]
}`;

    try {
      const { text, modelName } = await runWithOpenRouterFallback(
        apiKey,
        [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: JSON.stringify({
              employerQuery: query,
              candidates: candidates.map((c) => ({
                id: c.id,
                category: c.category,
                profession: c.profession,
                experience_years: c.experience_years,
                german_level: c.german_level,
                visa_status: c.visa_status,
              })),
            }),
          },
        ],
        { maxTokens: 650, temperature: 0.2, timeoutMs: 12000 }
      );

      const cleaned = text
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
      const aiParsed = JSON.parse(jsonStr);

      const byId = new Map(candidates.map((c) => [c.id, c]));
      const aiMatches: CandidateMatchItem[] = Array.isArray(aiParsed?.matches)
        ? aiParsed.matches
            .filter(
              (m: unknown): m is { id: string; matchScore?: number; reason?: string } =>
                Boolean(m) &&
                typeof (m as { id?: unknown }).id === "string" &&
                byId.has((m as { id: string }).id)
            )
            .map((m: { id: string; matchScore?: number; reason?: string }) => {
              const cand = byId.get(m.id)!;
              return {
                id: m.id,
                code: resolveCandidateCode(cand),
                profession: cand.profession,
                category: cand.category,
                german_level: cand.german_level,
                matchScore:
                  typeof m.matchScore === "number"
                    ? Math.min(99, Math.max(50, Math.round(m.matchScore)))
                    : 85,
                reason:
                  typeof m.reason === "string" && m.reason.trim()
                    ? m.reason.trim()
                    : fallback.matches.find((f) => f.id === m.id)?.reason || "",
                handoffUrl: buildCandidateHandoffUrl(cand),
              };
            })
        : [];

      if (aiMatches.length === 0) {
        return NextResponse.json({ ...fallback, mode: "guided" });
      }

      aiMatches.sort((a, b) => b.matchScore - a.matchScore);

      return NextResponse.json({
        matches: aiMatches,
        summary:
          typeof aiParsed?.summary === "string" && aiParsed.summary.trim()
            ? aiParsed.summary.trim()
            : fallback.summary,
        mode: "ai",
        model: modelName,
      });
    } catch {
      return NextResponse.json({ ...fallback, mode: "guided" });
    }
  } catch {
    return NextResponse.json({ error: "Interner Serverfehler." }, { status: 500 });
  }
}
