"use client";

import { useState, useMemo, useEffect, memo } from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SliderWithMarker } from "./roi/SliderWithMarker";
import { ProductTypeTabs, type ProductType } from "./roi/ProductTypeTabs";
import { SavingsCard } from "./roi/SavingsCard";
import { CostComparisonChart } from "./roi/CostComparisonChart";

// ============================================
// TYPES
// ============================================

interface ProductDefaults {
  germanSalary: number;
  dmfSalary: number;
  recruitmentFee: number;
  contractDuration: number;
  minGerman: number;
  maxGerman: number;
  minDmf: number;
  maxDmf: number;
  minFee: number;
  maxFee: number;
  avgGerman: number;
  avgDmf: number;
  label: string;
}

type SkilledIndustryKey = "pflege" | "handwerk" | "industrie" | "gastro" | "it";
type AzubiIndustryKey = "pflege" | "handwerk" | "gastro";
type SeasonalIndustryKey = "agriculture" | "logistics";

interface IndustryData {
  label: string;
  labelEn: string;
  labelVn: string;
  deSalary: number;
  minGerman: number;
  maxGerman: number;
  dmfSalary: number;
  minDmf: number;
  maxDmf: number;
  fee: number;
  minFee: number;
  maxFee: number;
}

// ============================================
// INDUSTRY DATA CONFIGURATION (§ 39 Abs. 2 AufenthG compliant)
// ============================================

export const INDUSTRY_DATA = {
  skilled: {
    pflege: {
      label: "Pflege & Medizin",
      labelEn: "Nursing & Healthcare",
      labelVn: "Điều dưỡng & Y tế",
      deSalary: 6200,
      minGerman: 4500,
      maxGerman: 9500,
      dmfSalary: 3800,
      minDmf: 3200,
      maxDmf: 5500,
      fee: 6500,
      minFee: 3500,
      maxFee: 12000,
    },
    handwerk: {
      label: "Handwerk & Bau",
      labelEn: "Crafts & Construction",
      labelVn: "Thủ công & Xây dựng",
      deSalary: 5600,
      minGerman: 4200,
      maxGerman: 8500,
      dmfSalary: 3500,
      minDmf: 2900,
      maxDmf: 5200,
      fee: 5500,
      minFee: 3000,
      maxFee: 10000,
    },
    industrie: {
      label: "Industrie & Technik",
      labelEn: "Industry & Engineering",
      labelVn: "Công nghiệp & Kỹ thuật",
      deSalary: 5800,
      minGerman: 4200,
      maxGerman: 8800,
      dmfSalary: 3600,
      minDmf: 3000,
      maxDmf: 5500,
      fee: 5500,
      minFee: 3000,
      maxFee: 10000,
    },
    gastro: {
      label: "Hotel & Gastronomie",
      labelEn: "Hotel & Gastronomy",
      labelVn: "Khách sạn & Nhà hàng",
      deSalary: 4600,
      minGerman: 3500,
      maxGerman: 7000,
      dmfSalary: 2900,
      minDmf: 2400,
      maxDmf: 4500,
      fee: 4500,
      minFee: 2500,
      maxFee: 8500,
    },
    it: {
      label: "IT & Software",
      labelEn: "IT & Software",
      labelVn: "CNTT & Phần mềm",
      deSalary: 6500,
      minGerman: 4800,
      maxGerman: 9500,
      dmfSalary: 4200,
      minDmf: 3500,
      maxDmf: 6500,
      fee: 6000,
      minFee: 3500,
      maxFee: 12000,
    },
  },
  azubi: {
    pflege: {
      label: "Pflege (Azubi)",
      labelEn: "Nursing (Apprentice)",
      labelVn: "Điều dưỡng (Học nghề)",
      deSalary: 2200,
      minGerman: 1500,
      maxGerman: 3500,
      dmfSalary: 1350,
      minDmf: 1000,
      maxDmf: 1800,
      fee: 4500,
      minFee: 2500,
      maxFee: 8000,
    },
    handwerk: {
      label: "Handwerk (Azubi)",
      labelEn: "Crafts (Apprentice)",
      labelVn: "Thủ công (Học nghề)",
      deSalary: 2100,
      minGerman: 1500,
      maxGerman: 3500,
      dmfSalary: 1250,
      minDmf: 1000,
      maxDmf: 1800,
      fee: 4500,
      minFee: 2500,
      maxFee: 8000,
    },
    gastro: {
      label: "Hotel/Küche (Azubi)",
      labelEn: "Hotel/Kitchen (Apprentice)",
      labelVn: "Khách sạn/Bếp (Học nghề)",
      deSalary: 1950,
      minGerman: 1500,
      maxGerman: 3500,
      dmfSalary: 1150,
      minDmf: 1000,
      maxDmf: 1800,
      fee: 4500,
      minFee: 2500,
      maxFee: 8000,
    },
  },
  seasonal: {
    agriculture: {
      label: "Landwirtschaft",
      labelEn: "Agriculture",
      labelVn: "Nông nghiệp",
      deSalary: 3400,
      minGerman: 2800,
      maxGerman: 5000,
      dmfSalary: 2400,
      minDmf: 2250,
      maxDmf: 3500,
      fee: 1500,
      minFee: 800,
      maxFee: 3500,
    },
    logistics: {
      label: "Lager & Logistik",
      labelEn: "Warehousing & Logistics",
      labelVn: "Kho bãi & Logistics",
      deSalary: 3600,
      minGerman: 2800,
      maxGerman: 5000,
      dmfSalary: 2550,
      minDmf: 2250,
      maxDmf: 3500,
      fee: 1500,
      minFee: 800,
      maxFee: 3500,
    },
  },
} as const;

