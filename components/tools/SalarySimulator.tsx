"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  UtensilsCrossed, 
  Wrench, 
  HardHat,
  MapPin,
  TrendingUp,
  Info,
  Euro,
  GraduationCap
} from "lucide-react";

// ============================================
// DATA LAYER - Salary Data 2024/2025
// ============================================

interface SalaryData {
  year1: number;
  year2: number;
  year3: number;
  afterGraduation: number;
}

interface IndustryConfig {
  id: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  salaryWest: SalaryData;
  salaryEast: SalaryData;
}

// Real market data for Germany 2024/2025 (Brutto monthly in EUR)
const industryData: Record<string, IndustryConfig> = {
  pflege: {
    id: "pflege",
    icon: Heart,
    color: "text-rose-500",
    gradient: "from-rose-500 to-pink-500",
    // Pflege (Nursing) - highest paid Ausbildung
    salaryWest: {
      year1: 1190,
      year2: 1290,
      year3: 1400,
      afterGraduation: 3200,
    },
    salaryEast: {
      year1: 1130,
      year2: 1220,
      year3: 1330,
      afterGraduation: 2900,
    },
  },
  gastronomie: {
    id: "gastronomie",
    icon: UtensilsCrossed,
    color: "text-amber-500",
    gradient: "from-amber-500 to-orange-500",
    // Gastronomie (Hospitality) - lower base
    salaryWest: {
      year1: 900,
      year2: 1000,
      year3: 1100,
      afterGraduation: 2400,
    },
    salaryEast: {
      year1: 850,
      year2: 940,
      year3: 1040,
      afterGraduation: 2200,
    },
  },
  mechatronik: {
    id: "mechatronik",
    icon: Wrench,
    color: "text-blue-500",
    gradient: "from-blue-500 to-cyan-500",
    // Mechatronik - technical, well paid
    salaryWest: {
      year1: 1050,
      year2: 1130,
      year3: 1210,
      afterGraduation: 3100,
    },
    salaryEast: {
      year1: 990,
      year2: 1070,
      year3: 1150,
      afterGraduation: 2850,
    },
  },
  bau: {
    id: "bau",
    icon: HardHat,
    color: "text-emerald-500",
    gradient: "from-emerald-500 to-teal-500",
    // Bau (Construction) - good pay with demand
    salaryWest: {
      year1: 920,
      year2: 1230,
      year3: 1495,
      afterGraduation: 3000,
    },
    salaryEast: {
      year1: 870,
      year2: 1165,
      year3: 1420,
      afterGraduation: 2750,
    },
  },
};

// Average living costs in Germany (monthly)
const LIVING_COST_AVERAGE = 900;
const MAX_SALARY_DISPLAY = 3500;

// ============================================
// CONTENT LAYER - Multilingual Text
// ============================================

interface SimulatorContent {
  title: string;
  subtitle: string;
  badge: string;
  regionLabel: string;
  regions: { west: string; east: string };
  industries: Record<string, string>;
  yearLabels: { year1: string; year2: string; year3: string; afterGrad: string };
  livingCost: string;
  disclaimer: string;
  perMonth: string;
  surplus: string;
  callToAction: string;
  unitEuro: string;
}

