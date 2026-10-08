"use client";

import Link from "next/link";
import { openConsentSettings } from "@/components/CookieConsent";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function Footer() {
  const { t, lang } = useLanguage();

  return (
    <footer
      className="bg-slate-900 text-slate-300 py-8 md:py-12 mt-12 md:mt-20"
      role="contentinfo"
      aria-label="Seitenende"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Column 1: Company information */}
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
              {t.footer.company_name}
            </div>
            <p className="text-xs md:text-sm opacity-80 mb-4">{t.hero.subtitle}</p>
            <p className="text-xs text-slate-400">
              {lang === "de"
                ? "Rechtssichere Personalvermittlung, Sprachausbildung und FEG-Visabegleitung für Unternehmen in Deutschland."
                : lang === "en"
                  ? "Legally compliant recruitment, language training, and visa support for businesses in Germany."
                  : "Dịch vụ tuyển dụng, đào tạo tiếng Đức và hỗ trợ visa theo chuẩn FEG cho doanh nghiệp tại Đức."}
            </p>
          </div>

          {/* Column 2: Solutions */}
          <div>
            <h3 className="text-white font-bold mb-3 md:mb-4 text-sm md:text-base">
              {t.header?.solutions || "Lösungen"}
            </h3>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <li>
                <Link href="/services/skilled-workers" className="hover:text-white transition">
                  {lang === "de"
                    ? "Fachkräfte (§ 18a/b)"
                    : lang === "en"
                      ? "Skilled Workers"
                      : "Lao động chuyên môn"}
                </Link>
              </li>
              <li>
                <Link href="/services/azubi" className="hover:text-white transition">
                  {lang === "de"
                    ? "Auszubildende (Azubi)"
                    : lang === "en"
                      ? "Apprentices (Azubi)"
                      : "Học nghề (Azubi)"}
                </Link>
              </li>
              <li>
                <Link href="/services/seasonal" className="hover:text-white transition">
                  {lang === "de"
                    ? "Saisonkräfte"
                    : lang === "en"
                      ? "Seasonal Workers"
                      : "Lao động thời vụ"}
                </Link>
              </li>
              <li>
                <Link href="/ueber-uns/ausbildung" className="hover:text-white transition">
                  {t.nav?.dual_training || "Duale Ausbildung"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Employers & Knowledge */}
          <div>
            <h3 className="text-white font-bold mb-3 md:mb-4 text-sm md:text-base">
              {t.nav?.employers || "Für Arbeitgeber"}
            </h3>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <li>
                <Link
                  href="/fuer-arbeitgeber/personalbedarf"
                  className="text-blue-400 font-semibold hover:text-white transition flex items-center gap-1"
                >
                  <span>→</span> {t.nav?.hiring_request || "Personalbedarf melden"}
                </Link>
              </li>
              <li>
                <Link href="/fuer-arbeitgeber/kandidaten" className="hover:text-white transition">
                  {t.nav?.candidates || "Kandidaten-Pool"}
                </Link>
              </li>
              <li>
                <Link href="/roi-rechner" className="hover:text-white transition">
                  {t.nav?.roi_calculator || "ROI-Rechner"}
                </Link>
              </li>
              <li>
                <Link href="/fuer-arbeitgeber/zeitplan" className="hover:text-white transition">
                  {t.nav?.timeline || "Ablauf & Zeitplan"}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition">
                  {t.header?.blog || "Blog & Fachbeiträge"}
                </Link>
              </li>
              <li>
                <Link href="/referenzen" className="hover:text-white transition">
                  {t.nav?.references || "Referenzen"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Legal */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-white font-bold mb-3 md:mb-4 text-sm md:text-base">
              {t.footer.contact_header}
            </h3>
            <p className="text-xs md:text-sm mb-1.5 md:mb-2">
              <span className="text-slate-400">{t.footer.email_label}</span>{" "}
              <a
                href={`mailto:${t.footer.email}`}
                className="hover:text-white transition underline"
              >
                {t.footer.email}
              </a>
            </p>
            <p className="text-xs md:text-sm mb-1.5 md:mb-2">
              <span className="text-slate-400">{t.footer.hotline_label}</span>{" "}
              <a
                href={`tel:${t.footer.phone.replace(/\\s/g, "")}`}
                className="hover:text-white transition underline"
              >
                {t.footer.phone}
              </a>
            </p>
            <p className="text-xs md:text-sm text-slate-400 mb-4">{t.footer.address}</p>

            <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs">
              <div>
                <Link href="/impressum" className="hover:text-white transition">
                  {t.footer.impressum}
                </Link>
                {" · "}
                <Link href="/datenschutz" className="hover:text-white transition">
                  {t.footer.datenschutz}
                </Link>
              </div>
              <div>
                <button
                  onClick={openConsentSettings}
                  className="hover:text-white underline text-left"
                >
                  {lang === "de"
                    ? "Datenschutzeinstellungen"
                    : lang === "en"
                      ? "Privacy settings"
                      : "Cài đặt quyền riêng tư"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-6 md:mt-10 pt-4 md:pt-6 text-center text-[10px] md:text-xs opacity-60">
          © {new Date().getFullYear()} DMF Talents. {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
