"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { HOMEPAGE_GEO_FAQS, buildHomepageFaqSchema } from "@/lib/seo/geo-schemas";

const SECTION_COPY = {
  de: {
    badge: "Rechtsrahmen, Fakten & Häufige Arbeitgeberfragen (FEG / AufenthG)",
    title: "Fachkräfte & Auszubildende aus Vietnam: Rechtliche Grundlagen & Praxiswissen",
    subtitle:
      "Kompakte Entscheidungsgrundlage für Geschäftsführer, Personalleiter und Pflegedienstleitungen zur rechtssicheren Gewinnung von Fachkräften (§ 18a/b AufenthG) und Auszubildenden (§ 16a AufenthG).",
    matrixTitle: "Übersicht der gesetzlichen Rekrutierungswege nach Deutschland",
    pathways: [
      {
        code: "§ 18a / § 18b AufenthG",
        name: "Qualifizierte Fachkräfte mit Berufs- oder Hochschulabschluss",
        detail:
          "Direkteinstieg für Bewerber mit staatlich anerkanntem vietnamesischem Berufsabschluss (Kolleg/Polytechnikum) oder Universitätsdiplom nach Gleichwertigkeitsprüfung (BQFG, IHK FOSA, HWK, Landesamt für Pflege, ZAB). Typische Branchen: Pflege & Klinken, SHK- und Elektrohandwerk, CNC-Zerspanung, Anlagenbau sowie IT & Engineering.",
        link: "/services/skilled-workers",
        linkLabel: "Fachkräfte-Programm im Detail",
      },
      {
        code: "§ 16a AufenthG",
        name: "Duale Berufsausbildung (Azubis aus Vietnam)",
        detail:
          "Rekrutierung leistungsstarker Schulabgänger und junger Erwachsener mit zertifiziertem Deutsch-Niveau B1/B2 (Goethe, telc, ÖSD) sowie fachsprachlicher und interkultureller Vorbereitung für 2,5- bis 3,5-jährige IHK-, HWK- oder Pflege-Ausbildungsgänge.",
        link: "/services/azubi",
        linkLabel: "Ausbildungsprogramm im Detail",
      },
      {
        code: "§ 16d AufenthG",
        name: "Anerkennungspartnerschaft & Anpassungsqualifizierung",
        detail:
          "Praxisnahe Beschleunigung nach dem reformierten Fachkräfteeinwanderungsgesetz: Kandidaten mit mehrjähriger Berufsausbildung reisen bereits vor Abschluss der vollen Gleichwertigkeit ein, arbeiten produktiv im deutschen Betrieb mit und absolvieren fehlende Qualifikationsmodule berufsbegleitend.",
        link: "/fuer-arbeitgeber/branchen",
        linkLabel: "Branchenlösungen & Anerkennungspfade",
      },
      {
        code: "§ 81a AufenthG",
        name: "Beschleunigtes Fachkräfteverfahren über die Ausländerbehörde",
        detail:
          "Verbindliche Verkürzung der behördlichen Bearbeitungszeiten durch Vereinbarung zwischen Arbeitgeber (bzw. DMF Talents in Vollmacht) und der zuständigen Ausländerbehörde: Anerkennungsprüfung in maximal 2 Monaten, ZAV-Zustimmung in 1 Woche und Visumtermin in 3 Wochen.",
        link: "/fuer-arbeitgeber/zeitplan",
        linkLabel: "Zeitplan-Simulator öffnen",
      },
    ],
    faqHeading: "Häufig gestellte Fragen deutscher Arbeitgeber (B2B-FAQ)",
    resourcesTitle: "Weiterführende Arbeitgeber-Ressourcen & Transparenz",
    resources: [
      { href: "/fuer-arbeitgeber/personalbedarf", label: "Personalbedarf melden (B2B-Anfrage)" },
      { href: "/fuer-arbeitgeber/kandidaten", label: "Aktueller Kandidatenpool" },
      { href: "/roi-rechner", label: "ROI- & Gehaltsrechner" },
      { href: "/fuer-arbeitgeber/branchen", label: "Branchen-Kompetenzfelder" },
      { href: "/blog", label: "Fachbeiträge & Leitfäden" },
      { href: "/impressum", label: "Impressum (§ 5 DDG)" },
      { href: "/datenschutz", label: "Datenschutz & DSGVO (Privacy Policy)" },
    ],
  },
  en: {
    badge: "Legal Framework, Key Facts & Employer FAQ (FEG / AufenthG)",
    title: "Skilled Workers & Apprentices from Vietnam: Legal Pathways & B2B Reference Guide",
    subtitle:
      "Structured decision guide for German managing directors, HR leaders, and healthcare executives on compliant international recruitment under § 18a/b and § 16a AufenthG.",
    matrixTitle: "Overview of Statutory Immigration Pathways to Germany",
    pathways: [
      {
        code: "§ 18a / § 18b AufenthG",
        name: "Qualified Skilled Workers with Vocational or Academic Degrees",
        detail:
          "Direct employment for candidates holding recognized Vietnamese vocational diplomas or university degrees verified via BQFG, IHK FOSA, HWK, State Nursing Boards, or ZAB across healthcare, skilled trades, CNC manufacturing, and engineering.",
        link: "/services/skilled-workers",
        linkLabel: "Explore Skilled Workers Program",
      },
      {
        code: "§ 16a AufenthG",
        name: "Dual Vocational Training (Apprentices from Vietnam)",
        detail:
          "Recruitment of motivated high-school graduates with certified B1/B2 German proficiency (Goethe, telc, ÖSD) and sector-specific training for 3-year dual apprenticeships under IHK, HWK, and nursing standards.",
        link: "/services/azubi",
        linkLabel: "Explore Apprenticeship Program",
      },
      {
        code: "§ 16d AufenthG",
        name: "Recognition Partnership & Adaptation Qualification",
        detail:
          "Accelerated entry under Germany's reformed Skilled Immigration Act: qualified professionals begin working in your company immediately while completing any remaining equivalence modules on the job.",
        link: "/fuer-arbeitgeber/branchen",
        linkLabel: "Industry Solutions & Recognition",
      },
      {
        code: "§ 81a AufenthG",
        name: "Fast-Track Skilled Worker Procedure",
        detail:
          "Statutorily capped processing times via power of attorney with the local immigration office: up to 2 months for credential recognition, 1 week for ZAV pre-approval, and 3 weeks for embassy visa scheduling.",
        link: "/fuer-arbeitgeber/zeitplan",
        linkLabel: "Open Timeline Simulator",
      },
    ],
    faqHeading: "Frequently Asked Questions for German Employers (B2B FAQ)",
    resourcesTitle: "Additional Employer Resources & Legal Transparency",
    resources: [
      { href: "/fuer-arbeitgeber/personalbedarf", label: "Submit Staffing Request (B2B Intake)" },
      { href: "/fuer-arbeitgeber/kandidaten", label: "Browse Candidate Pool" },
      { href: "/roi-rechner", label: "ROI & Salary Calculator" },
      { href: "/fuer-arbeitgeber/branchen", label: "Industry Specializations" },
      { href: "/blog", label: "Employer Guides & Blog" },
      { href: "/impressum", label: "Legal Notice (Impressum)" },
      { href: "/datenschutz", label: "Privacy Policy (Datenschutz / GDPR)" },
    ],
  },
  vn: {
    badge: "Hành lang Pháp lý, Số liệu & Câu hỏi Thường gặp (FEG / AufenthG)",
    title: "Tuyển dụng Nhân sự & Học viên Nghề từ Việt Nam sang Đức: Cẩm nang Pháp lý B2B",
    subtitle:
      "Tổng hợp thông tin chuẩn xác dành cho Ban giám đốc, Trưởng phòng Nhân sự và Quản lý Cơ sở Y tế tại Đức về quy trình tuyển dụng lao động chuyên môn (§ 18a/b) và du học nghề (§ 16a).",
    matrixTitle: "Các Diện Thị thực & Tuyển dụng Nhân sự Hợp pháp sang Đức",
    pathways: [
      {
        code: "§ 18a / § 18b AufenthG",
        name: "Lao động Chuyên môn có Bằng Cao đẳng Nghề hoặc Đại học",
        detail:
          "Tuyển dụng trực tiếp kỹ thuật viên, điều dưỡng viên và kỹ sư có bằng cấp chính quy được thẩm định tương đương qua IHK FOSA, HWK, Sở Y tế Bang hoặc ZAB cho các ngành Điều dưỡng, Cơ khí CNC, Điện - Nhiệt lạnh (SHK) và CNTT.",
        link: "/services/skilled-workers",
        linkLabel: "Chi tiết chương trình Lao động chuyên môn",
      },
      {
        code: "§ 16a AufenthG",
        name: "Du học Nghề Kép (Auszubildende / Azubi)",
        detail:
          "Tuyển chọn và đào tạo học viên tốt nghiệp THPT/Cao đẳng đạt chứng chỉ tiếng Đức B1/B2 quốc tế (Goethe, telc, ÖSD) cùng kỹ năng chuyên ngành để theo học chương trình nghề kép 3 năm tại doanh nghiệp Đức.",
        link: "/services/azubi",
        linkLabel: "Chi tiết chương trình Du học nghề",
      },
      {
        code: "§ 16d AufenthG",
        name: "Hợp tác Công nhận Bằng cấp (Anerkennungspartnerschaft)",
        detail:
          "Giải pháp rút ngắn thời gian theo luật FEG mới: ứng viên có bằng nghề sang Đức làm việc hưởng lương ngay tại doanh nghiệp và hoàn thiện chứng chỉ công nhận tương đương song song trong quá trình làm việc.",
        link: "/fuer-arbeitgeber/branchen",
        linkLabel: "Giải pháp theo từng Ngành nghề",
      },
      {
        code: "§ 81a AufenthG",
        name: "Thủ tục Xét duyệt Nhanh qua Sở Ngoại kiều",
        detail:
          "Rút ngắn thời hạn xử lý hồ sơ theo luật định thông qua ủy quyền với Sở Ngoại kiều: thẩm định văn bằng tối đa 2 tháng, ZAV chấp thuận trong 1 tuần và cấp lịch hẹn phỏng vấn visa trong 3 tuần.",
        link: "/fuer-arbeitgeber/zeitplan",
        linkLabel: "Mở Công cụ Dự toán Tiến độ",
      },
    ],
    faqHeading: "Câu hỏi Thường gặp từ Doanh nghiệp Đức (B2B FAQ)",
    resourcesTitle: "Tài liệu Tham khảo & Minh bạch Pháp lý",
    resources: [
      { href: "/fuer-arbeitgeber/personalbedarf", label: "Gửi Yêu cầu Tuyển dụng (B2B)" },
      { href: "/fuer-arbeitgeber/kandidaten", label: "Danh sách Hồ sơ Ứng viên" },
      { href: "/roi-rechner", label: "Công cụ Tính ROI & Chi phí" },
      { href: "/fuer-arbeitgeber/branchen", label: "Giải pháp theo Ngành nghề" },
      { href: "/blog", label: "Cẩm nang & Bài viết Chuyên sâu" },
      { href: "/impressum", label: "Thông tin Pháp lý (Impressum)" },
      { href: "/datenschutz", label: "Chính sách Bảo mật (Datenschutz / Privacy)" },
    ],
  },
} as const;

