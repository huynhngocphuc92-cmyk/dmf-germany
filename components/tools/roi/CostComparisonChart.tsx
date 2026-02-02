"use client";

import { memo } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface CostComparisonChartProps {
  germanTotalCost: number;
  dmfTotalCost: number;
  germanSalary: number;
  dmfSalary: number;
  recruitmentFee: number;
  contractDuration: number;
}

export const CostComparisonChart = memo(function CostComparisonChart({
  germanTotalCost,
  dmfTotalCost,
  germanSalary,
  dmfSalary,
  recruitmentFee,
  contractDuration,
}: CostComparisonChartProps) {
  const { t } = useLanguage();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const maxCost = Math.max(germanTotalCost, dmfTotalCost);
  const germanBarHeight = maxCost > 0 ? (germanTotalCost / maxCost) * 100 : 0;
  const dmfBarHeight = maxCost > 0 ? (dmfTotalCost / maxCost) * 100 : 0;

  return (
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
            <span className="text-sm font-bold text-gray-900">{formatCurrency(germanTotalCost)}</span>
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
            <span className="text-sm font-bold text-primary">{formatCurrency(dmfTotalCost)}</span>
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
          <p className="text-xs text-gray-600 mb-1">
            {t.roi?.cost_german || "Deutscher Kandidat"}
          </p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(germanTotalCost)}</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {formatCurrency(germanSalary)}/{t.roi?.cost_breakdown_month || "Monat"}
            <br />× 13 {t.roi?.cost_breakdown_months || "Monate"}
            <br />× {contractDuration}{" "}
            {contractDuration === 1
              ? t.roi?.cost_breakdown_year || "Jahr"
              : t.roi?.cost_breakdown_years || "Jahre"}
          </p>
        </div>
        <div className="text-center p-4 bg-primary/5 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">{t.roi?.cost_dmf || "DMF Kandidat"}</p>
          <p className="text-lg font-bold text-primary">{formatCurrency(dmfTotalCost)}</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {formatCurrency(dmfSalary)}/{t.roi?.cost_breakdown_month || "Monat"}
            <br />× 13 {t.roi?.cost_breakdown_months || "Monate"}
            <br />× {contractDuration}{" "}
            {contractDuration === 1
              ? t.roi?.cost_breakdown_year || "Jahr"
              : t.roi?.cost_breakdown_years || "Jahre"}
            <br />+ {formatCurrency(recruitmentFee)} {t.roi?.cost_breakdown_fee || "Gebühr"}
          </p>
        </div>
      </div>
    </div>
  );
});
