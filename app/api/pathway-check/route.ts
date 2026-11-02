import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { runWithOpenRouterFallback } from "@/lib/ai/openrouter";

const pathwayCheckSchema = z.object({
  age: z.number().int().min(16).max(55),
  education: z.enum(["highschool", "vocational", "university"]),
  germanLevel: z.enum(["none", "A1", "A2", "B1", "B2"]),
  preferredField: z.enum(["nursing", "tech", "hospitality", "seasonal"]),
  experienceYears: z.number().int().min(0).max(30).default(0),
  lang: z.enum(["de", "en", "vn"]).optional(),
});

export interface PathwayAssessmentResult {
  recommendedTrack: string;
  legalBasis: string;
  eligibilityScore: number;
  estimatedMonthsToDeparture: number;
  salaryRange: string;
  roadmapSteps: string[];
  advisorSummary: string;
}

function buildDeterministicPathway(
  input: z.infer<typeof pathwayCheckSchema>
): PathwayAssessmentResult {
  const { age, education, germanLevel, preferredField, experienceYears, lang = "vn" } = input;

  const isSkilledEligible =
    (education === "vocational" || education === "university") &&
    preferredField !== "seasonal" &&
    age <= 45;
  const isAzubiEligible = age >= 18 && age <= 32 && preferredField !== "seasonal";

  const languageMonthsMap: Record<typeof germanLevel, number> = {
    none: 9,
    A1: 7,
    A2: 5,
    B1: 3,
    B2: 1,
  };
  const estimatedMonthsToDeparture = languageMonthsMap[germanLevel] + 3;

  let eligibilityScore = 82;
  if (germanLevel === "B1" || germanLevel === "B2") eligibilityScore += 10;
  if (experienceYears >= 1) eligibilityScore += 4;
  if (age >= 18 && age <= 30) eligibilityScore += 3;
  if (age > 35 && !isSkilledEligible) eligibilityScore -= 12;
  eligibilityScore = Math.min(98, Math.max(62, eligibilityScore));

  if (lang === "de") {
    const track = isSkilledEligible
      ? "Qualifizierte Fachkraft (Anerkennung)"
      : isAzubiEligible
        ? "Duale Berufsausbildung (Azubi)"
        : "Saisonbeschäftigung / Einstiegsprogramm";
    const legalBasis = isSkilledEligible
      ? "§ 18a / § 18b AufenthG (FEG)"
      : isAzubiEligible
        ? "§ 16a AufenthG"
        : "§ 15a BeschV";
    const salaryRange = isSkilledEligible
      ? "2.800 € – 3.900 € Brutto/Monat"
      : isAzubiEligible
        ? "1.050 € – 1.400 € Ausbildungsvergütung/Monat"
        : "1.900 € – 2.300 € Brutto/Monat";

    return {
      recommendedTrack: track,
      legalBasis,
      eligibilityScore,
      estimatedMonthsToDeparture,
      salaryRange,
      roadmapSteps: [
        germanLevel === "B2"
          ? "Direkter Dossier-Check (DIN 5008 Lebenslauf & Zeugnisübersetzung)"
          : `Intensiv-Deutschkurs an der DMF Vietnam Academy bis B1/B2 (ca. ${languageMonthsMap[germanLevel]} Monate)`,
        "Fachliches Vorbereitungstraining & Online-Vorstellungsgespräch mit deutschem Arbeitgeber",
        `Visumverfahren (${legalBasis}) & betreute Einreise nach Deutschland`,
      ],
      advisorSummary: `Auf Basis Ihres Profils (${age} Jahre, Deutsch ${germanLevel === "none" ? "Anfänger" : germanLevel}) eignet sich der Weg „${track}“ (${legalBasis}) optimal. Die geschätzte Vorbereitungszeit bis zur Ausreise beträgt ca. ${estimatedMonthsToDeparture} Monate.`,
    };
  }

  if (lang === "en") {
    const track = isSkilledEligible
      ? "Skilled Professional Track (Fachkraft)"
      : isAzubiEligible
        ? "Dual Vocational Training (Ausbildung)"
        : "Seasonal / Fast-Entry Programme";
    const legalBasis = isSkilledEligible
      ? "§ 18a / § 18b AufenthG (FEG)"
      : isAzubiEligible
        ? "§ 16a AufenthG"
        : "§ 15a BeschV";
    const salaryRange = isSkilledEligible
      ? "€2,800 – €3,900 gross/month"
      : isAzubiEligible
        ? "€1,050 – €1,400 training stipend/month"
        : "€1,900 – €2,300 gross/month";

    return {
      recommendedTrack: track,
      legalBasis,
      eligibilityScore,
      estimatedMonthsToDeparture,
      salaryRange,
      roadmapSteps: [
        germanLevel === "B2"
          ? "Immediate DIN 5008 dossier standardization & credential check"
          : `Intensive German training at DMF Vietnam Academy to B1/B2 (approx. ${languageMonthsMap[germanLevel]} months)`,
        "Vocational interview preparation & direct matching with a German employer",
        `Fast-track visa application (${legalBasis}) & pre-departure integration`,
      ],
      advisorSummary: `Based on your profile (${age} years old, German: ${germanLevel === "none" ? "Beginner" : germanLevel}), the "${track}" (${legalBasis}) is your strongest pathway. Expected timeline to departure is approx. ${estimatedMonthsToDeparture} months.`,
    };
  }

  const trackVn = isSkilledEligible
    ? "Lao động có tay nghề / Chuyên gia (Fachkräfte)"
    : isAzubiEligible
      ? "Du học nghề kép hưởng lương tại Đức (Ausbildung)"
      : "Chương trình Lao động Thời vụ / Chuyển đổi";
  const legalBasisVn = isSkilledEligible
    ? "§ 18a / § 18b AufenthG (Luật Nhập cư FEG)"
    : isAzubiEligible
      ? "§ 16a AufenthG"
      : "§ 15a BeschV";
  const salaryRangeVn = isSkilledEligible
    ? "2.800 € – 3.900 € Brutto/tháng (~75 – 105 triệu VNĐ)"
    : isAzubiEligible
      ? "1.050 € – 1.400 €/tháng trợ cấp học nghề (miễn 100% học phí)"
      : "1.900 € – 2.300 € Brutto/tháng";

  return {
    recommendedTrack: trackVn,
    legalBasis: legalBasisVn,
    eligibilityScore,
    estimatedMonthsToDeparture,
    salaryRange: salaryRangeVn,
    roadmapSteps: [
      germanLevel === "B2"
        ? "Hoàn thiện ngay bộ hồ sơ chuẩn Đức (Lebenslauf DIN 5008 & dịch thuật bằng cấp)"
        : `Học tiếng Đức tăng tốc tại DMF Vietnam Academy lên trình độ B1/B2 (khoảng ${languageMonthsMap[germanLevel]} tháng)`,
      "Luyện phỏng vấn chuyên ngành (Vorstellungsgespräch) & ký hợp đồng trực tiếp với doanh nghiệp Đức",
      `Xin Visa theo diện ${legalBasisVn} (khoảng 6–10 tuần) & xuất cảnh sang Đức`,
    ],
    advisorSummary: `Với độ tuổi ${age}, trình độ tiếng Đức hiện tại (${germanLevel === "none" ? "Mới bắt đầu" : germanLevel}) và định hướng ngành ${preferredField === "nursing" ? "Điều dưỡng - Y tế" : preferredField === "tech" ? "Kỹ thuật - Cơ khí - CNTT" : preferredField === "hospitality" ? "Nhà hàng - Khách sạn" : "Nông nghiệp / Thời vụ"}, lộ trình tối ưu nhất cho bạn là **${trackVn}** (${legalBasisVn}). Tổng thời gian dự kiến từ lúc chuẩn bị đến khi bay sang Đức là khoảng ${estimatedMonthsToDeparture} tháng.`,
  };
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = await checkRateLimit(`pathway-check:${clientIp}`, RATE_LIMITS.CHAT);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es gleich erneut." },
        { status: 429 }
      );
    }

    const rawBody = await request.json().catch(() => null);
    const parsed = pathwayCheckSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: "Ungültige Eingabedaten." }, { status: 400 });
    }

    const fallback = buildDeterministicPathway(parsed.data);
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json({ data: fallback, mode: "guided" });
    }

    const lang = parsed.data.lang || "vn";
    const systemPrompt =
      lang === "vn"
        ? `Bạn là chuyên viên tư vấn định hướng lộ trình du học nghề (§ 16a AufenthG) và lao động có tay nghề (§ 18a/b AufenthG) tại Đức của DMF Vietnam Academy.
Hãy phân tích hồ sơ của ứng viên và trả lời HOÀN TOÀN BẰNG TIẾNG VIỆT tự nhiên, thân thiện (xưng "mình" - gọi "bạn").
Trả về DUY NHẤT một JSON object hợp lệ:
{
  "recommendedTrack": "Tên chương trình bằng tiếng Việt (VD: Du học nghề kép hưởng lương tại Đức - Ausbildung)",
  "legalBasis": "§ 16a AufenthG hoặc § 18a/b AufenthG",
  "eligibilityScore": 90,
  "estimatedMonthsToDeparture": 8,
  "salaryRange": "Mức thu nhập/trợ cấp bằng tiếng Việt (VD: 1.050 € – 1.400 €/tháng trợ cấp học nghề)",
  "roadmapSteps": ["Bước 1 bằng tiếng Việt", "Bước 2 bằng tiếng Việt", "Bước 3 bằng tiếng Việt"],
  "advisorSummary": "2-3 câu nhận xét và khích lệ cá nhân hóa bằng tiếng Việt"
}`
        : lang === "en"
          ? `You are a Senior Career & Visa Advisor at DMF Vietnam Academy (specialist in Germany's Skilled Immigration Act FEG §16a vocational training and §18a/b skilled workers).
Analyze the applicant profile and respond ENTIRELY IN ENGLISH.
Return ONLY a valid JSON object:
{
  "recommendedTrack": "...",
  "legalBasis": "§ 16a AufenthG or § 18a/b AufenthG",
  "eligibilityScore": 90,
  "estimatedMonthsToDeparture": 8,
  "salaryRange": "...",
  "roadmapSteps": ["Step 1", "Step 2", "Step 3"],
  "advisorSummary": "2-3 sentences of personalized assessment in English"
}`
          : `Du bist ein erfahrener Studien- und Karriereberater der DMF Vietnam Academy (Spezialist für das deutsche Fachkräfteeinwanderungsgesetz FEG §16a Ausbildung und §18a/b Fachkräfte).
Analysiere das Profil des Bewerbers und gib eine ehrliche, motivierende Einschätzung auf DEUTSCH.
Antworte AUSSCHLIESSLICH als valides JSON-Objekt:
{
  "recommendedTrack": "...",
  "legalBasis": "§ 16a AufenthG oder § 18a/b AufenthG",
  "eligibilityScore": 90,
  "estimatedMonthsToDeparture": 8,
  "salaryRange": "...",
  "roadmapSteps": ["Schritt 1", "Schritt 2", "Schritt 3"],
  "advisorSummary": "2-3 Sätze persönliche Einschätzung auf Deutsch"
}`;

    try {
      const { text } = await runWithOpenRouterFallback(
        apiKey,
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify(parsed.data) },
        ],
        { maxTokens: 550, temperature: 0.3, timeoutMs: 12000 }
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
      const aiObj = JSON.parse(jsonStr);

      return NextResponse.json({
        data: {
          recommendedTrack:
            typeof aiObj?.recommendedTrack === "string" && aiObj.recommendedTrack.trim()
              ? aiObj.recommendedTrack.trim()
              : fallback.recommendedTrack,
          legalBasis:
            typeof aiObj?.legalBasis === "string" && aiObj.legalBasis.trim()
              ? aiObj.legalBasis.trim()
              : fallback.legalBasis,
          eligibilityScore:
            typeof aiObj?.eligibilityScore === "number"
              ? Math.min(99, Math.max(55, Math.round(aiObj.eligibilityScore)))
              : fallback.eligibilityScore,
          estimatedMonthsToDeparture:
            typeof aiObj?.estimatedMonthsToDeparture === "number"
              ? Math.min(24, Math.max(2, Math.round(aiObj.estimatedMonthsToDeparture)))
              : fallback.estimatedMonthsToDeparture,
          salaryRange:
            typeof aiObj?.salaryRange === "string" && aiObj.salaryRange.trim()
              ? aiObj.salaryRange.trim()
              : fallback.salaryRange,
          roadmapSteps:
            Array.isArray(aiObj?.roadmapSteps) && aiObj.roadmapSteps.length >= 2
              ? aiObj.roadmapSteps.map((s: unknown) => String(s))
              : fallback.roadmapSteps,
          advisorSummary:
            typeof aiObj?.advisorSummary === "string" && aiObj.advisorSummary.trim()
              ? aiObj.advisorSummary.trim()
              : fallback.advisorSummary,
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
