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
  Printer,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
  Video,
} from "lucide-react";
import type { PublicCandidate } from "@/lib/candidates/public-profile";
import { useCandidateShortlist } from "@/lib/candidates/shortlist";
import { categoryLabelsI18n } from "@/app/admin/candidates/types";
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

  const code = candidate.id.slice(0, 8).toUpperCase();
  const saved = isShortlisted(candidate.id);
  const embedUrl = candidate.video_url ? getEmbedUrl(candidate.video_url) : null;
  const categoryLabel = categoryLabelsI18n[candidate.category]?.[lang] || candidate.category;

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
    lang === "de"
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
                      {(candidate.profession || "DM").slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-xs uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/10 text-emerald-300 border border-emerald-400/30">
                      {lang === "de"
                        ? `Anonymisiertes Kurzprofil #${code}`
                        : lang === "en"
                          ? `Anonymized Profile #${code}`
                          : `Hồ sơ ẩn danh #${code}`}
                    </span>
                    <Badge className="bg-blue-500/20 text-blue-200 border border-blue-400/30">
                      {categoryLabel}
                    </Badge>
                    {candidate.visa_status && (
                      <Badge className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                        § 81a AufenthG Vorbereitet
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    {candidate.profession || "Qualifizierte Fachkraft / Auszubildende(r)"}
                  </h1>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 flex-shrink-0">
                {candidate.german_level && (
                  <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-center min-w-[135px]">
                    <span className="block text-xs text-slate-300 mb-0.5">
                      {lang === "de" ? "Deutsch-Zertifikat" : "German Level"}
                    </span>
                    <span className="text-lg font-bold text-white">
                      Niveau {candidate.german_level}
                    </span>
                  </div>
                )}
                {candidate.experience_years != null && (
                  <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-center min-w-[135px]">
                    <span className="block text-xs text-slate-300 mb-0.5">
                      {lang === "de" ? "Berufserfahrung" : "Experience"}
                    </span>
                    <span className="text-lg font-bold text-white">
                      {candidate.experience_years}{" "}
                      {candidate.experience_years === 1
                        ? lang === "de"
                          ? "Jahr"
                          : "Yr"
                        : lang === "de"
                          ? "Jahre"
                          : "Yrs"}
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
                    ? "Geprüfte Unterlagen in der Bewerbungsmappe"
                    : lang === "en"
                      ? "Verified Documents in Full Dossier"
                      : "Hồ sơ đã được thẩm định của ứng viên"}
                </h2>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  {lang === "de"
                    ? "Aus Datenschutzgründen (DSGVO) sind Klarnamen und Zeugniskopien im öffentlichen Kurzprofil ausgeblendet. Als Arbeitgeber erhalten Sie auf Anfrage umgehend die ungeschwärzte Bewerbungsmappe."
                    : lang === "en"
                      ? "For GDPR compliance, personal names and certificate scans are anonymized in this public preview. Employers receive the complete unredacted dossier upon request."
                      : "Để tuân thủ luật bảo mật dữ liệu Đức (DSGVO), họ tên đầy đủ và bản scan văn bằng được ẩn trên trang công khai. Doanh nghiệp sẽ nhận trọn bộ hồ sơ gốc ngay khi gửi yêu cầu."}
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

              {/* Video Self-Intro */}
              {embedUrl && (
                <div className="pt-2 print:hidden">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                    <Video className="w-5 h-5 text-primary" />
                    {lang === "de"
                      ? "Persönliche Video-Vorstellung (Deutsch)"
                      : lang === "en"
                        ? "Video Self-Introduction (German)"
                        : "Video ứng viên tự giới thiệu bằng tiếng Đức"}
                  </h2>
                  {!videoAllowed ? (
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
                        src={embedUrl}
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
            candidateProfession={candidate.profession}
            headingLevel={2}
          />
        </div>
      </div>

      <ShortlistDrawer />
    </div>
  );
}
