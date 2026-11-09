import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, FileCheck2, MapPin, ShieldCheck } from "lucide-react";
import { REGIONAL_STANDORTE } from "@/lib/content/standorte";
import { SPEAKABLE_SPECIFICATION } from "@/lib/seo/aeo-schemas";
import { pageMetadata, SITE_NAME, siteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "/fuer-arbeitgeber/standorte",
  "Bundesländer-Verzeichnis: § 81a AufenthG & Anerkennungsstellen",
  "Überblick aller zuständigen Zentralstellen für das beschleunigte Fachkräfteverfahren (§ 81a AufenthG) und Pflege-Anerkennungsbehörden nach Bundesland (Bayern ZSEF, BW LZF, NRW ZFE, Berlin BIS u. a.)."
);

const HUB_FAQS = [
  {
    question:
      "Welche Behörde ist in meinem Bundesland für das beschleunigte Fachkräfteverfahren (§ 81a AufenthG) zuständig?",
    answer:
      "Die Zuständigkeit für § 81a AufenthG ist föderal geregelt: In Bayern die ZSEF Nürnberg, in Baden-Württemberg die LZF (Stuttgart/Karlsruhe), in NRW die ZFE Bonn bzw. kommunale Business Immigration Desks, in Berlin das LEA (Business Immigration Service), in Sachsen die Landesdirektion Sachsen und in Hamburg das Hamburg Welcome Center (HWC).",
  },
  {
    question:
      "Warum unterscheidet sich die Anerkennungsstelle zwischen Pflegeberufen und IHK-/Handwerksberufen?",
    answer:
      "Reglementierte Gesundheits- und Pflegeberufe werden niemals von der IHK FOSA geprüft, sondern ausschließlich von den Landesprüfungsämtern der Bundesländer (z. B. LfP Amberg in Bayern, RP Stuttgart Referat 95 in BW, ZAG Münster in NRW). Gewerblich-technische und kaufmännische Berufe laufen hingegen über die IHK FOSA oder die örtliche Handwerkskammer (HWK).",
  },
  {
    question: "Übernimmt DMF Talents die Behördenkommunikation in allen 16 Bundesländern?",
    answer:
      "Ja. Mit Untervollmacht des Arbeitgebers und der vietnamesischen Fachkraft übernimmt DMF Talents bundesweit die vollständige Vorbereitung und Koordination mit den Zentralstellen für Fachkräfteeinwanderung, den Landesämtern für Pflege, der IHK FOSA, den Handwerkskammern sowie der ZAV.",
  },
];

