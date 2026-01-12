"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { checkQuality } from "@/utils/qa-layer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import dynamic from 'next/dynamic';

// Lazy load FAQ Section (below the fold)
const FAQSection = dynamic(() => import('@/components/shared/FAQSection'), {
  loading: () => <div className="py-20 text-center text-slate-500">Laden...</div>,
  ssr: true // Keep SSR for SEO content, but split the JS bundle
});

import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Users,
  Zap,
  Calendar,
  Plane,
  FileCheck,
  Briefcase,
  Code,
  Heart,
  Stethoscope,
  Building2,
  Wrench,
  Laptop,
  Dumbbell,
  MessageCircle,
  Shield,
  Timer,
  TrendingUp,
  Sparkles,
  PhoneCall,
  BadgeCheck,
  CircleCheck,
  Rocket,
} from "lucide-react";

// ============================================
// FALLBACK DATA (DỮ LIỆU DỰ PHÒNG)
// ============================================

const DATA_DU_PHONG = {
  hero: {
    badge: "Fachkräfte Vermittlung",
    headline: "Qualifizierte Fachkräfte",
    headline_accent: "Anerkannte Abschlüsse. Sofort einsatzbereit.",
    subheadline: "Schluss mit dem Behörden-Dschungel. Wir vermitteln Ingenieure, IT-Profis und Pflegekräfte aus Vietnam – rechtssicher nach §18a/b AufenthG.",
    cta1: "Verfügbare Experten prüfen",
    cta2: "Kostenlose Beratung",
  },
  advantages: {
    badge: "Warum DMF?",
    title: "Der Unterschied ist messbar.",
    subtitle: "Vergleichen Sie selbst",
  },
  process: {
    badge: "Unser Prozess",
    title: "5 Schritte zum Erfolg",
    subtitle: "Transparent, planbar, zuverlässig",
  },
  expertise: {
    badge: "Unsere Expertise",
    title: "Spezialisierte Fachkräfte",
    subtitle: "Fokussiert auf die Branchen mit höchstem Bedarf",
  },
  stats: {
    stat1_label: "Vermittelte Fachkräfte",
    stat2_label: "Visum-Erfolgsquote",
    stat3_label: "Monate bis Arbeitsantritt",
  },
  cta: {
    title: "Bereit für qualifizierte Fachkräfte?",
    subtitle: "Vereinbaren Sie ein unverbindliches Beratungsgespräch.",
    cta1: "Jetzt Beratung anfragen",
    cta2: "Kandidatenprofile anfordern",
  },
};

// ============================================
// ANIMATED COUNTER
// ============================================

