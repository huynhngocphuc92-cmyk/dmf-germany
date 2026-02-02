"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";

// Lazy load FAQ Section (below the fold)
const FAQSection = dynamic(() => import("@/components/shared/FAQSection"), {
  loading: () => <div className="py-20 text-center text-slate-500">Laden...</div>,
  ssr: true, // Keep SSR for SEO content, but split the JS bundle
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
  GraduationCap,
  BookOpen,
  Heart,
  Shield,
  Timer,
  TrendingUp,
  Sparkles,
  PhoneCall,
  BadgeCheck,
  CircleCheck,
  Rocket,
  Award,
  Home,
  UserCheck,
} from "lucide-react";

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

function HeroSection() {
  const { lang, t } = useLanguage();

  // Build hero content from translations
  const content = {
    badge: t.service_pages.azubi.hero.badge,
    headline: t.service_pages.azubi.hero.headline,
    headline_accent: t.service_pages.azubi.hero.headline_accent,
    subheadline: t.service_pages.azubi.hero.subheadline,
    cta1: t.service_pages.azubi.hero.cta1,
    cta2: t.service_pages.azubi.hero.cta2,
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Gradient Mesh Background - Blue Theme */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-500/20 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-400/15 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />

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
              <Badge className="mb-6 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 backdrop-blur-sm">
                <Zap className="w-4 h-4 mr-2" />
                {content.badge}
              </Badge>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
              <span className="text-white">{content.headline}</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-400 to-blue-400 bg-clip-text text-transparent">
                {content.headline_accent}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10 max-w-lg">
              {content.subheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="group relative px-8 py-6 text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-400 hover:to-blue-400 text-white rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
                asChild
              >
                <Link href="#contact">
                  {content.cta1}
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
                  {content.cta2}
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
                className="w-80 h-80 rounded-full border-2 border-dashed border-blue-500/20"
              />

              {/* Middle ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-8 left-8 w-64 h-64 rounded-full border border-blue-500/30"
              />

              {/* Center content */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
                  >
                    <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent mb-2">
                      3
                    </div>
                    <div className="text-white font-medium text-lg">Jahre</div>
                    <div className="text-blue-400 text-sm mt-1">Ausbildung</div>
                  </motion.div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 right-8"
              >
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1.5">
                  <Zap className="w-3 h-3 mr-1" />
                  Langfristig
                </Badge>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 left-8"
              >
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1.5">
                  <Shield className="w-3 h-3 mr-1" />
                  100% Legal
                </Badge>
              </motion.div>

              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 -right-12 -translate-y-1/2"
              >
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1.5">
                  <Users className="w-3 h-3 mr-1" />
                  90%
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
          <motion.div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================
// ADVANTAGES SECTION
// ============================================

function AdvantagesSection() {
  const { lang, t } = useLanguage();

  // Build content from translations
  const raw = t.service_pages.azubi;
  const advantages = raw.advantages || {};

  const content = {
    badge: advantages.badge || "Warum Azubis aus Vietnam?",
    title: advantages.title || "3 Gründe für vietnamesische Azubis",
    subtitle: advantages.subtitle || "Nachhaltige Lösung für Ihren Fachkräftemangel",
    advantages: [
      {
        icon: Heart,
        title: advantages.advantage_1_title || "Hohe Arbeitsmoral",
        description: advantages.advantage_1_desc || "Diszipliniert, respektvoll und lernbereit",
        highlight: advantages.advantage_1_highlight || "Respekt",
        highlightDesc: advantages.advantage_1_highlight_desc || "Kulturelle Stärke",
      },
      {
        icon: TrendingUp,
        title: advantages.advantage_2_title || "Langfristige Bindung",
        description: advantages.advantage_2_desc || "Hohe Bleibequote nach der Ausbildung",
        highlight: advantages.advantage_2_highlight || "90%",
        highlightDesc: advantages.advantage_2_highlight_desc || "Bleibequote",
      },
      {
        icon: Shield,
        title: advantages.advantage_3_title || "Rundum-Betreuung",
        description: advantages.advantage_3_desc || "Wir übernehmen Behördengänge und Integration",
        highlight: advantages.advantage_3_highlight || "100%",
        highlightDesc: advantages.advantage_3_highlight_desc || "Fokus",
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
            className="mb-6 px-4 py-2 border-blue-200 text-blue-700 bg-blue-50"
          >
            <Zap className="w-4 h-4 mr-2" />
            {content.badge}
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            {content.title}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">{content.subtitle}</p>
        </motion.div>

        {/* Advantage Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {content.advantages.map((advantage, index) => {
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
                <div className="h-full bg-white rounded-3xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{advantage.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">{advantage.description}</p>

                  {/* Highlight Badge */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
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

function ProcessTimelineSection() {
  const { lang, t } = useLanguage();
  const ref = useRef(null);

  // Build content from translations - map process to timeline structure
  const raw = t.service_pages.azubi;
  const process = raw.process || {};

  const content = {
    badge: process.badge || "Einfacher Prozess",
    title: process.title || "4 Schritte zu Ihrem Azubi",
    subtitle: process.subtitle || "Schnell, transparent und unkompliziert",
    steps: [
      {
        step: "1",
        title: process.step1_title || "Bedarfsanalyse",
        description: process.step1_desc || "Wir besprechen Ihre Anforderungen",
        icon: Users,
      },
      {
        step: "2",
        title: process.step2_title || "Video-Interview",
        description: process.step2_desc || "Sie lernen passende Kandidaten kennen",
        icon: UserCheck,
      },
      {
        step: "3",
        title: process.step3_title || "Visa-Service",
        description: process.step3_desc || "Wir kümmern uns um alle Formalitäten",
        icon: FileCheck,
      },
      {
        step: "4",
        title: process.step4_title || "Ausbildungsstart",
        description: process.step4_desc || "Ihr Azubi beginnt motiviert",
        icon: GraduationCap,
      },
    ],
    key_message: "Schnell und unkompliziert",
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
            className="mb-6 px-4 py-2 border-blue-200 text-blue-700 bg-blue-50"
          >
            <Zap className="w-4 h-4 mr-2" />
            {content.badge}
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            {content.title}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">{content.subtitle}</p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Progress Bar Background */}
          <div className="absolute top-20 left-0 right-0 h-2 bg-slate-100 rounded-full mx-8 lg:mx-16" />

          {/* Animated Progress Bar */}
          <motion.div
            className="absolute top-20 left-0 h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-500 rounded-full mx-8 lg:mx-16"
            initial={{ width: "0%" }}
            animate={{ width: isInView ? "100%" : "0%" }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
            style={{ maxWidth: "calc(100% - 4rem)" }}
          />

          {/* Steps */}
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
            {content.steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Step Circle */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.3, type: "spring" }}
                    className="relative z-10 mb-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    {/* Step badge */}
                    <div className="absolute -top-2 -right-2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {step.step}
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
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 rounded-full px-6 py-3">
            <CircleCheck className="w-6 h-6 text-blue-600" />
            <span className="text-blue-800 font-semibold text-lg">{content.key_message}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// QUALITY SECTION (Using Quality Data - mapped to Sectors structure)
// ============================================

function QualitySection() {
  const { lang, t } = useLanguage();

  // Build content from translations - map quality to sectors structure
  const raw = t.service_pages.azubi;
  const quality = raw.quality || {};

  // Create sectors array from quality data
  const sectors = [
    {
      title: quality.prep_title || "Vorbereitung in Vietnam",
      subtitle: "Sprache & Kultur",
      icon: BookOpen,
      secondaryIcon: GraduationCap,
      color: "blue",
      items: [
        quality.prep_item1 || "Intensiv-Sprachkurse",
        quality.prep_item2 || "Fachsprache-Training",
        quality.prep_item3 || "Interkulturelle Workshops",
        quality.prep_item4 || "Deutsche Arbeitskultur",
      ],
      description: quality.prep_title || "Vorbereitung in Vietnam",
    },
    {
      title: quality.support_title || "Begleitung in Deutschland",
      subtitle: "3 Jahre Support",
      icon: Home,
      secondaryIcon: Heart,
      color: "blue",
      items: [
        quality.support_item1 || "24/7 Ansprechpartner",
        quality.support_item2 || "Wohnungssuche & Einzug",
        quality.support_item3 || "Behördenservice komplett",
        quality.support_item4 || "Laufende Betreuung",
      ],
      description: quality.support_title || "Begleitung in Deutschland",
    },
  ];

  const content = {
    badge: quality.badge || "DMF Qualitäts-Standard",
    title: quality.title || "Ganzheitliche Vorbereitung & Begleitung",
    subtitle: quality.subtitle || "Von der Sprachausbildung bis zur erfolgreichen Integration",
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
            className="mb-6 px-4 py-2 border-blue-200 text-blue-700 bg-blue-50"
          >
            <Award className="w-4 h-4 mr-2" />
            {content.badge}
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            {content.title}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">{content.subtitle}</p>
        </motion.div>

        {/* Sector Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {content.sectors.map((sector, index) => {
            const Icon = sector.icon;
            const SecondaryIcon = sector.secondaryIcon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -40 : 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <div className="h-full rounded-3xl p-8 lg:p-10 border-2 transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-50 border-blue-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-500 shadow-lg shadow-blue-500/30">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{sector.title}</h3>
                        <p className="text-sm font-medium text-blue-600">{sector.subtitle}</p>
                      </div>
                    </div>
                    <SecondaryIcon className="w-12 h-12 text-blue-200 group-hover:scale-110 transition-transform" />
                  </div>

                  {/* Items List */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {sector.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100/50"
                      >
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-slate-700">{item}</span>
                      </div>
                    ))}
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

function StatsSection() {
  const { lang, t } = useLanguage();

  // Build content from translations
  const raw = t.service_pages.azubi;
  const statsData = raw.stats || {};

  const content = {
    stats: [
      {
        value: "120+",
        label: statsData.stat1_label || "Azubis vermittelt",
        suffix: "",
        icon: Users,
      },
      {
        value: "95",
        label: statsData.stat2_label || "Ausbildung abgeschlossen",
        suffix: "%",
        icon: Award,
      },
      {
        value: "90",
        label: statsData.stat3_label || "Bleiben nach Abschluss",
        suffix: "%",
        icon: TrendingUp,
      },
      { value: "3", label: statsData.stat4_label || "Jahre Begleitung", suffix: "", icon: Clock },
    ],
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="py-20 md:py-28 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-[80px]" />
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
          {content.stats.map((stat, index) => {
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
                <div className="text-blue-100 text-sm md:text-base font-medium">{stat.label}</div>
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

function CTASection() {
  const { lang, t } = useLanguage();

  // Build content from translations
  const raw = t.service_pages.azubi;
  const ctaData = raw.cta || {};

  const content = {
    title: ctaData.title || "Bereit für Ihre zukünftigen Fachkräfte?",
    subtitle: ctaData.subtitle || "Investieren Sie heute in motivierte Azubis aus Vietnam.",
    cta1: ctaData.cta1 || "Azubi-Profile anfordern",
    cta2: ctaData.cta2 || "Beratungsgespräch vereinbaren",
    highlight: ctaData.highlight || "Nächster Ausbildungsstart: September 2026",
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
          {/* Highlight Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <Badge className="px-4 py-2 bg-blue-100 text-blue-800 border-blue-200">
              <Sparkles className="w-4 h-4 mr-2" />
              {content.highlight}
            </Badge>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {content.title}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10">
            {content.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="group px-8 py-6 text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-400 hover:to-blue-400 text-white rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
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
              className="px-8 py-6 text-base font-semibold border-blue-300 text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-300"
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

export default function AzubiPage() {
  // FAQ Questions for Azubi (B2B-Focused)
  const azubiFAQs = [
    {
      question: "Wie stellen Sie das Sprachniveau B2 vor der Einreise sicher?",
      answer:
        "Wir kooperieren mit zertifizierten Sprachschulen (Goethe/TELC) in Vietnam. Unsere Kandidaten durchlaufen ein intensives 12-monatiges Vorbereitungsprogramm, das nicht nur Sprache, sondern auch deutsche Fachbegriffe und Kultur vermittelt.",
    },
    {
      question: "Wie hoch ist die Bleibeperspektive der vietnamesischen Azubis?",
      answer:
        "Vietnamesische Azubis gelten als äußerst loyal. Unsere Statistiken zeigen eine Übernahmequote von über 90% nach der Ausbildung. Wir fördern dies durch kulturelles Onboarding, um Heimweh und Abbrüche zu minimieren.",
    },
    {
      question: "Unterstützen Sie bei der bürokratischen Abwicklung?",
      answer:
        "Ja. Wir übernehmen den kompletten Verwaltungsprozess: Vorprüfung der Unterlagen, Beschleunigtes Fachkräfteverfahren (§ 81a AufenthG) bis hin zur Wohnungssuche und Behördengängen.",
    },
    {
      question: "Welche Kosten kommen auf uns zu?",
      answer:
        "Wir arbeiten mit einem transparenten erfolgsbasierten Modell ohne versteckte Gebühren. Die Investition amortisiert sich in der Regel bereits im ersten Jahr. Gerne erstellen wir Ihnen ein individuelles Angebot.",
    },
  ];

  return (
    <main className="min-h-screen">
      <HeroSection />
      <AdvantagesSection />
      <ProcessTimelineSection />
      <QualitySection />
      <StatsSection />
      <CTASection />
      <FAQSection items={azubiFAQs} theme="blue" />
    </main>
  );
}
