"use client";
import Link from "next/link";

import { useState, useMemo } from "react";
import { Users, X, Sparkles, Search, Loader2, RotateCcw } from "lucide-react";
import { CandidateCard } from "@/components/candidates/CandidateCard";
import { InquiryModal } from "@/components/candidates/InquiryModal";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { CandidateCategory } from "@/app/admin/candidates/types";
import type { PublicCandidate } from "@/lib/candidates/public-profile";
import { categoryLabelsI18n } from "@/app/admin/candidates/types";
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

export function CandidatesClient({ initialCandidates, error }: CandidatesClientProps) {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<CandidateCategory | "all">("all");
  const [selectedCandidate, setSelectedCandidate] = useState<PublicCandidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // AI Talent Matcher state
  const [aiQuery, setAiQuery] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [aiMatches, setAiMatches] = useState<Record<string, MatchResultItem> | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

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
    const base =
      selectedCategory === "all"
        ? initialCandidates
        : initialCandidates.filter((c) => c.category === selectedCategory);

    if (!aiMatches) {
      return base;
    }

    const matchedOnly = base.filter((c) => Boolean(aiMatches[c.id]));
    const listToSort = matchedOnly.length > 0 ? matchedOnly : base;
    return [...listToSort].sort(
      (a, b) => (aiMatches[b.id]?.matchScore ?? 0) - (aiMatches[a.id]?.matchScore ?? 0)
    );
  }, [initialCandidates, selectedCategory, aiMatches]);

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
          candidates: initialCandidates,
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
          "Pflegefachkraft mit Deutsch B2 & Krankenhauserfahrung",
          "Motivierte Auszubildende für Gastronomie / Hotellerie",
          "Fachkraft Handwerk / CNC / Elektrotechnik ab B1",
        ]
      : lang === "en"
        ? [
            "Nursing professional with German B2 & hospital experience",
            "Motivated apprentices for hospitality / culinary",
            "Skilled technician in machining / electronics (B1+)",
          ]
        : [
            "Điều dưỡng viên trình độ B2 có kinh nghiệm bệnh viện",
            "Học viên du học nghề Nhà hàng - Khách sạn",
            "Thợ kỹ thuật cơ khí CNC / Điện công nghiệp từ B1",
          ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground pt-28 md:pt-40 pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Kandidaten-Pool</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Unsere Top-Talente für Ihr Unternehmen
            </p>
          </div>
        </div>
      </section>

      {/* AI Talent Matcher Section */}
      {initialCandidates.length > 0 && (
        <section className="py-8 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-b border-blue-900/40">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold">
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <Button
                type="submit"
                disabled={isMatching || aiQuery.trim().length < 2}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 h-auto rounded-xl gap-2"
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
            <div className="flex flex-wrap items-center gap-2 mt-3">
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
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-100 text-sm flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{aiSummary}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Filter Section - Simple Category Buttons */}
      {availableCategories.length > 0 && (
        <section className="py-6 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-700 mr-2">Filter:</span>
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className="text-sm"
              >
                Alle
              </Button>
              {availableCategories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="text-sm"
                >
                  {categoryLabelsI18n[cat]?.[lang] || cat}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Candidates Grid */}
      <section className="py-12 md:py-16">
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
              <p className="text-gray-600">
                Senden Sie uns Ihren Personalbedarf. Wir klären passende Profile und Verfügbarkeit
                mit Ihnen.
              </p>
              <Link href="/#contact" className="inline-block mt-5 text-primary underline">
                Personalbedarf besprechen
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onRequestProfile={handleRequestProfile}
                  matchScore={aiMatches?.[candidate.id]?.matchScore}
                  matchReason={aiMatches?.[candidate.id]?.reason}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Inquiry Modal */}
      <InquiryModal candidate={selectedCandidate} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