function AnimatedCounter({
  value,
  suffix,
  duration = 2,
}: {
  value: string;
  suffix: string;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    if (value.includes("<") || value.includes("+")) {
      setDisplayValue(value);
      return;
    }

    const numericValue = parseInt(value);
    if (isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOutQuart * numericValue);
      setDisplayValue(current.toString());
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
}

// ============================================
// HERO SECTION
// ============================================

function HeroSection({ content }: { content: any }) {
  const { lang } = useLanguage();
  
  // Use safe content from QA layer
  const heroContent = content?.hero || {};

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Gradient Mesh Background - Emerald/Green Theme */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-500/20 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-green-400/15 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 max-w-7xl min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full py-24 lg:py-0">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge className="mb-6 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 backdrop-blur-sm">
                <Zap className="w-4 h-4 mr-2" />
                {heroContent.badge || "Fachkräfte Vermittlung"}
              </Badge>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
              <span className="text-white">{heroContent.headline || "Qualifizierte Fachkräfte"}</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-400 bg-clip-text text-transparent">
                {heroContent.headline_accent || "Anerkannte Abschlüsse. Sofort einsatzbereit."}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10 max-w-lg">
              {heroContent.subheadline || "Schluss mit dem Behörden-Dschungel. Wir vermitteln Ingenieure, IT-Profis und Pflegekräfte aus Vietnam."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="group relative px-8 py-6 text-base font-semibold bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white rounded-full shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
                asChild
              >
                <Link href="#contact">
                  {heroContent.cta1 || "Verfügbare Experten prüfen"}
                  <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-base font-semibold border-slate-700 text-white hover:bg-slate-800/50 rounded-full transition-all duration-300"
                asChild
              >
                <Link href="/#contact">
                  <PhoneCall className="w-5 h-5 mr-2" />
                  {heroContent.cta2 || "Kostenlose Beratung"}
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Content - Visual Stats */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:flex items-center justify-center"
          >
            {/* Central Indicator */}
            <div className="relative">
              {/* Outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-80 h-80 rounded-full border-2 border-dashed border-emerald-500/20"
              />

              {/* Middle ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-8 left-8 w-64 h-64 rounded-full border border-green-500/30"
              />

              {/* Center content */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
                  >
                    <div className="text-6xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-2">
                      6-9
                    </div>
                    <div className="text-white font-medium text-lg">
                      Monate
                    </div>
                    <div className="text-emerald-400 text-sm mt-1">
                      bis Einsatz
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 right-8"
              >
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-3 py-1.5">
                  <Zap className="w-3 h-3 mr-1" />
                  Rechtssicher
                </Badge>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 left-8"
              >
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-3 py-1.5">
                  <Shield className="w-3 h-3 mr-1" />
                  100% Legal
                </Badge>
              </motion.div>

              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 -right-12 -translate-y-1/2"
              >
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-3 py-1.5">
                  <Users className="w-3 h-3 mr-1" />
                  150+
                </Badge>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================
// ADVANTAGES SECTION (Using Comparison Data as Fallback)
// ============================================

function AdvantagesSection({ content }: { content: any }) {
  const { lang } = useLanguage();
  
  // Use safe content from QA layer
  const raw = content || {};
  
  // Build section content from translations - use comparison as fallback
  const sectionContent = {
    badge: raw.comparison?.badge || "Warum DMF?",
    title: raw.comparison?.title || "Der Unterschied ist messbar.",
    subtitle: raw.comparison?.subtitle || "Vergleichen Sie selbst",
    advantages: [
      {
        icon: Shield,
        title: "Rechtssicher",
        description: "Wir garantieren die Einhaltung aller Vorgaben (§18a/b AufenthG). Kein Risiko für Sie.",
        highlight: "100%",
        highlightDesc: "Rechtssicher",
      },
      {
        icon: Zap,
        title: "Beschleunigtes Verfahren",
        description: "§81a Verfahren beschleunigt die Visumserteilung. Transparente Prozesse, keine Überraschungen.",
        highlight: "< 3",
        highlightDesc: "Monate",
      },
      {
        icon: Users,
        title: "Qualifizierte Experten",
        description: "Vorab geprüfte Qualifikationen und Deutschkenntnisse. B1/B2 Zertifikat inklusive.",
        highlight: "100%",
        highlightDesc: "Geprüft",
      },
    ],
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="py-24 md:py-32 bg-slate-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-6 px-4 py-2 border-emerald-200 text-emerald-700 bg-emerald-50"
          >
            <Zap className="w-4 h-4 mr-2" />
            {sectionContent.badge}
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            {sectionContent.title}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            {sectionContent.subtitle}
          </p>
        </motion.div>

        {/* Advantage Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {sectionContent.advantages.map((advantage: any, index: number) => {
            const Icon = advantage.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="h-full bg-white rounded-3xl p-8 border border-slate-200 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{advantage.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">{advantage.description}</p>

                  {/* Highlight Badge */}
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">
                      {advantage.highlight}
                    </div>
                    <div className="text-sm text-slate-500">{advantage.highlightDesc}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// PROCESS TIMELINE SECTION (Using Process Data)
// ============================================

function ProcessTimelineSection({ content }: { content: any }) {
  const { lang } = useLanguage();
  const ref = useRef(null);
  
  // Use safe content from QA layer
  const raw = content || {};
  const process = raw.process || {};
  
  const sectionContent = {
    badge: process.badge || "Unser Prozess",
    title: process.title || "5 Schritte zum Erfolg",
    subtitle: process.subtitle || "Transparent, planbar, zuverlässig",
    steps: [
      {
        week: process.step1_duration || "2-4",
        title: process.step1_title || "Auswahl",
        description: process.step1_desc || "Sorgfältige Prüfung von Qualifikationen",
        icon: Users,
      },
      {
        week: process.step2_duration || "3-6",
        title: process.step2_title || "Anerkennung",
        description: process.step2_desc || "Begleitung beim Anerkennungsverfahren",
        icon: FileCheck,
      },
      {
        week: process.step3_duration || "2-4",
        title: process.step3_title || "Matching",
        description: process.step3_desc || "Professionelles Matching",
        icon: Briefcase,
      },
      {
        week: process.step4_duration || "4-8",
        title: process.step4_title || "Visum",
        description: process.step4_desc || "Beschleunigtes Fachkräfteverfahren",
        icon: Plane,
      },
      {
        week: process.step5_duration || "Fortlaufend",
        title: process.step5_title || "Integration",
        description: process.step5_desc || "Begleitung bei Ankunft",
        icon: Users,
      },
    ],
    key_message: process.total_time || "Gesamtdauer: 6-9 Monate",
  };
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setProgress(100);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-6 px-4 py-2 border-emerald-200 text-emerald-700 bg-emerald-50"
          >
            <Zap className="w-4 h-4 mr-2" />
            {sectionContent.badge}
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            {sectionContent.title}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            {sectionContent.subtitle}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Progress Bar Background */}
          <div className="absolute top-20 left-0 right-0 h-2 bg-slate-100 rounded-full mx-8 lg:mx-16" />

          {/* Animated Progress Bar */}
          <motion.div
            className="absolute top-20 left-0 h-2 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-500 rounded-full mx-8 lg:mx-16"
            initial={{ width: "0%" }}
            animate={{ width: isInView ? "100%" : "0%" }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
            style={{ maxWidth: "calc(100% - 4rem)" }}
          />

          {/* Steps */}
          <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8">
            {sectionContent.steps.map((step: any, stepIndex: number) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={stepIndex}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + stepIndex * 0.2 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Step Circle */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + stepIndex * 0.3, type: "spring" }}
                    className="relative z-10 mb-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    {/* Duration badge */}
                    <div className="absolute -top-2 -right-2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {step.week}
                    </div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm max-w-xs">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Key Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-full px-6 py-3">
            <CircleCheck className="w-6 h-6 text-emerald-600" />
            <span className="text-emerald-800 font-semibold text-lg">{sectionContent.key_message}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// EXPERTISE SECTION (Using Expertise Data)
// ============================================

function ExpertiseSection({ content: contentProp }: { content: any }) {
  const { lang } = useLanguage();
  
  // Use safe content from QA layer
  const raw = contentProp || {};
  const expertise = raw.expertise || {};
  
  // Create sectors array from expertise data
  const sectors: any[] = [
    {
      title: expertise.health_title || "Gesundheitswesen",
      subtitle: expertise.health_highlight || "Pflegefachkräfte",
      icon: Stethoscope,
      secondaryIcon: Heart,
      color: "emerald",
      jobs: ["Pflegefachkraft", "Altenpfleger", "Krankenpfleger", "Hebamme"],
      description: expertise.health_title || "Qualifizierte Pflegekräfte aus Vietnam",
      stats: { workers: "80+", time: "6-9 Mo." },
    },
    {
      title: expertise.tech_title || "Technik",
      subtitle: expertise.tech_highlight || "Ingenieure",
      icon: Wrench,
      secondaryIcon: Building2,
      color: "green",
      jobs: ["Ingenieur", "Maschinenbau", "Elektrotechnik", "Bauingenieur"],
      description: expertise.tech_title || "Erfahrene Ingenieure",
      stats: { workers: "50+", time: "6-9 Mo." },
    },
    {
      title: expertise.it_title || "IT & Software",
      subtitle: expertise.it_highlight || "Entwickler",
      icon: Code,
      secondaryIcon: Laptop,
      color: "emerald",
      jobs: ["Softwareentwickler", "DevOps", "Data Engineer", "Full Stack"],
      description: expertise.it_title || "IT-Profis mit Expertise",
      stats: { workers: "40+", time: "6-9 Mo." },
    },
  ];
  
  const sectionContent = {
    badge: expertise.badge || "Unsere Expertise",
    title: expertise.title || "Spezialisierte Fachkräfte",
    subtitle: expertise.subtitle || "Fokussiert auf die Branchen mit höchstem Bedarf",
    sectors: sectors,
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-6 px-4 py-2 border-emerald-200 text-emerald-700 bg-emerald-50"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            {sectionContent.badge}
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            {sectionContent.title}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            {sectionContent.subtitle}
          </p>
        </motion.div>

        {/* Sector Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {sectionContent.sectors.map((sector: any, index: number) => {
            const Icon = sector.icon;
            const SecondaryIcon = sector.secondaryIcon;
            const isEmerald = sector.color === "emerald";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -40 : index === 1 ? 0 : 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <div
                  className={`h-full rounded-3xl p-8 lg:p-10 border-2 transition-all duration-300 ${
                    isEmerald
                      ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/10"
                      : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-400 hover:shadow-2xl hover:shadow-green-500/10"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                          isEmerald
                            ? "bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/30"
                            : "bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/30"
                        }`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{sector.title}</h3>
                        <p className={`text-sm font-medium ${isEmerald ? "text-emerald-600" : "text-green-600"}`}>
                          {sector.subtitle}
                        </p>
                      </div>
                    </div>
                    <SecondaryIcon
                      className={`w-12 h-12 ${
                        isEmerald ? "text-emerald-200" : "text-green-200"
                      } group-hover:scale-110 transition-transform`}
                    />
                  </div>

                  {/* Jobs List */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {sector.jobs.map((job: string, jobIdx: number) => (
                      <div
                        key={jobIdx}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                          isEmerald ? "bg-emerald-100/50" : "bg-green-100/50"
                        }`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 ${isEmerald ? "text-emerald-600" : "text-green-600"}`}
                        />
                        <span className="text-sm text-slate-700">{job}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 pt-4 border-t border-slate-200/50">
                    <div className="flex items-center gap-2">
                      <Users className={`w-5 h-5 ${isEmerald ? "text-emerald-600" : "text-green-600"}`} />
                      <span className="font-bold text-slate-900">{sector.stats.workers}</span>
                      <span className="text-sm text-slate-500">
                        Fachkräfte
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Timer className={`w-5 h-5 ${isEmerald ? "text-emerald-600" : "text-green-600"}`} />
                      <span className="font-bold text-slate-900">{sector.stats.time}</span>
                      <span className="text-sm text-slate-500">
                        Vorlauf
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// STATS SECTION
// ============================================

function StatsSection({ content }: { content: any }) {
  const { lang } = useLanguage();
  
  // Use safe content from QA layer
  const raw = content || {};
  const statsData = raw.stats || {};
  
  const sectionContent = {
    stats: [
      { value: "150+", label: statsData.stat1_label || "Vermittelte Fachkräfte", suffix: "", icon: Users },
      { value: "98", label: statsData.stat2_label || "Visum-Erfolgsquote", suffix: "%", icon: Shield },
      { value: "6-9", label: statsData.stat3_label || "Monate bis Arbeitsantritt", suffix: "", icon: Clock },
      { value: "95", label: statsData.success_rate || "Erfolgsrate", suffix: "%", icon: TrendingUp },
    ],
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-400/20 rounded-full blur-[80px]" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {sectionContent.stats.map((stat: any, index: number) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2} />
                </div>
                <div className="text-emerald-100 text-sm md:text-base font-medium">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// CTA SECTION
// ============================================

function CTASection({ content }: { content: any }) {
  const { lang } = useLanguage();
  
  // Use safe content from QA layer
  const raw = content || {};
  const ctaData = raw.cta || {};
  
  const sectionContent = {
    title: ctaData.title || "Bereit für qualifizierte Fachkräfte?",
    subtitle: ctaData.subtitle || "Vereinbaren Sie ein unverbindliches Beratungsgespräch.",
    cta1: ctaData.cta1 || "Jetzt Beratung anfragen",
    cta2: ctaData.cta2 || "Kandidatenprofile anfordern",
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="contact" className="py-24 md:py-32 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {content.title}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10">
            {content.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="group px-8 py-6 text-base font-semibold bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white rounded-full shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
              asChild
            >
              <Link href="/#contact">
                {content.cta1}
                <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-base font-semibold border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-full transition-all duration-300"
              asChild
            >
              <Link href="/#contact">
                <PhoneCall className="w-5 h-5 mr-2" />
                {content.cta2}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function SkilledWorkersPage() {
  const { t } = useLanguage();

  // 1. LẤY DỮ LIỆU THÔ (Có thể bị null hoặc sai key)
  const rawData = t.service_pages?.skilled_workers;

  // 2. QUA CỔNG KIỂM SOÁT QA (Lọc sạch)
  // Biến 'content' bây giờ đảm bảo 100% không bao giờ null
  const content = checkQuality(rawData, DATA_DU_PHONG);

  // FAQ Questions for Skilled Workers (B2B-Focused)
  const skilledFAQs = [
    {
      question: "Wie funktioniert das Anerkennungsverfahren?",
      answer: "Wir prüfen die vietnamesischen Abschlüsse bereits vor Vertragsschluss auf Gleichwertigkeit (Defizitbescheid). Sollte eine Anpassungsqualifizierung nötig sein, organisieren wir diese gemeinsam mit Ihnen."
    },
    {
      question: "Wie schnell können die Fachkräfte starten?",
      answer: "Dank des Beschleunigten Fachkräfteverfahrens oft in 4-6 Monaten. Da wir über einen Pool an bereits sprachlich qualifizierten Kandidaten verfügen, entfallen lange Wartezeiten für den Spracherwerb."
    },
    {
      question: "Sind die Kandidaten an einer langfristigen Arbeit interessiert?",
      answer: "Absolut. Unsere Kandidaten suchen eine langfristige Perspektive für sich und ihre Familien. Die kulturelle Integration wird durch unsere Betreuung vor Ort erleichtert."
    }
  ];

  return (
    <main className="min-h-screen">
      <HeroSection content={content} />
      <AdvantagesSection content={content} />
      <ProcessTimelineSection content={content} />
      <ExpertiseSection content={content} />
      <StatsSection content={content} />
      <CTASection content={content} />
      <FAQSection items={skilledFAQs} theme="emerald" />
    </main>
  );
}
