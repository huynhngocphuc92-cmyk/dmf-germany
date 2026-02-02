"use client";

import { memo } from "react";
import { Briefcase, GraduationCap, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

export type ProductType = "fachkraefte" | "azubi" | "saisonkraefte";

interface ProductTypeTabsProps {
  productType: ProductType;
  onChange: (type: ProductType) => void;
}

export const ProductTypeTabs = memo(function ProductTypeTabs({
  productType,
  onChange,
}: ProductTypeTabsProps) {
  const { t } = useLanguage();

  const tabs = [
    {
      type: "fachkraefte" as const,
      icon: Briefcase,
      label: t.roi?.tab_fachkraefte || "Fachkräfte",
    },
    {
      type: "azubi" as const,
      icon: GraduationCap,
      label: t.roi?.tab_azubi || "Auszubildende",
    },
    {
      type: "saisonkraefte" as const,
      icon: Calendar,
      label: t.roi?.tab_saisonkraefte || "Saisonkräfte",
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-xl border border-gray-200">
        {tabs.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={cn(
              "flex-1 min-w-[140px] px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2",
              productType === type
                ? "bg-primary text-white shadow-md"
                : "bg-transparent text-gray-700 hover:bg-gray-200"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
});
