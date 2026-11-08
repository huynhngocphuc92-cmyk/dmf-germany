"use client";

import { m } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { MotionProvider } from "@/components/shared/MotionProvider";
import { ArrowRight, BookOpen, Globe2, MapPin, ShieldCheck, UserCheck } from "lucide-react";
import { AssetImageWithDebug } from "@/components/ui/AssetImageWithDebug";

interface AboutSectionProps {
  introImg?: string | null;
  videoThumb?: string | null;
  repDeImg?: string | null;
  repVnImg?: string | null;
}

export const AboutSection = ({
  introImg,
  videoThumb,
  repDeImg = "/images/home/umit-elezov.jpg",
  repVnImg = "/images/home/achim-betticher.jpg",
}: AboutSectionProps = {}) => {
  const { t, lang } = useLanguage();

  // Use video thumbnail if available, otherwise use intro image
  const displayImage = videoThumb || introImg;
  const icons = [BookOpen, Globe2, UserCheck];

  // Dynamic stats from translations
  const stats = [
    { value: "350+", label: t.about.stat_candidates },
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

  const communityBentoItems = [
    {
      src: "/images/community/dmf-community-german-delegation-gruezi.jpg",
      title:
        lang === "vn"
          ? "Phái đoàn Đối tác Đức"
          : lang === "en"
            ? "German Partner Delegations"
            : "Deutsche Partner-Delegationen",
      desc:
        lang === "vn"
          ? "Thẩm định chất lượng, giao lưu văn hóa và gặp gỡ trực tiếp học viên tại Học viện DMF Việt Nam."
          : lang === "en"
            ? "On-site quality audits, guest lectures, and personal exchange directly at the DMF Campus in Vietnam."
            : "Qualitätsaudits, Gastvorträge und persönliches Kennenlernen direkt am DMF-Campus in Vietnam.",
    },
    {
      src: "/images/community/dmf-community-achim-interview-panel.jpg",
      title:
        lang === "vn"
          ? "Sát hạch cùng Chuyên gia Đức"
          : lang === "en"
            ? "German Interview Coaching"
            : "Deutsches Interview-Coaching",
      desc:
        lang === "vn"
          ? "Mô phỏng phỏng vấn thực chiến cùng ông Achim Betticher và hội đồng chuyên gia Đức."
          : lang === "en"
            ? "Realistic interview simulations conducted on site by Mr. Achim Betticher and German assessors."
            : "Praxisnahe Bewerbungssimulationen mit Herrn Achim Betticher und deutschen Prüfern vor Ort.",
    },
    {
      src: "/images/community/dmf-community-faculty-thay-khang-lecture.jpg",
      title:
        lang === "vn"
          ? "Đào tạo A1–B2 Toàn thời gian"
          : lang === "en"
            ? "Full-Time Academy (A1–B2)"
            : "Vollzeit-Sprachakademie (A1–B2)",
      desc:
        lang === "vn"
          ? "Lộ trình học tập trung các khóa K14 đến K50 chú trọng tiếng Đức chuyên ngành và kỷ luật nghề."
          : lang === "en"
            ? "Structured classroom instruction across cohorts K14 to K50 focused on vocational German."
            : "Strukturierter Präsenzunterricht in den Kohorten K14 bis K50 mit Fokus auf Fachsprache und Berufspraxis.",
    },
    {
      src: "/images/community/dmf-community-visa-hoang-duy.jpg",
      title:
        lang === "vn"
          ? "98% Cấp Thị thực (§ 16a / § 18a)"
          : lang === "en"
            ? "98% Visa Success (§ 16a / § 18a)"
            : "Verifizierte Visumerfolge (§ 16a / § 18a)",
      desc:
        lang === "vn"
          ? "Chuẩn hóa hồ sơ pháp lý trọn gói và đồng hành trực tiếp đến khi nhập cảnh CHLB Đức."
          : lang === "en"
            ? "Complete document compliance and personal accompaniment right up to arrival in Germany."
            : "Lückenlose Dokumenten-Compliance und persönliche Begleitung bis zur Einreise nach Deutschland.",
    },
  ];

  const representatives = [
    {
      key: "de",
      configKey: "home_rep_de_img",
      image: repDeImg || "/images/home/umit-elezov.jpg",
      initials: "UE",
      badge: t.about.rep_de_badge,
      name: t.about.rep_de_name,
      role: t.about.rep_de_role,
      description: t.about.rep_de_desc,
      location: t.contact.de_location,
      ctaLabel:
        lang === "vn"
          ? "Liên hệ đại diện tại Đức"
          : lang === "en"
            ? "Contact Representative in Germany"
            : "Direktkontakt in Deutschland",
      accentClass: "border-primary/20 bg-primary/5 text-primary",
    },
    {
      key: "vn",
      configKey: "home_rep_vn_img",
      image: repVnImg || "/images/home/achim-betticher.jpg",
      initials: "AB",
      badge: t.about.rep_vn_badge,
      name: t.about.rep_vn_name,
      role: t.about.rep_vn_role,
      description: t.about.rep_vn_desc,
      location: t.contact.vn_address,
      ctaLabel:
        lang === "vn"
          ? "Liên hệ học viện tại Việt Nam"
          : lang === "en"
            ? "Contact Academy in Vietnam"
            : "Kontakt zur Akademie in Vietnam",
      accentClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
    },
  ];

  return (
    <MotionProvider>
      <section id="about" className="py-16 md:py-24 lg:py-32 bg-background overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <m.div
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
            </m.div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center mb-12 md:mb-20">
              {/* Left - Description */}
              <m.div
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
                      <p
                        className={`text-xl md:text-3xl font-bold ${
                          index === 1 ? "text-accent" : "text-primary"
                        }`}
                      >
                        {stat.value}
                      </p>
                      <p className="text-[10px] md:text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </m.div>

              {/* Right - Visual */}
              <m.div
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:gap-4">
                    {communityBentoItems.map((item) => (
                      <figure
                        key={item.src}
                        className="group rounded-2xl overflow-hidden border border-border/60 bg-card shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                          <AssetImageWithDebug
                            src={item.src}
                            configKey="home_intro_img"
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 280px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <figcaption className="p-3.5 flex-1 flex flex-col justify-between">
                          <h4 className="text-xs md:text-sm font-bold text-foreground mb-1">
                            {item.title}
                          </h4>
                          <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">
                            {item.desc}
                          </p>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                )}
              </m.div>
            </div>

            {/* Features - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-16 md:mb-24">
              {features.map((feature, index) => {
                const Icon = icons[index] || BookOpen;
                return (
                  <m.div
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
                  </m.div>
                );
              })}
            </div>

            {/* Direct Representatives in Germany & Vietnam */}
            <m.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8 md:space-y-10"
            >
              <div className="text-center space-y-3 max-w-3xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                  {t.about.reps_title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                  {t.about.reps_subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {representatives.map((rep, index) => (
                  <m.div
                    key={rep.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 * index }}
                    className="flex flex-col sm:flex-row gap-6 p-6 md:p-7 rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                  >
                    {/* Portrait Image Slot */}
                    <div className="w-full sm:w-44 md:w-48 shrink-0">
                      <div className="w-full aspect-[4/5] rounded-xl overflow-hidden border border-border/60 bg-gradient-to-br from-slate-100 to-slate-200/70 relative shadow-sm">
                        {rep.image ? (
                          <AssetImageWithDebug
                            src={rep.image}
                            configKey={rep.configKey}
                            alt={rep.name}
                            fill
                            className="object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-primary/10 via-slate-50 to-primary/5">
                            <div className="w-20 h-20 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-2xl font-bold text-primary mb-3 shadow-inner">
                              {rep.initials}
                            </div>
                            <span className="text-xs font-semibold text-foreground/80">
                              {rep.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground mt-0.5">
                              {rep.location}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Representative Info */}
                    <div className="flex flex-col justify-between flex-1 space-y-4">
                      <div className="space-y-2.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${rep.accentClass}`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                          {rep.badge}
                        </span>
                        <div>
                          <h4 className="text-xl md:text-2xl font-bold text-foreground">
                            {rep.name}
                          </h4>
                          <p className="text-xs sm:text-sm font-medium text-primary mt-0.5">
                            {rep.role}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {rep.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4 text-primary shrink-0" />
                          <span>{rep.location}</span>
                        </div>
                        <a
                          href="#contact"
                          className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline transition-colors"
                        >
                          <span>{rep.ctaLabel}</span>
                          <ArrowRight className="w-4 h-4 shrink-0" />
                        </a>
                      </div>
                    </div>
                  </m.div>
                ))}
              </div>
            </m.div>
          </div>
        </div>
      </section>
    </MotionProvider>
  );
};
