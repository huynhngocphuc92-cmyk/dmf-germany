"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { User, Briefcase, Award, FileText } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BLUR_SQUARE } from "@/lib/image-placeholder";
import type { Candidate } from "@/app/admin/candidates/types";
import { categoryLabelsI18n } from "@/app/admin/candidates/types";
import { useLanguage } from "@/components/providers/LanguageProvider";

/**
 * Helper function to convert YouTube URL to embed URL
 * Supports: watch?v=..., youtu.be/..., embed/..., shorts/..., and other formats
 */
function getEmbedUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  const cleanUrl = url.trim();

  // Regex bắt ID từ: youtube.com/watch, youtu.be, youtube.com/shorts, youtube.com/embed
  // Pattern này bắt được cả link thường, link rút gọn và link Shorts
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = cleanUrl.match(regExp);

  // ID YouTube chuẩn thường có 11 ký tự
  if (match && match[2] && match[2].length === 11) {
    // Use youtube-nocookie.com for better privacy compliance (DSGVO)
    return `https://www.youtube-nocookie.com/embed/${match[2]}`;
  }

  return null;
}

interface CandidateCardProps {
  candidate: Candidate;
  onRequestProfile: (candidate: Candidate) => void;
}

/**
 * Get German level badge color based on level
 */
const getGermanLevelColor = (level: string): string => {
  switch (level) {
    case "A1":
    case "A2":
      return "bg-amber-100 text-amber-700 border-amber-300";
    case "B1":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "B2":
      return "bg-purple-100 text-purple-700 border-purple-300";
    case "C1":
    case "C2":
      return "bg-emerald-100 text-emerald-700 border-emerald-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

/**
 * Generate candidate code from ID
 */
const getCandidateCode = (id: string): string => {
  // Use first 8 characters of ID as code
  return id.slice(0, 8).toUpperCase();
};

/**
 * Get initials from profession or category
 */
const getInitials = (profession?: string, category?: string): string => {
  if (profession) {
    const words = profession.split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return profession.substring(0, 2).toUpperCase();
  }
  if (category) {
    return category.substring(0, 2).toUpperCase();
  }
  return "DM";
};

export const CandidateCard = ({ candidate, onRequestProfile }: CandidateCardProps) => {
  const { lang, t } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const candidateCode = getCandidateCode(candidate.id);
  const embedUrl = candidate.video_url ? getEmbedUrl(candidate.video_url) : null;
  const categoryLabel = candidate.category
    ? categoryLabelsI18n[candidate.category]?.[lang] || candidate.category
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden group">
        {/* Header - Avatar & Code */}
        <CardHeader className="pb-4 bg-gradient-to-br from-muted/30 to-muted/10 border-b">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <Avatar className="h-16 w-16 border-2 border-primary/20">
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
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                  {getInitials(candidate.profession, candidate.category)}
                </AvatarFallback>
              )}
            </Avatar>

            {/* Code */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-mono tracking-wide mb-1">
                {t.candidates?.code_label || "Kandidat"} #{candidateCode}
              </p>
              {candidate.category && (
                <Badge
                  variant="outline"
                  className="text-xs border-primary/30 text-primary bg-primary/5"
                >
                  {categoryLabel}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="pt-5 pb-4 flex-1 flex flex-col">
          {/* Profession */}
          {candidate.profession && (
            <h3 className="text-lg font-bold text-foreground mb-4 line-clamp-2">
              {candidate.profession}
            </h3>
          )}

          {/* Experience & German Level */}
          <div className="space-y-3 mb-4">
            {/* Experience */}
            {candidate.experience_years !== undefined && candidate.experience_years > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground">
                  {candidate.experience_years}{" "}
                  {candidate.experience_years === 1
                    ? t.candidates?.year_experience || "Jahr Erfahrung"
                    : t.candidates?.years_experience || "Jahre Erfahrung"}
                </span>
              </div>
            )}

            {/* German Level */}
            {candidate.german_level && (
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Badge
                  className={`${getGermanLevelColor(candidate.german_level)} text-xs font-medium border`}
                >
                  Deutsch {candidate.german_level}
                </Badge>
              </div>
            )}
          </div>

          {/* Video Section - Iframe directly in card */}
          {candidate.video_url && (
            <div className="mt-auto pt-4 border-t border-border">
              {embedUrl && !videoError ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`Video - ${candidateCode}`}
                    onLoad={() => {
                      // Video loaded successfully
                      setVideoError(false);
                    }}
                    onError={() => {
                      // Video failed to load
                      setVideoError(true);
                    }}
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

        {/* Footer - CTA Button */}
        <CardFooter className="pt-4 pb-5 border-t bg-muted/20">
          <Button
            className="w-full gap-2 bg-primary hover:bg-primary/90 shadow-md"
            onClick={() => onRequestProfile(candidate)}
          >
            <FileText className="h-4 w-4" />
            {t.candidates?.btn_request_profile || "Profil anfragen"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
