"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Calculator,
  Users,
  GraduationCap,
} from "lucide-react";
import { BRANCHEN_CONFIGS } from "@/lib/content/branchen";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function BranchenHubClient({
  customAssets = {},
}: {
  customAssets?: Record<string, string | null>;
}) {
  const { lang } = useLanguage();

  const academyShowcases = [
    {
      src: "/images/b2b/gate-1-sprache.jpg",
      badge: {
        de: "Stufe 1: Intensives Sprachtraining",
        en: "Stage 1: Intensive Language Training",
        vn: "Giai đoạn 1: Đào tạo tiếng Đức chuyên sâu",
      },
      title: {
        de: "Zertifiziertes Deutsch (B1/B2) & Fachsprache am DMF-Campus",
        en: "Certified German (B1/B2) & Sector Vocabulary at DMF Campus",
        vn: "Tiếng Đức chứng chỉ quốc tế (B1/B2) & Thuật ngữ chuyên ngành",
      },
      desc: {
        de: "Vollzeitunterricht mit muttersprachlichen Lehrkräften in unserer eigenen Akademie in Vietnam vor der Ausreise.",
        en: "Full-time classes with native speakers at our dedicated academy in Vietnam prior to departure.",
        vn: "Học viên học toàn thời gian cùng giáo viên bản ngữ tại Học viện DMF trước khi xuất cảnh.",
      },
    },
    {
      src: "/images/b2b/hero-skilled.jpg",
      badge: {
        de: "Stufe 2: Digitale Vorauswahl & Coaching",
        en: "Stage 2: Digital Pre-Screening & Coaching",
        vn: "Giai đoạn 2: Sàng lọc kỹ năng & Phỏng vấn",
      },
      title: {
        de: "Strukturierte Bewerbungsmappen & Live-Fachgespräche",
        en: "Structured German Dossiers & Live Technical Interviews",
        vn: "Chuẩn hóa bộ hồ sơ Bewerbungsmappe & Phỏng vấn trực tuyến",
      },
      desc: {
        de: "Vorbereitung auf deutsche Arbeitskultur, Arbeitssicherheit und direkte Video-Interviews mit Ihrem Team.",
        en: "Preparation for German workplace culture, safety standards, and direct video interviews with your team.",
        vn: "Luyện phỏng vấn trực tiếp và đào tạo văn hóa làm việc, kỷ luật lao động tại doanh nghiệp Đức.",
      },
    },
    {
      src: "/images/b2b/referenzen-delegation.jpg",
      badge: {
        de: "Stufe 3: Arbeitgeber-Audits vor Ort",
        en: "Stage 3: On-Site Employer Audits",
        vn: "Giai đoạn 3: Thẩm định trực tiếp từ Đối tác Đức",
      },
      title: {
        de: "Transparenz für deutsche Geschäftsführer & Personalleiter",
        en: "Full Transparency for German Executives & HR Leaders",
        vn: "Minh bạch tuyệt đối với Ban Giám đốc & HR doanh nghiệp Đức",
      },
      desc: {
        de: "Regelmäßige Delegationsreisen und persönliche Auswahlgespräche deutscher Partnerbetriebe in Vietnam.",
        en: "Regular delegation visits and in-person selection days by German partner companies in Vietnam.",
        vn: "Đón tiếp các phái đoàn doanh nghiệp Đức sang thăm trường và kiểm tra tay nghề ứng viên trực tiếp.",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white pt-36 md:pt-44 pb-16 md:pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1">
              {lang === "de"
                ? "Branchenlösungen nach Fachkräfteeinwanderungsgesetz (FEG)"
                : lang === "en"
                  ? "Sector Solutions under Germany's Skilled Immigration Act"
                  : "Giải pháp nhân sự theo từng ngành nghề tại CHLB Đức"}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-5">
              {lang === "de"
                ? "Fachkräfte & Auszubildende aus Vietnam nach Branche rekrutieren"
                : lang === "en"
                  ? "Recruit Vietnamese Skilled Workers & Apprentices by Industry"
                  : "Tuyển dụng Nhân sự & Học viên Nghề từ Việt Nam theo Ngành"}
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8">
              {lang === "de"
                ? "Jede Branche in Deutschland unterliegt eigenen Kammervorgaben (IHK FOSA, HWK, Landesamt für Pflege) und Sprachanforderungen. Wählen Sie Ihren Sektor für geprüfte Bewerberprofile, KldB-Berufsbilder und den exakten § 81a-Fahrplan."
                : lang === "en"
                  ? "Every German sector has specific chamber recognition rules (IHK FOSA, HWK, State Nursing Boards) and language standards. Select your industry to view matching candidates, legal pathways, and timelines."
                  : "Mỗi ngành nghề tại Đức có quy định công nhận bằng cấp (IHK FOSA, HWK, Sở Y tế) và yêu cầu tiếng Đức riêng biệt. Chọn lĩnh vực của doanh nghiệp để xem hồ sơ ứng viên và lộ trình pháp lý § 81a."}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md"
              >
                <Link href="/fuer-arbeitgeber/personalbedarf">
                  {lang === "de"
                    ? "Personalbedarf direkt melden"
                    : lang === "en"
                      ? "Submit Hiring Request"
                      : "Gửi yêu cầu tuyển dụng"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Link
                href="/fuer-arbeitgeber/kandidaten"
                className="inline-flex items-center justify-center rounded-md px-6 h-10 text-sm font-semibold border border-white/35 bg-white/10 text-white hover:bg-white/20 hover:border-white/60 transition-colors backdrop-blur-xs"
              >
                <Users className="w-4 h-4 mr-2" />
                {lang === "de"
                  ? "Alle Kandidaten ansehen"
                  : lang === "en"
                    ? "Browse Candidate Pool"
                    : "Xem toàn bộ ứng viên"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Cards Grid with B2B Workplace Hero Visuals */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {BRANCHEN_CONFIGS.map((branche) => {
              const imgSrc = customAssets[branche.assetKey] || branche.heroImage;
              return (
                <div
                  key={branche.slug}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:border-primary/40 transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Visual Banner */}
                    <Link
                      href={`/fuer-arbeitgeber/branchen/${branche.slug}`}
                      className="block relative aspect-[16/9] w-full overflow-hidden bg-slate-900"
                    >
                      <Image
                        src={imgSrc}
                        alt={branche.title[lang]}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized={imgSrc.startsWith("http")}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/25 to-transparent" />
                      <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/95 text-slate-900 shadow-sm">
                          <Building2 className="w-3.5 h-3.5 text-primary" />
                          {branche.badge[lang]}
                        </span>
                        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-slate-900/80 text-emerald-300 border border-emerald-400/30 backdrop-blur-xs">
                          {branche.legalPathway.timelineMonths}
                        </span>
                      </div>
                    </Link>

                    <div className="p-6 md:p-8 pb-4">
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
                        <Link
                          href={`/fuer-arbeitgeber/branchen/${branche.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {branche.title[lang]}
                        </Link>
                      </h2>

                      <p className="text-sm text-slate-600 leading-relaxed mb-5">
                        {branche.subtitle[lang]}
                      </p>

                      {/* Roles preview */}
                      <div className="space-y-2 mb-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          {lang === "de"
                            ? "Typische Berufsbilder (KldB):"
                            : lang === "en"
                              ? "Key Roles & Occupations:"
                              : "Các vị trí tuyển dụng chính:"}
                        </p>
                        {branche.roles.map((role) => (
                          <div
                            key={role.kldbCode}
                            className="flex items-center justify-between gap-2 text-xs bg-slate-50 rounded-lg px-3 py-2 border border-slate-200/70"
                          >
                            <span className="font-medium text-slate-800 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              {role.title[lang]}
                            </span>
                            <span className="font-mono text-slate-500 flex-shrink-0">
                              Deutsch {role.germanRequirement}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 md:px-8 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      {branche.legalPathway.paragraph.split("&")[0]}
                    </span>
                    <Button asChild size="sm" className="gap-1.5">
                      <Link href={`/fuer-arbeitgeber/branchen/${branche.slug}`}>
                        {lang === "de"
                          ? "Branchen-Leitfaden & Profile"
                          : lang === "en"
                            ? "View Industry Guide & Profiles"
                            : "Xem chi tiết ngành & Hồ sơ"}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Layer 3: Authentic DMF Academy & Delegation Proof in Vietnam */}
      <section className="py-16 md:py-20 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <GraduationCap className="w-4 h-4" />
              {lang === "de"
                ? "Qualitätssicherung vor der Einreise"
                : lang === "en"
                  ? "Pre-Departure Quality Assurance"
                  : "Đào tạo & Kiểm định chất lượng trước xuất cảnh"}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              {lang === "de"
                ? "Einblick in unsere Sprach- und Fachakademie in Vietnam"
                : lang === "en"
                  ? "Inside Our Language & Technical Academy in Vietnam"
                  : "Thực tế đào tạo và thẩm định tay nghề tại Học viện DMF Việt Nam"}
            </h2>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              {lang === "de"
                ? "Bevor unsere Kandidaten ihren Dienst in Deutschland antreten, durchlaufen sie ein mehrstufiges Ausbildungs- und Prüfungsprogramm an unserem eigenen Campus."
                : lang === "en"
                  ? "Before our candidates begin working in Germany, they complete a rigorous multi-stage language and vocational preparation program at our campus."
                  : "Trước khi sang Đức làm việc, mọi ứng viên đều trải qua chương trình đào tạo tiếng Đức chuyên ngành và kiểm tra tay nghề trực tiếp cùng đối tác Đức."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {academyShowcases.map((item) => (
              <div
                key={item.src}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[16/10] w-full bg-slate-200">
                  <Image
                    src={item.src}
                    alt={item.title[lang]}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-xs font-semibold text-primary mb-1.5">
                    {item.badge[lang]}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{item.title[lang]}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc[lang]}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Cross-Tool Banner */}
          <div className="mt-14 rounded-2xl bg-gradient-to-r from-blue-950 to-slate-900 text-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                <FileCheck2 className="w-4 h-4" />
                {lang === "de"
                  ? "Kosten- & Zeitplanung für Entscheider"
                  : "Cost & Timeline Planning for Decision Makers"}
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {lang === "de"
                  ? "Vergleichen Sie Kosten, Einsparungen und Einreisedauer für Ihren Betrieb"
                  : lang === "en"
                    ? "Compare Recruitment ROI and Visa Timelines for Your Company"
                    : "Tính toán Chi phí, Lợi tức (ROI) và Lộ trình nhập cảnh cho doanh nghiệp"}
              </h3>
              <p className="text-sm text-slate-300">
                {lang === "de"
                  ? "Nutzen Sie unseren interaktiven ROI-Rechner und den § 81a-Zeitplan-Simulator für Ihre Budgetplanung."
                  : "Use our interactive ROI Calculator and § 81a Timeline Simulator for your hiring budget."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
                <Link href="/roi-rechner">
                  <Calculator className="w-4 h-4" />
                  {lang === "de" ? "Zum ROI-Rechner" : "ROI Calculator"}
                </Link>
              </Button>
              <Link
                href="/fuer-arbeitgeber/zeitplan"
                className="inline-flex items-center justify-center rounded-md px-4 h-9 text-sm font-semibold border border-white/35 bg-white/10 text-white hover:bg-white/20 hover:border-white/60 transition-colors"
              >
                {lang === "de" ? "Zeitplan-Simulator" : "Timeline Simulator"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