const content: Record<"de" | "vn", SimulatorContent> = {
  de: {
    title: "Gehaltsrechner",
    subtitle: "Entdecken Sie Ihr Verdienstpotenzial während der dualen Ausbildung in Deutschland",
    badge: "Interaktives Tool",
    regionLabel: "Region",
    regions: {
      west: "Westdeutschland",
      east: "Ostdeutschland",
    },
    industries: {
      pflege: "Pflege",
      gastronomie: "Gastronomie",
      mechatronik: "Mechatronik",
      bau: "Bau",
    },
    yearLabels: {
      year1: "1. Jahr",
      year2: "2. Jahr",
      year3: "3. Jahr",
      afterGrad: "Nach Abschluss",
    },
    livingCost: "Ø Lebenshaltungskosten",
    disclaimer: "Durchschnittliche Bruttovergütung. Tatsächliche Werte variieren je nach Bundesland und Arbeitgeber.",
    perMonth: "pro Monat",
    surplus: "Überschuss",
    callToAction: "Starten Sie Ihre Karriere in Deutschland",
    unitEuro: "€",
  },
  vn: {
    title: "Công cụ tính lương",
    subtitle: "Khám phá tiềm năng thu nhập trong chương trình đào tạo nghề tại Đức",
    badge: "Công cụ tương tác",
    regionLabel: "Khu vực",
    regions: {
      west: "Tây Đức",
      east: "Đông Đức",
    },
    industries: {
      pflege: "Điều dưỡng",
      gastronomie: "Nhà hàng/KS",
      mechatronik: "Cơ điện tử",
      bau: "Xây dựng",
    },
    yearLabels: {
      year1: "Năm 1",
      year2: "Năm 2",
      year3: "Năm 3",
      afterGrad: "Sau tốt nghiệp",
    },
    livingCost: "Chi phí sinh hoạt TB",
    disclaimer: "Mức lương gộp trung bình. Thực tế có thể khác tùy theo bang và nhà tuyển dụng.",
    perMonth: "mỗi tháng",
    surplus: "Dư ra",
    callToAction: "Bắt đầu sự nghiệp tại Đức",
    unitEuro: "€",
  },
};

// ============================================
// COMPONENT LAYER
// ============================================

interface BarChartColumnProps {
  value: number;
  maxValue: number;
  label: string;
  color: string;
  gradient: string;
  delay: number;
  livingCost: number;
  content: SimulatorContent;
}

