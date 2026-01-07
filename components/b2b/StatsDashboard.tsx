"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Plane,
  Users,
  Building2,
  TrendingUp,
  Award,
  CheckCircle,
  Sparkles,
} from "lucide-react";

// ============================================
// CUSTOM HOOK: useCountUp
// ============================================

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}

function useCountUp({
  start = 0,
  end,
  duration = 2000,
  decimals = 0,
  suffix = "",
  prefix = "",
}: UseCountUpOptions) {
  const [count, setCount] = useState(start);
  const [isComplete, setIsComplete] = useState(false);

  const startAnimation = useCallback(() => {
    setIsComplete(false);
    const startTime = performance.now();
    const difference = end - start;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function: easeOutExpo for smooth deceleration
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      const currentValue = start + difference * easeOutExpo;

      setCount(Number(currentValue.toFixed(decimals)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
        setIsComplete(true);
      }
    };

    requestAnimationFrame(animate);
  }, [start, end, duration, decimals]);

  const formattedValue = `${prefix}${count.toLocaleString("de-DE")}${suffix}`;

  return { count, formattedValue, startAnimation, isComplete };
}

// ============================================
// ANIMATED NUMBER COMPONENT
// ============================================

interface AnimatedNumberProps {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  isInView: boolean;
  className?: string;
}

function AnimatedNumber({
  end,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 2000,
  isInView,
  className = "",
}: AnimatedNumberProps) {
  const hasAnimated = useRef(false);
  const { formattedValue, startAnimation } = useCountUp({
    end,
    suffix,
    prefix,
    decimals,
    duration,
  });

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      startAnimation();
    }
  }, [isInView, startAnimation]);

  return <span className={className}>{formattedValue}</span>;
}

// ============================================
// STAT CARD COMPONENTS
// ============================================

interface StatCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  isInView: boolean;
}

