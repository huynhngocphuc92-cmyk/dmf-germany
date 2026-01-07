"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { motion } from "framer-motion";
import { Globe, Users, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

export const ServicesSection = () => {
  const { t } = useLanguage();

  const iconMap = {
    recruitment: Globe,
    training: Users,
    consulting: Heart,
  };

  // Create services array from translations
  const services = [
    {
      icon: "recruitment" as const,
      title: t.services.recruitment,
      description: t.services.recruitment_desc,
    },
    {
      icon: "training" as const,
      title: t.services.training,
      description: t.services.training_desc,
    },
    {
      icon: "consulting" as const,
      title: t.services.consulting,
      description: t.services.consulting_desc,
    },
  ];

  return (
    <section id="services" className="py-16 md:py-24 lg:py-32 bg-muted/30">
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
              {t.services.title}
            </h2>
            {/* Decorative underline */}
            <div className="flex justify-center pt-2">
              <div className="w-16 md:w-20 h-1 bg-primary rounded-full" />
            </div>
            <p className="text-base md:text-lg text-muted-foreground mt-4 max-w-2xl mx-auto px-4">
              {t.services.subtitle}
            </p>
          </motion.div>

          {/* Services Grid - Responsive: 1 col mobile, 3 cols desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => {
              const Icon = iconMap[service.icon] || Globe;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="group"
                >
                  <div className="h-full p-6 md:p-8 lg:p-10 rounded-xl bg-card border border-border hover:border-accent/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-bl from-accent/5 to-transparent rounded-bl-full" />
                    
                    {/* Icon */}
                    <div className="relative mb-4 md:mb-6">
                      <div className="inline-flex p-3 md:p-4 rounded-xl bg-accent/10 group-hover:bg-accent transition-all duration-300">
                        <Icon className="h-6 w-6 md:h-8 md:w-8 text-accent group-hover:text-white transition-colors" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground mb-3 md:mb-4 relative">
                      {service.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 md:mb-6 relative">
                      {service.description}
                    </p>

                    {/* Learn More Link */}
                    <Link
                      href="#contact"
                      className="inline-flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors group/link relative"
                    >
                      {t.services.learnMore}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
