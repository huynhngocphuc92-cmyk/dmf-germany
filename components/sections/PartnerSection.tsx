"use client";

import Image from "next/image";
import { m } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { MotionProvider } from "@/components/shared/MotionProvider";

interface PartnerSectionProps {
  partnerBanner?: string | null;
}

export const PartnerSection = ({ partnerBanner }: PartnerSectionProps = {}) => {
  const { t, lang } = useLanguage();
  const hasBanner = partnerBanner && partnerBanner.trim() !== "";

  const sectors =
    lang === "en"
      ? [
          {
            title: "Healthcare & Nursing",
            desc: "Hospitals, inpatient care facilities, and outpatient services",
          },
          {
            title: "Skilled Trades & Industry",
            desc: "Electrical, HVAC, metalworking, and manufacturing enterprises",
          },
          {
            title: "Hospitality & Gastronomy",
            desc: "Hotels, system catering, and seasonal operations across Germany",
          },
        ]
      : lang === "vn"
        ? [
            {
              title: "Y tế & Điều dưỡng",
              desc: "Bệnh viện, viện dưỡng lão và các cơ sở chăm sóc sức khỏe",
            },
            {
              title: "Thủ công nghiệp & Công nghiệp",
              desc: "Cơ khí, điện - điện tử, xây dựng và sản xuất công nghiệp",
            },
            {
              title: "Nhà hàng & Khách sạn",
              desc: "Hệ thống khách sạn, ẩm thực và dịch vụ lưu trú trên toàn nước Đức",
            },
          ]
        : [
            {
              title: "Gesundheits- & Pflegeeinrichtungen",
              desc: "Kliniken, stationäre Pflegeheime und ambulante Pflegedienste",
            },
            {
              title: "Handwerk & Industrie",
              desc: "Elektrotechnik, SHK, Metallbau und produzierender Mittelstand",
            },
            {
              title: "Hotellerie & Gastronomie",
              desc: "Hotels, Systemgastronomie und Saisonbetriebe in ganz Deutschland",
            },
          ];

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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
                />
              </div>
            ) : (
              <div className="w-full rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 p-6 md:p-10 border border-border/60 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {sectors.map((sector) => (
                    <div
                      key={sector.title}
                      className="rounded-xl bg-card/80 backdrop-blur-sm p-5 border border-border/50 text-center space-y-2"
                    >
                      <h3 className="text-base md:text-lg font-bold text-foreground">
                        {sector.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                        {sector.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </m.div>
        </div>
      </section>
    </MotionProvider>
  );
};