function StatCard({ children, className = "", delay = 0, isInView }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`
        relative overflow-hidden rounded-3xl
        bg-white/[0.07] backdrop-blur-xl
        border border-white/10
        transition-all duration-300
        hover:bg-white/[0.12] hover:border-white/20
        hover:shadow-2xl hover:shadow-blue-500/10
        group
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function StatsDashboard() {
  const { lang, t } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Stats data - values remain constant, labels from translations
  const stats = {
    visaRate: {
      value: 98,
      label: t.stats_advanced.visa_rate,
      description: t.stats_advanced.visa_desc,
    },
    candidates: {
      value: 350,
      label: t.stats_advanced.students,
      description: t.stats_advanced.students_sub,
    },
    retention: {
      value: 95,
      label: t.stats_advanced.retention,
      description: t.stats_advanced.retention_sub,
    },
    partners: {
      value: 40,
      label: t.stats_advanced.partners,
      description: t.stats_advanced.partners_sub,
    },
  };

  // Trust indicators
  const trustIndicators = [
    { icon: Shield, text: t.stats_advanced.iso },
    { icon: Award, text: t.stats_advanced.gov },
    { icon: Sparkles, text: t.stats_advanced.exp },
  ];

  return (
    <section
      ref={sectionRef}
      id="stats-dashboard"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Dark Background with Gradient */}
      <div 
        className="
          absolute inset-0 
          bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950
        "
      />

      {/* Decorative Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] translate-x-1/2" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container relative mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            className="
              mb-6 px-5 py-2 text-sm font-medium 
              bg-white/10 border-white/20 text-white
              backdrop-blur-sm
            "
          >
            <Award className="h-4 w-4 mr-2" />
            {t.stats_advanced.badge}
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t.stats_advanced.title}
          </h2>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            {t.stats_advanced.subtitle}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 auto-rows-[minmax(180px,auto)]">
          
          {/* ========================= */}
          {/* CARD 1: Visa Success Rate */}
          {/* Spans 2 columns x 2 rows  */}
          {/* ========================= */}
          <StatCard 
            className="md:col-span-2 md:row-span-2 p-8 md:p-10"
            delay={0}
            isInView={isInView}
          >
            {/* Background Shield Icon */}
            <Shield 
              className="
                absolute -right-8 -bottom-8 
                w-64 h-64 text-white/[0.03]
                transition-all duration-500
                group-hover:text-white/[0.06]
                group-hover:scale-110
              " 
              strokeWidth={0.5}
            />

            {/* Circular Progress Visual */}
            <div className="absolute top-8 right-8 w-24 h-24 md:w-32 md:h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 251.2" }}
                  animate={isInView ? { strokeDasharray: "246.2 251.2" } : {}}
                  transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                    {stats.visaRate.label}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <AnimatedNumber
                    end={stats.visaRate.value}
                    suffix="%"
                    duration={2000}
                    isInView={isInView}
                    className="text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter"
                  />
                </div>
              </div>

              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-sm">
                {stats.visaRate.description}
              </p>
            </div>
          </StatCard>

          {/* ========================= */}
          {/* CARD 2: Candidates Placed */}
          {/* ========================= */}
          <StatCard 
            className="p-6 md:p-8"
            delay={0.1}
            isInView={isInView}
          >
            {/* Background Icon */}
            <Plane 
              className="
                absolute -right-4 -bottom-4 
                w-32 h-32 text-white/[0.03]
                transition-all duration-500
                group-hover:text-white/[0.06]
              " 
              strokeWidth={0.5}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <Plane className="w-5 h-5 text-cyan-400" />
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-2">
                <AnimatedNumber
                  end={stats.candidates.value}
                  suffix="+"
                  duration={2000}
                  isInView={isInView}
                  className="text-5xl md:text-6xl font-black text-white tracking-tighter"
                />
              </div>

              <p className="text-sm font-medium text-slate-300 mb-1">
                {stats.candidates.label}
              </p>
              <p className="text-xs text-slate-500">
                {stats.candidates.description}
              </p>
            </div>
          </StatCard>

          {/* ========================= */}
          {/* CARD 3: Retention Rate    */}
          {/* ========================= */}
          <StatCard 
            className="p-6 md:p-8"
            delay={0.2}
            isInView={isInView}
          >
            {/* Background Icon */}
            <TrendingUp 
              className="
                absolute -right-4 -bottom-4 
                w-32 h-32 text-white/[0.03]
                transition-all duration-500
                group-hover:text-white/[0.06]
              " 
              strokeWidth={0.5}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-bold text-emerald-400">&gt;</span>
                <AnimatedNumber
                  end={stats.retention.value}
                  suffix="%"
                  duration={2000}
                  isInView={isInView}
                  className="text-5xl md:text-6xl font-black text-emerald-400 tracking-tighter"
                />
              </div>

              <p className="text-sm font-medium text-slate-300 mb-1">
                {stats.retention.label}
              </p>
              <p className="text-xs text-slate-500">
                {stats.retention.description}
              </p>
            </div>
          </StatCard>

          {/* ========================= */}
          {/* CARD 4: Partner Network   */}
          {/* Spans 2 columns           */}
          {/* ========================= */}
          <StatCard 
            className="md:col-span-2 p-6 md:p-8"
            delay={0.3}
            isInView={isInView}
          >
            {/* Background Icon */}
            <Building2 
              className="
                absolute -right-8 -bottom-8 
                w-48 h-48 text-white/[0.03]
                transition-all duration-500
                group-hover:text-white/[0.06]
              " 
              strokeWidth={0.5}
            />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                    {stats.partners.label}
                  </span>
                </div>

                <div className="flex items-baseline gap-1 mb-2">
                  <AnimatedNumber
                    end={stats.partners.value}
                    suffix="+"
                    duration={2000}
                    isInView={isInView}
                    className="text-6xl md:text-7xl font-black text-white tracking-tighter"
                  />
                </div>

                <p className="text-sm text-slate-400 max-w-xs">
                  {stats.partners.description}
                </p>
              </div>

              {/* Partner logos placeholder */}
              <div className="flex items-center gap-3 md:gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                    className="
                      w-12 h-12 md:w-14 md:h-14 rounded-2xl 
                      bg-white/5 border border-white/10
                      flex items-center justify-center
                      transition-all duration-300
                      hover:bg-white/10 hover:scale-110
                    "
                  >
                    <Building2 className="w-5 h-5 md:w-6 md:h-6 text-slate-500" />
                  </motion.div>
                ))}
              </div>
            </div>
          </StatCard>

        </div>

        {/* Bottom Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-10"
        >
          {trustIndicators.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

