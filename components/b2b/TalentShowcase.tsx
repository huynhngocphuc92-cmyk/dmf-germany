"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PlayCircle,
  FileText,
  Check,
  Languages,
  ShieldCheck,
  User,
  Briefcase,
  Calendar,
  Award,
  X,
  AlertCircle,
} from "lucide-react";
import { getEmbedUrl } from "@/lib/utils/youtube";

// ============================================
// TYPES
// ============================================

type Industry = "pflege" | "gastronomie" | "handwerk" | "technik";
type GermanLevel = "A2" | "B1" | "B2" | "C1";

interface Candidate {
  id: string;
  code: string;
  industry: Industry;
  germanLevel: GermanLevel;
  qualifications: string[];
  availability: string;
  experience: string;
  videoAvailable: boolean; // Deprecated: Use videoUrl instead. Kept for backward compatibility
  videoUrl?: string; // YouTube URL for candidate introduction video
}

interface IndustryConfig {
  label: string;
  labelDe: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  avatarBg: string;
  avatarText: string;
}

// ============================================
// CONFIGURATION
// ============================================

const industryConfig: Record<Industry, IndustryConfig> = {
  pflege: {
    label: "Pflege",
    labelDe: "Gesundheit & Pflege",
    bgColor: "bg-sky-600",
    textColor: "text-white",
    borderColor: "border-sky-600",
    avatarBg: "bg-sky-100",
    avatarText: "text-sky-700",
  },
  gastronomie: {
    label: "Gastronomie",
    labelDe: "Hotellerie & Gastronomie",
    bgColor: "bg-amber-500",
    textColor: "text-white",
    borderColor: "border-amber-500",
    avatarBg: "bg-amber-100",
    avatarText: "text-amber-700",
  },
  handwerk: {
    label: "Handwerk",
    labelDe: "Handwerk & Bau",
    bgColor: "bg-orange-600",
    textColor: "text-white",
    borderColor: "border-orange-600",
    avatarBg: "bg-orange-100",
    avatarText: "text-orange-700",
  },
  technik: {
    label: "Technik",
    labelDe: "Technik & Industrie",
    bgColor: "bg-slate-700",
    textColor: "text-white",
    borderColor: "border-slate-700",
    avatarBg: "bg-slate-100",
    avatarText: "text-slate-700",
  },
};

const germanLevelConfig: Record<GermanLevel, { label: string; description: string }> = {
  A2: { label: "A2", description: "Grundkenntnisse" },
  B1: { label: "B1", description: "Fortgeschritten" },
  B2: { label: "B2", description: "Selbständig" },
  C1: { label: "C1", description: "Fachkundig" },
};

// Mock Data - 4 Kandidaten
const mockCandidates: Candidate[] = [
  {
    id: "1",
    code: "DMF-2401",
    industry: "pflege",
    germanLevel: "B2",
    qualifications: [
      "3 Jahre Berufserfahrung in der Altenpflege",
      "Vollständig geimpft (COVID-19, Hepatitis B)",
      "Telc-Zertifikat B2 Pflege",
    ],
    availability: "03/2024",
    experience: "Altenpflegeheim & Krankenhaus",
    videoAvailable: true,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Sample YouTube video
  },
  {
    id: "2",
    code: "DMF-2402",
    industry: "gastronomie",
    germanLevel: "B1",
    qualifications: [
      "5 Jahre Erfahrung als Souschef",
      "IHK-anerkanntes Koch-Zertifikat",
      "Hygieneschulung nach HACCP",
    ],
    availability: "02/2024",
    experience: "5-Sterne-Hotel & Fine Dining",
    videoAvailable: true,
    videoUrl: "https://youtu.be/dQw4w9WgXcQ", // Sample YouTube short link
  },
  {
    id: "3",
    code: "DMF-2403",
    industry: "handwerk",
    germanLevel: "B1",
    qualifications: [
      "4 Jahre Erfahrung im Hochbau",
      "Elektroinstallateur-Zertifikat",
      "Führerschein Klasse B & C",
    ],
    availability: "04/2024",
    experience: "Wohnungsbau & Renovierung",
    videoAvailable: false,
  },
  {
    id: "4",
    code: "DMF-2404",
    industry: "technik",
    germanLevel: "B2",
    qualifications: [
      "Ingenieurstudium (Bachelor)",
      "CNC-Programmierung & CAD/CAM",
      "Qualitätsmanagement ISO 9001",
    ],
    availability: "05/2024",
    experience: "Automobilindustrie",
    videoAvailable: true,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Sample YouTube video
  },
];

// ============================================
// SUB-COMPONENTS
// ============================================

