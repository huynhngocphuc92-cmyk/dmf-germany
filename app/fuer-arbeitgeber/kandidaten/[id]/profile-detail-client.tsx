"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Award,
  Briefcase,
  CheckCircle2,
  Copy,
  Check,
  FileCheck2,
  FileText,
  ExternalLink,
  Printer,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
  Video,
  Clock,
} from "lucide-react";
import type { PublicCandidate } from "@/lib/candidates/public-profile";
import { useCandidateShortlist } from "@/lib/candidates/shortlist";
import { categoryLabelsI18n, poolStageLabelsI18n } from "@/app/admin/candidates/types";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useConsent, openConsentSettings } from "@/components/CookieConsent";
import { getEmbedUrl } from "@/lib/utils/youtube";
import { HiringRequestForm } from "@/components/employers/HiringRequestForm";
import { ShortlistDrawer } from "@/components/candidates/ShortlistDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BLUR_SQUARE } from "@/lib/image-placeholder";

export function ProfileDetailClient({ candidate }: { candidate: PublicCandidate }) {
  const { lang } = useLanguage();
  const { externalMedia: videoAllowed } = useConsent();
  const { isShortlisted, toggleShortlist } = useCandidateShortlist();
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const code = candidate.display_code || candidate.id.slice(0, 8).toUpperCase();
  const saved = isShortlisted(candidate.id);
  const isLocalVideo =
    Boolean(candidate.video_url) &&
    (candidate.video_url!.startsWith("/") || candidate.video_url!.endsWith(".mp4"));
  const embedUrl = candidate.video_url && !isLocalVideo ? getEmbedUrl(candidate.video_url) : null;
  const categoryLabel = categoryLabelsI18n[candidate.category]?.[lang] || candidate.category;
  const poolStage =
    candidate.pool_stage || (candidate.visa_status ? "in_germany" : "interview_ready");
  const poolStageLabel =
    poolStageLabelsI18n[poolStage]?.[lang] || poolStageLabelsI18n[poolStage]?.de;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore clipboard failure
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const dossierChecklist =
    candidate.highlights && candidate.highlights.length > 0
      ? [
          ...candidate.highlights,
          lang === "de"
            ? "Vorabprüfung für das beschleunigte Verfahren (§ 16a / § 81a AufenthG)"
            : lang === "en"
              ? "Pre-screened for fast-track § 16a / § 81a AufenthG visa procedure"
              : "Đã rà soát điều kiện làm thủ tục Visa (§ 16a / § 81a AufenthG)",
        ]
      : lang === "de"
        ? [
            "Tabellarischer Lebenslauf nach deutschem Standard (geprüft)",
            "Beglaubigte Übersetzung der Schul- bzw. Berufsabschlüsse",
            `Nachweis Sprachniveau Deutsch ${candidate.german_level || "B1/B2"} (Goethe / telc / ÖSD)`,
            "Vorabprüfung für das beschleunigte Fachkräfteverfahren (§ 81a AufenthG)",
            "Gesundheitliche Eignung & polizeiliches Führungszeugnis vorbereitet",
          ]
        : lang === "en"
          ? [
              "German-standard structured CV (verified)",
              "Certified translations of academic / vocational diplomas",
              `Verified German proficiency ${candidate.german_level || "B1/B2"} (Goethe / telc / ÖSD)`,
              "Pre-screened for fast-track § 81a AufenthG visa procedure",
              "Medical fitness & police clearance certificate prepared",
            ]
          : [
              "Sơ yếu lý lịch (Lebenslauf) chuẩn định dạng doanh nghiệp Đức",
              "Bản dịch công chứng bằng cấp và bảng điểm chuyên môn",
              `Chứng chỉ tiếng Đức ${candidate.german_level || "B1/B2"} (Goethe / telc / ÖSD)`,
              "Đã rà soát điều kiện làm thủ tục rút gọn § 81a AufenthG",
              "Đủ điều kiện sức khỏe và lý lịch tư pháp sẵn sàng xin Visa",
            ];

  return (
    <div className="min-h-screen bg-slate-50 pt-36 md:pt-44 pb-28 print:pt-4 print:bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 print:hidden">
          <Link
            href="/fuer-arbeitgeber/kandidaten"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {lang === "de"
              ? "Zurück zum Kandidaten-Pool"
              : lang === "en"
                ? "Back to Candidate Pool"
                : "Quay lại danh sách ứng viên"}
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toggleShortlist(candidate)}
              className="gap-1.5"
            >
              {saved ? (
                <BookmarkCheck className="w-4 h-4 text-emerald-600" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
              {saved
                ? lang === "de"
                  ? "Auf Merkliste"
                  : lang === "en"
                    ? "Shortlisted"
                    : "Đã lưu"
                : lang === "de"
                  ? "Auf Merkliste setzen"
                  : lang === "en"
                    ? "Add to Shortlist"
                    : "Lưu vào danh sách"}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-1.5"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied
                ? lang === "de"
                  ? "Link kopiert!"
                  : "Copied!"
                : lang === "de"
                  ? "Exposé-Link teilen"
                  : lang === "en"
                    ? "Share Link"
                    : "Sao chép link"}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrintPdf}
              className="gap-1.5"
            >
              <Printer className="w-4 h-4" />
              {lang === "de"
                ? "Als PDF-Exposé drucken"
                : lang === "en"
                  ? "Print / Save PDF"
                  : "In / Tải PDF Exposé"}
            </Button>
          </div>
        </div>

        {/* Exposé Dossier Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-10 print:border-0 print:shadow-none">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-white/10 border-2 border-white/20 flex items-center justify-center flex-shrink-0">
                  {candidate.avatar_url && !imgError ? (
                    <Image
                      src={candidate.avatar_url}
                      alt={`Kandidat #${code}`}
                      fill
                      className="object-cover"
                      onError={() => setImgError(true)}
                      unoptimized={candidate.avatar_url.startsWith("http")}
                      placeholder="blur"
                      blurDataURL={BLUR_SQUARE}
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white/90">
                      {(candidate.initials_label || candidate.profession || "DM")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-xs uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/10 text-emerald-300 border border-emerald-400/30">
                      #{code}
                      {candidate.initials_label ? ` • ${candidate.initials_label}` : ""}
                      {candidate.cohort ? ` (${candidate.cohort})` : ""}
                    </span>
                    <Badge className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                      {poolStageLabel}
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-200 border border-blue-400/30">
                      {categoryLabel}
                    </Badge>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    {candidate.profession || "Qualifizierte Fachkraft / Auszubildende(r)"}
                  </h1>
                  {candidate.availability_label && (
                    <p className="text-xs text-slate-300 mt-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{candidate.availability_label}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 flex-shrink-0">
                {candidate.german_level && (
                  <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-center min-w-[135px]">
                    <span className="block text-xs text-slate-300 mb-0.5">
                      {lang === "de" ? "Sprachniveau" : "German Level"}
                    </span>
                    <span className="text-lg font-bold text-white">
                      Niveau {candidate.german_level}
                    </span>
                  </div>
                )}
                {candidate.experience_years != null && (
                  <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-center min-w-[135px]">
                    <span className="block text-xs text-slate-300 mb-0.5">
                      {lang === "de" ? "Praxis / Ausbildung" : "Experience"}
                    </span>
                    <span className="text-lg font-bold text-white">
                      {candidate.experience_years > 0
                        ? `${candidate.experience_years} ${
                            candidate.experience_years === 1
                              ? lang === "de"
                                ? "Jahr"
                                : "Yr"
                              : lang === "de"
                                ? "Jahre"
                                : "Yrs"
                          }`
                        : candidate.cohort || "DMF"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                  <FileCheck2 className="w-5 h-5 text-primary" />
                  {lang === "de"
                    ? "Geprüfte Unterlagen & Ausbildungsstand"
                    : lang === "en"
                      ? "Verified Documents & Training Status"
                      : "Hồ sơ & Trạng thái đào tạo tại DMF"}
                </h2>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  {lang === "de"
                    ? "Aus Datenschutzgründen (DSGVO) sind Reisepass- und Ausweiskopien im öffentlichen Kurzprofil ausgeblendet. Die folgenden geprüften Bewerbungsunterlagen (Lebenslauf, Motivationsschreiben, Sprachzertifikat) stehen Ihnen direkt als PDF-Vorschau zur Verfügung."
                    : lang === "en"
                      ? "For GDPR compliance, passport and ID scans are excluded from public view. Verified application documents (CV, motivation letter, language certificate) can be previewed directly below."
                      : "Để tuân thủ luật bảo mật dữ liệu Đức (DSGVO), bản scan hộ chiếu/CCCD được ẩn trên trang công khai. Doanh nghiệp có thể xem trực tiếp CV tiếng Đức, Thư động lực và Chứng chỉ B1 bên dưới."}
                </p>
                <ul className="space-y-2.5">
                  {dossierChecklist.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-slate-800 bg-slate-50 rounded-xl p-3 border border-slate-200/70"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct Dossier PDF Documents */}
              {candidate.documents && candidate.documents.length > 0 && (
                <div className="pt-2 print:hidden">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-primary" />
                    {lang === "de"
                      ? "Hinterlegte Bewerbungsunterlagen (PDF-Direktansicht)"
                      : lang === "en"
                        ? "Uploaded Application Documents (Direct PDF View)"
                        : "Hồ sơ & Văn bằng đính kèm (Xem PDF trực tiếp)"}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {candidate.documents.map((doc) => (
                      <a
                        key={doc.url}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white hover:border-primary/40 hover:bg-primary/5 p-3.5 shadow-2xs transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-sm font-semibold text-slate-900 group-hover:text-primary truncate">
                              {doc.label}
                            </span>
                            <span className="block text-[11px] text-slate-500 uppercase tracking-wider">
                              {doc.type === "cv"
                                ? "Deutscher Lebenslauf (PDF)"
                                : doc.type === "motivation"
                                  ? "Motivationsschreiben (PDF)"
                                  : doc.type === "certificate"
                                    ? "Sprachzertifikat (PDF)"
                                    : "Bewerbungsmappe (PDF)"}
                            </span>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-primary flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Self-Intro */}
              {(isLocalVideo || embedUrl) && (
                <div className="pt-2 print:hidden">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                    <Video className="w-5 h-5 text-primary" />
                    {lang === "de"
                      ? "Persönliche Video-Vorstellung (Deutsch)"
                      : lang === "en"
                        ? "Video Self-Introduction (German)"
                        : "Video ứng viên tự giới thiệu bằng tiếng Đức"}
                  </h2>
                  {isLocalVideo ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-200 shadow-sm">
                      <video
                        src={candidate.video_url!}
                        controls
                        preload="metadata"
                        playsInline
                        className="w-full h-full object-cover"
                        title={`Vorstellungsvideo Kandidat #${code}`}
                      />
                    </div>
                  ) : !videoAllowed ? (
                    <button
                      type="button"
                      onClick={openConsentSettings}
                      className="w-full rounded-xl bg-slate-100 border border-slate-200 p-6 text-sm text-slate-700 hover:bg-slate-200/70 transition-colors"
                    >
                      {lang === "de"
                        ? "Video ansehen: Bitte externe Medien in den Datenschutzeinstellungen aktivieren."
                        : "Watch video: allow external media in privacy settings."}
                    </button>
                  ) : (
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-200 shadow-sm">
                      <iframe
                        src={embedUrl!}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`Video Kandidat #${code}`}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Sidebar Summary */}
            <div className="lg:col-span-5 space-y-5">
              <div className="rounded-2xl bg-blue-50/70 border border-blue-200/80 p-5 space-y-4">
                <div className="flex items-center gap-2.5 text-blue-950 font-bold">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span>
                    {lang === "de"
                      ? "Rechtlicher Einstellungsfahrplan"
                      : lang === "en"
                        ? "Legal Onboarding Pathway"
                        : "Lộ trình pháp lý dự kiến"}
                  </span>
                </div>
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <Briefcase className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900">
                        {lang === "de" ? "Rechtsgrundlage:" : "Legal Basis:"}
                      </strong>
                      <span>
                        {candidate.category === "azubi"
                          ? "§ 16a AufenthG (Duale Berufsausbildung)"
                          : candidate.category === "skilled"
                            ? "§ 18a / § 18b AufenthG i.V.m. § 81a AufenthG"
                            : "Saisonbeschäftigung / § 16a / § 18a AufenthG"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Award className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900">
                        {lang === "de" ? "Nächster Schritt für Arbeitgeber:" : "Next Step:"}
                      </strong>
                      <span>
                        {lang === "de"
                          ? "Vollständige Bewerbungsmappe anfordern & unverbindliches Video-Kennenlernen (30 Min.) vereinbaren."
                          : "Request complete dossier & schedule a 30-min video interview."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Dossier Request Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm print:hidden">
          <HiringRequestForm
            service={candidate.category}
            candidateId={candidate.id}
            candidateCode={code}
            candidateProfession={candidate.profession}
            headingLevel={2}
          />
        </div>
      </div>

      <ShortlistDrawer />
    </div>
  );
}
