"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { LANGUAGE_OPTIONS } from "./nav-data";

interface LanguageSwitcherProps {
  variant?: "desktop" | "mobile";
}

export const LanguageSwitcher = memo(function LanguageSwitcher({
  variant = "desktop",
}: LanguageSwitcherProps) {
  const { lang, setLang } = useLanguage();

  const isDesktop = variant === "desktop";

  return (
    <div
      className={cn(
        "flex items-center bg-slate-100 rounded-lg",
        isDesktop ? "gap-1 p-1" : "gap-0.5 p-0.5"
      )}
    >
      {LANGUAGE_OPTIONS.map((langOption) => (
        <button
          key={langOption.code}
          type="button"
          onClick={() => setLang(langOption.code)}
          className={cn(
            "rounded-md font-semibold transition-all duration-200",
            isDesktop ? "px-4 py-2 text-sm" : "px-2.5 py-1.5 text-xs",
            lang === langOption.code
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
              : "bg-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-800"
          )}
        >
          {langOption.label}
        </button>
      ))}
    </div>
  );
});