interface CandidateCardProps {
  candidate: Candidate;
  index: number;
  onViewVideo: (candidate: Candidate) => void;
  onRequestProfile: (candidate: Candidate) => void;
}

function CandidateCard({ 
  candidate, 
  index, 
  onViewVideo, 
  onRequestProfile 
}: CandidateCardProps) {
  const { t } = useLanguage();
  const industry = industryConfig[candidate.industry];
  const germanLevel = germanLevelConfig[candidate.germanLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        delay: index * 0.15, 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <Card className="h-full border-2 border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 overflow-hidden group">
        {/* Card Header - Identification */}
        <CardHeader className="pb-4 bg-gradient-to-br from-muted/30 to-muted/10">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <Avatar className={`h-16 w-16 ${industry.avatarBg} border-2 ${industry.borderColor}`}>
              <AvatarFallback className={`${industry.avatarText} text-xl font-bold`}>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {/* Code */}
              <p className="text-sm text-muted-foreground font-mono tracking-wide mb-2">
                #{candidate.code}
              </p>
              
              {/* Industry Badge - Prominent */}
              <Badge className={`${industry.bgColor} ${industry.textColor} text-sm px-3 py-1 font-medium shadow-sm`}>
                {industry.labelDe}
              </Badge>
            </div>
          </div>
        </CardHeader>

        {/* Card Content - Competencies */}
        <CardContent className="pt-5 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Block 1: German Level (Priority #1) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Languages className="h-4 w-4" />
                <span className="font-medium">{t.talentShowcase.skills_label}</span>
              </div>
              
              <div className="flex items-center gap-3">
                {/* German Flag indicator */}
                <div className="flex flex-col gap-0.5">
                  <div className="w-8 h-2 bg-black rounded-t-sm" />
                  <div className="w-8 h-2 bg-red-600" />
                  <div className="w-8 h-2 bg-yellow-400 rounded-b-sm" />
                </div>
                
                <div>
                  <p className="text-3xl font-bold text-foreground tracking-tight">
                    {germanLevel.label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {germanLevel.description}
                  </p>
                </div>
              </div>

              {/* Experience Summary */}
              <div className="pt-2 mt-2 border-t border-dashed border-border">
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{candidate.experience}</span>
                </div>
              </div>
            </div>

            {/* Block 2: Qualifications & Availability */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="h-4 w-4" />
                <span className="font-medium">{t.talentShowcase.qualifications_label}</span>
              </div>
              
              <ul className="space-y-2">
                {candidate.qualifications.map((qual, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground leading-snug">{qual}</span>
                  </li>
                ))}
                
                {/* Availability */}
                <li className="flex items-start gap-2 text-sm pt-1">
                  <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground font-medium">
                    {t.talentShowcase.availability_label} {candidate.availability}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>

        {/* Card Footer - Actions */}
        <CardFooter className="pt-4 pb-5 bg-muted/20 border-t flex flex-col sm:flex-row gap-3">
          {/* Video Button (Secondary) - Show if videoUrl exists */}
          {candidate.videoUrl && getEmbedUrl(candidate.videoUrl) && (
            <Button
              variant="outline"
              className="flex-1 gap-2 group-hover:border-primary/50 transition-colors"
              onClick={() => onViewVideo(candidate)}
            >
              <PlayCircle className="h-4 w-4" />
              {t.talentShowcase.btn_video}
            </Button>
          )}
          
          {/* Request Profile Button (Primary) */}
          <Button
            className={`gap-2 bg-primary hover:bg-primary/90 shadow-md ${
              candidate.videoUrl && getEmbedUrl(candidate.videoUrl) ? "flex-1" : "w-full"
            }`}
            onClick={() => onRequestProfile(candidate)}
          >
            <FileText className="h-4 w-4" />
            {t.talentShowcase.btn_profile}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Video Modal Component
interface VideoModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

function VideoModal({ candidate, isOpen, onClose }: VideoModalProps) {
  const { t } = useLanguage();
  if (!candidate) return null;

  const industry = industryConfig[candidate.industry];
  const germanLevel = germanLevelConfig[candidate.germanLevel];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-primary/5 to-accent/5 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className={`h-12 w-12 ${industry.avatarBg} border ${industry.borderColor}`}>
                <AvatarFallback className={`${industry.avatarText}`}>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-xl">
                  {t.talentShowcase.video_title}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <span className="font-mono">#{candidate.code}</span>
                  <span>•</span>
                  <Badge variant="outline" className={`${industry.textColor} ${industry.bgColor} text-xs`}>
                    {industry.label}
                  </Badge>
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Video Player */}
        {candidate.videoUrl ? (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {(() => {
              const embedUrl = getEmbedUrl(candidate.videoUrl);
              
              if (!embedUrl) {
                // Invalid YouTube URL - show error
                return (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/20 rounded-lg">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
                    <p className="text-red-500 text-sm font-medium">Ungültiger YouTube-Link</p>
                    <p className="text-red-400 text-xs mt-1">Bitte überprüfen Sie die URL</p>
                  </div>
                );
              }

              return (
                <iframe
                  src={embedUrl}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`Video giới thiệu - ${candidate.code}`}
                />
              );
            })()}
          </div>
        ) : (
          // Fallback: No video available
          <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <PlayCircle className="h-16 w-16 text-white/30 mb-4" />
              <p className="text-white/60 text-sm">Kein Video verfügbar</p>
            </div>
          </div>
        )}

        {/* Candidate Quick Info */}
        <div className="p-6 bg-muted/30">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                {t.talentShowcase.skills_label}
              </p>
              <p className="text-2xl font-bold text-foreground">{germanLevel.label}</p>
              <p className="text-xs text-muted-foreground">{germanLevel.description}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                {t.talentShowcase.exp_label}
              </p>
              <p className="text-sm font-medium text-foreground">{candidate.experience}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                {t.talentShowcase.availability_label}
              </p>
              <p className="text-lg font-semibold text-primary">{candidate.availability}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            {t.talentShowcase.btn_close}
          </Button>
          <Button 
            className="flex-1"
            onClick={() => {
              onClose();
              // Scroll to contact after modal closes
              setTimeout(() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }, 300);
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            {t.talentShowcase.btn_profile}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function TalentShowcase() {
  const { lang, t } = useLanguage();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleViewVideo = useCallback((candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsVideoModalOpen(true);
  }, []);

  const scrollToContact = useCallback((candidateId: string) => {
    // Find the candidate
    const candidate = mockCandidates.find(c => c.id === candidateId);
    if (!candidate) return;

    const industry = industryConfig[candidate.industry];

    // Scroll to contact section
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }

    // Pre-fill message after scroll
    setTimeout(() => {
      const messageTextarea = document.querySelector<HTMLTextAreaElement>(
        'textarea[name="message"]'
      );
      if (messageTextarea) {
        const prefillText = lang === "de"
          ? `Sehr geehrte Damen und Herren,

ich interessiere mich für das Kandidatenprofil #${candidate.code} (${industry.labelDe}, Deutschkenntnisse ${candidate.germanLevel}).

Bitte übersenden Sie mir das vollständige Bewerberprofil sowie weitere Informationen zu den Vermittlungskonditionen.

Mit freundlichen Grüßen`
          : lang === "en"
          ? `Dear Sir or Madam,

I am interested in candidate profile #${candidate.code} (${industry.labelDe}, German level ${candidate.germanLevel}).

Please send me the complete applicant profile and further information on the placement conditions.

Best regards`
          : `Kính gửi Quý công ty,

Tôi quan tâm đến hồ sơ ứng viên #${candidate.code} (${industry.labelDe}, Trình độ tiếng Đức ${candidate.germanLevel}).

Vui lòng gửi cho tôi hồ sơ ứng viên đầy đủ và thông tin về điều kiện giới thiệu.

Trân trọng`;

        messageTextarea.value = prefillText;
        messageTextarea.dispatchEvent(new Event("input", { bubbles: true }));
        messageTextarea.focus();
      }
    }, 800);
  }, [lang]);

  const handleRequestProfile = useCallback((candidate: Candidate) => {
    scrollToContact(candidate.id);
  }, [scrollToContact]);

  return (
    <section 
      id="talent-showcase" 
      className="py-20 md:py-28 bg-gradient-to-b from-muted/40 via-background to-background"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          {/* Badge */}
          <Badge 
            variant="outline" 
            className="mb-5 px-4 py-1.5 text-sm border-primary/30 text-primary bg-primary/5"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            {t.talentShowcase.badge}
          </Badge>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5 tracking-tight">
            {t.talentShowcase.title}
          </h2>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t.talentShowcase.subtitle}
          </p>
        </motion.div>

        {/* Candidates Grid - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {mockCandidates.map((candidate, index) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              index={index}
              onViewVideo={handleViewVideo}
              onRequestProfile={handleRequestProfile}
            />
          ))}
        </div>

        {/* DSGVO Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-muted/50 rounded-full border border-border">
            <ShieldCheck className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              {t.talentShowcase.disclaimer}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <VideoModal
        candidate={selectedCandidate}
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </section>
  );
}
