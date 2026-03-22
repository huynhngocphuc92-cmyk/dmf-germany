"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { TRANSLATIONS, Language } from "@/lib/translations";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (typeof TRANSLATIONS)["de"];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === "undefined") {
      return "de";
    }

    const saved = localStorage.getItem("dmf_lang");
    return saved && saved in TRANSLATIONS ? (saved as Language) : "de";
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("dmf_lang", newLang);
  };

  // Resolve the dictionary for the active language.
  const t = TRANSLATIONS[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  );
}

// Hook consumed by client components that need the current language context.
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
