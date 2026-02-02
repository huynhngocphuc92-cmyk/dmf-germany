"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Cookie, X, Settings, CheckCircle } from "lucide-react";

// Constants for cookie consent storage
export const COOKIE_CONSENT_KEY = "dmf-cookie-consent";
export const COOKIE_CONSENT_VALUE = {
  ACCEPTED: "accepted",
  DECLINED: "declined",
} as const;

type ConsentValue = (typeof COOKIE_CONSENT_VALUE)[keyof typeof COOKIE_CONSENT_VALUE];

interface CookieConsentContent {
  title: string;
  description: string;
  acceptAll: string;
  declineOptional: string;
  settings: string;
  privacyLink: string;
  necessary: string;
  analytics: string;
}

const content: Record<"de" | "en" | "vn", CookieConsentContent> = {
  de: {
    title: "Cookie-Einstellungen",
    description:
      "Wir verwenden Cookies und Drittanbieter-Tools (Maps, Calendly), um die Website zu verbessern. Durch Klicken auf 'Akzeptieren' stimmen Sie der Verwendung zu.",
    acceptAll: "Akzeptieren",
    declineOptional: "Nur notwendige",
    settings: "Einstellungen",
    privacyLink: "Datenschutzerklärung",
    necessary: "Notwendige Cookies (erforderlich)",
    analytics: "Analyse-Cookies (Google Analytics)",
  },
  en: {
    title: "Cookie Settings",
    description:
      "We use cookies to improve your experience on our website. For analytics cookies (Google Analytics), we need your explicit consent according to GDPR.",
    acceptAll: "Accept All",
    declineOptional: "Necessary Only",
    settings: "Settings",
    privacyLink: "Privacy Policy",
    necessary: "Necessary Cookies (required)",
    analytics: "Analytics Cookies (Google Analytics)",
  },
  vn: {
    title: "Cài đặt Cookie",
    description:
      "Chúng tôi sử dụng cookie để cải thiện trải nghiệm của bạn. Đối với cookie phân tích (Google Analytics), chúng tôi cần sự đồng ý rõ ràng của bạn theo DSGVO.",
    acceptAll: "Chấp nhận tất cả",
    declineOptional: "Chỉ cần thiết",
    settings: "Cài đặt",
    privacyLink: "Chính sách bảo mật",
    necessary: "Cookie cần thiết (bắt buộc)",
    analytics: "Cookie phân tích (Google Analytics)",
  },
};

// Custom hook to check consent status
export function useCookieConsent(): {
  hasConsented: boolean;
  consentValue: ConsentValue | null;
  setConsent: (value: ConsentValue) => void;
  resetConsent: () => void;
} {
  const [consentValue, setConsentValue] = useState<ConsentValue | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored === COOKIE_CONSENT_VALUE.ACCEPTED || stored === COOKIE_CONSENT_VALUE.DECLINED) {
      setConsentValue(stored);
    }
  }, []);

  const setConsent = useCallback((value: ConsentValue) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
    setConsentValue(value);
    // Dispatch custom event for GA to listen
    window.dispatchEvent(new CustomEvent("cookieConsentChange", { detail: value }));
  }, []);

  const resetConsent = useCallback(() => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    setConsentValue(null);
  }, []);

  return {
    hasConsented: consentValue !== null,
    consentValue,
    setConsent,
    resetConsent,
  };
}

// Check if analytics consent is granted
export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(COOKIE_CONSENT_KEY) === COOKIE_CONSENT_VALUE.ACCEPTED;
}

export function CookieConsent() {
  const { lang } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const { hasConsented, setConsent } = useCookieConsent();

  const t = content[lang];

  // Only show on client side (useEffect)
  useEffect(() => {
    // Check localStorage only on client
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      // Delay showing banner slightly for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    localStorage.setItem(COOKIE_CONSENT_KEY, COOKIE_CONSENT_VALUE.ACCEPTED);
    setConsent(COOKIE_CONSENT_VALUE.ACCEPTED);
    setIsVisible(false);
    // Dispatch custom event for GA to listen
    window.dispatchEvent(
      new CustomEvent("cookieConsentChange", {
        detail: COOKIE_CONSENT_VALUE.ACCEPTED,
      })
    );
  }, [setConsent]);

  const handleDecline = useCallback(() => {
    localStorage.setItem(COOKIE_CONSENT_KEY, COOKIE_CONSENT_VALUE.DECLINED);
    setConsent(COOKIE_CONSENT_VALUE.DECLINED);
    setIsVisible(false);
    // Dispatch custom event for GA to listen
    window.dispatchEvent(
      new CustomEvent("cookieConsentChange", {
        detail: COOKIE_CONSENT_VALUE.DECLINED,
      })
    );
  }, [setConsent]);

  const handleSaveSettings = useCallback(() => {
    const value = analyticsEnabled ? COOKIE_CONSENT_VALUE.ACCEPTED : COOKIE_CONSENT_VALUE.DECLINED;
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
    setConsent(value);
    setIsVisible(false);
    setShowSettings(false);
    window.dispatchEvent(new CustomEvent("cookieConsentChange", { detail: value }));
  }, [analyticsEnabled, setConsent]);

  // Don't render if not visible or already consented
  if (!isVisible || hasConsented) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 md:p-6">
      <div className="mx-auto max-w-4xl animate-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 bg-slate-800 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Cookie className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">{t.title}</h3>
            </div>
            <button
              onClick={handleDecline}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Schließen"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6 bg-slate-900">
            <p className="text-sm md:text-base text-slate-300 mb-4 leading-relaxed">
              {t.description}
            </p>

            {/* Settings Panel */}
            {showSettings && (
              <div className="mb-4 p-4 rounded-lg bg-slate-800 border border-slate-700 space-y-3 animate-in fade-in duration-300">
                {/* Necessary Cookies - Always enabled */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium text-white">{t.necessary}</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30">
                    ✓
                  </div>
                </div>

                {/* Analytics Cookies - Toggleable */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-white">{t.analytics}</span>
                  </div>
                  <button
                    onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      analyticsEnabled ? "bg-primary" : "bg-slate-600"
                    }`}
                    aria-label="Analytics umschalten"
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        analyticsEnabled ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Privacy Link */}
            <a
              href="/datenschutz"
              className="text-sm text-primary-400 hover:text-primary-300 hover:underline inline-block mb-4"
            >
              {t.privacyLink} →
            </a>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAcceptAll}
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg"
              >
                {t.acceptAll}
              </Button>
              {!showSettings && (
                <Button
                  onClick={() => setShowSettings(true)}
                  variant="outline"
                  className="flex-1 border-slate-600 text-white hover:bg-slate-800"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {t.settings}
                </Button>
              )}
              {showSettings && (
                <>
                  <Button
                    onClick={handleDecline}
                    variant="outline"
                    className="flex-1 border-slate-600 text-white hover:bg-slate-800"
                  >
                    {t.declineOptional}
                  </Button>
                  <Button
                    onClick={handleSaveSettings}
                    variant="secondary"
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
                  >
                    {lang === "de" ? "Speichern" : lang === "en" ? "Save" : "Lưu"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
