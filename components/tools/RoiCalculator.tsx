"use client";

import { useState, useMemo, useEffect, memo } from "react";
import { Clock } from "lucide-react";
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
  maxFee: number;
  avgGerman: number;
  avgDmf: number;
}

type SkilledIndustryKey = "pflege" | "handwerk" | "gastro" | "it";
type AzubiIndustryKey = "pflege" | "gastro" | "handwerk";
type SeasonalIndustryKey = "agriculture" | "logistics";

interface IndustryData {
  label: string;
  deSalary: number;
  dmfSalary: number;
  fee: number;
}

// ============================================
// INDUSTRY DATA CONFIGURATION
// ============================================

export const INDUSTRY_DATA = {
  skilled: {
    pflege: { label: "Pflege & Medizin", deSalary: 3800, dmfSalary: 3000, fee: 1500 },
    handwerk: { label: "Handwerk & Bau", deSalary: 3200, dmfSalary: 2600, fee: 1500 },
    gastro: { label: "Hotel & Gastronomie", deSalary: 2800, dmfSalary: 2300, fee: 1500 },
    it: { label: "IT & Technik", deSalary: 4500, dmfSalary: 3500, fee: 1500 },
  },
  azubi: {
    pflege: { label: "Pflege (Azubi)", deSalary: 1300, dmfSalary: 1100, fee: 1500 },
    gastro: { label: "Hotel/Küche (Azubi)", deSalary: 1000, dmfSalary: 900, fee: 1500 },
    handwerk: { label: "Handwerk (Azubi)", deSalary: 1100, dmfSalary: 950, fee: 1500 },
  },
  seasonal: {
    agriculture: { label: "Landwirtschaft", deSalary: 2100, dmfSalary: 1800, fee: 1500 },
    logistics: { label: "Lager & Logistik", deSalary: 2300, dmfSalary: 1900, fee: 1500 },
  },
} as const;

// ============================================
// PRODUCT DEFAULTS
// ============================================

const PRODUCT_DEFAULTS: Record<ProductType, ProductDefaults> = {
  fachkraefte: {
    germanSalary: 3500,
    dmfSalary: 2800,
    recruitmentFee: 1500,
    contractDuration: 3,
    minGerman: 2000,
    maxGerman: 6000,
    minDmf: 1800,
    maxDmf: 5000,
    maxFee: 5000,
    avgGerman: 3500,
    avgDmf: 2800,
  },
  azubi: {
    germanSalary: 1200,
    dmfSalary: 1000,
    recruitmentFee: 1500,
    contractDuration: 3,
    minGerman: 600,
    maxGerman: 2000,
    minDmf: 500,
    maxDmf: 1800,
    maxFee: 5000,
    avgGerman: 1200,
    avgDmf: 1000,
  },
  saisonkraefte: {
    germanSalary: 2000,
    dmfSalary: 1800,
    recruitmentFee: 1500,
    contractDuration: 1,
    minGerman: 1500,
    maxGerman: 3000,
    minDmf: 1400,
    maxDmf: 2500,
    maxFee: 5000,
    avgGerman: 2000,
    avgDmf: 1800,
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
      let minGerman, maxGerman, minDmf, maxDmf, maxFee;

      if (productType === "azubi") {
        minGerman = Math.max(600, Math.round(industryData.deSalary * 0.6));
        maxGerman = Math.min(2000, Math.round(industryData.deSalary * 1.8));
        minDmf = Math.max(500, Math.round(industryData.dmfSalary * 0.6));
        maxDmf = Math.min(1800, Math.round(industryData.dmfSalary * 1.8));
        maxFee = 5000;
      } else if (productType === "saisonkraefte") {
        minGerman = Math.max(1500, Math.round(industryData.deSalary * 0.75));
        maxGerman = Math.min(3000, Math.round(industryData.deSalary * 1.5));
        minDmf = Math.max(1400, Math.round(industryData.dmfSalary * 0.75));
        maxDmf = Math.min(2500, Math.round(industryData.dmfSalary * 1.5));
        maxFee = 5000;
      } else {
        minGerman = Math.max(2000, Math.round(industryData.deSalary * 0.6));
        maxGerman = Math.round(industryData.deSalary * 1.8);
        minDmf = Math.max(1800, Math.round(industryData.dmfSalary * 0.6));
        maxDmf = Math.round(industryData.dmfSalary * 1.8);
        maxFee = 5000;
      }

      return {
        germanSalary: industryData.deSalary,
        dmfSalary: industryData.dmfSalary,
        recruitmentFee: industryData.fee,
        contractDuration: productType === "saisonkraefte" ? 1 : 3,
        minGerman,
        maxGerman,
        minDmf,
        maxDmf,
        maxFee,
        avgGerman: industryData.deSalary,
        avgDmf: industryData.dmfSalary,
      };
    }
  }

  return PRODUCT_DEFAULTS[productType];
};

