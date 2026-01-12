'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Languages,
  Check,
  ChevronRight,
} from 'lucide-react';

interface SkilledHeroProps {
  badge: string;
  headline: string;
  headline_accent: string;
  subheadline: string;
  cta1: string;
  cta2: string;
  floating_card1: {
    name: string;
    role: string;
    badge: string;
  };
  floating_card2: {
    title: string;
    status: string;
  };
  floating_card3: {
    title: string;
    level: string;
  };
  success_rate_label: string;
}

export function SkilledHero(props: SkilledHeroProps) {
  const {
    badge,
    headline,
    headline_accent,
    subheadline,
    cta1,
    cta2,
    floating_card1,
    floating_card2,
    floating_card3,
    success_rate_label,
  } = props;

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0">
        {/* Primary gradient orbs */}
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-500/20 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-teal-400/15 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />

        {/* Subtle grid pattern */}
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
          {/* Left Content - Text */}
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
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Badge className="mb-8 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 backdrop-blur-sm">
                <Shield className="w-4 h-4 mr-2" />
                {badge}
              </Badge>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
              <span className="text-white">{headline}</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 bg-clip-text text-transparent">
                {headline_accent}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10 max-w-lg">
              {subheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="group relative px-8 py-6 text-base font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-full shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
                asChild
              >
                <Link href="#comparison">
                  {cta1}
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-base font-semibold border-slate-700 text-white hover:bg-slate-800/50 rounded-full transition-all duration-300"
                asChild
              >
                <Link href="/#contact">
                  {cta2}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Content - Floating Cards Grid */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block h-[600px]"
          >
            {/* Floating Card 1 - Profile Card */}
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-8 left-8 z-20"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl w-72">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl">
                    NM
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm">
                      {floating_card1.name}
                    </h4>
                    <p className="text-slate-400 text-xs">
                      {floating_card1.role}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {floating_card1.badge}
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 2 - Status Card */}
            <motion.div
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute top-32 right-4 z-10"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl w-64">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">
                      {floating_card2.title}
                    </p>
                    <p className="text-white font-medium text-sm">
                      {floating_card2.status}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 3 - Language Level */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-32 left-16 z-20"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl w-56">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                    <Languages className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">
                      {floating_card3.title}
                    </p>
                    <p className="text-white font-semibold text-sm">
                      {floating_card3.level}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 4 - Success Rate */}
            <motion.div
              animate={{
                y: [0, 8, 0],
              }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
              className="absolute bottom-16 right-8 z-10"
            >
              <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl border border-emerald-500/20 p-5 shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">98%</div>
                  <div className="text-emerald-300 text-xs font-medium">
                    {success_rate_label}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-emerald-500/10 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-teal-500/5 rounded-full" />
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
