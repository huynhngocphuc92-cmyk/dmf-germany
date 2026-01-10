"use client";

import { useState, useMemo, useEffect } from "react";
import { TrendingDown, TrendingUp, Euro, Users, Clock, Briefcase, GraduationCap, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

/**
 * Product Type Definitions
 */
type ProductType = "fachkraefte" | "azubi" | "saisonkraefte";

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
  avgGerman: number; // Market average for German salary
  avgDmf: number; // Market average for DMF salary
}

/**
 * Industry Sub-Type Definitions
 */
type SkilledIndustryKey = "pflege" | "handwerk" | "gastro" | "it";
type AzubiIndustryKey = "pflege" | "gastro" | "handwerk";
type SeasonalIndustryKey = "agriculture" | "logistics";

interface IndustryData {
  label: string;
  deSalary: number;
  dmfSalary: number;
  fee: number;
}

/**
 * Industry Data Configuration
 * Market averages and defaults for specific sub-industries
 * 
 * Usage:
 * - When user selects a product type (fachkraefte/azubi/saisonkraefte),
 *   they can optionally select a sub-industry for more accurate calculations
 * - Each industry has specific market averages for German salary, DMF salary, and recruitment fee
 * - This data is used to calculate defaults and market average markers on sliders
 */
export const INDUSTRY_DATA = {
  skilled: { // Fachkräfte
    pflege: { 
      label: "Pflege & Medizin", 
      deSalary: 3800, 
      dmfSalary: 3000, 
      fee: 1500 
    },
    handwerk: { 
      label: "Handwerk & Bau", 
      deSalary: 3200, 
      dmfSalary: 2600, 
      fee: 1500 
    },
    gastro: { 
      label: "Hotel & Gastronomie", 
      deSalary: 2800, 
      dmfSalary: 2300, 
      fee: 1500 
    },
    it: { 
      label: "IT & Technik", 
      deSalary: 4500, 
      dmfSalary: 3500, 
      fee: 1500 
    },
  },
  azubi: { // Ausbildung
    pflege: { 
      label: "Pflege (Azubi)", 
      deSalary: 1300, 
      dmfSalary: 1100, 
      fee: 1500 
    },
    gastro: { 
      label: "Hotel/Küche (Azubi)", 
      deSalary: 1000, 
      dmfSalary: 900, 
      fee: 1500 
    },
    handwerk: { 
      label: "Handwerk (Azubi)", 
      deSalary: 1100, 
      dmfSalary: 950, 
      fee: 1500 
    },
  },
  seasonal: { // Saisonkräfte
    agriculture: { 
      label: "Landwirtschaft", 
      deSalary: 2100, 
      dmfSalary: 1800, 
      fee: 1500 
    },
    logistics: { 
      label: "Lager & Logistik", 
      deSalary: 2300, 
      dmfSalary: 1900, 
      fee: 1500 
    },
  },
} as const;

/**
 * Helper function to get ProductDefaults from Industry Data or fallback to defaults
 */
