import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dmf-vietnam.de';

export const metadata: Metadata = {
  title: 'Azubi aus Vietnam vermitteln | DMF Manpower',
  description: 'Finden Sie motivierte Auszubildende aus Vietnam für Pflege, Handwerk und Industrie. Komplettservice inkl. Visum & B2-Sprachniveau.',
  openGraph: {
    title: 'Azubi aus Vietnam vermitteln | DMF Manpower',
    description: 'Motivierte Azubis für Ihr Unternehmen. Jetzt informieren!',
    url: `${baseUrl}/services/azubi`,
    siteName: 'DMF Manpower',
    images: [
      {
        url: '/og-image.jpg', // Using default OG image, can be customized later
        width: 1200,
        height: 630,
        alt: 'Azubi aus Vietnam vermitteln | DMF Manpower',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Azubi aus Vietnam vermitteln | DMF Manpower',
    description: 'Motivierte Azubis für Ihr Unternehmen. Jetzt informieren!',
    images: ['/og-image.jpg'],
  },
};

export default function AzubiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
