"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CandidateShowcase } from "./CandidateShowcase";

// Animation variants - Modern & Smooth
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

import type { Candidate } from "@/app/admin/candidates/types";

interface HeroSectionProps {
  heroBg?: string | null;
  heroOverlayOpacity?: string | null;
  featuredCandidates?: Candidate[];
}

export const HeroSection = ({
  heroBg,
  heroOverlayOpacity,
  featuredCandidates = [],
}: HeroSectionProps = {}) => {
  const { t, lang } = useLanguage();

  return (
    <section
      id="home"
      className="relative min-h-[90vh] md:min-h-[95vh] flex items-center overflow-hidden"
    >
      {/* Background - Dynamic from database or fallback */}
      {heroBg && heroBg.trim() !== "" ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Strong Dark Overlay - Gradient đậm hơn: Bên trái đen đặc để đọc chữ, bên phải mờ dần để lộ ảnh nền */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/20" />
        </div>
      ) : (
        // Fallback: Dark gradient background
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/20" />
      )}

      {/* Content Container */}
      <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Typography */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.2,
                },
              },
            }}
            className="space-y-6 md:space-y-8"
          >
            {/* H1 - Large, Bold, White with drop shadow */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-md"
            >
              {t.hero.title}
            </motion.h1>

            {/* Description - Light Gray */}
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl"
            >
              {t.hero.subtitle}
            </motion.p>

            {/* CTA Buttons - Horizontal Layout */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4">
              {/* Primary Button - Brand Blue */}
              <Link
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-lg text-base md:text-lg font-semibold transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 group"
              >
                {t.hero.cta_primary}
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              {/* Secondary Button - Outline with white border */}
              <Button
                variant="outline"
                size="lg"
                asChild
                className="gap-2 px-8 py-4 h-auto text-base md:text-lg font-semibold border-2 border-white/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/50"
              >
                <a href="/DMF Vietnam Handbuch.pdf" download="DMF_Vietnam_Unternehmensprofil.pdf">
                  <Download className="h-5 w-5" />
                  {t.hero.cta_secondary}
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Candidate Showcase */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInRight}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block"
          >
            <CandidateShowcase candidates={featuredCandidates} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
