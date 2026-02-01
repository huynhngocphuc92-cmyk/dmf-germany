import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { HeaderWrapper } from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { SmartChatBot } from "@/components/bot/SmartChatBot";
import { CookieConsent } from "@/components/CookieConsent";

// Base URL for absolute URLs in metadata
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dmf-vietnam.de";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "DMF Manpower | Fachkräfte aus Vietnam für Deutschland",
    template: "%s | DMF Manpower",
  },
  description:
    "Spezialisierte Personalvermittlung für Pflege, Handwerk & Industrie. Full-Service von Rekrutierung bis Visum. Jetzt Fachkräfte finden!",
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
  authors: [{ name: "DMF Vietnam" }],
  creator: "DMF Vietnam",
  publisher: "DMF Vietnam",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: baseUrl,
    siteName: "DMF Manpower",
    title: "DMF Manpower | Fachkräfte aus Vietnam für Deutschland",
    description:
      "Spezialisierte Personalvermittlung für Pflege, Handwerk & Industrie. Full-Service von Rekrutierung bis Visum. Jetzt Fachkräfte finden!",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "DMF Manpower - Fachkräfte aus Vietnam für Deutschland",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DMF Manpower | Fachkräfte aus Vietnam für Deutschland",
    description:
      "Spezialisierte Personalvermittlung für Pflege, Handwerk & Industrie. Full-Service von Rekrutierung bis Visum.",
    images: ["/og-image.svg"],
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
  alternates: {
    canonical: baseUrl,
  },
  verification: {
    // Add Google Search Console verification if available
    // google: 'verification_token_here',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        {/* QUAN TRỌNG: Provider phải bọc lấy TẤT CẢ mọi thứ bên trong body */}
        <LanguageProvider>
          {/* JsonLd nằm trong này mới có dữ liệu ngôn ngữ */}
          <JsonLd />

          {/* HeaderWrapper fetches logo from database (key: site_logo, header_logo, or logo_url) */}
          <HeaderWrapper />

          <main className="min-h-screen">{children}</main>

          <Footer />

          {/* Cookie Consent Banner */}
          <CookieConsent />

          {/* DMF AI Chat Assistant - Smart Bot with Claude AI */}
          <SmartChatBot />
        </LanguageProvider>
      </body>
    </html>
  );
}