function BarChartColumn({
  value,
  maxValue,
  label,
  gradient,
  delay,
  livingCost,
  content: t,
}: BarChartColumnProps) {
  const heightPercent = (value / maxValue) * 100;
  const livingCostPercent = (livingCost / maxValue) * 100;
  const surplus = value - livingCost;
  const hasSurplus = surplus > 0;

  return (
    <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
      {/* Value Label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.3, duration: 0.3 }}
        className="text-center"
      >
        <span className="text-lg md:text-xl font-bold text-foreground">
          {value.toLocaleString("de-DE")}
        </span>
        <span className="text-xs text-muted-foreground ml-1">{t.unitEuro}</span>
      </motion.div>

      {/* Bar Container */}
      <div className="relative w-full h-48 md:h-64 bg-muted/30 rounded-xl overflow-hidden">
        {/* Living Cost Line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
          className="absolute w-full border-t-2 border-dashed border-amber-500/70 z-10"
          style={{ bottom: `${livingCostPercent}%` }}
        >
          <span className="absolute -top-5 right-0 text-[10px] text-amber-600 font-medium whitespace-nowrap">
            {livingCost}€
          </span>
        </motion.div>

        {/* Animated Bar */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${heightPercent}%` }}
          transition={{
            delay,
            duration: 0.8,
            ease: [0.34, 1.56, 0.64, 1], // Spring-like easing
          }}
          className={`absolute bottom-0 left-1 right-1 rounded-t-lg bg-gradient-to-t ${gradient} shadow-lg`}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 rounded-t-lg" />
          
          {/* Surplus indicator */}
          {hasSurplus && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.8 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <span className="px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full shadow-lg">
                +{surplus.toLocaleString("de-DE")}€
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Year Label */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2 }}
        className="text-xs md:text-sm font-medium text-muted-foreground text-center"
      >
        {label}
      </motion.span>
    </div>
  );
}

export function SalarySimulator() {
  const { t, lang } = useLanguage();
  
  // Fallback content for complex translations not yet in translations.ts
  // This will be gradually migrated to translations.ts
  const fallbackContent: Record<"de" | "en" | "vn", Partial<SimulatorContent>> = {
    de: {
      subtitle: "Entdecken Sie Ihr Verdienstpotenzial während der dualen Ausbildung in Deutschland",
      badge: "Interaktives Tool",
      regionLabel: "Region",
      regions: { west: "Westdeutschland", east: "Ostdeutschland" },
      industries: { pflege: "Pflege", gastronomie: "Gastronomie", mechatronik: "Mechatronik", bau: "Bau" },
      livingCost: "Ø Lebenshaltungskosten",
      disclaimer: "Durchschnittliche Bruttovergütung. Tatsächliche Werte variieren je nach Bundesland und Arbeitgeber.",
      perMonth: "pro Monat",
      surplus: "Überschuss",
      callToAction: "Starten Sie Ihre Karriere in Deutschland",
      unitEuro: "€",
    },
    en: {
      subtitle: "Discover your earning potential during dual training in Germany",
      badge: "Interactive Tool",
      regionLabel: "Region",
      regions: { west: "West Germany", east: "East Germany" },
      industries: { pflege: "Nursing", gastronomie: "Hospitality", mechatronik: "Mechatronics", bau: "Construction" },
      livingCost: "Avg. Living Costs",
      disclaimer: "Average gross salary. Actual values vary by state and employer.",
      perMonth: "per month",
      surplus: "Surplus",
      callToAction: "Start your career in Germany",
      unitEuro: "€",
    },
    vn: {
      subtitle: "Khám phá tiềm năng thu nhập trong chương trình đào tạo nghề tại Đức",
      badge: "Công cụ tương tác",
      regionLabel: "Khu vực",
      regions: { west: "Tây Đức", east: "Đông Đức" },
      industries: { pflege: "Điều dưỡng", gastronomie: "Nhà hàng/KS", mechatronik: "Cơ điện tử", bau: "Xây dựng" },
      livingCost: "Chi phí sinh hoạt TB",
      disclaimer: "Mức lương gộp trung bình. Thực tế có thể khác tùy theo bang và nhà tuyển dụng.",
      perMonth: "mỗi tháng",
      surplus: "Dư ra",
      callToAction: "Bắt đầu sự nghiệp tại Đức",
      unitEuro: "€",
    },
  };
  
  // Merge translations with fallback content
  const fullContent: SimulatorContent = {
    title: t.simulator.title,
    subtitle: fallbackContent[lang]?.subtitle || "",
    badge: fallbackContent[lang]?.badge || "",
    regionLabel: fallbackContent[lang]?.regionLabel || "",
    regions: fallbackContent[lang]?.regions || { west: "", east: "" },
    industries: t.industries || fallbackContent[lang]?.industries || {},
    yearLabels: t.yearLabels,
    livingCost: fallbackContent[lang]?.livingCost || "",
    disclaimer: fallbackContent[lang]?.disclaimer || "",
    perMonth: fallbackContent[lang]?.perMonth || "",
    surplus: fallbackContent[lang]?.surplus || "",
    callToAction: fallbackContent[lang]?.callToAction || "",
    unitEuro: fallbackContent[lang]?.unitEuro || "€",
  };
  
  const t_full = fullContent;

  const [selectedIndustry, setSelectedIndustry] = useState<string>("pflege");
  const [selectedRegion, setSelectedRegion] = useState<"west" | "east">("west");

  const currentIndustry = industryData[selectedIndustry];
  const currentSalary = selectedRegion === "west" 
    ? currentIndustry.salaryWest 
    : currentIndustry.salaryEast;

  const chartData = useMemo(() => [
    { key: "year1", value: currentSalary.year1, label: t_full.yearLabels.year1 },
    { key: "year2", value: currentSalary.year2, label: t_full.yearLabels.year2 },
    { key: "year3", value: currentSalary.year3, label: t_full.yearLabels.year3 },
    { key: "afterGrad", value: currentSalary.afterGraduation, label: t_full.yearLabels.afterGrad },
  ], [currentSalary, t_full.yearLabels]);

  const Icon = currentIndustry.icon;

  return (
    <section id="salary-calculator" className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            <TrendingUp className="h-4 w-4" />
            {t_full.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            {t_full.title}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t_full.subtitle}
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Card className="max-w-4xl mx-auto shadow-xl border-primary/10 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
              <CardTitle className="flex items-center justify-between flex-wrap gap-4">
                {/* Industry Icon + Name */}
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${currentIndustry.gradient} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">
                      {t.industries?.[selectedIndustry] || t_full.industries?.[selectedIndustry] || selectedIndustry}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {t_full.regions[selectedRegion]}
                    </p>
                  </div>
                </div>

                {/* Region Toggle */}
                <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
                  <button
                    onClick={() => setSelectedRegion("west")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      selectedRegion === "west"
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t_full.regions.west}
                  </button>
                  <button
                    onClick={() => setSelectedRegion("east")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      selectedRegion === "east"
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t_full.regions.east}
                  </button>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 md:p-6 lg:p-8">
              {/* Industry Tabs */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
                {Object.entries(industryData).map(([key, data]) => {
                  const TabIcon = data.icon;
                  const isActive = selectedIndustry === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedIndustry(key)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        isActive
                          ? `bg-gradient-to-r ${data.gradient} text-white shadow-lg scale-105`
                          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <TabIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">{t_full.industries?.[key] || key}</span>
                    </button>
                  );
                })}
              </div>

              {/* Chart Area */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedIndustry}-${selectedRegion}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  {/* Living Cost Legend */}
                  <div className="flex items-center justify-center gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded bg-gradient-to-r ${currentIndustry.gradient}`} />
                      <span className="text-muted-foreground">{t_full.industries?.[selectedIndustry] || selectedIndustry}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 border-t-2 border-dashed border-amber-500" />
                      <span className="text-muted-foreground">{t_full.livingCost} ({LIVING_COST_AVERAGE}€)</span>
                    </div>
                  </div>

                  {/* Bar Chart */}
                  <div className="flex items-end justify-between gap-3 md:gap-6 px-2 md:px-8">
                    {chartData.map((item, index) => (
                      <BarChartColumn
                        key={item.key}
                        value={item.value}
                        maxValue={MAX_SALARY_DISPLAY}
                        label={item.label}
                        color={currentIndustry.color}
                        gradient={currentIndustry.gradient}
                        delay={index * 0.1}
                        livingCost={LIVING_COST_AVERAGE}
                        content={t_full}
                      />
                    ))}
                  </div>

                  {/* Summary Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3"
                  >
                    <div className="p-3 bg-primary/5 rounded-xl text-center">
                      <Euro className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-xs text-muted-foreground">{t_full.yearLabels.year1}</p>
                      <p className="font-bold text-foreground">{currentSalary.year1.toLocaleString("de-DE")}€</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-xl text-center">
                      <Euro className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-xs text-muted-foreground">{t_full.yearLabels.year3}</p>
                      <p className="font-bold text-foreground">{currentSalary.year3.toLocaleString("de-DE")}€</p>
                    </div>
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-center">
                      <GraduationCap className="h-5 w-5 mx-auto mb-1 text-emerald-600" />
                      <p className="text-xs text-muted-foreground">{t_full.yearLabels.afterGrad}</p>
                      <p className="font-bold text-emerald-600">{currentSalary.afterGraduation.toLocaleString("de-DE")}€</p>
                    </div>
                    <div className="p-3 bg-amber-500/10 rounded-xl text-center">
                      <TrendingUp className="h-5 w-5 mx-auto mb-1 text-amber-600" />
                      <p className="text-xs text-muted-foreground">{t_full.surplus}</p>
                      <p className="font-bold text-amber-600">
                        +{(currentSalary.afterGraduation - LIVING_COST_AVERAGE).toLocaleString("de-DE")}€
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="mt-6 flex items-start gap-2 p-3 bg-muted/50 rounded-lg"
              >
                <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  {t_full.disclaimer}
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl shadow-lg hover:bg-primary/90 transition-all hover:shadow-xl hover:scale-105"
          >
            <GraduationCap className="h-5 w-5" />
            {t_full.callToAction}
          </a>
        </motion.div>
      </div>
    </section>
  );
}