// ============================================
// PRODUCT DEFAULTS
// ============================================

const PRODUCT_DEFAULTS: Record<ProductType, ProductDefaults> = {
  fachkraefte: {
    germanSalary: 5800,
    dmfSalary: 3600,
    recruitmentFee: 5500,
    contractDuration: 3,
    minGerman: 4200,
    maxGerman: 8800,
    minDmf: 3000,
    maxDmf: 5500,
    minFee: 3000,
    maxFee: 10000,
    avgGerman: 5800,
    avgDmf: 3600,
    label: "Fachkräfte (Allgemein)",
  },
  azubi: {
    germanSalary: 2100,
    dmfSalary: 1250,
    recruitmentFee: 4500,
    contractDuration: 3,
    minGerman: 1500,
    maxGerman: 3500,
    minDmf: 1000,
    maxDmf: 1800,
    minFee: 2500,
    maxFee: 8000,
    avgGerman: 2100,
    avgDmf: 1250,
    label: "Auszubildende (Allgemein)",
  },
  saisonkraefte: {
    germanSalary: 3400,
    dmfSalary: 2400,
    recruitmentFee: 1500,
    contractDuration: 1,
    minGerman: 2800,
    maxGerman: 5000,
    minDmf: 2250,
    maxDmf: 3500,
    minFee: 800,
    maxFee: 3500,
    avgGerman: 3400,
    avgDmf: 2400,
    label: "Saisonkräfte (Allgemein)",
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

const getProductDefaultsFromIndustry = (
  productType: ProductType,
  industryKey?: SkilledIndustryKey | AzubiIndustryKey | SeasonalIndustryKey
): ProductDefaults => {
  if (industryKey) {
    const industryMap = {
      fachkraefte: INDUSTRY_DATA.skilled,
      azubi: INDUSTRY_DATA.azubi,
      saisonkraefte: INDUSTRY_DATA.seasonal,
    };

    const industryData: IndustryData | null =
      (industryMap[productType] as Record<string, IndustryData>)?.[industryKey] || null;

    if (industryData) {
      return {
        germanSalary: industryData.deSalary,
        dmfSalary: industryData.dmfSalary,
        recruitmentFee: industryData.fee,
        contractDuration: productType === "saisonkraefte" ? 1 : 3,
        minGerman: industryData.minGerman,
        maxGerman: industryData.maxGerman,
        minDmf: industryData.minDmf,
        maxDmf: industryData.maxDmf,
        minFee: industryData.minFee,
        maxFee: industryData.maxFee,
        avgGerman: industryData.deSalary,
        avgDmf: industryData.dmfSalary,
        label: industryData.label,
      };
    }
  }

  return PRODUCT_DEFAULTS[productType];
};

// ============================================
// MAIN COMPONENT
// ============================================

export const RoiCalculator = memo(function RoiCalculator() {
  const { t, lang } = useLanguage();
  const [productType, setProductType] = useState<ProductType>("fachkraefte");
  const [selectedIndustry, setSelectedIndustry] = useState<
    SkilledIndustryKey | AzubiIndustryKey | SeasonalIndustryKey | null
  >("pflege");

  const currentDefaults = useMemo(() => {
    return getProductDefaultsFromIndustry(productType, selectedIndustry || undefined);
  }, [productType, selectedIndustry]);

  const [germanSalary, setGermanSalary] = useState(
    () => getProductDefaultsFromIndustry("fachkraefte", "pflege").germanSalary
  );
  const [dmfSalary, setDmfSalary] = useState(
    () => getProductDefaultsFromIndustry("fachkraefte", "pflege").dmfSalary
  );
  const [recruitmentFee, setRecruitmentFee] = useState(
    () => getProductDefaultsFromIndustry("fachkraefte", "pflege").recruitmentFee
  );
  const [contractDuration, setContractDuration] = useState(
    () => getProductDefaultsFromIndustry("fachkraefte", "pflege").contractDuration
  );

  useEffect(() => {
    if (productType === "fachkraefte") {
      setSelectedIndustry("pflege");
    } else if (productType === "azubi") {
      setSelectedIndustry("handwerk");
    } else {
      setSelectedIndustry("agriculture");
    }
  }, [productType]);

  useEffect(() => {
    setGermanSalary(currentDefaults.germanSalary);
    setDmfSalary(currentDefaults.dmfSalary);
    setRecruitmentFee(currentDefaults.recruitmentFee);
    setContractDuration(currentDefaults.contractDuration);
  }, [currentDefaults]);

  const calculations = useMemo(() => {
    const germanTotalCost = germanSalary * 13 * contractDuration;
    const dmfTotalCost = dmfSalary * 13 * contractDuration + recruitmentFee;
    const savings = germanTotalCost - dmfTotalCost;
    const savingsPercentage =
      germanTotalCost > 0 ? ((savings / germanTotalCost) * 100).toFixed(1) : "0";

    return { germanTotalCost, dmfTotalCost, savings, savingsPercentage };
  }, [germanSalary, dmfSalary, recruitmentFee, contractDuration]);

  const germanAvgPosition =
    ((currentDefaults.avgGerman - currentDefaults.minGerman) /
      (currentDefaults.maxGerman - currentDefaults.minGerman)) *
    100;
  const dmfAvgPosition =
    ((currentDefaults.avgDmf - currentDefaults.minDmf) /
      (currentDefaults.maxDmf - currentDefaults.minDmf)) *
    100;

  const getProductTitle = () => {
    switch (productType) {
      case "fachkraefte":
        return t.roi?.input_title_fachkraefte || "Kostenvergleich Fachkräfte";
      case "azubi":
        return t.roi?.input_title_azubi || "Kostenvergleich Ausbildung";
      case "saisonkraefte":
        return t.roi?.input_title_saisonkraefte || "Kostenvergleich Saisonkräfte";
      default:
        return t.roi?.input_title || "Parameter eingeben";
    }
  };

  const getProductSubtitle = () => {
    switch (productType) {
      case "fachkraefte":
        return (
          t.roi?.input_subtitle_fachkraefte ||
          "Vergleichen Sie Zeitarbeits-/Vakanzkosten mit der Direktvermittlung zum gleichen Tarifgehalt"
        );
      case "azubi":
        return (
          t.roi?.input_subtitle_azubi || "Vergleichen Sie die Ausbildungskosten und Förderungen"
        );
      case "saisonkraefte":
        return (
          t.roi?.input_subtitle_saisonkraefte ||
          "Vergleichen Sie die Kosten für Saisonarbeitskräfte"
        );
      default:
        return "";
    }
  };

  const getAvailableIndustries = (): Record<string, IndustryData> => {
    const industryMap: Record<ProductType, Record<string, IndustryData>> = {
      fachkraefte: INDUSTRY_DATA.skilled,
      azubi: INDUSTRY_DATA.azubi,
      saisonkraefte: INDUSTRY_DATA.seasonal,
    };
    return industryMap[productType] || {};
  };

  const getIndustryOptionLabel = (data: IndustryData) => {
    if (lang === "en") return data.labelEn;
    if (lang === "vn") return data.labelVn;
    return data.label;
  };

  const handleIndustryChange = (value: string) => {
    if (value === "") {
      setSelectedIndustry(null);
    } else {
      setSelectedIndustry(value as SkilledIndustryKey | AzubiIndustryKey | SeasonalIndustryKey);
    }
  };

  const serviceParam =
    productType === "azubi" ? "azubi" : productType === "saisonkraefte" ? "seasonal" : "skilled";

  const currentPreset = currentDefaults;

  return (
    <div className="w-full max-w-7xl mx-auto">
      <ProductTypeTabs productType={productType} onChange={setProductType} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{getProductTitle()}</h2>
              {getProductSubtitle() && (
                <p className="text-sm text-gray-600">{getProductSubtitle()}</p>
              )}
            </div>

            {/* Industry Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.roi?.industry_label || "Wählen Sie Ihre Branche"}
              </label>
              <select
                value={selectedIndustry || ""}
                onChange={(e) => handleIndustryChange(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-2 sm:text-sm py-2.5 px-3 border bg-white transition-colors hover:border-gray-400 cursor-pointer"
              >
                <option value="">
                  {t.roi?.industry_default || "Allgemein (Keine spezifische Branche)"}
                </option>
                {Object.entries(getAvailableIndustries()).map(([key, data]) => (
                  <option key={key} value={key}>
                    {getIndustryOptionLabel(data)}
                  </option>
                ))}
              </select>
              {selectedIndustry && (
                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {t.roi?.industry_hint ||
                    "Berechnungen basieren auf Marktdurchschnitt für diese Branche"}
                </p>
              )}
            </div>

            {/* Slider 1: Alternative Monthly Cost (Zeitarbeit / Vakanzkosten) */}
            <SliderWithMarker
              value={germanSalary}
              onChange={setGermanSalary}
              min={currentDefaults.minGerman}
              max={currentDefaults.maxGerman}
              step={productType === "azubi" ? 50 : 100}
              avgPosition={germanAvgPosition}
              avgValue={currentDefaults.avgGerman}
              label={
                lang === "de"
                  ? "Monatliche Kosten Alternative (z. B. Zeitarbeit / Leiharbeit / Vakanzkosten inkl. Lohnnebenkosten)"
                  : lang === "en"
                    ? "Monthly Alternative Costs (e.g. Temp Agency / Vacancy Costs incl. Non-Wage Labor Costs)"
                    : "Chi phí phương án thay thế hàng tháng (VD: Thuê ngoài / Chi phí trống vị trí)"
              }
              hint={
                (t.roi as Record<string, string> | undefined)?.label_salary_de_hint ||
                (lang === "de"
                  ? "Durchschnittliche monatliche Gesamtkosten bei Zeitarbeit, Überstunden oder unbesetzter Stelle"
                  : lang === "en"
                    ? "Average monthly total cost for temporary agency staffing or unfilled vacancies"
                    : "Tổng chi phí trung bình hàng tháng khi thuê nhân sự qua agency hoặc để trống vị trí")
              }
              id="german-salary"
              markerType="german"
            />

            {/* Slider 2: DMF Candidate Salary (§ 39 Abs. 2 AufenthG equal pay) */}
            <SliderWithMarker
              value={dmfSalary}
              onChange={setDmfSalary}
              min={currentDefaults.minDmf}
              max={currentDefaults.maxDmf}
              step={productType === "azubi" ? 50 : 100}
              avgPosition={dmfAvgPosition}
              avgValue={currentDefaults.avgDmf}
              label={
                lang === "de"
                  ? "Arbeitgeber-Bruttogehalt DMF-Kandidat (100% gleiches Tarif-/Vergleichsentgelt nach § 39 Abs. 2 AufenthG)"
                  : lang === "en"
                    ? "Employer Gross Salary DMF Candidate (100% Equal Collective/Comparable Pay per § 39 (2) AufenthG)"
                    : "Lương gộp ứng viên DMF (100% lương ngang bằng theo § 39 khoản 2 AufenthG)"
              }
              hint={
                lang === "de"
                  ? "Gesetzlich vorgeschriebenes gleiches Tarif-/Vergleichsentgelt wie vergleichbare deutsche Beschäftigte"
                  : lang === "en"
                    ? "Statutorily required equal collective/comparable remuneration as for domestic employees"
                    : "Mức lương ngang bằng theo quy định pháp luật Đức như nhân sự bản địa tương đương"
              }
              id="dmf-salary"
              markerType="dmf"
            />

            {/* Recruitment Fee */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.roi?.label_fee || "Einmalige Vermittlungsgebühr"}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={currentDefaults.minFee}
                  max={currentDefaults.maxFee}
                  step={productType === "saisonkraefte" ? 100 : 500}
                  value={recruitmentFee}
                  onChange={(e) => setRecruitmentFee(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex items-center gap-1 min-w-[120px] justify-end">
                  <input
                    type="number"
                    min={currentDefaults.minFee}
                    max={currentDefaults.maxFee}
                    step={productType === "saisonkraefte" ? 100 : 500}
                    value={recruitmentFee}
                    onChange={(e) => setRecruitmentFee(Number(e.target.value))}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-right focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-gray-600">€</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t.roi?.label_fee_hint ||
                  "Einmalige Servicegebühr für Rekrutierung, Sprachausbildung und Visabegleitung"}
              </p>
            </div>

            {/* Contract Duration */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.roi?.label_duration || "Vertragslaufzeit"}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max={productType === "saisonkraefte" ? 3 : 5}
                  step="1"
                  value={contractDuration}
                  onChange={(e) => setContractDuration(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="min-w-[80px] text-right">
                  <span className="text-lg font-bold text-primary">
                    {contractDuration}{" "}
                    {contractDuration === 1
                      ? t.roi?.conclusion_years_singular || "Jahr"
                      : t.roi?.conclusion_years_plural || "Jahre"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t.roi?.label_duration_hint ||
                  "Betrachtungszeitraum / geplante Betriebszugehörigkeit"}
              </p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <SavingsCard
            savings={calculations.savings}
            savingsPercentage={calculations.savingsPercentage}
            contractDuration={contractDuration}
          />

          <CostComparisonChart
            germanTotalCost={calculations.germanTotalCost}
            dmfTotalCost={calculations.dmfTotalCost}
            germanSalary={germanSalary}
            dmfSalary={dmfSalary}
            recruitmentFee={recruitmentFee}
            contractDuration={contractDuration}
          />

          {/* Legal Compliance Note (§ 39 Abs. 2 AufenthG) */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-blue-900 leading-relaxed font-medium">
              {lang === "de"
                ? "Hinweis nach § 39 Abs. 2 AufenthG: Vietnamesische Fachkräfte erhalten das gleiche Tarif-/Vergleichsentgelt wie deutsche Beschäftigte. Die Ersparnis entsteht durch den Wegfall überhöhter Zeitarbeits- und Vakanzkosten."
                : lang === "en"
                  ? "Legal Note (§ 39 (2) AufenthG): Vietnamese professionals receive the exact same collective/comparable salary as German employees. Cost savings result from eliminating expensive temporary staffing agency fees and vacancy losses."
                  : "Lưu ý pháp lý (§ 39 khoản 2 AufenthG): Nhân sự Việt Nam nhận mức lương theo thỏa ước/tương đương 100% như lao động Đức. Khoản tiết kiệm đến từ việc cắt giảm chi phí thuê nhân sự thời vụ qua agency và thiệt hại do trống vị trí."}
            </p>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-xs text-amber-800 leading-relaxed">
              {t.roi?.disclaimer ||
                "Hinweis: Diese Berechnung dient nur als Referenz und berücksichtigt keine zusätzlichen Zulagen, Sozialabgaben, Steuern oder andere Nebenkosten. Die tatsächlichen Kosten können je nach individuellem Fall variieren."}
            </p>
          </div>

          {/* Conversion CTA Card */}
          <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 rounded-xl p-6 text-white shadow-lg border border-blue-800/50 space-y-4">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                {lang === "de"
                  ? "Praxistransfer"
                  : lang === "en"
                    ? "Action Plan"
                    : "Ứng dụng thực tế"}
              </span>
              <h4 className="text-lg font-bold text-white">
                {lang === "de"
                  ? "Dieses Einsparpotenzial für Ihr Unternehmen realisieren?"
                  : lang === "en"
                    ? "Realize this cost-saving potential for your business?"
                    : "Hiện thực hóa mức tiết kiệm này cho doanh nghiệp của bạn?"}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === "de"
                  ? "Lassen Sie Ihren konkreten Personalbedarf unverbindlich prüfen. Wir erstellen Ihnen eine passgenaue Kostenkalkulation inklusive FEG-Terminplan."
                  : lang === "en"
                    ? "Request a non-binding consultation. We provide a customized cost calculation and FEG timeline for your company."
                    : "Đăng ký tư vấn miễn phí. Chúng tôi sẽ lập bảng dự toán chi phí chi tiết và lộ trình visa FEG cho doanh nghiệp bạn."}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href={`/fuer-arbeitgeber/personalbedarf?service=${serviceParam}&industry=${selectedIndustry || "all"}&notes=${encodeURIComponent(`ROI-Rechner: ${currentPreset.label}, Laufzeit ${contractDuration}J, Gehalt ${dmfSalary}€`)}`}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-sm transition-all shadow-md hover:shadow-lg group"
              >
                <span>
                  {lang === "de"
                    ? "Unverbindliches Angebot mit diesen Werten anfordern"
                    : lang === "en"
                      ? "Request quote with these parameters"
                      : "Yêu cầu báo giá theo thông số này"}
                </span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
