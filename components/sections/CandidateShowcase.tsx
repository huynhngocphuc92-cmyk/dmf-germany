"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import type { Candidate } from "@/app/admin/candidates/types";
import { categoryLabelsI18n } from "@/app/admin/candidates/types";

interface CandidateShowcaseProps {
  candidates?: Candidate[];
}

// Fallback candidate data nếu không có dữ liệu từ DB
const fallbackCandidate: Candidate = {
  id: "fallback",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  full_name: "Nguyen Thi Mai",
  email: "example@example.com",
  category: "azubi",
  profession: "Pflegefachfrau",
  experience_years: 3,
  german_level: "B2",
  visa_status: true,
  is_featured: true,
  avatar_url: undefined,
};

export const CandidateShowcase = ({ candidates = [] }: CandidateShowcaseProps) => {
  const { lang, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sử dụng dữ liệu từ DB hoặc fallback
  const displayCandidates = useMemo(() => {
    if (candidates.length > 0) {
      return candidates;
    }
    return [fallbackCandidate];
  }, [candidates]);

  // Tự động chuyển đổi profile sau 4 giây (Loop vô hạn)
  useEffect(() => {
    if (displayCandidates.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayCandidates.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [displayCandidates.length]);

  // Đảm bảo currentCandidate luôn tồn tại
  const currentCandidate =
    displayCandidates[currentIndex] || displayCandidates[0] || fallbackCandidate;

  // Format position text từ category và profession
  const getPositionText = (candidate: Candidate) => {
    if (!candidate) return "";
    const categoryLabel = categoryLabelsI18n[candidate.category]?.[lang] || candidate.category;
    const profession = candidate.profession || "";
    return profession ? `${categoryLabel} - ${profession}` : categoryLabel;
  };

  // Generate badges từ dữ liệu thật
  const getBadges = (candidate: Candidate) => {
    if (!candidate) return [];

    const badges = [];

    // German Level Badge
    if (candidate.german_level) {
      badges.push({
        icon: "🇩🇪",
        text: `${candidate.german_level} ${t.candidate.certified}`,
      });
    }

    // Experience Badge
    if (candidate.experience_years && candidate.experience_years > 0) {
      const expLabel =
        candidate.experience_years === 1
          ? t.candidate.year_experience
          : t.candidate.years_experience;
      badges.push({
        icon: "🎓",
        text: `${candidate.experience_years} ${expLabel}`,
      });
    }

    // Visa Ready Badge (nếu visa_status là true)
    if (candidate.visa_status === true) {
      badges.push({
        icon: "✅",
        text: t.candidate.visa_ready,
      });
    }

    return badges;
  };

  const badges = getBadges(currentCandidate);

  return (
    <div className="relative h-[500px] md:h-[600px]">
      {/* Blob Background - Khối màu loang đằng sau */}
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-primary/30 rounded-full blur-3xl opacity-60" />

      {/* Main Card - Glass Effect với AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCandidate.id || currentIndex}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative w-full h-full max-w-[300px] mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl z-10"
        >
          {/* Avatar - Large, High Quality */}
          <div className="flex justify-center mb-6">
            {currentCandidate.avatar_url ? (
              <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg border border-white/20 relative">
                <Image
                  src={currentCandidate.avatar_url}
                  alt={currentCandidate.full_name}
                  fill
                  className="object-cover"
                  unoptimized={currentCandidate.avatar_url.startsWith("http")}
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-6xl shadow-lg border border-white/20">
                👤
              </div>
            )}
          </div>

          {/* Name - Bold, White */}
          <h3 className="text-2xl font-bold text-white text-center mb-2">
            {currentCandidate.full_name}
          </h3>

          {/* Position - Brand Blue */}
          <p className="text-primary text-center font-semibold mb-4 text-sm md:text-base">
            {getPositionText(currentCandidate)}
          </p>

          {/* Badges/Tags */}
          <div className="space-y-2">
            {badges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10"
              >
                <span className="text-lg">{badge.icon}</span>
                <span className="text-white text-sm font-medium">{badge.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Indicator Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {displayCandidates.map((candidate, index) => (
              <button
                key={candidate.id || index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-primary w-6" : "bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Show candidate ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
