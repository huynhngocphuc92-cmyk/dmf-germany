import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calculator,
  CheckCircle2,
  Clock,
  MapPin,
  Plane,
  ShieldCheck,
} from "lucide-react";
import {
  buildRegionalStandortSchemas,
  getRegionalStandortBySlug,
  REGIONAL_STANDORT_SLUGS,
  REGIONAL_STANDORTE,
} from "@/lib/content/standorte";
import { pageMetadata } from "@/lib/site";

export function generateStaticParams() {
  return REGIONAL_STANDORT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = getRegionalStandortBySlug(slug);
  if (!config) {
    return pageMetadata(
      `/fuer-arbeitgeber/standorte/${slug}`,
      "Standort nicht gefunden",
      "Übersicht unserer regionalen § 81a AufenthG Leitfäden."
    );
  }
  return pageMetadata(
    `/fuer-arbeitgeber/standorte/${config.slug}`,
    config.metaTitle,
    config.metaDescription
  );
}

export default async function RegionalStandortDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = getRegionalStandortBySlug(slug);
  if (!config) {
    notFound();
  }

  const schemas = buildRegionalStandortSchemas(config);

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-6">
          <Link
            href="/fuer-arbeitgeber/standorte"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Alle Bundesländer & § 81a Zentralstellen
          </Link>
        </div>

        {/* Hero & Direct Answer Box */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-800 mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              Regionaler § 81a-Leitfaden: {config.stateName}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-medium">
              {config.placementsCount}+ erfolgreiche DMF-Platzierungen in der Region
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{config.metaTitle}</h1>
          <p className="text-slate-300 text-sm md:text-base mb-6">
            Wichtige Wirtschaftsstandorte: <strong>{config.cities.join(" · ")}</strong>
          </p>

          {/* AEO Direct Answer Box */}
          <div className="aeo-direct-answer bg-slate-800/90 border border-teal-500/30 rounded-2xl p-6 text-slate-100 mb-6">
            <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              {config.directAnswerTitle}
            </div>
            <p className="text-sm md:text-base leading-relaxed">{config.directAnswerText}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {config.keyHighlights.map((item) => (
              <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                <div className="text-xs text-slate-400 mb-1">{item.label}</div>
                <div className="text-sm font-bold text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Regional Authority Directory Table */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Zuständige Behörden & Anerkennungsstellen in {config.stateName}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <caption className="sr-only">
                Behördenverzeichnis für Fachkräfteeinwanderung in {config.stateName}
              </caption>
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold w-1/3">Verfahrensschritt / Bereich</th>
                  <th className="py-3 px-4 font-semibold">
                    Zuständige Stelle in {config.stateName}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    Beschleunigtes Fachkräfteverfahren (§ 81a AufenthG)
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{config.authority81aName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {config.authority81aAddress}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    Verfahrensmodell in {config.shortName}
                  </td>
                  <td className="py-3.5 px-4">{config.authority81aModel}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    Anerkennung Pflege- & Gesundheitsberufe (Reglementiert)
                  </td>
                  <td className="py-3.5 px-4">{config.nursingRecognitionOffice}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    Anerkennung IHK- & Handwerksberufe (BQFG)
                  </td>
                  <td className="py-3.5 px-4">{config.ihkHwkRecognitionOffice}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    Arbeitsmarktzulassung (§ 39 AufenthG)
                  </td>
                  <td className="py-3.5 px-4">
                    Bundesagentur für Arbeit – Zentrale Auslands- und Fachvermittlung (ZAV), Frist
                    im § 81a-Verfahren: 1 Woche
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    Zielflughäfen & Anreisekoordination
                  </td>
                  <td className="py-3.5 px-4 flex items-center gap-2">
                    <Plane className="w-4 h-4 text-primary shrink-0" />
                    {config.arrivalAirport}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4-Step Regional Process & Industries */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <section className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Ablauf für Arbeitgeber in {config.stateName} (4–6 Monate)
            </h2>
            <div className="space-y-5">
              {config.processSteps.map((step) => (
                <div
                  key={step.step}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80"
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                    {step.step}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Schwerpunktbranchen in {config.shortName}
              </h2>
              <ul className="space-y-2.5 text-sm text-slate-700">
                {config.focusIndustries.map((ind) => (
                  <li key={ind} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold mb-2">
                Personalbedarf in {config.stateName} anmelden
              </h3>
              <p className="text-xs opacity-90 leading-relaxed mb-4">
                Starten Sie Ihre Anfrage direkt mit vorausgefülltem Arbeitsort ({config.stateName})
                oder berechnen Sie vorab Ihren Return on Investment.
              </p>
              <div className="space-y-2.5">
                <Link
                  href={`/fuer-arbeitgeber/personalbedarf?location=${encodeURIComponent(config.stateName)}&service=skilled`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-primary font-bold text-sm hover:bg-slate-100 transition-colors"
                >
                  Fachkräfte für {config.shortName} anfragen
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/fuer-arbeitgeber/personalbedarf?location=${encodeURIComponent(config.stateName)}&service=azubi`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-foreground/10 border border-white/25 text-white font-semibold text-sm hover:bg-white/20 transition-colors"
                >
                  Azubis für {config.shortName} anfragen
                </Link>
                <Link
                  href="/roi-rechner"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white/90 hover:underline"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  Zum B2B ROI-Rechner (Direktvermittlung vs. Zeitarbeit)
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Regional FAQ Section */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Häufige Fragen zum Recruiting aus Vietnam in {config.stateName}
          </h2>
          <div className="space-y-6">
            {config.faqs.map((faq) => (
              <div
                key={faq.question}
                className="border-b border-slate-100 pb-5 last:border-b-0 last:pb-0"
              >
                <h3 className="text-base font-bold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cross-Links to Other German States */}
        <section className="bg-slate-100 rounded-2xl p-6 border border-slate-200">
          <h2 className="text-base font-bold text-slate-900 mb-3">
            Weitere Bundesländer & § 81a Leitfäden
          </h2>
          <div className="flex flex-wrap gap-2">
            {REGIONAL_STANDORTE.filter((item) => item.slug !== config.slug).map((other) => (
              <Link
                key={other.slug}
                href={`/fuer-arbeitgeber/standorte/${other.slug}`}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-primary hover:text-primary transition-colors"
              >
                {other.stateName} ({other.shortName})
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
