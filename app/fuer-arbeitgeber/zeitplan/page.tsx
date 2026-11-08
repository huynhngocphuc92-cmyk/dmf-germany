"use client";
import Image from "next/image";
import Link from "next/link";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { AeoSnippetSection } from "@/components/seo/AeoSnippetSection";
import FAQSection from "@/components/shared/FAQSection";
import { TimelineSimulator } from "@/components/tools/TimelineSimulator";
import { ZEITPLAN_AEO_CONFIG, buildTimelinePageSchemas } from "@/lib/seo/aeo-schemas";
import { ArrowRight, Calendar, CheckCircle2, Clock } from "lucide-react";

export default function ZeitplanPage() {
  const { t, lang } = useLanguage();
  const timelineSchemas = buildTimelinePageSchemas();

  const milestoneVisuals = [
    {
      step: "01",
      src: "/images/community/dmf-community-faculty-thay-loc-grammar.jpg",
      title:
        lang === "vn"
          ? "1. Đào tạo Tiếng Đức Chuyên sâu (A1–B2)"
          : lang === "en"
            ? "1. Intensive German Training (A1–B2)"
            : "1. Vollzeit-Sprachausbildung (A1–B2)",
      desc:
        lang === "vn"
          ? "Học tập trung toàn thời gian cùng đội ngũ giảng viên cơ hữu tại Học viện DMF Biên Hòa."
          : lang === "en"
            ? "Full-time classroom instruction with dedicated faculty at the DMF Academy in Vietnam."
            : "Strukturierter Vollzeit-Unterricht mit Fokus auf Grammatik, Fachsprache und Sprechpraxis.",
    },
    {
      step: "02",
      src: "/images/community/dmf-community-cohort-k32-written-exam.jpg",
      title:
        lang === "vn"
          ? "2. Kiểm tra Chất lượng Định kỳ (Khóa K32)"
          : lang === "en"
            ? "2. Weekly Quality Assessments (Cohort K32)"
            : "2. Verbindliche Lernzielkontrollen (Kohorte K32)",
      desc:
        lang === "vn"
          ? "Sát hạch viết và nói hàng tuần nhằm đảm bảo tiến độ thi đỗ chứng chỉ Goethe / telc đúng hạn."
          : lang === "en"
            ? "Weekly written and oral exams ensuring timely Goethe / telc certification."
            : "Regelmäßige schriftliche und mündliche Prüfungen sichern den planmäßigen Zertifikatsabschluss.",
    },
    {
      step: "03",
      src: "/images/community/dmf-community-achim-interview-panel.jpg",
      title:
        lang === "vn"
          ? "3. Phỏng vấn Thực chiến cùng Chuyên gia Đức"
          : lang === "en"
            ? "3. German Expert Interview Simulation"
            : "3. Interview-Simulation mit Achim Betticher",
      desc:
        lang === "vn"
          ? "Ông Achim Betticher và chuyên gia Đức trực tiếp rèn luyện kỹ năng phỏng vấn và văn hóa doanh nghiệp."
          : lang === "en"
            ? "Mr. Achim Betticher and German experts coach candidates on workplace expectations."
            : "Praxisnahes Bewerbungstraining nach deutschen Arbeitgeberstandards direkt am DMF-Campus.",
    },
    {
      step: "04",
      src: "/images/community/dmf-community-german-translated-transcript.jpg",
      title:
        lang === "vn"
          ? "4. Dịch thuật Công chứng & Thẩm định Văn bằng"
          : lang === "en"
            ? "4. Certified Translation & Recognition Dossier"
            : "4. Beglaubigtes Dossier (IHK / HWK / ZAB)",
      desc:
        lang === "vn"
          ? "Hoàn thiện hồ sơ học bạ, bằng cấp dịch thuật tiếng Đức chuẩn hóa để nộp Sở Ngoại kiều và IHK/HWK."
          : lang === "en"
            ? "Complete German-translated academic and vocational dossiers ready for IHK, HWK, and ZAB."
            : "Lückenlos übersetzte und beglaubigte Zeugnisakten für Ausländerbehörden und Kammern.",
    },
    {
      step: "05",
      src: "/images/community/dmf-community-visum-d-zusatzblatt.jpg",
      title:
        lang === "vn"
          ? "5. Cấp Thị thực Quốc gia D & Zusatzblatt"
          : lang === "en"
            ? "5. National D-Visa & Zusatzblatt Issuance"
            : "5. Erteilung des Nationalen D-Visums",
      desc:
        lang === "vn"
          ? "Nhận thị thực lao động / đào tạo nghề chính thức từ Tổng Lãnh sự quán Đức (§ 16a / § 18a / § 81a)."
          : lang === "en"
            ? "Official German National D-Visa with work permit supplement issued by the German Consulate."
            : "Originales Visum (Kategorie D) inklusive offiziellem Zusatzblatt für den sofortigen Start.",
    },
    {
      step: "06",
      src: "/images/community/dmf-community-airport-briefing-duy.jpg",
      title:
        lang === "vn"
          ? "6. Hướng dẫn Xuất cảnh & Đón tiếp tại Đức"
          : lang === "en"
            ? "6. Airport Briefing & Arrival in Germany"
            : "6. Flughafen-Briefing & Einreise nach DE",
      desc:
        lang === "vn"
          ? "Kiểm tra hồ sơ lần cuối tại sân bay quốc tế và bàn giao trực tiếp cho đội ngũ DMF tại CHLB Đức."
          : lang === "en"
            ? "Final document check at the airport and seamless handover to our on-site team in Germany."
            : "Persönliche Ausreisebegleitung am Flughafen und nahtlose Übergabe an unser Team in Deutschland.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground pt-28 md:pt-40 pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Calendar className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t.timeline?.page_title || "Ihr Weg zur Fachkraft"}
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              {t.timeline?.page_subtitle ||
                "Planungssicherheit ist uns wichtig. Simulieren Sie hier den zeitlichen Ablauf von der Vertragsunterzeichnung bis zur Ankunft Ihrer Fachkraft in Deutschland."}
            </p>
          </div>
        </div>
      </section>

      {/* AEO Direct Answer, HowTo JSON-LD & Statutory § 81a Deadline Table */}
      <AeoSnippetSection
        config={ZEITPLAN_AEO_CONFIG}
        schemas={timelineSchemas}
        accentColor="primary"
      />

      {/* Timeline Simulator Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <TimelineSimulator />
          </div>
        </div>
      </section>

      {/* 6-Stage Documentary Visual Milestones Section */}
      <section className="py-12 md:py-16 bg-slate-50 border-y border-slate-200/80">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              {lang === "vn"
                ? "6 Cột mốc Thực thi Thực tế (Từ Học viện DMF đến CHLB Đức)"
                : lang === "en"
                  ? "6 Real-World Execution Milestones (From DMF Academy to Germany)"
                  : "Der DMF-Prozess in echten Bildern: 6 Meilensteine bis zur Einreise"}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
              {lang === "vn"
                ? "Hình ảnh thực tế ghi lại toàn bộ chuỗi quy trình chuẩn bị ngôn ngữ, sát hạch phỏng vấn, hoàn thiện hồ sơ pháp lý và xuất cảnh của học viên DMF Talents."
                : lang === "en"
                  ? "Authentic documentary photography from our academy and visa operations illustrating each milestone of your recruitment timeline."
                  : "Authentische Foto-Dokumentation aus unserer Akademie und Rechtsabteilung zu jedem Schritt Ihres Rekrutierungszeitplans."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {milestoneVisuals.map((item) => (
              <figure
                key={item.step}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 flex flex-col"
              >
                <div className="relative aspect-[16/10] w-full bg-slate-100">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 360px"
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/85 text-white text-xs font-bold backdrop-blur-xs">
                    Meilenstein {item.step}
                  </span>
                </div>
                <figcaption className="p-5 flex-1">
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">{item.title}</h3>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Process Benefits Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              {t.timeline?.benefits_title || "Warum DMF für Ihre Planung?"}
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              {t.timeline?.benefits_subtitle || "Transparenz und Zuverlässigkeit in jedem Schritt"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t.timeline?.benefit_transparency || "Transparente Zeitschätzung"}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t.timeline?.benefit_transparency_desc ||
                    "Wir informieren Sie kontinuierlich über den Fortschritt und halten Sie über jeden Meilenstein auf dem Laufenden."}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t.timeline?.benefit_reliability || "Zuverlässige Prozesse"}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t.timeline?.benefit_reliability_desc ||
                    "Durch jahrelange Erfahrung können wir präzise Zeitschätzungen geben und halten uns an vereinbarte Fristen."}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t.timeline?.benefit_flexibility || "Flexible Anpassung"}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t.timeline?.benefit_flexibility_desc ||
                    "Mit dem beschleunigten Fachkräfteverfahren können wir den Prozess verkürzen, wenn Zeit wichtig ist."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.timeline?.cta_title || "Bereit, den Prozess zu starten?"}
            </h2>
            <p className="text-lg opacity-90 mb-8">
              {t.timeline?.cta_subtitle ||
                "Kontaktieren Sie uns für eine individuelle Beratung und erhalten Sie einen maßgeschneiderten Zeitplan für Ihr Projekt."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                {t.timeline?.cta_contact || "Jetzt kontaktieren"}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/roi-rechner"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                {t.timeline?.cta_costs || "Kosten berechnen"}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AEO FAQ Section with FAQPage JSON-LD */}
      <FAQSection
        items={ZEITPLAN_AEO_CONFIG.faqs}
        theme="blue"
        pagePath="/fuer-arbeitgeber/zeitplan"
      />
    </div>
  );
}
