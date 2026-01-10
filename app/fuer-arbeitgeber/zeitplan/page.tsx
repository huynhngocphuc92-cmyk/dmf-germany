"use client";

import { Calendar, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { TimelineSimulator } from "@/components/tools/TimelineSimulator";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function ZeitplanPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground pt-28 md:pt-40 pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Calendar className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t.timeline?.page_title || "Ihr Weg zur Fachkraft"}
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              {t.timeline?.page_subtitle || "Planungssicherheit ist uns wichtig. Simulieren Sie hier den zeitlichen Ablauf von der Vertragsunterzeichnung bis zur Ankunft Ihrer Fachkraft in Deutschland."}
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Simulator Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <TimelineSimulator />
          </div>
        </div>
      </section>

      {/* Process Benefits Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              {t.timeline?.benefits_title || "Warum DMF für Ihre Planung?"}
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              {t.timeline?.benefits_subtitle || "Transparenz und Zuverlässigkeit in jedem Schritt"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t.timeline?.benefit_transparency || "Transparente Zeitschätzung"}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t.timeline?.benefit_transparency_desc || "Wir informieren Sie kontinuierlich über den Fortschritt und halten Sie über jeden Meilenstein auf dem Laufenden."}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t.timeline?.benefit_reliability || "Zuverlässige Prozesse"}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t.timeline?.benefit_reliability_desc || "Durch jahrelange Erfahrung können wir präzise Zeitschätzungen geben und halten uns an vereinbarte Fristen."}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t.timeline?.benefit_flexibility || "Flexible Anpassung"}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t.timeline?.benefit_flexibility_desc || "Mit dem beschleunigten Fachkräfteverfahren können wir den Prozess verkürzen, wenn Zeit wichtig ist."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.timeline?.cta_title || "Bereit, den Prozess zu starten?"}
            </h2>
            <p className="text-lg opacity-90 mb-8">
              {t.timeline?.cta_subtitle || "Kontaktieren Sie uns für eine individuelle Beratung und erhalten Sie einen maßgeschneiderten Zeitplan für Ihr Projekt."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#contact"
                className="px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                {t.timeline?.cta_contact || "Jetzt kontaktieren"}
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/fuer-arbeitgeber/roi-rechner"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                {t.timeline?.cta_costs || "Kosten berechnen"}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
