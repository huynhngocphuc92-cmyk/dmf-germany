"use client";

import { Calculator } from "lucide-react";
import { RoiCalculator } from "@/components/tools/RoiCalculator";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function RoiRechnerPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground pt-28 md:pt-40 pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Calculator className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t.roi?.title || "Wirtschaftlichkeits-Rechner"}
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              {t.roi?.subtitle || "Prüfen Sie sofort die Wirtschaftlichkeit bei der Rekrutierung vietnamesischer Fachkräfte."}
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <RoiCalculator />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.roi?.cta_title || "Überzeugt vom Ergebnis?"}
            </h2>
            <p className="text-lg opacity-90 mb-8">
              {t.roi?.cta_subtitle || "Kontaktieren Sie uns jetzt für ein individuelles Angebot für Ihr Unternehmen."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#contact"
                className="px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                {t.roi?.cta_contact || "Kontakt aufnehmen"}
              </a>
              <a
                href="/services/skilled-workers"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                {t.roi?.cta_services || "Unsere Dienstleistungen"}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
