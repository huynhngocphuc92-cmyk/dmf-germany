"use client";
import { useEffect } from "react";
import { GoogleAnalytics as GA } from "@next/third-parties/google";
import { hasAnalyticsConsent, useConsent } from "@/components/CookieConsent";
export function GoogleAnalytics({ measurementId }: { measurementId?: string }) {
  const consent = useConsent();
  const gaId = measurementId || process.env.NEXT_PUBLIC_GA_ID;
  useEffect(() => {
    if (!gaId) return;
    window[`ga-disable-${gaId}`] = !consent.analytics;
    window.gtag?.("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    if (!consent.analytics) {
      const names = document.cookie
        .split(";")
        .map((item) => item.trim().split("=")[0])
        .filter((name) => /^_ga(?:_|$)|^_gid$/.test(name));
      const hostname = window.location.hostname;
      const domains = [
        "",
        hostname,
        ...hostname
          .split(".")
          .slice(1)
          .map((_, i) =>
            hostname
              .split(".")
              .slice(i + 1)
              .join(".")
          ),
      ];
      for (const name of names)
        for (const domain of domains)
          document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ""}; SameSite=Lax`;
    }
  }, [gaId, consent.analytics]);
  return gaId && consent.analytics ? <GA gaId={gaId} /> : null;
}
declare global {
  interface Window {
    [key: `ga-disable-${string}`]: boolean | undefined;
    gtag?: (
      command: "event" | "config" | "set" | "consent",
      action: string,
      params?: Record<string, string | number | boolean>
    ) => void;
  }
}
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
): void {
  if (!hasAnalyticsConsent()) return;
  window.gtag?.("event", eventName, eventParams);
}
export function trackPageView(path: string, title?: string): void {
  trackEvent("page_view", { page_path: path, page_title: title || document.title });
}
