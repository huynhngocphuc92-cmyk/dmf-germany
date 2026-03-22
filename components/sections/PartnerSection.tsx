"use client";

import Image from "next/image";
import { m } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { MotionProvider } from "@/components/shared/MotionProvider";

interface PartnerSectionProps {
  partnerBanner?: string | null;
}

export const PartnerSection = ({ partnerBanner }: PartnerSectionProps = {}) => {
  const { t } = useLanguage();
  // Fall back to a gradient placeholder when no banner is configured.
  const hasBanner = partnerBanner && partnerBanner.trim() !== "";

  return (
    <MotionProvider>
      <section className="py-12 md:py-16 lg:py-20 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-5xl mx-auto space-y-6"
          >
            {/* Centered section title */}
            <m.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-foreground"
            >
              {t.partner.title}
            </m.h2>

            {/* Main image container */}
            {hasBanner ? (
              <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={partnerBanner}
                  alt={t.partner.banner_alt}
                  fill
                  className="object-cover"
                  unoptimized={partnerBanner.startsWith("http")}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
                />
              </div>
            ) : (
              // Fallback placeholder
              <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 flex items-center justify-center border border-border/50 shadow-2xl">
                <p className="text-muted-foreground text-sm md:text-base">
                  {t.partner.logos_placeholder}
                </p>
              </div>
            )}
          </m.div>
        </div>
      </section>
    </MotionProvider>
  );
};
