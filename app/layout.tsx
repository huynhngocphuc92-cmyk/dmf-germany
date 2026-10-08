import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { RequestContextCapture } from "@/components/providers/RequestContextCapture";
import { HeaderWrapper } from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { SmartChatBot } from "@/components/bot/SmartChatBot";
import { CookieConsent } from "@/components/CookieConsent";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { MobileStickyBar } from "@/components/layout/MobileStickyBar";

import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DMF Talents | Fachkräfte aus Vietnam für Deutschland",
    template: "%s | DMF Talents",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Personalvermittlung Vietnam",
    "Fachkräfte Deutschland",
    "Pflegekräfte",
    "Azubi Vietnam",
    "Manpower Agency",
    "Fachkräftevermittlung",
    "Vietnam Recruiting",
    "Deutschland Personal",
    "Arbeitskräfte Vietnam",
    "Krankenpflege Personal",
    "Handwerk Personal",
    "Industrie Personal",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: SITE_URL,
    siteName: "DMF Talents",
    title: "DMF Talents | Fachkräfte aus Vietnam für Deutschland",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "DMF Talents | Fachkräfte aus Vietnam für Deutschland",
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png", sizes: "512x512" }],
    shortcut: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <LanguageProvider>
          <RequestContextCapture />
          <JsonLd />
          <HeaderWrapper />

          <main className="min-h-screen pb-16 lg:pb-0">{children}</main>

          <Footer />

          <CookieConsent />

          {/* Google Analytics 4 — DSGVO: chỉ nạp sau khi user đồng ý cookie */}
          <GoogleAnalytics />

          <MobileStickyBar />

          <SmartChatBot />
        </LanguageProvider>
      </body>
    </html>
  );
}
