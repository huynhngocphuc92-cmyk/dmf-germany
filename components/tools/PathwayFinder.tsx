"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, Clock, Award, Compass, ArrowRight, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { PathwayAssessmentResult } from "@/app/api/pathway-check/route";

export function PathwayFinder() {
  const { lang } = useLanguage();
  const [age, setAge] = useState(22);
  const [education, setEducation] = useState<"highschool" | "vocational" | "university">(
    "highschool"
  );
  const [germanLevel, setGermanLevel] = useState<"none" | "A1" | "A2" | "B1" | "B2">("A1");
  const [preferredField, setPreferredField] = useState<
    "nursing" | "tech" | "hospitality" | "seasonal"
  >("nursing");
  const [experienceYears, setExperienceYears] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PathwayAssessmentResult | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/pathway-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age,
          education,
          germanLevel,
          preferredField,
          experienceYears,
          lang,
        }),
      });
      const json = await response.json();
      if (response.ok && json.data) {
        setResult(json.data);
      }
    } catch {
      // Ignore transient error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="ai-pathway-finder"
      className="py-16 md:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-slate-200/70"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {lang === "de"
                ? "KI-Potenzial- & Visum-Check (60 Sek.)"
                : lang === "en"
                  ? "AI Visa & Pathway Matcher (60 Sec)"
                  : "Trợ lý AI Định hướng Lộ trình Đức (60 Giây)"}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            {lang === "de"
              ? "Welches Programm (§ 16a Ausbildung oder § 18a/b Fachkraft) passt zum Profil?"
              : lang === "en"
                ? "Which German Pathway (§ 16a Vocational or § 18a/b Skilled) Fits Best?"
                : "Bạn phù hợp với Du học nghề (§ 16a) hay Lao động tay nghề (§ 18a/b)?"}
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            {lang === "de"
              ? "Prüfen Sie in wenigen Klicks die rechtliche Eignung, geschätzte Vorlaufzeit bis zur Einreise und Vergütungsspanne nach aktuellem Fachkräfteeinwanderungsgesetz (FEG)."
              : lang === "en"
                ? "Check legal eligibility, estimated preparation timeline to departure, and expected compensation under Germany's Skilled Immigration Act (FEG)."
                : "Chọn 4 thông tin cơ bản bên dưới — AI của DMF sẽ phân tích ngay tỷ lệ đậu hồ sơ, mức lương dự kiến tại Đức và lộ trình chuẩn bị từng bước."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <form
            onSubmit={handleAnalyze}
            className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-5"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                {lang === "de"
                  ? `1. Alter des Bewerbers: ${age} Jahre`
                  : lang === "en"
                    ? `1. Applicant Age: ${age} years`
                    : `1. Độ tuổi hiện tại: ${age} tuổi`}
              </label>
              <input
                type="range"
                min={17}
                max={45}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>17</span>
                <span>25</span>
                <span>35</span>
                <span>45</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                {lang === "de"
                  ? "2. Höchster Bildungsabschluss"
                  : lang === "en"
                    ? "2. Highest Education"
                    : "2. Bằng cấp cao nhất hiện có"}
              </label>
              <select
                value={education}
                onChange={(e) =>
                  setEducation(e.target.value as "highschool" | "vocational" | "university")
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="highschool">
                  {lang === "de"
                    ? "Oberschulabschluss (THPT / Abitur)"
                    : lang === "en"
                      ? "High School Diploma (THPT)"
                      : "Tốt nghiệp THPT (Cấp 3)"}
                </option>
                <option value="vocational">
                  {lang === "de"
                    ? "Berufsfachschule / College (Cao đẳng / Trung cấp nghề)"
                    : lang === "en"
                      ? "Vocational College Diploma (2–3 years)"
                      : "Tốt nghiệp Trung cấp / Cao đẳng nghề"}
                </option>
                <option value="university">
                  {lang === "de"
                    ? "Hochschulabschluss / Bachelor (Đại học)"
                    : lang === "en"
                      ? "University Bachelor's Degree"
                      : "Tốt nghiệp Đại học (Cử nhân / Kỹ sư)"}
                </option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  {lang === "de"
                    ? "3. Deutsch-Niveau"
                    : lang === "en"
                      ? "3. German Level"
                      : "3. Trình độ tiếng Đức"}
                </label>
                <select
                  value={germanLevel}
                  onChange={(e) =>
                    setGermanLevel(e.target.value as "none" | "A1" | "A2" | "B1" | "B2")
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="none">
                    {lang === "de"
                      ? "Noch keine"
                      : lang === "en"
                        ? "Beginner (0)"
                        : "Chưa biết (0)"}
                  </option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  {lang === "de"
                    ? "Praxiserfahrung"
                    : lang === "en"
                      ? "Work Experience"
                      : "Kinh nghiệm làm việc"}
                </label>
                <select
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={0}>
                    {lang === "de" ? "Keine" : lang === "en" ? "None" : "Chưa có"}
                  </option>
                  <option value={1}>
                    {lang === "de" ? "1 Jahr" : lang === "en" ? "1 year" : "1 năm"}
                  </option>
                  <option value={2}>
                    {lang === "de" ? "2 Jahre" : lang === "en" ? "2 years" : "2 năm"}
                  </option>
                  <option value={3}>
                    {lang === "de" ? "3+ Jahre" : lang === "en" ? "3+ years" : "Trên 3 năm"}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                {lang === "de"
                  ? "4. Gewünschter Fachbereich"
                  : lang === "en"
                    ? "4. Target Industry"
                    : "4. Ngành nghề mong muốn tại Đức"}
              </label>
              <select
                value={preferredField}
                onChange={(e) =>
                  setPreferredField(
                    e.target.value as "nursing" | "tech" | "hospitality" | "seasonal"
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="nursing">
                  {lang === "de"
                    ? "Pflege & Medizin (Klinik / Altenpflege)"
                    : lang === "en"
                      ? "Nursing & Healthcare"
                      : "Điều dưỡng & Y tế (Bệnh viện / Viện dưỡng lão)"}
                </option>
                <option value="tech">
                  {lang === "de"
                    ? "Handwerk, Industrie, CNC & IT"
                    : lang === "en"
                      ? "Engineering, CNC, Skilled Trades & IT"
                      : "Cơ khí CNC, Điện - Điện tử, Kỹ thuật & CNTT"}
                </option>
                <option value="hospitality">
                  {lang === "de"
                    ? "Hotellerie, Gastronomie & Lebensmittel"
                    : lang === "en"
                      ? "Hospitality, Culinary & Food Tech"
                      : "Nhà hàng - Khách sạn, Đầu bếp & Chế biến thực phẩm"}
                </option>
                <option value="seasonal">
                  {lang === "de"
                    ? "Saisonarbeit (Landwirtschaft & Logistik)"
                    : lang === "en"
                      ? "Seasonal Employment (Agriculture & Logistics)"
                      : "Lao động thời vụ (Nông nghiệp & Kho vận)"}
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>
                {lang === "de"
                  ? "KI-Laufbahn & Visum-Check starten"
                  : lang === "en"
                    ? "Run AI Pathway & Visa Assessment"
                    : "Phân tích Lộ trình & Tỷ lệ Visa bằng AI"}
              </span>
            </button>
          </form>

          {/* Result Column */}
          <div className="lg:col-span-7">
            {result ? (
              <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-800 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
                      <Compass className="w-4 h-4" />
                      {result.legalBasis}
                    </span>
                    <h3 className="text-2xl font-bold text-white">{result.recommendedTrack}</h3>
                  </div>
                  <div className="bg-emerald-500/15 border border-emerald-400/30 rounded-xl px-4 py-2 text-center">
                    <span className="block text-2xl font-extrabold text-emerald-400">
                      {result.eligibilityScore}%
                    </span>
                    <span className="text-[11px] text-emerald-200 uppercase tracking-wide">
                      {lang === "de"
                        ? "Eignungs-Score"
                        : lang === "en"
                          ? "Eligibility Fit"
                          : "Mức độ phù hợp"}
                    </span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>
                        {lang === "de"
                          ? "Geschätzte Dauer bis Einreise"
                          : lang === "en"
                            ? "Estimated Time to Departure"
                            : "Thời gian chuẩn bị dự kiến"}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-white">
                      ~ {result.estimatedMonthsToDeparture}{" "}
                      {lang === "de" ? "Monate" : lang === "en" ? "months" : "tháng"}
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span>
                        {lang === "de"
                          ? "Erwartete Vergütung in Deutschland"
                          : lang === "en"
                            ? "Expected Compensation in Germany"
                            : "Mức thu nhập dự kiến tại Đức"}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white">{result.salaryRange}</p>
                  </div>
                </div>

                {/* Advisor Summary */}
                <div className="bg-blue-950/60 border border-blue-800/50 rounded-xl p-4 text-sm text-blue-100 leading-relaxed">
                  {result.advisorSummary}
                </div>

                {/* 3-Step Roadmap */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {lang === "de"
                      ? "Empfohlener 3-Schritte-Fahrplan"
                      : lang === "en"
                        ? "Recommended 3-Step Roadmap"
                        : "Lộ trình 3 bước dành riêng cho bạn"}
                  </h4>
                  <ul className="space-y-2.5">
                    {result.roadmapSteps.map((step, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-slate-200 bg-white/5 rounded-xl p-3"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm px-5 py-3 transition-colors"
                  >
                    <span>
                      {lang === "de"
                        ? "Persönliche Beratung zu diesem Fahrplan anfordern"
                        : lang === "en"
                          ? "Request Free Consultation for This Pathway"
                          : "Đăng ký tư vấn chi tiết lộ trình này"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[380px] rounded-2xl border-2 border-dashed border-slate-200 bg-white/70 p-8 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Compass className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {lang === "de"
                    ? "Bereit für Ihre individuelle KI-Auswertung"
                    : lang === "en"
                      ? "Ready for Your Personalized AI Pathway Report"
                      : "Sẵn sàng phân tích lộ trình sang Đức của bạn"}
                </h3>
                <p className="text-sm text-slate-500 max-w-md leading-relaxed">
                  {lang === "de"
                    ? "Wählen Sie links Alter, Abschluss, Sprachniveau und Wunschbranche aus und klicken Sie auf „KI-Laufbahn & Visum-Check starten“."
                    : lang === "en"
                      ? "Select age, education, German level, and preferred industry on the left, then click 'Run AI Pathway & Visa Assessment'."
                      : "Hãy chọn Độ tuổi, Bằng cấp, Trình độ tiếng Đức và Ngành nghề bên trái rồi bấm nút phân tích để xem ngay kết quả từ chuyên gia AI."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
