import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/lib/language-context";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { CookieConsent } from "@/components/CookieConsent";
import { ThemeInjector } from "@/components/admin/ThemeInjector";
import { getSiteConfigByKey } from "@/actions/theme-actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Generate metadata dynamically to support dynamic favicon
export async function generateMetadata(): Promise<Metadata> {
  // Fetch favicon from database
  const { data: faviconAsset } = await getSiteConfigByKey("site_favicon");
  const faviconUrl = faviconAsset?.value || "/favicon.ico";

  return {
    title: "DMF Vietnam | Brücke zwischen vietnamesischen Talenten & Deutschland",
    description:
      "DMF Vietnam - Ihr zuverlässiger Partner für die Vermittlung qualifizierter Fachkräfte und Auszubildender aus Vietnam. Duale Ausbildung, Sprachtraining und interkulturelle Vorbereitung. Vertrauen, Transparenz und höchste Qualität.",
    keywords: [
      "DMF Vietnam",
      "Fachkräfte Vietnam",
      "Duale Ausbildung",
      "Azubi Vietnam",
      "Personalvermittlung Vietnam Deutschland",
      "Sprachausbildung Deutsch",
      "Interkulturelles Training",
      "Pflegekräfte Vietnam",
    ],
    authors: [{ name: "DMF Vietnam" }],
    creator: "DMF Vietnam",
    publisher: "DMF Vietnam",
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: "de_DE",
      url: "https://dmf.edu.vn",
      siteName: "DMF Vietnam",
      title: "DMF Vietnam | Brücke zwischen vietnamesischen Talenten & Deutschland",
      description:
        "DMF Vietnam vermittelt qualifizierte Fachkräfte und Auszubildende aus Vietnam an deutsche Unternehmen. Sprachausbildung, interkulturelles Training und umfassende Betreuung.",
      images: [
        {
          url: "https://dmf.edu.vn/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "DMF Vietnam - Brücken bauen zwischen Vietnam und Deutschland",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "DMF Vietnam | Fachkräfte für Deutschland",
      description:
        "Ihr zuverlässiger Partner für qualifizierte vietnamesische Fachkräfte.",
      images: ["https://dmf.edu.vn/og-image.jpg"],
    },
    icons: {
      icon: faviconUrl,
      apple: faviconUrl,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1e3a5f" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch logo, hotline, and email from database
  const [logoAsset, hotlineAsset, emailAsset] = await Promise.all([
    getSiteConfigByKey("site_logo"),
    getSiteConfigByKey("contact_hotline"),
    getSiteConfigByKey("contact_email"),
  ]);
  
  const logoUrl = logoAsset?.data?.value || null;
  const hotline = hotlineAsset?.data?.value || null;
  const email = emailAsset?.data?.value || null;

  return (
    <html lang="de" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Dynamic Theme Injection from Database */}
        <ThemeInjector />
        <LanguageProvider defaultLanguage="de">
          {/* SEO: Structured Data (Schema.org JSON-LD) */}
          <JsonLd />
          
          {/* Analytics: Google Analytics 4 (DSGVO compliant - requires cookie consent) */}
          <GoogleAnalytics />
          
          <Header logoUrl={logoUrl} hotline={hotline} email={email} />
          <main className="pt-[120px]">{children}</main>
          <Footer />
          
          {/* UI: Toast notifications */}
          <Toaster richColors position="top-center" />
          
          {/* DSGVO: Cookie Consent Banner */}
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  );
}