export function GeoKnowledgeSection() {
  const { lang } = useLanguage();
  const safeLang: "de" | "en" | "vn" = lang === "en" || lang === "vn" ? lang : "de";
  const copy = SECTION_COPY[safeLang];
  const faqSchema = buildHomepageFaqSchema(safeLang);

  return (
    <section
      id="geo-knowledge-base"
      aria-labelledby="geo-knowledge-heading"
      className="py-16 md:py-24 bg-slate-50 border-t border-slate-200/80"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary mb-4">
            {copy.badge}
          </p>
          <h2
            id="geo-knowledge-heading"
            className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4"
          >
            {copy.title}
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">{copy.subtitle}</p>
        </div>

        {/* Legal Pathways Matrix */}
        <div className="mb-14">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-6 text-center md:text-left">
            {copy.matrixTitle}
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {copy.pathways.map((item) => (
              <div
                key={item.code}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <dt className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                    <span className="text-base md:text-lg font-bold text-slate-900">
                      {item.name}
                    </span>
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-100 text-primary">
                      {item.code}
                    </span>
                  </dt>
                  <dd className="text-sm text-slate-600 leading-relaxed mb-4">{item.detail}</dd>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href={item.link}
                    className="text-xs md:text-sm font-semibold text-primary hover:underline"
                  >
                    {item.linkLabel} →
                  </Link>
                </div>
              </div>
            ))}
          </dl>
        </div>

        {/* Authoritative B2B FAQ Block */}
        <div className="mb-12">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-6 text-center md:text-left">
            {copy.faqHeading}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HOMEPAGE_GEO_FAQS.map((faq) => (
              <article
                key={faq.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {faq.category[safeLang]}
                  </span>
                  <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {faq.legalBasis}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2.5 leading-snug">
                  {faq.question[safeLang]}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.answer[safeLang]}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Quick Reference & Trust Anchor Bar */}
        <nav
          aria-label={copy.resourcesTitle}
          className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
            {copy.resourcesTitle}
          </h3>
          <ul className="flex flex-wrap gap-x-6 gap-y-2.5 text-sm">
            {copy.resources.map((res) => (
              <li key={res.href}>
                <Link
                  href={res.href}
                  className="font-medium text-slate-700 hover:text-primary underline underline-offset-4 transition-colors"
                >
                  {res.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
