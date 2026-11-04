"use client";

import { useState } from "react";
import Link from "next/link";
import { useConsent, openConsentSettings } from "@/components/CookieConsent";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Briefcase,
  Award,
  FileText,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BLUR_SQUARE } from "@/lib/image-placeholder";
import type { PublicCandidate } from "@/lib/candidates/public-profile";
import { useCandidateShortlist } from "@/lib/candidates/shortlist";
import {
  categoryLabelsI18n,
  poolStageColors,
  poolStageLabelsI18n,
  type CandidatePoolStage,
} from "@/app/admin/candidates/types";
import { useLanguage } from "@/components/providers/LanguageProvider";

import { getEmbedUrl } from "@/lib/utils/youtube";

interface CandidateCardProps {
  candidate: PublicCandidate;
  onRequestProfile?: (candidate: PublicCandidate) => void;
  preview?: boolean;
  matchScore?: number;
  matchReason?: string;
}

const getGermanLevelColor = (level: string): string => {
  switch (level) {
    case "A1":
    case "A2":
      return "bg-amber-50 text-amber-800 border-amber-300";
    case "B1":
      return "bg-blue-50 text-blue-800 border-blue-300";
    case "B2":
      return "bg-purple-50 text-purple-800 border-purple-300";
    case "C1":
    case "C2":
      return "bg-emerald-50 text-emerald-800 border-emerald-300";
    default:
      return "bg-slate-100 text-slate-700 border-slate-300";
  }
};

const getCandidateCode = (id: string): string => {
  return id.slice(0, 8).toUpperCase();
};

const getAvatarInitials = (
  initialsLabel?: string | null,
  profession?: string | null,
  category?: string
): string => {
  if (initialsLabel) {
    const parts = initialsLabel.replace(/\./g, "").trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    if (parts.length === 1 && parts[0].length >= 2) {
      return parts[0].slice(0, 2).toUpperCase();
    }
  }
  if (profession) {
    const words = profession
      .split(/\s+/)
      .map((w) => w.replace(/[^a-zA-ZÄÖÜäöüß]/g, ""))
      .filter((w) => w.length > 0);
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    if (words.length === 1 && words[0].length >= 2) {
      return words[0].substring(0, 2).toUpperCase();
    }
  }
  if (category) {
    return category.substring(0, 2).toUpperCase();
  }
  return "DM";
};

const getStageAccentMeta = (stage: CandidatePoolStage, lang: "de" | "en" | "vn") => {
  switch (stage) {
    case "interview_ready":
      return {
        topBar: "border-t-4 border-t-emerald-500",
        dot: "bg-emerald-500",
        avatarRing: "border-emerald-500/30 bg-emerald-50 text-emerald-800",
        stepCount: 4,
        barColor: "bg-emerald-500",
        stepLabel:
          lang === "de"
            ? "Reifegrad 4/4 • Sofort vermittelbar"
            : lang === "en"
              ? "Stage 4/4 • Ready for Placement"
              : "Bước 4/4 • Sẵn sàng phỏng vấn",
      };
    case "in_germany":
      return {
        topBar: "border-t-4 border-t-indigo-600",
        dot: "bg-indigo-600",
        avatarRing: "border-indigo-500/30 bg-indigo-50 text-indigo-800",
        stepCount: 4,
        barColor: "bg-indigo-600",
        stepLabel:
          lang === "de"
            ? "In Deutschland aktiv • DMF-Referenz"
            : lang === "en"
              ? "Active in Germany • Placed Talent"
              : "Đã xuất cảnh & học nghề tại Đức",
      };
    case "b1_b2_exam":
      return {
        topBar: "border-t-4 border-t-amber-500",
        dot: "bg-amber-500",
        avatarRing: "border-amber-500/30 bg-amber-50 text-amber-800",
        stepCount: 3,
        barColor: "bg-amber-500",
        stepLabel:
          lang === "de"
            ? "Reifegrad 3/4 • B1/B2-Prüfungsphase"
            : lang === "en"
              ? "Stage 3/4 • B1/B2 Exam Phase"
              : "Bước 3/4 • Đang ôn & thi B1/B2",
      };
    case "b_niveau":
      return {
        topBar: "border-t-4 border-t-blue-500",
        dot: "bg-blue-500",
        avatarRing: "border-blue-500/30 bg-blue-50 text-blue-800",
        stepCount: 2,
        barColor: "bg-blue-500",
        stepLabel:
          lang === "de"
            ? "Reifegrad 2/4 • Sprachkurs B-Niveau"
            : lang === "en"
              ? "Stage 2/4 • B-Level Course"
              : "Bước 2/4 • Đang học B-Niveaus",
      };
    case "a_niveau":
      return {
        topBar: "border-t-4 border-t-slate-400",
        dot: "bg-slate-400",
        avatarRing: "border-slate-300 bg-slate-100 text-slate-700",
        stepCount: 1,
        barColor: "bg-slate-500",
        stepLabel:
          lang === "de"
            ? "Reifegrad 1/4 • Grundstufe A-Niveau"
            : lang === "en"
              ? "Stage 1/4 • A-Level Foundation"
              : "Bước 1/4 • Đang học A-Niveaus",
      };
  }
};

