"use client";

import { useLanguage } from "@/lib/language-context";
import { motion } from "framer-motion";
import { ArrowRight, Users, GraduationCap, HeartHandshake, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Animation variants - German precision style (subtle, no bounce)
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const highlightItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const HeroSection = () => {
  const { content, language } = useLanguage();

  // Dynamic highlights based on language
  const highlights = language === "de" 
    ? [
        { icon: Users, text: "Qualifizierte Fachkräfte" },
        { icon: GraduationCap, text: "Sprachausbildung B1-B2" },
        { icon: HeartHandshake, text: "Langfristige Betreuung" },
      ]
    : [
        { icon: Users, text: "Nhân sự chất lượng cao" },
        { icon: GraduationCap, text: "Đào tạo tiếng Đức B1-B2" },
        { icon: HeartHandshake, text: "Hỗ trợ lâu dài" },
      ];

  return (
    <section
      id="home"
      className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden"
    >
      {/* Background - Gradient with pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/5" />
      
      {/* Decorative Elements - Hidden on mobile for performance */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="hidden md:block absolute top-20 right-0 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-gradient-to-l from-accent/10 to-transparent rounded-full blur-3xl" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        className="hidden md:block absolute bottom-0 left-0 w-[300px] lg:w-[400px] h-[300px] lg:h-[400px] bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-3xl" 
      />
      
      {/* Geometric pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="container mx-auto px-4 lg:px-8 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
          {/* Left Column - Content with stagger animation */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-5 md:space-y-8"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} transition={{ duration: 0.5, ease: "easeOut" }}>
              <span className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-accent/10 text-accent text-xs md:text-sm font-medium border border-accent/20">
                🇻🇳 🇩🇪 {content.hero.badge}
              </span>
            </motion.div>

            {/* Title - Responsive font sizes */}
            <motion.h1
              variants={fadeInUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15] md:leading-[1.1]"
            >
              <span className="text-primary">{content.hero.title.split(" ").slice(0, 2).join(" ")}</span>
              {" "}
              {content.hero.title.split(" ").slice(2).join(" ")}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl"
            >
              {content.hero.subtitle}
            </motion.p>

            {/* Highlights with stagger - Responsive layout */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-6"
            >
              {highlights.map((item, index) => (
                <motion.span
                  key={index}
                  variants={highlightItem}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground"
                >
                  <item.icon className="h-4 w-4 md:h-5 md:w-5 text-accent flex-shrink-0" />
                  {item.text}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA Buttons - Responsive */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4"
            >
              <Link
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 md:py-4 bg-primary text-primary-foreground rounded-lg text-sm md:text-base font-medium transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 group"
              >
                {content.hero.ctaPrimary}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              
              {/* Download Profile Button - Outline style */}
              <Button
                variant="outline"
                size="lg"
                asChild
                className="gap-2 px-6 md:px-8 py-3.5 md:py-4 h-auto text-sm md:text-base border-2"
              >
                <a
                  href="/DMF Vietnam Handbuch.pdf"
                  download="DMF_Vietnam_Unternehmensprofil.pdf"
                >
                  <Download className="h-4 w-4" />
                  {content.hero.downloadProfile}
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual (Hidden on mobile, visible on lg+) */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-secondary shadow-2xl border border-border/50">
              {/* Placeholder Image Container */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <motion.div 
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{ opacity: 1, rotate: 12 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="absolute top-8 left-8 w-24 h-24 border-2 border-primary/40 rounded-lg" 
                  />
                  <motion.div 
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{ opacity: 1, rotate: -6 }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="absolute top-20 left-20 w-40 h-40 border-2 border-accent/30 rounded-lg" 
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="absolute bottom-16 right-16 w-28 h-28 border-2 border-primary/20 rounded-full" 
                  />
                </div>
                
                {/* Placeholder Content */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-center p-8 relative z-10"
                >
                  <div className="w-36 h-36 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center shadow-lg">
                    <span className="text-6xl">🤝</span>
                  </div>
                  <p className="text-xl font-semibold text-foreground/80">
                    {language === "de" ? "Partnerschaft & Ausbildung" : "Hợp tác & Đào tạo"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Vietnam ↔ Deutschland
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              className="absolute -bottom-6 -left-6 bg-background rounded-xl shadow-xl p-6 border"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                  <GraduationCap className="h-7 w-7 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">B1-B2</p>
                  <p className="text-sm text-muted-foreground">
                    {language === "de" ? "Deutschniveau" : "Trình độ tiếng Đức"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Top Right Card */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
              className="absolute -top-4 -right-4 bg-background rounded-xl shadow-xl p-4 border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {language === "de" ? "Zertifiziert" : "Chứng nhận"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === "de" ? "Qualitätsstandard" : "Tiêu chuẩn chất lượng"}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
