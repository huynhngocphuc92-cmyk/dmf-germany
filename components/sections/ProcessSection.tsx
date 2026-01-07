"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ClipboardList,
  UserSearch,
  GraduationCap,
  FileCheck,
  Plane,
  HeartHandshake,
} from "lucide-react";

// Animation variants - German precision style
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const headerVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lineVariants: any = {
  hidden: { scaleY: 0 },
  visible: { 
    scaleY: 1,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stepVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: index * 0.12,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodeVariants: any = {
  hidden: { scale: 0, opacity: 0 },
  visible: (index: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: index * 0.12 + 0.1,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

export const ProcessSection = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Icons für jeden Schritt
  const stepIcons = [
    ClipboardList, // Bedarfsanalyse
    UserSearch, // Rekrutierung und Auswahl
    GraduationCap, // Sprach- und Fachtraining
    FileCheck, // Interview und Vertrag
    Plane, // Visa und Ausreise
    HeartHandshake, // Integration und Nachbetreuung
  ];

  return (
    <section 
      ref={sectionRef}
      id="process" 
      className="py-16 md:py-28 lg:py-36 bg-background relative overflow-hidden"
    >
      {/* Background decorations - Hidden on mobile for performance */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="hidden md:block absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-primary/5 rounded-full blur-3xl" 
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.2 }}
        className="hidden md:block absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-accent/5 rounded-full blur-3xl" 
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center space-y-4 md:space-y-6 mb-12 md:mb-20"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium"
            >
              {t.process.badge}
            </motion.span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              {t.process.title}
            </h2>
            {/* Decorative underline with animation */}
            <motion.div 
              className="flex justify-center pt-2"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-16 md:w-24 h-1 md:h-1.5 bg-gradient-to-r from-primary to-accent rounded-full" />
            </motion.div>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              {t.process.subtitle}
            </p>
          </motion.div>

          {/* Vertical Timeline */}
          <div className="relative">
            {/* Animated vertical line - Desktop */}
            <motion.div 
              variants={lineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              style={{ originY: 0 }}
              className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary/30 transform -translate-x-1/2 rounded-full" 
            />

            {/* Animated vertical line - Mobile/Tablet */}
            <motion.div 
              variants={lineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              style={{ originY: 0 }}
              className="lg:hidden absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-primary via-accent to-primary/30 rounded-full" 
            />

            <div className="space-y-6 md:space-y-8 lg:space-y-0">
              {t.process.steps.map((step, index) => {
                const isEven = index % 2 === 0;
                const Icon = stepIcons[index] || ClipboardList;

                return (
                  <div key={step.number} className="relative">
                    {/* Desktop Layout */}
                    <div
                      className={`hidden lg:flex items-center gap-8 ${
                        isEven ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      {/* Content Card */}
                      <motion.div 
                        custom={index}
                        variants={stepVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className={`w-[calc(50%-4rem)] ${isEven ? "text-right" : "text-left"}`}
                      >
                        <div
                          className={`inline-block p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 group ${
                            isEven ? "ml-auto" : "mr-auto"
                          }`}
                        >
                          <div
                            className={`flex items-center gap-4 mb-4 ${
                              isEven ? "flex-row-reverse justify-start" : "flex-row"
                            }`}
                          >
                            <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent transition-colors duration-300">
                              <Icon className="h-6 w-6 text-accent group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {step.title}
                            </h3>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </motion.div>

                      {/* Center Number Node */}
                      <motion.div 
                        custom={index}
                        variants={nodeVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="relative flex items-center justify-center"
                      >
                        <div className="absolute w-20 h-20 bg-primary/10 rounded-full animate-pulse" />
                        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-lg shadow-primary/30 z-10">
                          <span className="text-2xl font-bold">
                            {step.number.padStart(2, "0")}
                          </span>
                        </div>
                      </motion.div>

                      {/* Empty space */}
                      <div className="w-[calc(50%-4rem)]" />
                    </div>

                    {/* Mobile/Tablet Layout */}
                    <motion.div 
                      custom={index}
                      variants={stepVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-30px" }}
                      className="lg:hidden flex items-start gap-4 sm:gap-6"
                    >
                      {/* Number Node - Mobile */}
                      <motion.div 
                        custom={index}
                        variants={nodeVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-30px" }}
                        className="relative flex-shrink-0"
                      >
                        <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full animate-pulse" />
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-lg shadow-primary/30 z-10">
                          <span className="text-base sm:text-xl font-bold">
                            {step.number.padStart(2, "0")}
                          </span>
                        </div>
                      </motion.div>

                      {/* Content Card - Mobile */}
                      <div className="flex-1 p-4 sm:p-6 rounded-xl bg-card border border-border group">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <div className="p-1.5 sm:p-2 rounded-lg bg-accent/10 flex-shrink-0">
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-foreground">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
