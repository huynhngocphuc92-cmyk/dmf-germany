"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface PartnerSectionProps {
  partnerBanner?: string | null;
}

export const PartnerSection = ({ partnerBanner }: PartnerSectionProps = {}) => {
  const { t } = useLanguage();
  // Fallback: Nếu không có ảnh từ DB, hiển thị gradient placeholder
  const hasBanner = partnerBanner && partnerBanner.trim() !== "";

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl mx-auto space-y-6"
        >
          {/* Title - Căn giữa, font đậm */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-foreground"
          >
            {t.partner.title}
          </motion.h2>

          {/* Image Container - Rounded-2xl và Shadow-2xl như khung cửa sổ */}
          {hasBanner ? (
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={partnerBanner}
                alt={t.partner.banner_alt}
                fill
                className="object-cover"
                unoptimized={partnerBanner.startsWith("http")}
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
              />
            </div>
          ) : (
            // Fallback: Gradient placeholder
            <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 flex items-center justify-center border border-border/50 shadow-2xl">
              <p className="text-muted-foreground text-sm md:text-base">
                {t.partner.logos_placeholder}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
