import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zeitplan & Ablauf | DMF',
  description: 'Planungssicherheit ist uns wichtig. Simulieren Sie hier den zeitlichen Ablauf von der Vertragsunterzeichnung bis zur Ankunft Ihrer Fachkraft in Deutschland.',
  keywords: [
    'Zeitplan Personalvermittlung',
    'Prozessablauf Fachkräfte',
    'Visum Prozess Zeit',
    'Zeitplan Simulator',
    'DMF Zeitplan',
    'Beschleunigtes Fachkräfteverfahren',
    'Timeline Rekrutierung'
  ],
  openGraph: {
    title: 'Zeitplan & Ablauf | DMF Manpower',
    description: 'Planungssicherheit ist uns wichtig. Simulieren Sie hier den zeitlichen Ablauf von der Vertragsunterzeichnung bis zur Ankunft Ihrer Fachkraft in Deutschland.',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DMF Zeitplan & Ablauf',
      },
    ],
  },
  alternates: {
    canonical: '/fuer-arbeitgeber/zeitplan',
  },
};

export default function ZeitplanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