export default function RegionalStandorteHubPage() {
  const hubUrl = siteUrl("/fuer-arbeitgeber/standorte");

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${hubUrl}#webpage`,
      url: hubUrl,
      name: `Bundesländer-Verzeichnis: § 81a AufenthG & Anerkennungsstellen | ${SITE_NAME}`,
      description:
        "Vollständiges B2B-Verzeichnis der zuständigen § 81a AufenthG Behörden und Anerkennungsstellen für die Rekrutierung vietnamesischer Fachkräfte und Auszubildender nach Bundesland.",
      inLanguage: "de-DE",
      speakable: SPEAKABLE_SPECIFICATION,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${hubUrl}#itemlist`,
      name: "Regionale § 81a AufenthG & Rekrutierungs-Leitfäden nach Bundesland",
      numberOfItems: REGIONAL_STANDORTE.length,
      itemListElement: REGIONAL_STANDORTE.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: `${item.stateName} – ${item.authority81aName}`,
        url: siteUrl(`/fuer-arbeitgeber/standorte/${item.slug}`),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${hubUrl}#faq`,
      mainEntity: HUB_FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Startseite",
          item: siteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Bundesländer & § 81a Standorte",
          item: hubUrl,
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      {/* Hero Section */}
      <section className="container mx-auto px-4 max-w-6xl mb-12">
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-800">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <MapPin className="w-3.5 h-3.5" />
            Bundesweite Behörden-Matrix (§ 81a AufenthG & BQFG)
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Fachkräfte & Azubis aus Vietnam nach Bundesland rekrutieren
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed mb-8">
            Jedes Bundesland organisiert das beschleunigte Fachkräfteverfahren (§ 81a AufenthG) und
            die Berufsanerkennung unterschiedlich. Finden Sie hier die exakt zuständige
            Zentralstelle (ZSEF, LZF, ZFE, LEA BIS, HWC) sowie das zuständige Landesprüfungsamt für
            Ihren Unternehmensstandort.
          </p>

          {/* Direct Answer Box (.aeo-direct-answer) */}
          <div className="aeo-direct-answer bg-slate-800/90 border border-teal-500/30 rounded-2xl p-6 text-slate-100">
            <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              Direkte Antwort für Arbeitgeber (AEO Behörden-Überblick)
            </div>
            <p className="text-sm md:text-base leading-relaxed">
              Beim Recruiting aus Vietnam beträgt die bundesweit einheitliche Behördengebühr für das
              beschleunigte Fachkräfteverfahren nach <strong>§ 81a AufenthG 411 EUR</strong>{" "}
              (Anerkennungsfrist max. 2 Monate, ZAV-Zustimmung 1 Woche, Visumtermin 3 Wochen). Die
              Durchführung erfolgt je nach Bundesland über spezialisierte Landesbehörden wie die{" "}
              <strong>ZSEF Nürnberg (Bayern)</strong>, die{" "}
              <strong>LZF Stuttgart/Karlsruhe (Baden-Württemberg)</strong>, die{" "}
              <strong>ZFE Bonn (NRW)</strong> oder das{" "}
              <strong>LEA Business Immigration Service (Berlin)</strong>, während Pflegeabschlüsse
              zwingend von den jeweiligen Landesprüfungsämtern (niemals von der IHK FOSA) beschieden
              werden.
            </p>
          </div>
        </div>
      </section>

      {/* SSR Master Authority Table */}
      <section className="container mx-auto px-4 max-w-6xl mb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Übersichtstabelle: § 81a AufenthG Zentralstellen & Pflege-Anerkennung nach Bundesland
            </h2>
            <p className="text-sm text-slate-600">
              Direkter Vergleich der regionalen Zuständigkeiten, Anerkennungsstellen und
              Zielflughäfen für deutsche Arbeitgeber.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <caption className="sr-only">
                Zuständige Behörden für § 81a AufenthG und Berufsanerkennung nach Bundesland
              </caption>
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-200">
                  <th className="py-3.5 px-4 font-semibold">Bundesland / Region</th>
                  <th className="py-3.5 px-4 font-semibold">Zuständige § 81a AufenthG Stelle</th>
                  <th className="py-3.5 px-4 font-semibold">Anerkennung Pflegeberufe</th>
                  <th className="py-3.5 px-4 font-semibold">IHK / Handwerk (HWK)</th>
                  <th className="py-3.5 px-4 font-semibold">Leitfaden</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {REGIONAL_STANDORTE.map((region) => (
                  <tr key={region.slug} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-900">
                      <div>{region.stateName}</div>
                      <div className="text-xs font-normal text-slate-500 mt-0.5">
                        {region.cities.slice(0, 4).join(", ")}
                      </div>
                    </td>
                    <td className="py-4 px-4">{region.authority81aName}</td>
                    <td className="py-4 px-4">{region.nursingRecognitionOffice}</td>
                    <td className="py-4 px-4">{region.ihkHwkRecognitionOffice}</td>
                    <td className="py-4 px-4">
                      <Link
                        href={`/fuer-arbeitgeber/standorte/${region.slug}`}
                        className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline whitespace-nowrap"
                      >
                        Details & Ablauf
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Regional Cards Grid */}
      <section className="container mx-auto px-4 max-w-6xl mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Regionale Rekrutierungs-Leitfäden im Detail
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REGIONAL_STANDORTE.map((region) => (
            <article
              key={region.slug}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:border-primary/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    <Building2 className="w-3.5 h-3.5" />
                    {region.shortName} · {region.placementsCount}+ DMF-Referenzen
                  </span>
                  <span className="text-xs text-slate-500">{region.arrivalAirport}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  <Link
                    href={`/fuer-arbeitgeber/standorte/${region.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {region.stateName}: Fachkräfte & Azubis aus Vietnam
                  </Link>
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {region.directAnswerText}
                </p>
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 mb-4 space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <FileCheck2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>§ 81a Stelle:</strong> {region.authority81aName}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Pflege-Prüfstelle:</strong> {region.nursingRecognitionOffice}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <Link
                  href={`/fuer-arbeitgeber/standorte/${region.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
                >
                  Regionalen § 81a-Leitfaden öffnen
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/fuer-arbeitgeber/personalbedarf?location=${encodeURIComponent(region.stateName)}`}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
                >
                  Bedarf in {region.shortName} melden
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Häufige Fragen zur Behördenzuständigkeit in den Bundesländern
          </h2>
          <div className="space-y-6">
            {HUB_FAQS.map((faq) => (
              <div
                key={faq.question}
                className="border-b border-slate-100 pb-5 last:border-b-0 last:pb-0"
              >
                <h3 className="text-base font-bold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
