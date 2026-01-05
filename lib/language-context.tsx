"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { siteContent, Language, SiteContent } from "@/config/site-content";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  content: SiteContent;
  t: <T>(getter: (content: SiteContent) => T) => T;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({ 
  children, 
  defaultLanguage = "de" 
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    // Optional: Save to localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("dmf-language", lang);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const newLang = prev === "de" ? "vn" : "de";
      if (typeof window !== "undefined") {
        localStorage.setItem("dmf-language", newLang);
      }
      return newLang;
    });
  }, []);

  // Get current content based on language
  const content = siteContent[language];

  // Helper function to get translated content
  const t = useCallback(<T,>(getter: (content: SiteContent) => T): T => {
    return getter(content);
  }, [content]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        content,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Optional: Hook to initialize language from localStorage
export function useInitializeLanguage() {
  const { setLanguage } = useLanguage();
  
  // This effect runs on client side only
  if (typeof window !== "undefined") {
    const savedLang = localStorage.getItem("dmf-language") as Language | null;
    if (savedLang && (savedLang === "de" || savedLang === "vn")) {
      setLanguage(savedLang);
    }
  }
}

