import { Calculator, TrendingDown, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { RoiCalculator } from "@/components/tools/RoiCalculator";

export default function RoiRechnerPage() {
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
              Warum Vietnam? Rechnen Sie selbst!
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Vergleichen Sie die langfristigen Personalkosten und erkennen Sie 
              die wirtschaftlichen Vorteile sofort.
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

      {/* Benefits Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              Weitere Vorteile von DMF
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Neben den Kosteneinsparungen bietet DMF weitere wirtschaftliche und strategische Vorteile
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Qualifizierte Fachkräfte
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Hochqualifizierte Kandidaten mit relevanten Zertifikaten und 
                  Berufserfahrung, sorgfältig von DMF geprüft.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingDown className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Geringere Fluktuation
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Langfristige Beschäftigung und hohe Mitarbeiterbindung durch 
                  umfassende Betreuung und Integration.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Rundum-Service
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Von der Rekrutierung bis zur Integration – DMF begleitet Sie 
                  in allen Phasen des Prozesses.
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
              Überzeugt vom Ergebnis?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Kontaktieren Sie uns jetzt, um ein detailliertes, individuelles Angebot 
              für Ihr Unternehmen zu erhalten.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#contact"
                className="px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                Angebot anfordern
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/services/skilled-workers"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                Unsere Dienstleistungen
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Häufig gestellte Fragen
            </h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Was ist in der Vermittlungsgebühr enthalten?
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Die Gebühr deckt Rekrutierung, Vorauswahl, Sprachprüfung, 
                  fachspezifische Vorbereitung, Visum- und Dokumentationsunterstützung 
                  sowie Erstintegration im Unternehmen.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Wie lange dauert der Vermittlungsprozess?
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Nach Abschluss des Vertrags benötigen wir durchschnittlich 3-6 Monate 
                  für Rekrutierung, Vorbereitung und Visa-Bearbeitung, abhängig von der 
                  Position und den individuellen Anforderungen.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Gibt es Garantien für die Kandidaten?
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Ja, DMF bietet eine Nachbesserungsgarantie: Falls ein Kandidat nicht 
                  den Anforderungen entspricht, finden wir kostenlos einen Ersatz innerhalb 
                  der vereinbarten Garantiezeit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
