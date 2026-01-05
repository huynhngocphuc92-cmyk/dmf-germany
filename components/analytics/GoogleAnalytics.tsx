"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics as GA } from "@next/third-parties/google";
import { COOKIE_CONSENT_KEY, COOKIE_CONSENT_VALUE } from "@/components/CookieConsent";

interface GoogleAnalyticsProps {
  measurementId?: string;
}

/**
 * Google Analytics Component with DSGVO Compliance
 * 
 * This component only loads GA4 script when:
 * 1. GA_MEASUREMENT_ID is configured
 * 2. User has explicitly accepted cookies via CookieConsent
 * 
 * Follows German DSGVO requirements for cookie consent.
 */
export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const [hasConsent, setHasConsent] = useState<boolean>(false);
  const gaId = measurementId || process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    // Check initial consent status
    const checkConsent = () => {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      setHasConsent(consent === COOKIE_CONSENT_VALUE.ACCEPTED);
    };

    checkConsent();

    // Listen for consent changes from CookieConsent component
    const handleConsentChange = (event: CustomEvent<string>) => {
      setHasConsent(event.detail === COOKIE_CONSENT_VALUE.ACCEPTED);
    };

    // Listen for storage changes (e.g., if user clears data)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === COOKIE_CONSENT_KEY) {
        checkConsent();
      }
    };

    window.addEventListener("cookieConsentChange", handleConsentChange as EventListener);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("cookieConsentChange", handleConsentChange as EventListener);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Don't render anything if:
  // 1. No GA ID configured
  // 2. User hasn't consented
  if (!gaId || !hasConsent) {
    return null;
  }

  return <GA gaId={gaId} />;
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "set",
      action: string,
      params?: Record<string, string | number | boolean>
    ) => void;
  }
}

/**
 * Track custom events to Google Analytics
 * Only sends events if user has consented
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;

  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (consent !== COOKIE_CONSENT_VALUE.ACCEPTED) return;

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, eventParams);
  }
}

/**
 * Track page views manually (optional, GA usually auto-tracks)
 */
export function trackPageView(path: string, title?: string): void {
  trackEvent("page_view", {
    page_path: path,
    page_title: title || document.title,
  });
}

