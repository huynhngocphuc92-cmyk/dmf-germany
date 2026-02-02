"use client";

import { useState, useMemo } from "react";
import { Users, X } from "lucide-react";
import { CandidateCard } from "@/components/candidates/CandidateCard";
import { InquiryModal } from "@/components/candidates/InquiryModal";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { Candidate, CandidateCategory } from "@/app/admin/candidates/types";
import { categoryLabelsI18n } from "@/app/admin/candidates/types";
import { Button } from "@/components/ui/button";

interface CandidatesClientProps {
  initialCandidates: Candidate[];
  error: string | null;
}

export function CandidatesClient({ initialCandidates, error }: CandidatesClientProps) {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<CandidateCategory | "all">("all");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Filter candidates by category
  const filteredCandidates = useMemo(() => {
    if (selectedCategory === "all") {
      return initialCandidates;
    }
    return initialCandidates.filter((c) => c.category === selectedCategory);
  }, [initialCandidates, selectedCategory]);

  const handleRequestProfile = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

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
                Hiện chưa có hồ sơ phù hợp
              </h3>
              <p className="text-gray-600">
                Bitte versuchen Sie es mit anderen Filtern oder kommen Sie später wieder.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onRequestProfile={handleRequestProfile}
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
