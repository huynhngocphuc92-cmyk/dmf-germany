import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { runWithOpenRouterFallback } from "@/lib/ai/openrouter";

const roiBriefSchema = z.object({
  productType: z.enum(["fachkraefte", "azubi", "saisonkraefte"]),
  industry: z.string().nullish(),
  germanSalary: z.number().positive(),
  dmfSalary: z.number().positive(),
  recruitmentFee: z.number().nonnegative(),
  contractDuration: z.number().int().min(1).max(10),
  savings: z.number(),
  savingsPercentage: z.string(),
  lang: z.enum(["de", "en", "vn"]).optional(),
});

function buildDeterministicBrief(data: z.infer<typeof roiBriefSchema>): {
  headline: string;
  bullets: string[];
  recommendation: string;
} {
  const {
    productType,
    germanSalary,
    dmfSalary,
    recruitmentFee,
    contractDuration,
    savings,
    savingsPercentage,
    lang = "de",
  } = data;

  const monthlyDiff = Math.max(1, germanSalary - dmfSalary);
  const breakEvenMonths = Math.max(1, Math.ceil(recruitmentFee / monthlyDiff));
  const formattedSavings = new Intl.NumberFormat("de-DE").format(Math.max(0, savings));

  const legalNoteDe =
    productType === "azubi"
      ? "Visumverfahren nach § 16a AufenthG (Vorlaufzeit ca. 4–6 Monate bis Ausbildungsbeginn)."
      : productType === "saisonkraefte"
        ? "Saisonbeschäftigung mit planbarer Einsatzdauer und schneller Einarbeitung."
        : "Beschleunigtes Fachkräfteverfahren nach § 81a / § 18a/b AufenthG (ca. 3–5 Monate bis Einreise).";

  if (lang === "en") {
    return {
      headline: `Executive ROI Brief: €${formattedSavings} net advantage over ${contractDuration} ${contractDuration === 1 ? "year" : "years"} (${savingsPercentage}%)`,
      bullets: [
        `Amortization (Break-Even): The one-time placement fee of €${recruitmentFee.toLocaleString("de-DE")} amortizes within approx. ${breakEvenMonths} ${breakEvenMonths === 1 ? "month" : "months"} of employment.`,
        `Planning Security & Retention: Direct preparation at DMF Vietnam Academy (German language + trade terminology) ensures high loyalty and low turnover over the ${contractDuration}-year horizon.`,
        `Legal & Timeline Framework: ${productType === "azubi" ? "§ 16a AufenthG vocational visa track (approx. 4–6 months lead time)." : "§ 18a/b & § 81a AufenthG fast-track skilled visa procedure (approx. 3–5 months lead time)."}`,
      ],
      recommendation:
        "Recommended next step: Request 2–3 pre-vetted candidate dossiers to lock in the upcoming intake cohort.",
    };
  }

  if (lang === "vn") {
    return {
      headline: `Báo cáo Tối ưu Chi phí (CFO Brief): Tiết kiệm ${formattedSavings} € trong ${contractDuration} năm (${savingsPercentage}%)`,
      bullets: [
        `Điểm hoàn vốn (Break-Even): Phí dịch vụ tuyển dụng một lần (${recruitmentFee.toLocaleString("de-DE")} €) được hoàn vốn chỉ sau khoảng ${breakEvenMonths} tháng làm việc.`,
        `Độ gắn bó & Ổn định nhân sự: Ứng viên được đào tạo bài bản tiếng Đức và văn hóa doanh nghiệp tại DMF Vietnam Academy, giảm thiểu tỷ lệ nghỉ việc trong suốt ${contractDuration} năm.`,
        `Khung pháp lý & Tiến độ Visa: ${productType === "azubi" ? "Quy trình Visa học nghề § 16a AufenthG (thời gian chuẩn bị khoảng 4–6 tháng)." : "Thủ tục Visa lao động có tay nghề § 18a/b & § 81a AufenthG rút gọn (khoảng 3–5 tháng)."}`,
      ],
      recommendation:
        "Khuyến nghị: Yêu cầu danh sách 2–3 hồ sơ ứng viên mẫu để giữ chỗ cho đợt nhập cảnh gần nhất.",
    };
  }

  return {
    headline: `Management-Kurzanalyse: ${formattedSavings} € Kostenvorteil über ${contractDuration} ${contractDuration === 1 ? "Jahr" : "Jahre"} (${savingsPercentage} %)`,
    bullets: [
      `Amortisation (Break-Even): Die einmalige Vermittlungsgebühr von ${recruitmentFee.toLocaleString("de-DE")} € amortisiert sich rechnerisch bereits nach ca. ${breakEvenMonths} ${breakEvenMonths === 1 ? "Monat" : "Monaten"}.`,
      `Planungssicherheit & Bindung: Durch die sprachliche und fachliche Vorbereitung an der DMF Vietnam Academy sinkt das Fluktuationsrisiko über die ${contractDuration}-jährige Laufzeit deutlich.`,
      `Rechtsrahmen & Zeitplan: ${legalNoteDe}`,
    ],
    recommendation:
      "Empfehlung für Geschäftsführung & HR: Fordern Sie unverbindlich 2–3 passende Bewerberdossiers an, um den Starttermin frühzeitig abzusichern.",
  };
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = await checkRateLimit(`roi-brief:${clientIp}`, RATE_LIMITS.CHAT);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es gleich erneut." },
        { status: 429 }
      );
    }

    const rawBody = await request.json().catch(() => null);
    const parsed = roiBriefSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: "Ungültige Kalkulationsparameter." }, { status: 400 });
    }

    const fallback = buildDeterministicBrief(parsed.data);
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json({ data: fallback, mode: "guided" });
    }

    const lang = parsed.data.lang || "de";
    const systemPrompt = `Du bist ein Senior-HR- & CFO-Berater für den deutschen Mittelstand bei DMF Talents.
Erstelle eine präzise, überzeugende Management-Kurzanalyse (Executive Brief) auf Basis der übergebenen ROI-Kalkulationsdaten für die Rekrutierung aus Vietnam.
Sprache: ${lang === "de" ? "Deutsch (sachlich, geschäftsführertauglich)" : lang === "en" ? "English (executive tone)" : "Tiếng Việt (chuyên nghiệp, dành cho Ban Giám đốc)"}.
Antworte AUSSCHLIESSLICH als valides JSON-Objekt:
{
  "headline": "...",
  "bullets": ["Punkt 1 (Amortisation/Break-Even)", "Punkt 2 (Qualität & Mitarbeiterbindung)", "Punkt 3 (Rechtsrahmen FEG §16a/§18a & Vorlaufzeit)"],
  "recommendation": "Kurze Handlungsempfehlung (1 Satz)"
}`;

    try {
      const { text } = await runWithOpenRouterFallback(
        apiKey,
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify(parsed.data) },
        ],
        { maxTokens: 500, temperature: 0.3, timeoutMs: 12000 }
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
          headline:
            typeof aiObj?.headline === "string" && aiObj.headline.trim()
              ? aiObj.headline.trim()
              : fallback.headline,
          bullets:
            Array.isArray(aiObj?.bullets) && aiObj.bullets.length >= 2
              ? aiObj.bullets.map((b: unknown) => String(b))
              : fallback.bullets,
          recommendation:
            typeof aiObj?.recommendation === "string" && aiObj.recommendation.trim()
              ? aiObj.recommendation.trim()
              : fallback.recommendation,
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