// ============================================
// MAIN COMPONENT
// ============================================

export const RoiCalculator = memo(function RoiCalculator() {
  const { t } = useLanguage();
  const [productType, setProductType] = useState<ProductType>("fachkraefte");
  const [selectedIndustry, setSelectedIndustry] = useState<
    SkilledIndustryKey | AzubiIndustryKey | SeasonalIndustryKey | null
  >(null);

  const currentDefaults = useMemo(() => {
    return getProductDefaultsFromIndustry(productType, selectedIndustry || undefined);
  }, [productType, selectedIndustry]);

  const [germanSalary, setGermanSalary] = useState(
    () => getProductDefaultsFromIndustry("fachkraefte").germanSalary
  );
  const [dmfSalary, setDmfSalary] = useState(
    () => getProductDefaultsFromIndustry("fachkraefte").dmfSalary
  );
  const [recruitmentFee, setRecruitmentFee] = useState(
    () => getProductDefaultsFromIndustry("fachkraefte").recruitmentFee
  );
  const [contractDuration, setContractDuration] = useState(
    () => getProductDefaultsFromIndustry("fachkraefte").contractDuration
  );

  useEffect(() => {
    setSelectedIndustry(null);
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
          "Vergleichen Sie die Personalkosten für qualifizierte Fachkräfte"
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

  const handleIndustryChange = (value: string) => {
    if (value === "") {
      setSelectedIndustry(null);
    } else {
      setSelectedIndustry(value as SkilledIndustryKey | AzubiIndustryKey | SeasonalIndustryKey);
    }
  };

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
                    {data.label}
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

            {/* German Salary Slider */}
            <SliderWithMarker
              value={germanSalary}
              onChange={setGermanSalary}
              min={currentDefaults.minGerman}
              max={currentDefaults.maxGerman}
              step={productType === "azubi" ? 50 : 100}
              avgPosition={germanAvgPosition}
              avgValue={currentDefaults.avgGerman}
              label={t.roi?.label_salary_de || "Monatsgehalt (Brutto) - Deutscher Kandidat"}
              hint={
                t.roi?.label_salary_dmf_hint ||
                "Durchschnittliches Monatsgehalt für vergleichbare Position"
              }
              id="german-salary"
              markerType="german"
            />

            {/* DMF Salary Slider */}
            <SliderWithMarker
              value={dmfSalary}
              onChange={setDmfSalary}
              min={currentDefaults.minDmf}
              max={currentDefaults.maxDmf}
              step={productType === "azubi" ? 50 : 100}
              avgPosition={dmfAvgPosition}
              avgValue={currentDefaults.avgDmf}
              label={t.roi?.label_salary_dmf || "Monatsgehalt (Brutto) - DMF Kandidat"}
              hint={
                t.roi?.label_salary_dmf_hint || "Erwartetes Gehalt für vietnamesischen Fachkräfte"
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
                  min="0"
                  max={currentDefaults.maxFee}
                  step={productType === "saisonkraefte" ? 100 : 500}
                  value={recruitmentFee}
                  onChange={(e) => setRecruitmentFee(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex items-center gap-1 min-w-[120px] justify-end">
                  <input
                    type="number"
                    min="0"
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
                {t.roi?.label_fee_hint || "Eine einmalige Gebühr für Rekrutierung und Vermittlung"}
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
                {t.roi?.label_duration_hint || "Dauer des Arbeitsvertrags"}
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

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-xs text-amber-800 leading-relaxed">
              {t.roi?.disclaimer ||
                "Hinweis: Diese Berechnung dient nur als Referenz und berücksichtigt keine zusätzlichen Zulagen, Sozialabgaben, Steuern oder andere Nebenkosten. Die tatsächlichen Kosten können je nach individuellem Fall variieren."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
