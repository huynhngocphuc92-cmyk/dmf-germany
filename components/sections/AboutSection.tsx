"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { motion } from "framer-motion";
import { BookOpen, Globe2, UserCheck } from "lucide-react";
import { AssetImageWithDebug } from "@/components/ui/AssetImageWithDebug";

interface AboutSectionProps {
  introImg?: string | null;
  videoThumb?: string | null;
}

export const AboutSection = ({ introImg, videoThumb }: AboutSectionProps = {}) => {
  const { t, lang } = useLanguage();
  
  // Use video thumbnail if available, otherwise use intro image
  const displayImage = videoThumb || introImg;
  const icons = [BookOpen, Globe2, UserCheck];

  // Dynamic stats from translations
  const stats = [
    { value: "500+", label: t.about.stat_candidates },
    { value: "50+", label: t.about.stat_partners },
    { value: "98%", label: t.about.stat_success },
  ];

  // Features from translations
  const features = [
    {
      title: t.about.feature_1_title,
      description: t.about.feature_1_desc,
    },
    {
      title: t.about.feature_2_title,
      description: t.about.feature_2_desc,
    },
    {
      title: t.about.feature_3_title,
      description: t.about.feature_3_desc,
    },
  ];

  return (
    <section id="about" className="py-16 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              {t.about.title}
            </h2>
            {/* Decorative underline */}
            <div className="flex justify-center pt-2">
              <div className="w-16 md:w-20 h-1 bg-primary rounded-full" />
            </div>
            <p className="text-base md:text-lg text-muted-foreground mt-4 px-4">
              {t.about.subtitle}
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center mb-12 md:mb-20">
            {/* Left - Description */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                {t.about.description}
              </p>
              
              {/* Quick Stats - Responsive */}
              <div className="grid grid-cols-3 gap-2 md:gap-4 pt-4">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className={`text-center p-3 md:p-4 rounded-lg ${
                      index === 1 ? "bg-accent/5" : "bg-primary/5"
                    }`}
                  >
                    <p className={`text-xl md:text-3xl font-bold ${
                      index === 1 ? "text-accent" : "text-primary"
                    }`}>
                      {stat.value}
                    </p>
                    <p className="text-[10px] md:text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              {displayImage ? (
                <div className="aspect-square rounded-2xl overflow-hidden border border-border/50 shadow-lg relative">
                  <AssetImageWithDebug
                    src={displayImage}
                    configKey={videoThumb ? "home_intro_video_thumb" : "home_intro_img"}
                    alt={t.about.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 flex items-center justify-center border border-border/50">
                  <div className="text-center p-6 md:p-8">
                    <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-3 md:mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-3xl md:text-5xl">🎓</span>
                    </div>
                    <p className="text-base md:text-lg font-medium text-foreground">
                      {t.about.title}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">Vietnam</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Features - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = icons[index] || BookOpen;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                  className="text-center space-y-3 md:space-y-4 p-5 md:p-8 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex justify-center">
                    <div className="p-3 md:p-4 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                      <Icon className="h-6 w-6 md:h-8 md:w-8 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
