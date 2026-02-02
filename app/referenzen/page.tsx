"use client";

import { MapPin, Users, Briefcase } from "lucide-react";
import { successStories, getTotalPlacements } from "@/lib/data/success-stories";
import MapWrapper from "@/components/map/MapWrapper";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function ReferenzenPage() {
  const { t } = useLanguage();
  const totalPlacements = getTotalPlacements();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground pt-28 md:pt-40 pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t.map?.title || "Unsere Erfolgsgeschichten"}
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              {t.map?.desc || "Fachkräfte aus Vietnam in ganz Deutschland"}
            </p>
            <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="text-lg font-semibold">{totalPlacements}+ Vermittlungen</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="text-lg font-semibold">{successStories.length} Städte</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <MapWrapper />
        </div>
      </section>

      {/* Success Stories Grid - SEO Support */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              Erfolgreiche Vermittlungen nach Stadt
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Überblick über unsere erfolgreichen Platzierungen in verschiedenen deutschen Städten
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {successStories.map((city) => (
                <div
                  key={city.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{city.city}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {city.position[0].toFixed(2)}°N, {city.position[1].toFixed(2)}°E
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-gray-900">
                        {city.candidateCount}+ Vermittlungen
                      </span>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-start gap-2 mb-2">
                        <Briefcase className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1 font-medium">Branchen:</p>
                          <div className="flex flex-wrap gap-2">
                            {city.jobTypes.map((job, index) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium"
                              >
                                {job}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Werden Sie Teil unserer Erfolgsgeschichte
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Lassen Sie uns gemeinsam qualifizierte Fachkräfte aus Vietnam für Ihr Unternehmen
              finden.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#contact"
                className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Kontakt aufnehmen
              </a>
              <a
                href="/services/skilled-workers"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Unsere Dienstleistungen
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
