"use client";

import { memo } from "react";
import { TrendingDown } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface SavingsCardProps {
  savings: number;
  savingsPercentage: string;
  contractDuration: number;
}

export const SavingsCard = memo(function SavingsCard({
  savings,
  savingsPercentage,
  contractDuration,
}: SavingsCardProps) {
  const { t } = useLanguage();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-xl shadow-lg p-8 border border-primary/20">
      <div className="flex items-start gap-3 mb-4">
        <TrendingDown className="w-8 h-8 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium opacity-90 mb-1">
            {t.roi?.savings_title || "Ihre Ersparnis"}
          </h3>
          <p className="text-4xl md:text-5xl font-bold mb-3">{formatCurrency(savings)}</p>
          <p className="text-base opacity-90 mb-2">
            ({savingsPercentage}% {t.roi?.savings_percentage || "weniger Kosten"})
          </p>
          <p className="text-lg font-semibold mt-4 pt-4 border-t border-white/20">
            {t.roi?.conclusion || "Sie sparen ca."} {formatCurrency(savings)}{" "}
            {t.roi?.conclusion_over || "über"} {contractDuration}{" "}
            {contractDuration === 1
              ? t.roi?.conclusion_years_singular || "Jahr"
              : t.roi?.conclusion_years_plural || "Jahre"}
          </p>
        </div>
      </div>
    </div>
  );
});
