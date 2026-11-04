"use client";
import Link from "next/link";

import { useState, useMemo } from "react";
import {
  Users,
  X,
  Sparkles,
  Search,
  Loader2,
  RotateCcw,
  CheckCircle2,
  GraduationCap,
  Plane,
  BookOpen,
  Award,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { CandidateCard } from "@/components/candidates/CandidateCard";
import { InquiryModal } from "@/components/candidates/InquiryModal";
import { ShortlistDrawer } from "@/components/candidates/ShortlistDrawer";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type {
  CandidateCategory,
  CandidatePoolStage,
  GermanLevel,
} from "@/app/admin/candidates/types";
import type { PublicCandidate } from "@/lib/candidates/public-profile";
import { categoryLabelsI18n } from "@/app/admin/candidates/types";
import { DMF_POOL_STAGE_SUMMARY } from "@/lib/candidates/dmf-pool-data";
import { Button } from "@/components/ui/button";

interface CandidatesClientProps {
  initialCandidates: PublicCandidate[];
  error: string | null;
}

interface MatchResultItem {
  id: string;
  matchScore: number;
  reason: string;
}

const PAGE_SIZE = 24;

const STAGE_ORDER: CandidatePoolStage[] = [
  "interview_ready",
  "b1_b2_exam",
  "b_niveau",
  "a_niveau",
  "in_germany",
];

const STAGE_CARD_BORDER: Record<CandidatePoolStage, string> = {
  interview_ready: "border-t-4 border-t-emerald-500",
  b1_b2_exam: "border-t-4 border-t-amber-500",
  b_niveau: "border-t-4 border-t-blue-500",
  a_niveau: "border-t-4 border-t-slate-400",
  in_germany: "border-t-4 border-t-indigo-600",
};

export function CandidatesClient({ initialCandidates, error }: CandidatesClientProps) {
  const { lang, t } = useLanguage();
  const [selectedStage, setSelectedStage] = useState<CandidatePoolStage | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<CandidateCategory | "all">("all");
  const [selectedLevel, setSelectedLevel] = useState<GermanLevel | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [selectedCandidate, setSelectedCandidate] = useState<PublicCandidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // AI Talent Matcher state
  const [aiQuery, setAiQuery] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [aiMatches, setAiMatches] = useState<Record<string, MatchResultItem> | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Count candidates per pool stage
  const stageCounts = useMemo(() => {
    const counts: Record<CandidatePoolStage, number> = {
      interview_ready: 0,
      b1_b2_exam: 0,
      b_niveau: 0,
      a_niveau: 0,
      in_germany: 0,
    };
    initialCandidates.forEach((c) => {
      const stage = c.pool_stage || (c.visa_status ? "in_germany" : "interview_ready");
      counts[stage] = (counts[stage] || 0) + 1;
    });
    return counts;
  }, [initialCandidates]);

  // Get unique categories from candidates
  const availableCategories = useMemo(() => {
    const categories = new Set<CandidateCategory>();
    initialCandidates.forEach((c) => {
      if (c.category) {
        categories.add(c.category);
      }
    });
    return Array.from(categories);
  }, [initialCandidates]);

  // Filter and optionally rank candidates by AI match score
  const filteredCandidates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const base = initialCandidates.filter((c) => {
      const cStage = c.pool_stage || (c.visa_status ? "in_germany" : "interview_ready");
      if (selectedStage !== "all" && cStage !== selectedStage) return false;
      if (selectedCategory !== "all" && c.category !== selectedCategory) return false;
      if (selectedLevel !== "all" && c.german_level !== selectedLevel) return false;
      if (q) {
        const hay = [
          c.display_code,
          c.initials_label,
          c.cohort,
          c.profession,
          c.german_level,
          c.availability_label,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (!aiMatches) {
      return base;
    }

    const matchedOnly = base.filter((c) => Boolean(aiMatches[c.id]));
    const listToSort = matchedOnly.length > 0 ? matchedOnly : base;
    return [...listToSort].sort(
      (a, b) => (aiMatches[b.id]?.matchScore ?? 0) - (aiMatches[a.id]?.matchScore ?? 0)
    );
  }, [initialCandidates, selectedStage, selectedCategory, selectedLevel, searchQuery, aiMatches]);

  const visibleCandidates = useMemo(
    () => filteredCandidates.slice(0, visibleCount),
    [filteredCandidates, visibleCount]
  );

  const hasActiveFilters =
    selectedStage !== "all" ||
    selectedCategory !== "all" ||
    selectedLevel !== "all" ||
    searchQuery.trim().length > 0 ||
    Boolean(aiMatches);

  const handleResetAllFilters = () => {
    setSelectedStage("all");
    setSelectedCategory("all");
    setSelectedLevel("all");
    setSearchQuery("");
    setVisibleCount(PAGE_SIZE);
    handleResetAiMatcher();
  };

  const handleSelectStage = (stage: CandidatePoolStage | "all") => {
    setSelectedStage(stage);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSelectCategory = (cat: CandidateCategory | "all") => {
    setSelectedCategory(cat);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSelectLevel = (lvl: GermanLevel | "all") => {
    setSelectedLevel(lvl);
    setVisibleCount(PAGE_SIZE);
  };

  const handleRunAiMatcher = async (customQuery?: string) => {
    const q = (customQuery ?? aiQuery).trim();
    if (q.length < 2 || initialCandidates.length === 0) return;
    if (customQuery) setAiQuery(customQuery);

    setIsMatching(true);
    setAiError(null);
    try {
      const response = await fetch("/api/candidates/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          candidates: initialCandidates.slice(0, 60),
          lang,
        }),
      });
      const result = await response.json();
      if (!response.ok || !Array.isArray(result.matches)) {
        setAiError(
          result.error ||
            (lang === "de"
              ? "KI-Analyse momentan nicht verfügbar."
              : lang === "en"
                ? "AI matching temporarily unavailable."
                : "Tính năng lọc AI tạm thời gián đoạn.")
        );
        return;
      }

      const map: Record<string, MatchResultItem> = {};
      for (const item of result.matches as MatchResultItem[]) {
        map[item.id] = item;
      }
      setAiMatches(map);
      setAiSummary(result.summary || null);
      setSelectedCategory("all");
      setSelectedStage("all");
      setSelectedLevel("all");
      setVisibleCount(PAGE_SIZE);
    } catch {
      setAiError(
        lang === "de"
          ? "Netzwerkfehler bei der KI-Suche."
          : lang === "en"
            ? "Network error during AI search."
            : "Lỗi kết nối khi phân tích ứng viên."
      );
    } finally {
      setIsMatching(false);
    }
  };

  const handleResetAiMatcher = () => {
    setAiQuery("");
    setAiMatches(null);
    setAiSummary(null);
    setAiError(null);
  };

  const handleRequestProfile = (candidate: PublicCandidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  const examplePrompts =
    lang === "de"
      ? [
          "Pflegefachkraft / Azubi Pflege mit Deutsch B1/B2 & Video",
          "Motivierte Auszubildende für Gastronomie / Hotellerie (Mercure-Standard)",
          "Handwerk / Industriemechaniker / SHK / Kfz ab B1",
        ]
      : lang === "en"
        ? [
            "Nursing apprentice with German B1/B2 & video intro",
            "Motivated apprentices for hospitality / culinary",
            "Skilled technician in machining / electronics (B1+)",
          ]
        : [
            "Ứng viên Điều dưỡng trình độ B1/B2 đã có Video phỏng vấn",
            "Học viên du học nghề Nhà hàng - Khách sạn sẵn sàng phỏng vấn",
            "Ứng viên Kỹ thuật cơ khí / Điện / SHK trình độ B1+",
          ];

  const getStageIcon = (stage: CandidatePoolStage) => {
    switch (stage) {
      case "interview_ready":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "b1_b2_exam":
        return <Award className="w-4 h-4 text-amber-500" />;
      case "b_niveau":
        return <GraduationCap className="w-4 h-4 text-blue-500" />;
      case "a_niveau":
        return <BookOpen className="w-4 h-4 text-slate-500" />;
      case "in_germany":
        return <Plane className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground pt-28 md:pt-36 pb-12 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase mb-5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>
                {initialCandidates.length} Geprüfte DMF-Talente • Kohorten K1–K57 • DSGVO-konform
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              DMF Kandidaten-Pool
            </h1>
            <p className="text-base md:text-lg opacity-90 max-w-3xl mx-auto leading-relaxed">
              {lang === "de"
                ? "Transparente Personalpipeline aus unserer eigenen Akademie in Vietnam: Von der Grundstufe (A-Niveau) und dem B-Niveau über die B1/B2-Prüfungsvorbereitung bis zu sofort interviewbereiten Kandidaten und erfolgreich in Deutschland platzierten Auszubildenden."
                : lang === "en"
                  ? "Transparent talent pipeline from our own academy in Vietnam: From A- & B-Level language cohorts and B1/B2 exam candidates to interview-ready talents and apprentices already placed in Germany."
                  : "Hệ thống phân phối học viên thực tế từ Học viện DMF: Từ khối đang học tiếng (A-Niveaus, B-Niveaus, Đang thi B1/B2) đến nhóm Đã sẵn sàng phỏng vấn và Đã sang Đức học nghề."}
            </p>
          </div>
        </div>
      </section>

      {/* AI Talent Matcher Section */}
      {initialCandidates.length > 0 && (
        <section className="py-6 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-b border-blue-900/40">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base md:text-lg font-bold">
                    {lang === "de"
                      ? "KI-Kandidaten-Matcher (Sofort-Empfehlung)"
                      : lang === "en"
                        ? "AI Talent Matcher (Instant Shortlist)"
                        : "Trợ lý AI Tìm Ứng viên Phù hợp"}
                  </h2>
                  <p className="text-xs text-slate-300">
                    {lang === "de"
                      ? "Beschreiben Sie kurz Ihre offene Stelle – unsere KI bewertet und sortiert den Kandidaten-Pool in Sekunden."
                      : lang === "en"
                        ? "Describe your open role in one sentence — our AI scores and ranks matching profiles in seconds."
                        : "Mô tả ngắn vị trí đang cần tuyển — AI sẽ chấm điểm mức độ phù hợp và lọc ứng viên ngay lập tức."}
                  </p>
                </div>
              </div>
              {aiMatches && (
                <button
                  type="button"
                  onClick={handleResetAiMatcher}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg transition-colors self-start md:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {lang === "de"
                    ? "KI-Filter zurücksetzen"
                    : lang === "en"
                      ? "Reset AI filter"
                      : "Xóa bộ lọc AI"}
                </button>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRunAiMatcher();
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder={
                    lang === "de"
                      ? "z.B. Suche 2 Pflegefachkräfte mit Deutsch B2 und Krankenhauserfahrung..."
                      : lang === "en"
                        ? "e.g. Looking for 2 nursing professionals with German B2..."
                        : "VD: Cần tìm 2 ứng viên Điều dưỡng trình độ B2 có kinh nghiệm..."
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <Button
                type="submit"
                disabled={isMatching || aiQuery.trim().length < 2}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-2.5 h-auto rounded-xl gap-2"
              >
                {isMatching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {lang === "de"
                  ? "Passende Talente finden"
                  : lang === "en"
                    ? "Match Candidates"
                    : "Lọc ứng viên bằng AI"}
              </Button>
            </form>

            {/* Quick Example Chips */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className="text-xs text-slate-400">
                {lang === "de" ? "Beispiele:" : lang === "en" ? "Examples:" : "Gợi ý nhanh:"}
              </span>
              {examplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleRunAiMatcher(prompt)}
                  className="text-xs px-2.5 py-1 rounded-full bg-white/10 hover:bg-emerald-500/20 hover:border-emerald-400/40 border border-white/15 text-slate-200 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {aiError && (
              <p className="mt-3 text-xs text-amber-300 bg-amber-950/60 border border-amber-700/50 rounded-lg px-3 py-2">
                {aiError}
              </p>
            )}

            {aiSummary && (
              <div className="mt-3.5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-100 text-sm flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{aiSummary}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5-Stage Pool Funnel Selector & Multi-Facet Filter Bar */}
      <section className="py-7 bg-white border-b border-slate-200 shadow-2xs">
        <div className="container mx-auto px-4 space-y-5">
          {/* Lifecycle Stage Cards */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {lang === "de"
                  ? "1. Nach Ausbildungs- & Vermittlungsphase auswählen"
                  : lang === "en"
                    ? "1. Select Training & Placement Stage"
                    : "1. Chọn giai đoạn Học tiếng – Thi B1/B2 – Sẵn sàng phỏng vấn – Đã sang Đức"}
              </h2>
              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetAllFilters}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {lang === "de"
                      ? "Alle Filter zurücksetzen"
                      : lang === "en"
                        ? "Reset all filters"
                        : "Đặt lại bộ lọc"}
                  </button>
                )}
                <span className="text-xs text-slate-600 font-semibold bg-slate-100 px-2.5 py-1 rounded-md">
                  {filteredCandidates.length} / {initialCandidates.length}{" "}
                  {lang === "de" ? "Profile" : lang === "en" ? "Profiles" : "Hồ sơ"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <button
                type="button"
                onClick={() => handleSelectStage("all")}
                className={`text-left rounded-xl p-3.5 border border-t-4 border-t-primary transition-all ${
                  selectedStage === "all"
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold opacity-85">
                    {lang === "de"
                      ? "Gesamter Pool"
                      : lang === "en"
                        ? "Entire Pool"
                        : "Toàn bộ Kho"}
                  </span>
                  <Users className="w-4 h-4 opacity-80" />
                </div>
                <p className="text-2xl font-bold">{initialCandidates.length}</p>
                <p className="text-[11px] opacity-80 mt-0.5 line-clamp-1">
                  {lang === "de"
                    ? "100% • Alle Phasen (K1–K57)"
                    : lang === "en"
                      ? "100% • All cohorts (K1–K57)"
                      : "100% • Tất cả học viên DMF"}
                </p>
              </button>

              {STAGE_ORDER.map((stage) => {
                const meta = DMF_POOL_STAGE_SUMMARY[stage];
                const active = selectedStage === stage;
                const count = stageCounts[stage] ?? meta.count;
                const badgeText =
                  lang === "de" ? meta.badgeDe : lang === "en" ? meta.badgeEn : meta.badgeVn;
                const subText =
                  lang === "de"
                    ? meta.subtitleDe
                    : lang === "en"
                      ? meta.subtitleEn
                      : meta.subtitleVn;

                return (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => handleSelectStage(stage)}
                    className={`text-left rounded-xl p-3.5 border transition-all ${STAGE_CARD_BORDER[stage]} ${
                      active
                        ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-primary/25"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold truncate">{badgeText}</span>
                      {getStageIcon(stage)}
                    </div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p
                      className={`text-[11px] mt-0.5 line-clamp-1 ${
                        active ? "text-slate-300" : "text-slate-500"
                      }`}
                      title={subText}
                    >
                      {subText}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter + German Level Filter + Quick Search Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-4">
              {/* Program Track Filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-1">
                  {lang === "de" ? "Programm:" : lang === "en" ? "Track:" : "Nhóm:"}
                </span>
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSelectCategory("all")}
                  className="text-xs h-8 px-3"
                >
                  {lang === "de" ? "Alle" : lang === "en" ? "All" : "Tất cả"}
                </Button>
                {availableCategories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSelectCategory(cat)}
                    className="text-xs h-8 px-3"
                  >
                    {categoryLabelsI18n[cat]?.[lang] || cat}
                  </Button>
                ))}
              </div>

              {/* German Level Quick Filter */}
              <div className="flex flex-wrap items-center gap-1.5 border-l border-slate-200 pl-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-1">
                  {lang === "de" ? "Deutsch:" : lang === "en" ? "German:" : "Trình độ:"}
                </span>
                {(["all", "B2", "B1", "A2", "A1"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleSelectLevel(lvl)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors ${
                      selectedLevel === lvl
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {lvl === "all"
                      ? lang === "de"
                        ? "Alle"
                        : lang === "en"
                          ? "All"
                          : "Tất cả"
                      : lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                placeholder={
                  lang === "de"
                    ? "Code (#DMF), Beruf, Kohorte (z.B. K21)..."
                    : lang === "en"
                      ? "Search code (#DMF), profession, cohort (K21)..."
                      : "Tìm mã (#DMF), ngành nghề, khóa (K21)..."
                }
                className="w-full pl-9 pr-8 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Active Stage Description Banner */}
      {selectedStage !== "all" && (
        <section className="bg-slate-900 text-white py-3 border-b border-slate-800">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              {getStageIcon(selectedStage)}
              <span className="font-semibold">
                {lang === "de"
                  ? DMF_POOL_STAGE_SUMMARY[selectedStage].badgeDe
                  : lang === "en"
                    ? DMF_POOL_STAGE_SUMMARY[selectedStage].badgeEn
                    : DMF_POOL_STAGE_SUMMARY[selectedStage].badgeVn}
                :
              </span>
              <span className="text-slate-300">
                {lang === "de"
                  ? DMF_POOL_STAGE_SUMMARY[selectedStage].subtitleDe
                  : lang === "en"
                    ? DMF_POOL_STAGE_SUMMARY[selectedStage].subtitleEn
                    : DMF_POOL_STAGE_SUMMARY[selectedStage].subtitleVn}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleSelectStage("all")}
              className="text-xs text-emerald-300 hover:underline self-start sm:self-auto"
            >
              {lang === "de"
                ? "Alle 296 Kandidaten anzeigen"
                : lang === "en"
                  ? "Show all 296 candidates"
                  : "Xem toàn bộ 296 ứng viên"}
            </button>
          </div>
        </section>
      )}

      {/* Candidates Grid */}
      <section className="py-10 md:py-14 pb-28">
        <div className="container mx-auto px-4">
          {error ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
                <X className="h-6 w-6" />
                <div>
                  <p className="font-semibold">
                    {t.candidates?.error_loading || "Fehler beim Laden der Kandidaten"}
                  </p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aktuell keine passenden öffentlichen Profile
              </h3>
              <p className="text-gray-600 mb-4">
                Für diese Filterkombination liegen keine Treffer vor. Setzen Sie die Filter zurück
                oder senden Sie uns Ihren Personalbedarf.
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={handleResetAllFilters}>
                  Filter zurücksetzen
                </Button>
                <Button asChild>
                  <Link href="/#contact">Personalbedarf besprechen</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onRequestProfile={handleRequestProfile}
                    matchScore={aiMatches?.[candidate.id]?.matchScore}
                    matchReason={aiMatches?.[candidate.id]?.reason}
                  />
                ))}
              </div>

              {visibleCount < filteredCandidates.length && (
                <div className="mt-12 text-center">
                  <p className="text-sm text-slate-500 mb-3">
                    {lang === "de"
                      ? `${visibleCandidates.length} von ${filteredCandidates.length} Kandidaten angezeigt`
                      : lang === "en"
                        ? `Showing ${visibleCandidates.length} of ${filteredCandidates.length} candidates`
                        : `Đang hiển thị ${visibleCandidates.length} / ${filteredCandidates.length} ứng viên`}
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                      className="gap-2 font-semibold"
                    >
                      <ChevronDown className="w-4 h-4" />
                      {lang === "de"
                        ? `Weitere ${Math.min(PAGE_SIZE, filteredCandidates.length - visibleCount)} Profile laden`
                        : lang === "en"
                          ? `Load ${Math.min(PAGE_SIZE, filteredCandidates.length - visibleCount)} more profiles`
                          : `Xem thêm ${Math.min(PAGE_SIZE, filteredCandidates.length - visibleCount)} hồ sơ`}
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => setVisibleCount(filteredCandidates.length)}
                      className="text-slate-600"
                    >
                      {lang === "de"
                        ? `Alle (${filteredCandidates.length}) anzeigen`
                        : lang === "en"
                          ? `Show all (${filteredCandidates.length})`
                          : `Hiển thị tất cả (${filteredCandidates.length})`}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Inquiry Modal */}
      <InquiryModal candidate={selectedCandidate} isOpen={isModalOpen} onClose={handleCloseModal} />

      {/* Floating Shortlist (Merkliste) Drawer */}
      <ShortlistDrawer />
    </div>
  );
}
