"use client";
import Link from "next/link";

import MapWrapper from "@/components/map/MapWrapper";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { successStories } from "@/lib/data/success-stories";
import { Briefcase, Building2, MapPin } from "lucide-react";

export default function ReferenzenPage() {
  const { t, lang } = useLanguage();

  const copy =
    lang === "en"
      ? {
          badge: "Regional & Sector Overview (Exemplary Sector Distribution)",
          regionsLabel: `${successStories.length} Key Regions in Germany`,
          nationwideLabel: "Nationwide Employer Support",
          gridTitle: "Regional Deployment & Sector Overview",
          gridDesc:
            "Overview of key target regions and core industries across Germany where Vietnamese skilled workers and trainees are deployed.",
          focusRegion: "Target Region & Focus Sectors",
          sectorsLabel: "Core Sectors:",
          ctaTitle: "Looking for Qualified Talent for Your Region?",
          ctaDesc:
            "Let us find suitable skilled workers, trainees, or seasonal staff from Vietnam for your organization.",
          ctaPrimary: "Submit Staffing Request",
          ctaSecondary: "Our Services",
        }
      : lang === "vn"
        ? {
            badge: "Tổng quan Khu vực & Ngành nghề (Phân bổ ngành nghề tiêu biểu)",
            regionsLabel: `${successStories.length} Khu vực trọng điểm tại Đức`,
            nationwideLabel: "Hỗ trợ doanh nghiệp trên toàn CHLB Đức",
            gridTitle: "Tổng quan Khu vực & Ngành nghề Triển khai",
            gridDesc:
              "Tổng quan các thành phố trọng điểm và lĩnh vực ngành nghề tiêu biểu dành cho nhân sự và học viên nghề từ Việt Nam tại Đức.",
            focusRegion: "Khu vực & Ngành nghề trọng điểm",
            sectorsLabel: "Ngành nghề:",
            ctaTitle: "Hợp tác Tuyển dụng Nhân sự cho Doanh nghiệp của Bạn",
            ctaDesc:
              "Hãy cùng chúng tôi kết nối những nhân sự có tay nghề, du học sinh nghề và lao động thời vụ phù hợp từ Việt Nam.",
            ctaPrimary: "Gửi yêu cầu nhân sự",
            ctaSecondary: "Dịch vụ của chúng tôi",
          }
        : {
            badge: "Standort- & Einsatzübersicht (Beispielhafte Branchenverteilung)",
            regionsLabel: `${successStories.length} Schwerpunktregionen`,
            nationwideLabel: "Bundesweite Arbeitgeberbetreuung",
            gridTitle: "Standort- & Einsatzübersicht nach Region",
            gridDesc:
              "Überblick über zentrale Wirtschaftsregionen und beispielhafte Einsatzbranchen für Fachkräfte und Auszubildende in Deutschland.",
            focusRegion: "Einsatzregion & Schwerpunktbranchen",
            sectorsLabel: "Branchen:",
            ctaTitle: "Personalbedarf in Ihrer Region?",
            ctaDesc:
              "Lassen Sie uns gemeinsam qualifizierte Fachkräfte, Auszubildende oder Saisonkräfte aus Vietnam für Ihr Unternehmen gewinnen.",
            ctaPrimary: "Personalbedarf anmelden",
            ctaSecondary: "Unsere Dienstleistungen",
          };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground pt-28 md:pt-40 pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-xs md:text-sm font-medium mb-4">
              {copy.badge}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t.map?.title || copy.gridTitle}
            </h1>
            <p className="text-lg md:text-xl opacity-90">{t.map?.desc || copy.gridDesc}</p>
            <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="text-lg font-semibold">{copy.regionsLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span className="text-lg font-semibold">{copy.nationwideLabel}</span>
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

      {/* Regional Sector Overview Grid */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              {copy.gridTitle}
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">{copy.gridDesc}</p>

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
                      <Building2 className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-gray-900 text-sm">
                        {copy.focusRegion}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-start gap-2 mb-2">
                        <Briefcase className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1 font-medium">
                            {copy.sectorsLabel}
                          </p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.ctaTitle}</h2>
            <p className="text-lg opacity-90 mb-8">{copy.ctaDesc}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/fuer-arbeitgeber/personalbedarf"
                className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                {copy.ctaPrimary}
              </Link>
              <Link
                href="/services/skilled-workers"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                {copy.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