const getProductDefaultsFromIndustry = (
  productType: ProductType,
  industryKey?: SkilledIndustryKey | AzubiIndustryKey | SeasonalIndustryKey
): ProductDefaults => {
  // If industry key is provided, use industry-specific data
  if (industryKey) {
    const industryMap = {
      fachkraefte: INDUSTRY_DATA.skilled,
      azubi: INDUSTRY_DATA.azubi,
      saisonkraefte: INDUSTRY_DATA.seasonal,
    };
    
    // Type casting to fix TypeScript inference issue with dynamic property access
    // Using 'any' to bypass TypeScript's inability to infer the correct type
    const industryData: any = industryMap[productType]?.[industryKey as never] || null;
    
    if (industryData) {
      // Calculate reasonable min/max ranges based on industry data
      // Ranges are product-type specific to ensure realistic values
      let minGerman, maxGerman, minDmf, maxDmf, maxFee;
      
      if (productType === "azubi") {
        // Ausbildung: Narrower range for apprenticeship allowances
        minGerman = Math.max(600, Math.round(industryData.deSalary * 0.6));
        maxGerman = Math.min(2000, Math.round(industryData.deSalary * 1.8));
        minDmf = Math.max(500, Math.round(industryData.dmfSalary * 0.6));
        maxDmf = Math.min(1800, Math.round(industryData.dmfSalary * 1.8));
        maxFee = 5000; // Unified max fee
      } else if (productType === "saisonkraefte") {
        // Seasonal: Limited range around minimum wage
        minGerman = Math.max(1500, Math.round(industryData.deSalary * 0.75));
        maxGerman = Math.min(3000, Math.round(industryData.deSalary * 1.5));
        minDmf = Math.max(1400, Math.round(industryData.dmfSalary * 0.75));
        maxDmf = Math.min(2500, Math.round(industryData.dmfSalary * 1.5));
        maxFee = 5000; // Unified max fee
      } else {
        // Fachkräfte: Wider range for skilled workers
        minGerman = Math.max(2000, Math.round(industryData.deSalary * 0.6));
        maxGerman = Math.round(industryData.deSalary * 1.8);
        minDmf = Math.max(1800, Math.round(industryData.dmfSalary * 0.6));
        maxDmf = Math.round(industryData.dmfSalary * 1.8);
        maxFee = 5000; // Unified max fee
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
  
  // Fallback to default values if no industry specified or invalid
  return PRODUCT_DEFAULTS[productType];
};

/**
 * Product Defaults Configuration (Fallback defaults)
 */
const PRODUCT_DEFAULTS: Record<ProductType, ProductDefaults> = {
  fachkraefte: {
    germanSalary: 3500,
    dmfSalary: 2800,
    recruitmentFee: 1500, // Unified fee for all industries
    contractDuration: 3,
    minGerman: 2000,
    maxGerman: 6000,
    minDmf: 1800,
    maxDmf: 5000,
    maxFee: 5000, // Unified max fee
    avgGerman: 3500, // Market average
    avgDmf: 2800, // Market average
  },
  azubi: {
    germanSalary: 1200,
    dmfSalary: 1000,
    recruitmentFee: 1500, // Unified fee for all industries
    contractDuration: 3,
    minGerman: 600,
    maxGerman: 2000,
    minDmf: 500,
    maxDmf: 1800,
    maxFee: 5000, // Unified max fee
    avgGerman: 1200, // Market average for apprenticeship allowance
    avgDmf: 1000, // Market average
  },
  saisonkraefte: {
    germanSalary: 2000,
    dmfSalary: 1800,
    recruitmentFee: 1500, // Unified fee for all industries
    contractDuration: 1,
    minGerman: 1500,
    maxGerman: 3000,
    minDmf: 1400,
    maxDmf: 2500,
    maxFee: 5000, // Unified max fee
    avgGerman: 2000, // Minimum wage market average
    avgDmf: 1800, // Market average
  },
};

/**
 * ROI Calculator Component
 * Wirtschaftlichkeits-Rechner for B2B clients
 * Supports multiple product types: Fachkräfte, Azubi, Saisonkräfte
 */
export const RoiCalculator = () => {
  const { t } = useLanguage();
  const [productType, setProductType] = useState<ProductType>("fachkraefte");
  const [selectedIndustry, setSelectedIndustry] = useState<SkilledIndustryKey | AzubiIndustryKey | SeasonalIndustryKey | null>(null);
  
  // Get current product defaults (with industry support)
  const currentDefaults = useMemo(() => {
    return getProductDefaultsFromIndustry(productType, selectedIndustry || undefined);
  }, [productType, selectedIndustry]);
  
  // Initialize state with default values (will be updated by useEffect on mount)
  const [germanSalary, setGermanSalary] = useState(() => 
    getProductDefaultsFromIndustry("fachkraefte").germanSalary
  );
  const [dmfSalary, setDmfSalary] = useState(() => 
    getProductDefaultsFromIndustry("fachkraefte").dmfSalary
  );
  const [recruitmentFee, setRecruitmentFee] = useState(() => 
    getProductDefaultsFromIndustry("fachkraefte").recruitmentFee
  );
  const [contractDuration, setContractDuration] = useState(() => 
    getProductDefaultsFromIndustry("fachkraefte").contractDuration
  );

  // Reset industry selection when product type changes (industry keys differ between product types)
  useEffect(() => {
    setSelectedIndustry(null);
  }, [productType]);

  // Update values when product type or industry changes
  useEffect(() => {
    setGermanSalary(currentDefaults.germanSalary);
    setDmfSalary(currentDefaults.dmfSalary);
    setRecruitmentFee(currentDefaults.recruitmentFee);
    setContractDuration(currentDefaults.contractDuration);
  }, [currentDefaults]);

  // Auto-adjust DMF salary when German salary changes (optional helper)
  const handleGermanSalaryChange = (value: number) => {
    setGermanSalary(value);
    // Optional: Auto-set DMF salary to 80% of German salary
    // Uncomment below if you want auto-adjustment:
    // setDmfSalary(Math.round(value * 0.8 / 100) * 100);
  };

  // Calculate costs (13 months per year including bonus/13th month salary)
  const calculations = useMemo(() => {
    const germanTotalCost = germanSalary * 13 * contractDuration;
    const dmfTotalCost = dmfSalary * 13 * contractDuration + recruitmentFee;
    const savings = germanTotalCost - dmfTotalCost;
    const savingsPercentage = germanTotalCost > 0 
      ? ((savings / germanTotalCost) * 100).toFixed(1)
      : "0";

    return {
      germanTotalCost,
      dmfTotalCost,
      savings,
      savingsPercentage,
    };
  }, [germanSalary, dmfSalary, recruitmentFee, contractDuration]);

  // Format currency for display
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate bar heights
  const maxCost = Math.max(calculations.germanTotalCost, calculations.dmfTotalCost);
  const germanBarHeight = maxCost > 0 
    ? (calculations.germanTotalCost / maxCost) * 100 
    : 0;
  const dmfBarHeight = maxCost > 0 
    ? (calculations.dmfTotalCost / maxCost) * 100 
    : 0;

  // Calculate average marker positions
  const germanAvgPosition = ((currentDefaults.avgGerman - currentDefaults.minGerman) / (currentDefaults.maxGerman - currentDefaults.minGerman)) * 100;
  const dmfAvgPosition = ((currentDefaults.avgDmf - currentDefaults.minDmf) / (currentDefaults.maxDmf - currentDefaults.minDmf)) * 100;

  // Get dynamic title and subtitle based on product type
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
        return t.roi?.input_subtitle_fachkraefte || "Vergleichen Sie die Personalkosten für qualifizierte Fachkräfte";
      case "azubi":
        return t.roi?.input_subtitle_azubi || "Vergleichen Sie die Ausbildungskosten und Förderungen";
      case "saisonkraefte":
        return t.roi?.input_subtitle_saisonkraefte || "Vergleichen Sie die Kosten für Saisonarbeitskräfte";
      default:
        return "";
    }
  };

  // Get available industries for current product type
  const getAvailableIndustries = (): Record<string, IndustryData> => {
    const industryMap: Record<ProductType, typeof INDUSTRY_DATA.skilled | typeof INDUSTRY_DATA.azubi | typeof INDUSTRY_DATA.seasonal> = {
      fachkraefte: INDUSTRY_DATA.skilled,
      azubi: INDUSTRY_DATA.azubi,
      saisonkraefte: INDUSTRY_DATA.seasonal,
    };
    return (industryMap[productType] || {}) as Record<string, IndustryData>;
  };

  // Handle industry selection change
  const handleIndustryChange = (value: string) => {
    if (value === "") {
      setSelectedIndustry(null);
    } else {
      setSelectedIndustry(value as SkilledIndustryKey | AzubiIndustryKey | SeasonalIndustryKey);
    }
  };

  // Slider component with average marker
  const SliderWithMarker = ({
    value,
    onChange,
    min,
    max,
    step,
    avgPosition,
    avgValue,
    label,
    hint,
    id,
    markerType = "german", // "german" (orange/red) or "dmf" (green)
  }: {
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step: number;
    avgPosition: number;
    avgValue: number;
    label: string;
    hint?: string;
    id: string;
    markerType?: "german" | "dmf";
  }) => {
    const sliderFillPercentage = ((value - min) / (max - min)) * 100;
    const clampedAvgPosition = Math.max(0, Math.min(100, avgPosition));
    
    // Determine if value is below or above average
    const isBelowAverage = value < avgValue;
    const isAboveAverage = value > avgValue;
    
    // Color scheme based on marker type
    const markerColors = markerType === "german" 
      ? {
          bg: "bg-orange-100",
          text: "text-orange-700",
          border: "border-orange-300",
          line: "bg-orange-400",
          shadow: "shadow-orange-200",
        }
      : {
          bg: "bg-green-100",
          text: "text-green-700",
          border: "border-green-300",
          line: "bg-green-400",
          shadow: "shadow-green-200",
        };
    
    // Track color based on position relative to average
    const getTrackColor = () => {
      if (markerType === "german") {
        // For German: red/orange if above average (expensive), neutral if below
        if (isAboveAverage) return "rgb(239, 68, 68)"; // red-500
        return "rgb(59, 130, 246)"; // blue-500 (primary)
      } else {
        // For DMF: green if below average (good deal), neutral if above
        if (isBelowAverage) return "rgb(34, 197, 94)"; // green-500
        return "rgb(59, 130, 246)"; // blue-500 (primary)
      }
    };
    
    const trackColor = getTrackColor();
    const trackFillPercentage = sliderFillPercentage;
    
    // Calculate opacity for right side of marker (fade effect)
    const rightSideOpacity = 0.25;
    
    // Determine if slider is to the right of marker (for fade effect)
    const isSliderRightOfMarker = sliderFillPercentage > clampedAvgPosition;

    return (
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          {label}
        </label>
        {/* Container for slider with marker and label */}
        <div className="relative pt-6 pb-2">
          {/* Slider Container with Average Marker */}
          <div className="relative flex items-center gap-4">
            <div className="flex-1 relative h-8 flex items-center">
              {/* Faded overlay for right side of marker (visual emphasis) */}
              {clampedAvgPosition >= 0 && clampedAvgPosition <= 100 && (
                <div
                  className="absolute inset-0 pointer-events-none z-0 rounded-lg overflow-hidden"
                  style={{
                    left: `${clampedAvgPosition}%`,
                    right: 0,
                    background: `linear-gradient(to right, transparent 0%, rgba(0, 0, 0, ${rightSideOpacity}) 100%)`,
                  }}
                />
              )}
              
              {/* Average Marker Vertical Line */}
              {clampedAvgPosition >= 0 && clampedAvgPosition <= 100 && (
                <div
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 h-5 w-0.5 z-10 pointer-events-none transition-all duration-300",
                    markerColors.line
                  )}
                  style={{ 
                    left: `${clampedAvgPosition}%`,
                    transform: 'translateX(-50%) translateY(-50%)'
                  }}
                />
              )}
              
              {/* Arrow Tooltip Marker (Above the slider track) */}
              {clampedAvgPosition >= 0 && clampedAvgPosition <= 100 && (
                <div
                  className="absolute top-0 -translate-x-1/2 -translate-y-[130%] flex flex-col items-center pointer-events-none z-20 transition-all duration-300"
                  style={{ 
                    left: `${clampedAvgPosition}%`
                  }}
                >
                  {/* Badge (Thân) */}
                  <div className={cn(
                    "px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold text-white whitespace-nowrap mb-[-1px]",
                    markerType === "german" 
                      ? "bg-red-500 shadow-red-200" 
                      : "bg-green-600 shadow-green-200"
                  )}>
                    {t.roi?.average_marker || "Ø Markt"}: {formatCurrency(avgValue)}
                  </div>
                  {/* Arrow (Mũi tên nhọn dùng Border) */}
                  <div className={cn(
                    "w-0 h-0",
                    "border-l-[6px] border-l-transparent",
                    "border-r-[6px] border-r-transparent",
                    "border-t-[8px]",
                    markerType === "german" ? "border-t-red-500" : "border-t-green-600"
                  )}></div>
                </div>
              )}
              
              {/* Slider */}
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="roi-slider absolute inset-0 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer z-20 transition-all duration-200 ease-out hover:h-2.5"
                style={{
                  background: `linear-gradient(to right, 
                    ${trackColor} 0%, 
                    ${trackColor} ${trackFillPercentage}%, 
                    rgba(229, 231, 235, ${isSliderRightOfMarker ? 0.4 : 1}) ${trackFillPercentage}%, 
                    rgba(229, 231, 235, ${rightSideOpacity}) 100%)`,
                  '--thumb-color': trackColor,
                } as React.CSSProperties}
                onMouseDown={(e) => {
                  e.currentTarget.classList.add('slider-active');
                }}
                onMouseUp={(e) => {
                  e.currentTarget.classList.remove('slider-active');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.classList.remove('slider-active');
                }}
              />
            </div>
            {/* Value Input */}
            <div className="flex items-center gap-1 min-w-[120px] justify-end">
              <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => {
                  const newValue = Math.max(min, Math.min(max, Number(e.target.value) || min));
                  onChange(newValue);
                }}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-right focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-600">€</span>
            </div>
          </div>
        </div>
        {/* Hint text */}
        {hint && (
          <p className="text-xs text-gray-500 mt-1">
            {hint}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Product Type Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-xl border border-gray-200">
          <button
            onClick={() => setProductType("fachkraefte")}
            className={cn(
              "flex-1 min-w-[140px] px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2",
              productType === "fachkraefte"
                ? "bg-primary text-white shadow-md"
                : "bg-transparent text-gray-700 hover:bg-gray-200"
            )}
          >
            <Briefcase className="w-4 h-4" />
            {t.roi?.tab_fachkraefte || "Fachkräfte"}
          </button>
          <button
            onClick={() => setProductType("azubi")}
            className={cn(
              "flex-1 min-w-[140px] px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2",
              productType === "azubi"
                ? "bg-primary text-white shadow-md"
                : "bg-transparent text-gray-700 hover:bg-gray-200"
            )}
          >
            <GraduationCap className="w-4 h-4" />
            {t.roi?.tab_azubi || "Auszubildende"}
          </button>
          <button
            onClick={() => setProductType("saisonkraefte")}
            className={cn(
              "flex-1 min-w-[140px] px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2",
              productType === "saisonkraefte"
                ? "bg-primary text-white shadow-md"
                : "bg-transparent text-gray-700 hover:bg-gray-200"
            )}
          >
            <Calendar className="w-4 h-4" />
            {t.roi?.tab_saisonkraefte || "Saisonkräfte"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Input Section - Left */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {getProductTitle()}
              </h2>
              {getProductSubtitle() && (
                <p className="text-sm text-gray-600">
                  {getProductSubtitle()}
                </p>
              )}
            </div>

            {/* Industry Selection Dropdown */}
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
                  {t.roi?.industry_hint || "Berechnungen basieren auf Marktdurchschnitt für diese Branche"}
                </p>
              )}
            </div>

            {/* German Salary */}
            <SliderWithMarker
              value={germanSalary}
              onChange={handleGermanSalaryChange}
              min={currentDefaults.minGerman}
              max={currentDefaults.maxGerman}
              step={productType === "azubi" ? 50 : 100}
              avgPosition={germanAvgPosition}
              avgValue={currentDefaults.avgGerman}
              label={t.roi?.label_salary_de || "Monatsgehalt (Brutto) - Deutscher Kandidat"}
              hint={t.roi?.label_salary_dmf_hint || "Durchschnittliches Monatsgehalt für vergleichbare Position"}
              id="german-salary"
              markerType="german"
            />

            {/* DMF Salary */}
            <SliderWithMarker
              value={dmfSalary}
              onChange={setDmfSalary}
              min={currentDefaults.minDmf}
              max={currentDefaults.maxDmf}
              step={productType === "azubi" ? 50 : 100}
              avgPosition={dmfAvgPosition}
              avgValue={currentDefaults.avgDmf}
              label={t.roi?.label_salary_dmf || "Monatsgehalt (Brutto) - DMF Kandidat"}
              hint={t.roi?.label_salary_dmf_hint || "Erwartetes Gehalt für vietnamesischen Fachkräfte"}
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
                    {contractDuration} {contractDuration === 1 
                      ? (t.roi?.conclusion_years_singular || "Jahr")
                      : (t.roi?.conclusion_years_plural || "Jahre")}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t.roi?.label_duration_hint || "Dauer des Arbeitsvertrags"}
              </p>
            </div>
          </div>
        </div>

        {/* Results Section - Right */}
        <div className="space-y-6">
          {/* Savings Card */}
          <div className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-xl shadow-lg p-8 border border-primary/20">
            <div className="flex items-start gap-3 mb-4">
              <TrendingDown className="w-8 h-8 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium opacity-90 mb-1">
                  {t.roi?.savings_title || "Ihre Ersparnis"}
                </h3>
                <p className="text-4xl md:text-5xl font-bold mb-3">
                  {formatCurrency(calculations.savings)}
                </p>
                <p className="text-base opacity-90 mb-2">
                  ({calculations.savingsPercentage}% {t.roi?.savings_percentage || "weniger Kosten"})
                </p>
                <p className="text-lg font-semibold mt-4 pt-4 border-t border-white/20">
                  {t.roi?.conclusion || "Sie sparen ca."} {formatCurrency(calculations.savings)} {t.roi?.conclusion_over || "über"} {contractDuration} {contractDuration === 1 
                    ? (t.roi?.conclusion_years_singular || "Jahr")
                    : (t.roi?.conclusion_years_plural || "Jahre")}
                </p>
              </div>
            </div>
          </div>

          {/* Comparison Chart */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {t.roi?.comparison_title || "Kostenvergleich"}
            </h3>

            {/* Bar Chart */}
            <div className="space-y-8 mb-6">
              {/* German Cost Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    {t.roi?.cost_german || "Deutscher Kandidat"}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(calculations.germanTotalCost)}
                  </span>
                </div>
                <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 bg-gray-400 h-full transition-all duration-500 rounded-lg"
                    style={{ width: `${germanBarHeight}%` }}
                  />
                </div>
              </div>

              {/* DMF Cost Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    {t.roi?.cost_dmf || "DMF Kandidat"}
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {formatCurrency(calculations.dmfTotalCost)}
                  </span>
                </div>
                <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 bg-primary h-full transition-all duration-500 rounded-lg"
                    style={{ width: `${dmfBarHeight}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">{t.roi?.cost_german || "Deutscher Kandidat"}</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(calculations.germanTotalCost)}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {formatCurrency(germanSalary)}/{t.roi?.cost_breakdown_month || "Monat"}<br />
                  × 13 {t.roi?.cost_breakdown_months || "Monate"}<br />
                  × {contractDuration} {contractDuration === 1 
                    ? (t.roi?.cost_breakdown_year || "Jahr")
                    : (t.roi?.cost_breakdown_years || "Jahre")}
                </p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">{t.roi?.cost_dmf || "DMF Kandidat"}</p>
                <p className="text-lg font-bold text-primary">
                  {formatCurrency(calculations.dmfTotalCost)}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {formatCurrency(dmfSalary)}/{t.roi?.cost_breakdown_month || "Monat"}<br />
                  × 13 {t.roi?.cost_breakdown_months || "Monate"}<br />
                  × {contractDuration} {contractDuration === 1 
                    ? (t.roi?.cost_breakdown_year || "Jahr")
                    : (t.roi?.cost_breakdown_years || "Jahre")}
                  <br />
                  + {formatCurrency(recruitmentFee)} {t.roi?.cost_breakdown_fee || "Gebühr"}
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-xs text-amber-800 leading-relaxed">
              {t.roi?.disclaimer || "Hinweis: Diese Berechnung dient nur als Referenz und berücksichtigt keine zusätzlichen Zulagen, Sozialabgaben, Steuern oder andere Nebenkosten. Die tatsächlichen Kosten können je nach individuellem Fall variieren."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
