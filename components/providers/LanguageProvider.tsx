"use client";

import { createContext, ReactNode, useContext, useEffect, useSyncExternalStore } from "react";
import { Language, TRANSLATIONS } from "@/lib/translations";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (typeof TRANSLATIONS)["de"];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

let sessionLanguage: Language = "de";
function readLanguage(): Language {
  try {
    const saved = localStorage.getItem("dmf_lang");
    return saved && saved in TRANSLATIONS ? (saved as Language) : sessionLanguage;
  } catch {
    return sessionLanguage;
  }
}
function subscribeLanguage(change: () => void) {
  window.addEventListener("dmf-language", change);
  window.addEventListener("storage", change);
  return () => {
    window.removeEventListener("dmf-language", change);
    window.removeEventListener("storage", change);
  };
}
export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribeLanguage, readLanguage, () => "de" as Language);
  useEffect(() => {
    document.documentElement.lang = lang === "vn" ? "vi" : lang;
  }, [lang]);
  const setLang = (newLang: Language) => {
    sessionLanguage = newLang;
    try {
      localStorage.setItem("dmf_lang", newLang);
    } catch {}
    document.documentElement.lang = newLang === "vn" ? "vi" : newLang;
    window.dispatchEvent(new Event("dmf-language"));
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
