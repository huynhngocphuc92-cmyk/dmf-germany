"use client";

import { useRef } from "react";
import { m, useInView } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { MotionProvider } from "@/components/shared/MotionProvider";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Plane,
  Users,
  Building2,
  TrendingUp,
  Award,
  CheckCircle,
  Sparkles,
} from "lucide-react";

// ============================================
// STAT CARD COMPONENTS
// ============================================

interface StatCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  isInView: boolean;
}

function StatCard({ children, className = "", delay = 0, isInView }: StatCardProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`
        relative overflow-hidden rounded-3xl
        bg-white/[0.07] backdrop-blur-xl
        border border-white/10
        transition-all duration-300
        hover:bg-white/[0.12] hover:border-white/20
        hover:shadow-2xl hover:shadow-blue-500/10
        group
        ${className}
      `}
    >
      {children}
    </m.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function StatsDashboard() {
  const { lang } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const copy =
    lang === "en"
      ? {
          badge: "Quality & Process Standards",
          title: "Structured Recruitment from Vietnam",
          subtitle:
            "Transparent processes, thorough linguistic preparation, and full legal compliance for German employers.",
          card1Label: "End-to-End Process Support",
          card1Value: "A–Z",
          card1Sub: "Full Service under FEG & § 81a AufenthG",
          card1Desc:
            "Structured support from candidate pre-selection and credential recognition to visa issuance and arrival in Germany.",
          card2Value: "B1–B2",
          card2Label: "Structured Preparation",
          card2Desc: "Targeted language & vocational qualification in Vietnam",
          card3Value: "§ 81a",
          card3Label: "Legally Compliant Process",
          card3Desc: "Fast-track procedure for skilled workers & trainees (AufenthG)",
          card4Label: "Long-Term Retention & Integration",
          card4Value: "3 Pillars",
          card4Desc:
            "Skilled workers (§§ 18a/18b), trainees (§ 16a), and seasonal staff — backed by intercultural onboarding support.",
          sectors: [
            "Healthcare & Nursing",
            "Skilled Trades & Industry",
            "Hospitality & Gastronomy",
          ],
          trust: [
            {
              icon: Shield,
              text: "Structured Preparation · Language & Vocational Training in Vietnam",
            },
            {
              icon: Award,
              text: "Legally Compliant Process · Support under FEG & § 81a AufenthG",
            },
            {
              icon: Sparkles,
              text: "Long-Term Retention · Intercultural Integration Support",
            },
          ],
        }
      : lang === "vn"
        ? {
            badge: "Tiêu chuẩn Chất lượng & Quy trình",
            title: "Tuyển dụng Bài bản từ Việt Nam",
            subtitle:
              "Quy trình minh bạch, đào tạo tiếng Đức chuyên sâu và tuân thủ pháp lý chặt chẽ dành cho doanh nghiệp Đức.",
            card1Label: "Đồng hành Quy trình Trọn gói",
            card1Value: "A–Z",
            card1Sub: "Chuẩn pháp lý FEG & § 81a AufenthG",
            card1Desc:
              "Hỗ trợ xuyên suốt từ khâu sơ tuyển, công nhận văn bằng đến thủ tục thị thực và hội nhập tại Đức.",
            card2Value: "B1–B2",
            card2Label: "Chuẩn bị Bài bản",
            card2Desc: "Đào tạo ngôn ngữ & định hướng nghề nghiệp tại Việt Nam",
            card3Value: "§ 81a",
            card3Label: "Quy trình Pháp lý Minh bạch",
            card3Desc: "Thủ tục nhanh cho lao động có tay nghề & học viên nghề (AufenthG)",
            card4Label: "Gắn kết & Hội nhập Lâu dài",
            card4Value: "3 Trụ cột",
            card4Desc:
              "Nhân sự có tay nghề (§§ 18a/18b), Du học nghề (§ 16a) và Lao động thời vụ — đồng hành văn hóa bền vững.",
            sectors: ["Y tế & Điều dưỡng", "Kỹ thuật & Công nghiệp", "Nhà hàng & Khách sạn"],
            trust: [
              {
                icon: Shield,
                text: "Chuẩn bị bài bản · Đào tạo ngôn ngữ & chuyên môn tại Việt Nam",
              },
              {
                icon: Award,
                text: "Quy trình pháp lý an toàn · Theo chuẩn FEG & § 81a AufenthG",
              },
              {
                icon: Sparkles,
                text: "Gắn kết lâu dài · Đồng hành hội nhập văn hóa doanh nghiệp",
              },
            ],
          }
        : {
            badge: "Qualitäts- & Prozessstandards",
            title: "Strukturierte Gewinnung aus Vietnam",
            subtitle:
              "Transparente Abläufe, fundierte sprachliche Vorbereitung und rechtssichere Verfahren für deutsche Arbeitgeber.",
            card1Label: "Ganzheitliche Prozessbegleitung",
            card1Value: "A–Z",
            card1Sub: "Komplettbegleitung nach FEG & § 81a AufenthG",
            card1Desc:
              "Strukturierte Begleitung von der Vorauswahl über die Berufsanerkennung bis zur Visumerteilung und Einreise nach Deutschland.",
            card2Value: "B1–B2",
            card2Label: "Strukturierte Vorbereitung",
            card2Desc: "Sprach- & Fachqualifizierung in Vietnam nach GER-Standard",
            card3Value: "§ 81a",
            card3Label: "Rechtssicherer Prozess",
            card3Desc: "Begleitung nach FEG & beschleunigtem Fachkräfteverfahren (AufenthG)",
            card4Label: "Langfristige Bindung & Fokusbranchen",
            card4Value: "3 Säulen",
            card4Desc:
              "Fachkräfte (§§ 18a/18b), Auszubildende (§ 16a) und Saisonkräfte – inklusive interkultureller Integrationsbegleitung.",
            sectors: ["Pflege & Gesundheit", "Handwerk & Industrie", "Hotellerie & Gastronomie"],
            trust: [
              {
                icon: Shield,
                text: "Strukturierte Vorbereitung · Sprach- & Fachqualifizierung in Vietnam",
              },
              {
                icon: Award,
                text: "Rechtssicherer Prozess · Begleitung nach FEG & § 81a AufenthG",
              },
              {
                icon: Sparkles,
                text: "Langfristige Bindung · Interkulturelle Integrationsbegleitung",
              },
            ],
          };

  return (
    <MotionProvider>
      <section
        ref={sectionRef}
        id="stats-dashboard"
        className="relative py-24 md:py-32 overflow-hidden"
      >
        {/* Dark Background with Gradient */}
        <div
          className="
            absolute inset-0 
            bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950
          "
        />

        {/* Decorative Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] translate-x-1/2" />

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container relative mx-auto px-4 max-w-7xl">
          {/* Section Header */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge
              className="
                mb-6 px-5 py-2 text-sm font-medium 
                bg-white/10 border-white/20 text-white
                backdrop-blur-sm
              "
            >
              <Award className="h-4 w-4 mr-2" />
              {copy.badge}
            </Badge>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              {copy.title}
            </h2>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">{copy.subtitle}</p>
          </m.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 auto-rows-[minmax(140px,auto)] md:auto-rows-[minmax(180px,auto)]">
            {/* ========================= */}
            {/* CARD 1: End-to-End Process */}
            {/* Spans 2 columns x 2 rows  */}
            {/* ========================= */}
            <StatCard
              className="md:col-span-2 md:row-span-2 p-8 md:p-10"
              delay={0}
              isInView={isInView}
            >
              <Shield
                className="
                  absolute -right-8 -bottom-8 
                  w-64 h-64 text-white/[0.03]
                  transition-all duration-500
                  group-hover:text-white/[0.06]
                  group-hover:scale-110
                "
                strokeWidth={0.5}
              />

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                      {copy.card1Label}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter">
                      {copy.card1Value}
                    </span>
                  </div>
                  <p className="text-base md:text-lg font-semibold text-blue-300 mb-4">
                    {copy.card1Sub}
                  </p>
                </div>

                <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-md">
                  {copy.card1Desc}
                </p>
              </div>
            </StatCard>

            {/* ========================= */}
            {/* CARD 2: Language Standard */}
            {/* ========================= */}
            <StatCard className="p-6 md:p-8" delay={0.1} isInView={isInView}>
              <Plane
                className="
                  absolute -right-4 -bottom-4 
                  w-32 h-32 text-white/[0.03]
                  transition-all duration-500
                  group-hover:text-white/[0.06]
                "
                strokeWidth={0.5}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <Plane className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                    {copy.card2Value}
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-300 mb-1">{copy.card2Label}</p>
                <p className="text-xs text-slate-400">{copy.card2Desc}</p>
              </div>
            </StatCard>

            {/* ========================= */}
            {/* CARD 3: Legal Fast-Track  */}
            {/* ========================= */}
            <StatCard className="p-6 md:p-8" delay={0.2} isInView={isInView}>
              <TrendingUp
                className="
                  absolute -right-4 -bottom-4 
                  w-32 h-32 text-white/[0.03]
                  transition-all duration-500
                  group-hover:text-white/[0.06]
                "
                strokeWidth={0.5}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl md:text-5xl font-black text-emerald-400 tracking-tighter">
                    {copy.card3Value}
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-300 mb-1">{copy.card3Label}</p>
                <p className="text-xs text-slate-400">{copy.card3Desc}</p>
              </div>
            </StatCard>

            {/* ========================= */}
            {/* CARD 4: Program Pillars   */}
            {/* Spans 2 columns           */}
            {/* ========================= */}
            <StatCard className="md:col-span-2 p-6 md:p-8" delay={0.3} isInView={isInView}>
              <Building2
                className="
                  absolute -right-8 -bottom-8 
                  w-48 h-48 text-white/[0.03]
                  transition-all duration-500
                  group-hover:text-white/[0.06]
                "
                strokeWidth={0.5}
              />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                      {copy.card4Label}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                      {copy.card4Value}
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 max-w-md">{copy.card4Desc}</p>
                </div>

                {/* Core Sector Pillars */}
                <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
                  {copy.sectors.map((sector, i) => (
                    <div
                      key={i}
                      className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300 flex items-center gap-2"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{sector}</span>
                    </div>
                  ))}
                </div>
              </div>
            </StatCard>
          </div>

          {/* Bottom Trust Indicators */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-10"
          >
            {copy.trust.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <item.icon className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </m.div>
        </div>
      </section>
    </MotionProvider>
  );
}
