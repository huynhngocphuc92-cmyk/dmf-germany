import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
  },
  twitter: {
    card: "summary_large_image",
    title: "DMF Vietnam | Fachkräfte für Deutschland",
    description:
      "Ihr zuverlässiger Partner für qualifizierte vietnamesische Fachkräfte.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1e3a5f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
