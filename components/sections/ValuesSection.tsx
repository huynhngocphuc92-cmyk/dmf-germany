"use client";

import { useLanguage } from "@/lib/language-context";
import { motion } from "framer-motion";
import { Award, UserCheck, Eye, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Animation variants - German precision style
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cardVariants: any = {
  hidden: { 
    opacity: 0, 
    y: 40,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

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

export const ValuesSection = () => {
  const { content } = useLanguage();

  // Hardcoded icons mapping - đồng bộ và đẹp ngay lập tức
  const iconMap = {
    award: Award, // Qualität
    search: UserCheck, // Sorgfältige Auswahl (thay Search bằng UserCheck)
    eye: Eye, // Transparenz
    shield: ShieldCheck, // Verantwortung
  };

  // Gradient colors cho mỗi card
  const gradients = [
    "from-primary/10 to-primary/5",
    "from-accent/10 to-accent/5",
    "from-primary/10 to-accent/5",
    "from-accent/10 to-primary/5",
  ];

  return (
    <section id="values" className="py-16 md:py-28 lg:py-36 bg-muted/20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
              className="inline-block px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-accent/10 text-accent text-xs md:text-sm font-medium"
            >
              {content.values.badge}
            </motion.span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              {content.values.title}
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
              {content.values.subtitle}
            </p>
          </motion.div>

          {/* Values Grid - Responsive: 1 col mobile, 2 cols tablet, 4 cols desktop */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
          >
            {content.values.items.map((value, index) => {
              const Icon =
                iconMap[value.icon as keyof typeof iconMap] || ShieldCheck;
              return (
                <motion.div
                  key={value.title}
                  variants={cardVariants}
                >
                  <Card
                    className={`h-full group cursor-default border-border/50 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden relative`}
                  >
                    {/* Background gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />

                    <CardHeader className="relative pb-0 pt-6 md:pt-8">
                      {/* Icon container */}
                      <div className="mb-4 md:mb-6">
                        <div className="relative inline-flex">
                          {/* Glow effect */}
                          <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative p-3 md:p-4 rounded-xl md:rounded-2xl bg-blue-50 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-accent transition-all duration-300">
                            <Icon className="w-10 h-10 text-primary group-hover:text-white transition-colors duration-300" />
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {value.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="relative pt-3 md:pt-4 pb-6">
                      <CardDescription className="text-muted-foreground leading-relaxed text-xs md:text-sm">
                        {value.description}
                      </CardDescription>
                    </CardContent>

                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