export const CandidateCard = ({
  candidate,
  onRequestProfile,
  preview = false,
  matchScore,
  matchReason,
}: CandidateCardProps) => {
  const { lang, t } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const { externalMedia: videoAllowed } = useConsent();
  const { isShortlisted, toggleShortlist } = useCandidateShortlist();
  const savedInShortlist = isShortlisted(candidate.id);

  const candidateCode = candidate.display_code || getCandidateCode(candidate.id);
  const embedUrl = candidate.video_url ? getEmbedUrl(candidate.video_url) : null;
  const categoryLabel = candidate.category
    ? categoryLabelsI18n[candidate.category]?.[lang] || candidate.category
    : "";
  const poolStage: CandidatePoolStage =
    candidate.pool_stage || (candidate.visa_status ? "in_germany" : "interview_ready");
  const poolStageLabel =
    poolStageLabelsI18n[poolStage]?.[lang] || poolStageLabelsI18n[poolStage]?.de;
  const poolStageColor = poolStageColors[poolStage];
  const stageMeta = getStageAccentMeta(poolStage, lang);

  // Split multi-profession strings ("Hotelfachmann / Koch / SHK") into primary role + secondary tags
  const rawProfessions = (candidate.profession || "Beruf auf Anfrage")
    .split(/\s+\/\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const primaryProfession = rawProfessions[0] || "Beruf auf Anfrage";
  const secondaryProfessions = rawProfessions.slice(1);

  const ctaLabel =
    poolStage === "in_germany"
      ? lang === "de"
        ? "Ähnliches Profil anfragen"
        : lang === "en"
          ? "Request Similar Profile"
          : "Yêu cầu hồ sơ tương tự"
      : poolStage === "interview_ready"
        ? lang === "de"
          ? "Interview & Dossier"
          : lang === "en"
            ? "Request Interview"
            : "Đặt lịch phỏng vấn"
        : lang === "de"
          ? "Kandidat vormerken"
          : lang === "en"
            ? "Pre-reserve Talent"
            : "Đặt chỗ sớm";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="h-full"
    >
      <Card
        className={`h-full flex flex-col py-0 gap-0 border border-slate-200/90 hover:border-primary/40 hover:shadow-xl transition-all duration-300 overflow-hidden group ${stageMeta.topBar}`}
      >
        {/* Top Status Ribbon */}
        <div className="px-5 py-2.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${stageMeta.dot}`} />
            <Badge
              variant="outline"
              className={`text-[11px] font-semibold px-2 py-0.5 truncate ${poolStageColor}`}
            >
              {poolStageLabel}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {candidate.category && (
              <span className="text-[11px] font-medium text-slate-600 bg-white border border-slate-200 rounded-md px-2 py-0.5">
                {categoryLabel}
              </span>
            )}
            {typeof matchScore === "number" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                <Sparkles className="h-2.5 w-2.5" />
                {matchScore}%
              </span>
            )}
          </div>
        </div>

        {/* Identity Header */}
        <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar
              className={`h-12 w-12 border-2 flex-shrink-0 shadow-2xs ${stageMeta.avatarRing}`}
            >
              {candidate.avatar_url && !imageError ? (
                <Image
                  src={candidate.avatar_url}
                  alt={candidateCode}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  unoptimized={candidate.avatar_url.startsWith("http")}
                  placeholder="blur"
                  blurDataURL={BLUR_SQUARE}
                />
              ) : (
                <AvatarFallback className={`font-bold text-sm ${stageMeta.avatarRing}`}>
                  {getAvatarInitials(
                    candidate.initials_label,
                    candidate.profession,
                    candidate.category
                  )}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80">
                  #{candidateCode}
                </span>
                {candidate.cohort && (
                  <span className="text-[11px] font-semibold text-primary bg-primary/8 px-2 py-0.5 rounded">
                    {candidate.cohort}
                  </span>
                )}
              </div>
              {candidate.initials_label && (
                <p className="text-sm font-bold text-slate-900 mt-1 truncate">
                  {candidate.initials_label}{" "}
                  <span className="text-xs font-normal text-slate-500">
                    (
                    {lang === "de"
                      ? "DSGVO-anonymisiert"
                      : lang === "en"
                        ? "GDPR-anonymized"
                        : "Ẩn danh DSGVO"}
                    )
                  </span>
                </p>
              )}
            </div>
          </div>

          {!preview && (
            <button
              type="button"
              onClick={() => toggleShortlist(candidate)}
              title={
                savedInShortlist
                  ? lang === "de"
                    ? "Von Merkliste entfernen"
                    : "Remove from shortlist"
                  : lang === "de"
                    ? "Auf Merkliste speichern"
                    : "Save to shortlist"
              }
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold border transition-all flex-shrink-0 ${
                savedInShortlist
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary"
              }`}
            >
              {savedInShortlist ? (
                <BookmarkCheck className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Bookmark className="h-3.5 w-3.5" />
              )}
              <span>
                {savedInShortlist
                  ? lang === "de"
                    ? "Gemerkt"
                    : lang === "en"
                      ? "Saved"
                      : "Đã lưu"
                  : lang === "de"
                    ? "Merken"
                    : lang === "en"
                      ? "Save"
                      : "Lưu"}
              </span>
            </button>
          )}
        </div>

        {/* Main Content */}
        <CardContent className="px-5 pt-1 pb-4 flex-1 flex flex-col">
          {/* Primary Profession & Optional Secondary Role Pills */}
          <div className="mb-3.5">
            <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
              {primaryProfession}
            </h3>
            {secondaryProfessions.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 mt-1.5">
                <span className="text-[11px] text-slate-500 mr-0.5">
                  {lang === "de" ? "Auch:" : lang === "en" ? "Also:" : "Ngành phụ:"}
                </span>
                {secondaryProfessions.map((role) => (
                  <span
                    key={role}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80"
                  >
                    {role}
                  </span>
                ))}
              </div>
            )}
          </div>

          {matchReason && (
            <div className="mb-3.5 rounded-lg border border-emerald-200 bg-emerald-50/80 p-2.5 text-xs text-emerald-950 leading-relaxed">
              <span className="font-semibold text-emerald-800 block mb-0.5">
                {lang === "de"
                  ? "KI-Empfehlung:"
                  : lang === "en"
                    ? "AI Match Insight:"
                    : "Đánh giá từ AI:"}
              </span>
              {matchReason}
            </div>
          )}

          {/* Key Metrics & 4-Step Readiness Pathway Tracker */}
          <div className="rounded-xl bg-slate-50/80 border border-slate-200/70 p-3 mb-3.5 space-y-2.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              {candidate.german_level && (
                <div className="flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  <Badge
                    className={`${getGermanLevelColor(candidate.german_level)} text-xs font-semibold border`}
                  >
                    Deutsch {candidate.german_level}
                  </Badge>
                </div>
              )}

              {candidate.visa_status ? (
                <Badge className="bg-indigo-50 text-indigo-800 border-indigo-200 text-[11px] font-semibold border">
                  Visum &amp; Ausbildungsvertrag
                </Badge>
              ) : (
                candidate.experience_years != null &&
                candidate.experience_years > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                    {candidate.experience_years}{" "}
                    {candidate.experience_years === 1
                      ? t.candidates?.year_experience || "Jahr Praxis"
                      : t.candidates?.years_experience || "Jahre Praxis"}
                  </span>
                )
              )}
            </div>

            {/* 4-Step Visual Readiness Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                <span className="font-medium">{stageMeta.stepLabel}</span>
                <span className="font-mono font-semibold text-slate-700">
                  {stageMeta.stepCount * 25}%
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 rounded-full transition-colors ${
                      step <= stageMeta.stepCount ? stageMeta.barColor : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {candidate.availability_label && (
              <div className="flex items-start gap-1.5 text-xs text-slate-700 pt-0.5">
                <Clock className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-medium leading-tight">{candidate.availability_label}</span>
              </div>
            )}
          </div>

          {/* Verified Dossier Highlights */}
          {candidate.highlights && candidate.highlights.length > 0 && (
            <ul className="space-y-1.5 mb-2 text-xs text-slate-600 mt-auto">
              {candidate.highlights.slice(0, 3).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Direct Dossier Documents (Lebenslauf, Zertifikat, Motivationsschreiben) */}
          {candidate.documents && candidate.documents.length > 0 && (
            <div className="mt-2.5 pt-2.5 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <FileText className="h-3 w-3 text-primary" />
                <span>
                  {lang === "de"
                    ? "Bewerbungsunterlagen (PDF)"
                    : lang === "en"
                      ? "Application Documents (PDF)"
                      : "Hồ sơ đính kèm (PDF)"}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {candidate.documents.slice(0, 3).map((doc) => (
                  <a
                    key={doc.url}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md bg-slate-50 hover:bg-primary/8 text-slate-700 hover:text-primary border border-slate-200/90 hover:border-primary/30 px-2 py-1 text-[11px] font-medium transition-colors"
                  >
                    <FileText className="h-3 w-3 flex-shrink-0 text-primary" />
                    <span className="truncate max-w-[155px]">{doc.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Video Section - Native HTML5 Video or Iframe directly in card */}
          {candidate.video_url && (
            <div className="mt-3 pt-3 border-t border-border">
              {candidate.video_url.startsWith("/") || candidate.video_url.endsWith(".mp4") ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-200">
                  <video
                    src={candidate.video_url}
                    controls
                    preload="metadata"
                    playsInline
                    className="w-full h-full object-cover"
                    title={`Vorstellungsvideo - ${candidateCode}`}
                  />
                </div>
              ) : embedUrl && !videoAllowed ? (
                <button
                  type="button"
                  className="w-full rounded-lg bg-slate-100 p-4 text-xs text-slate-700"
                  onClick={openConsentSettings}
                >
                  {lang === "de"
                    ? "Video ansehen: externe Medien in den Datenschutzeinstellungen erlauben."
                    : lang === "en"
                      ? "Watch video: allow external media in privacy settings."
                      : "Xem video: cho phép video bên ngoài trong cài đặt quyền riêng tư."}
                </button>
              ) : embedUrl && !videoError ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`Video - ${candidateCode}`}
                    onLoad={() => setVideoError(false)}
                    onError={() => setVideoError(true)}
                  />
                </div>
              ) : (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <p className="text-sm text-gray-500 text-center px-4">
                    {!embedUrl || videoError ? "Video-Link ungültig" : "Video wird geladen..."}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>

        {/* Footer - CTA Buttons */}
        <CardFooter className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row gap-2">
          {!preview && (
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto gap-1.5 text-xs bg-white hover:bg-slate-50"
            >
              <Link href={`/fuer-arbeitgeber/kandidaten/${candidate.id}`}>
                <ExternalLink className="h-3.5 w-3.5" />
                {lang === "de" ? "Exposé" : lang === "en" ? "Dossier" : "Hồ sơ"}
              </Link>
            </Button>
          )}
          <Button
            className="w-full flex-1 gap-2 bg-primary hover:bg-primary/90 shadow-xs text-xs font-semibold"
            disabled={preview}
            onClick={() => onRequestProfile?.(candidate)}
          >
            <FileText className="h-3.5 w-3.5" />
            {ctaLabel}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
