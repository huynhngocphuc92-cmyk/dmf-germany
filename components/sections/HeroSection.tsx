"use client";

import Image from "next/image";
import { LazyMotion, m } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { ArrowRight, Download, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";
import { handleContactAnchorClick } from "@/lib/navigation/contact-anchor";
import { GERMANY_CONTACT } from "@/lib/company/contact";

// Animation variants - Modern & Smooth
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

const loadMotionFeatures = () => import("@/lib/framer-motion-features").then((mod) => mod.default);

interface HeroSectionProps {
  heroBg?: string | null;
  heroOverlayOpacity?: string | null;
  candidateSlot?: ReactNode;
}

export const HeroSection = ({
  heroBg,
  heroOverlayOpacity,
  candidateSlot,
}: HeroSectionProps = {}) => {
  const { t, lang } = useLanguage();
  const parsedOverlayOpacity = Number.parseFloat(heroOverlayOpacity ?? "");
  const overlayOpacity = Number.isFinite(parsedOverlayOpacity)
    ? Math.min(Math.max(parsedOverlayOpacity, 0), 1)
    : 0.75;
  const repBadgeLabel =
    lang === "de"
      ? "Direkte Vertretung in Deutschland"
      : lang === "en"
        ? "Direct Representative in Germany"
        : "Pháp nhân đại diện trực tiếp tại Đức";

  return (
    <section
      id="home"
      className="relative min-h-[90vh] md:min-h-[95vh] flex items-center overflow-hidden"
    >
      {/* Background - Rendered through next/image so the hero can be optimized as the LCP asset */}
      {heroBg && heroBg.trim() !== "" ? (
        <div className="absolute inset-0">
          <Image
            src={heroBg}
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            quality={75}
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/20"
            style={{ opacity: overlayOpacity }}
          />
        </div>
      ) : (
        // Fallback: Dark gradient background
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/20" />
      )}

      {/* Content Container */}
      <LazyMotion features={loadMotionFeatures}>
        <div className="container mx-auto px-4 lg:px-8 pt-36 pb-16 md:pt-44 md:pb-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Typography */}
            <m.div
              initial={false}
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
              {/* Direct Germany Representative Badge */}
              <m.div variants={fadeInUp}>
                <div className="inline-flex flex-wrap items-center gap-2 sm:gap-3 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg">
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-300">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                    {repBadgeLabel}:
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white">
                    {GERMANY_CONTACT.rawName}
                  </span>
                  <span className="text-white/30 hidden sm:inline">•</span>
                  <a
                    href={GERMANY_CONTACT.phoneHref}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/90 hover:bg-primary text-white text-xs sm:text-sm font-semibold transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    {GERMANY_CONTACT.phone}
                  </a>
                </div>
              </m.div>

              {/* H1 - Large, Bold, White with drop shadow */}
              <m.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-md"
              >
                {t.hero.title}
              </m.h1>

              {/* Description - Light Gray */}
              <m.p
                variants={fadeInUp}
                className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl"
              >
                {t.hero.subtitle}
              </m.p>

              {/* CTA Buttons - Horizontal Layout */}
              <m.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4">
                {/* Primary Button - Brand Blue */}
                <Link
                  href="#contact"
                  onClick={handleContactAnchorClick}
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
              </m.div>
            </m.div>

            {/* Right Column - Candidate Showcase */}
            <m.div
              initial={false}
              animate="visible"
              variants={fadeInRight}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden lg:block lg:min-h-[600px]"
            >
              {candidateSlot}
            </m.div>
          </div>
        </div>
      </LazyMotion>
    </section>
  );
};
