"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  GraduationCap,
  HelpCircle,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { BrancheConfig } from "@/lib/content/branchen";
import { BRANCHEN_CONFIGS } from "@/lib/content/branchen";
import type { PublicCandidate } from "@/lib/candidates/public-profile";
import { CandidateCard } from "@/components/candidates/CandidateCard";
import { InquiryModal } from "@/components/candidates/InquiryModal";
import { ShortlistDrawer } from "@/components/candidates/ShortlistDrawer";
import { HiringRequestForm } from "@/components/employers/HiringRequestForm";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function BrancheDetailClient({
  branche,
  candidates,
  heroImageUrl,
}: {
  branche: BrancheConfig;
  candidates: PublicCandidate[];
  heroImageUrl?: string;
}) {
  const { lang } = useLanguage();
  const [selectedCandidate, setSelectedCandidate] = useState<PublicCandidate | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const otherBranchen = BRANCHEN_CONFIGS.filter((b) => b.slug !== branche.slug);
  const resolvedHeroImg = heroImageUrl || branche.heroImage;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section with Workplace Photography + Stats */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white pt-36 md:pt-44 pb-16 md:pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-6">
            <Link
              href="/fuer-arbeitgeber/branchen"
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {lang === "de"
                ? "Alle Branchenlösungen"
                : lang === "en"
                  ? "All Industry Solutions"
                  : "Tất cả giải pháp ngành nghề"}
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1">
                {branche.badge[lang]}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-5">
                {branche.title[lang]}
              </h1>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-7">
                {branche.subtitle[lang]}
              </p>

              {/* Hero Stats Inline Grid */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {branche.heroStats.map((stat) => (
                  <div
                    key={stat.value}
                    className="rounded-xl bg-white/10 border border-white/15 p-3.5 backdrop-blur-xs"
                  >
                    <span className="block text-xl md:text-2xl font-bold text-emerald-300 mb-0.5">
                      {stat.value}
                    </span>
                    <span className="text-xs text-slate-200 leading-snug block">
                      {stat.label[lang]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md"
                >
                  <a href="#branchen-anfrage">
                    {lang === "de"
                      ? "Personalbedarf für diese Branche melden"
                      : lang === "en"
                        ? "Request Candidates for This Sector"
                        : "Gửi yêu cầu tuyển dụng ngành này"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                <a
                  href="#verfuegbare-profile"
                  className="inline-flex items-center justify-center rounded-md px-6 h-10 text-sm font-semibold border border-white/35 bg-white/10 text-white hover:bg-white/20 hover:border-white/60 transition-colors backdrop-blur-xs"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {lang === "de"
                    ? `Verfügbare Profile ansehen (${candidates.length})`
                    : lang === "en"
                      ? `View Matching Profiles (${candidates.length})`
                      : `Xem hồ sơ đang có (${candidates.length})`}
                </a>
              </div>
            </div>

            {/* Right Column: Industry Workplace Hero Visual */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border-2 border-white/15 shadow-2xl bg-slate-900">
                <Image
                  src={resolvedHeroImg}
                  alt={branche.title[lang]}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                  unoptimized={resolvedHeroImg.startsWith("http")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-white/95 font-medium">
                  <span className="px-2.5 py-1 rounded-md bg-slate-900/75 backdrop-blur-xs border border-white/15">
                    {branche.legalPathway.authority[lang].split("&")[0]}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-600/90 font-semibold">
                    § 81a Fast-Track
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal & Recognition Framework */}
      <section className="py-12 md:py-16 border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 rounded-2xl bg-slate-900 text-white p-6 md:p-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Scale className="w-4 h-4" />
                {lang === "de"
                  ? "Rechtsgrundlage & Behörden"
                  : lang === "en"
                    ? "Legal Framework & Authorities"
                    : "Hành lang pháp lý & Cơ quan thẩm quyền"}
              </div>
              <h2 className="text-xl font-bold">{branche.legalPathway.paragraph}</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {branche.legalPathway.summary[lang]}
              </p>
              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>
                      {lang === "de" ? "Zuständige Stellen:" : "Competent Authorities:"}
                    </strong>{" "}
                    {branche.legalPathway.authority[lang]}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>
                      {lang === "de" ? "Typische Verfahrensdauer:" : "Estimated Lead Time:"}
                    </strong>{" "}
                    {branche.legalPathway.timelineMonths}
                  </span>
                </div>
              </div>
            </div>

            {/* Roles & KldB Table */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">
                {lang === "de"
                  ? "Vermittelbare Berufsbilder & Sprachstandards"
                  : lang === "en"
                    ? "Available Occupations & Language Standards"
                    : "Các vị trí cung ứng & Tiêu chuẩn tiếng Đức"}
              </h2>
              <div className="space-y-3">
                {branche.roles.map((role) => (
                  <div
                    key={role.kldbCode}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          KldB {role.kldbCode}
                        </span>
                        <Badge variant="outline" className="border-primary/30 text-primary">
                          Deutsch min. {role.germanRequirement}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">{role.title[lang]}</h3>
                      <p className="text-xs text-slate-600 mt-1">{role.pathway[lang]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Layer 1: Vector Technical Competency Matrix & Legal Process Infographics (.svg) */}
      <section className="py-14 md:py-20 bg-slate-100/80 border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <FileSpreadsheet className="w-4 h-4" />
              {lang === "de"
                ? "Fachliche & Behördliche Prozessschemata"
                : lang === "en"
                  ? "Technical Competency & Regulatory Schematics"
                  : "Sơ đồ Năng lực Chuyên môn & Quy trình Pháp lý"}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              {lang === "de"
                ? "Qualifikationsmatrix & Visum-Fahrplan im Überblick"
                : lang === "en"
                  ? "Qualification Matrix & Visa Roadmap at a Glance"
                  : "Ma trận kỹ năng nghề nghiệp & Lộ trình thẩm định hồ sơ"}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {[branche.competencySvg, branche.processSvg].map((diagram) => (
              <div
                key={diagram.src}
                className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-xs flex flex-col justify-between"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-1.5">{diagram.title[lang]}</h3>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                    {diagram.caption[lang]}
                  </p>
                </div>
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                  <Image
                    src={diagram.src}
                    alt={diagram.title[lang]}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Matching Live Candidates Section */}
      <section id="verfuegbare-profile" className="py-14 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
                {lang === "de"
                  ? "Vorausgewählte Bewerberprofile"
                  : lang === "en"
                    ? "Pre-Screened Candidate Profiles"
                    : "Hồ sơ ứng viên tiêu biểu"}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                {lang === "de"
                  ? "Aktuelle Kandidaten für Ihren Fachbereich"
                  : lang === "en"
                    ? "Current Candidates for Your Sector"
                    : "Ứng viên sẵn sàng cho lĩnh vực của bạn"}
              </h2>
            </div>
            <Link
              href="/fuer-arbeitgeber/kandidaten"
              className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1.5"
            >
              {lang === "de"
                ? "Kompletten Kandidaten-Pool öffnen"
                : lang === "en"
                  ? "Open Full Candidate Pool"
                  : "Mở toàn bộ danh sách ứng viên"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {candidates.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-700 font-medium mb-3">
                {lang === "de"
                  ? "Neue Profile für diesen Fachbereich befinden sich aktuell in der Freigabeprüfung."
                  : "New candidate profiles for this sector are currently being prepared."}
              </p>
              <Button asChild size="sm">
                <a href="#branchen-anfrage">
                  {lang === "de"
                    ? "Unverbindliche Vorauswahl anfordern"
                    : "Request Custom Shortlist"}
                </a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.slice(0, 6).map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onRequestProfile={(c) => {
                    setSelectedCandidate(c);
                    setModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sector Advantages + Layer 3 DMF Academy Verification Strip */}
      <section className="py-14 md:py-20 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-10">
            {lang === "de"
              ? "Warum deutsche Arbeitgeber in dieser Branche mit DMF Talents arbeiten"
              : lang === "en"
                ? "Why German Employers in This Sector Partner with DMF Talents"
                : "Lợi thế khi doanh nghiệp Đức tuyển dụng qua DMF Talents"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {branche.advantages.map((adv) => (
              <div
                key={adv.title.de}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{adv.title[lang]}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{adv.description[lang]}</p>
              </div>
            ))}
          </div>

          {/* Authentic DMF Academy & Delegation Banner */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <GraduationCap className="w-4 h-4" />
                {lang === "de"
                  ? "Eigene Sprach- & Fachakademie in Vietnam"
                  : lang === "en"
                    ? "Dedicated Training Academy in Vietnam"
                    : "Học viện Đào tạo trực tiếp tại Việt Nam"}
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                {lang === "de"
                  ? "Geprüfte Vorbereitung vor Ort & persönliche Arbeitgeber-Audits"
                  : lang === "en"
                    ? "Verified On-Site Preparation & Employer Selection Visits"
                    : "Đào tạo thực chiến & Đón phái đoàn Đức sang tuyển trực tiếp"}
              </h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                {lang === "de"
                  ? "Unsere Kandidaten lernen an unserem Campus in Vietnam nicht nur Deutsch bis B1/B2, sondern trainieren Fachbegriffe, Arbeitssicherheit und betriebliche Abläufe für Deutschland."
                  : lang === "en"
                    ? "At our campus in Vietnam, candidates master B1/B2 German alongside technical terminology, occupational safety, and German workplace routines."
                    : "Ứng viên được rèn luyện tiếng Đức B1/B2, thuật ngữ chuyên ngành và phỏng vấn trực tiếp cùng đại diện doanh nghiệp Đức ngay tại Học viện DMF."}
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-200">
                <Image
                  src="/images/b2b/hero-skilled.jpg"
                  alt="DMF Academy Fachunterricht"
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover"
                />
                <span className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded bg-slate-900/80 text-white text-[11px] font-medium backdrop-blur-xs">
                  {lang === "de"
                    ? "Intensivtraining & digitale Vorauswahl am DMF-Campus"
                    : "Intensive training & digital pre-screening at DMF Campus"}
                </span>
              </div>
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-200">
                <Image
                  src="/images/b2b/referenzen-delegation.jpg"
                  alt="Deutsche Arbeitgeber-Delegation bei DMF"
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover"
                />
                <span className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded bg-slate-900/80 text-white text-[11px] font-medium backdrop-blur-xs">
                  {lang === "de"
                    ? "Audits & Auswahlgespräche deutscher Partner vor Ort"
                    : "On-site audits & interviews by German employers"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry FAQs */}
      {branche.faqs.length > 0 && (
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-2">
                <HelpCircle className="w-4 h-4" />
                <span>FAQ</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                {lang === "de"
                  ? "Häufige Fragen deutscher Arbeitgeber"
                  : lang === "en"
                    ? "Frequently Asked Questions from German Employers"
                    : "Câu hỏi thường gặp từ doanh nghiệp Đức"}
              </h2>
            </div>
            <div className="space-y-4">
              {branche.faqs.map((faq) => (
                <div
                  key={faq.question.de}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2">
                    {faq.question[lang]}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.answer[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Direct Hiring Request Section */}
      <section
        id="branchen-anfrage"
        className="py-14 md:py-20 bg-slate-100/90 border-t border-slate-200"
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="rounded-2xl border border-slate-200 bg-card p-6 md:p-10 shadow-md">
            <HiringRequestForm
              service={branche.serviceType}
              initialBrancheLabel={branche.badge[lang]}
              headingLevel={2}
            />
          </div>
        </div>
      </section>

      {/* Other Industries Internal Linking for SEO */}
      <section className="py-12 pb-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            {lang === "de"
              ? "Weitere Branchenlösungen entdecken"
              : lang === "en"
                ? "Explore Other Sectors"
                : "Khám phá các ngành nghề khác"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {otherBranchen.map((b) => (
              <Link
                key={b.slug}
                href={`/fuer-arbeitgeber/branchen/${b.slug}`}
                className="rounded-xl border border-slate-200 p-4 hover:border-primary/40 hover:bg-slate-50 transition-colors"
              >
                <span className="text-xs font-semibold text-primary block mb-1">
                  {b.badge[lang]}
                </span>
                <span className="text-sm font-bold text-slate-900 line-clamp-2">
                  {b.title[lang]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <InquiryModal
        candidate={selectedCandidate}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedCandidate(null);
        }}
      />
      <ShortlistDrawer />
    </div>
  );
}
