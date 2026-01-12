import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dmf-vietnam.de';

export const metadata: Metadata = {
  title: 'Saisonarbeiter aus Vietnam vermitteln | DMF Manpower',
  description: 'Zuverlässige Saisonkräfte für Landwirtschaft & Gastronomie. Schnell verfügbar, rechtssicher nach §15a BeschV. Einsatzbereit in 4-8 Wochen.',
  openGraph: {
    title: 'Saisonarbeiter aus Vietnam vermitteln | DMF Manpower',
    description: 'Saisonkräfte für Ihre Hochsaison. Jetzt verfügbarkeit prüfen!',
    url: `${baseUrl}/services/seasonal`,
    siteName: 'DMF Manpower',
    images: [
      {
        url: '/og-image.jpg', // Using default OG image, can be customized later
        width: 1200,
        height: 630,
        alt: 'Saisonarbeiter aus Vietnam vermitteln | DMF Manpower',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saisonarbeiter aus Vietnam vermitteln | DMF Manpower',
    description: 'Saisonkräfte für Ihre Hochsaison. Jetzt verfügbarkeit prüfen!',
    images: ['/og-image.jpg'],
  },
};

export default function SeasonalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
