"use client";

import Link from "next/link";
import { openConsentSettings } from "@/components/CookieConsent";
import { COOPERATION_ITEMS, getCooperationLabel } from "@/components/header/nav-data";
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
          </div>

          {/* Column 2: Quick links */}
          <div>
            <h3 className="text-white font-bold mb-3 md:mb-4 text-sm md:text-base">
              {t.footer.links_title}
            </h3>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <li>
                <Link href="/" className="hover:text-white transition">
                  {t.header.home}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/roi-rechner" className="hover:text-white">
                  {lang === "de"
                    ? "Personalkosten-Rechner"
                    : lang === "en"
                      ? "Staffing cost calculator"
                      : "Tính chi phí nhân sự"}
                </Link>
              </li>
              {COOPERATION_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {getCooperationLabel(item.labelKey, lang)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/#about" className="hover:text-white transition">
                  {t.header.about}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="text-white font-bold mb-3 md:mb-4 text-sm md:text-base">
              {t.footer.legal_title}
            </h3>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <li>
                <Link href="/impressum" className="hover:text-white transition">
                  {t.footer.impressum}
                </Link>
              </li>
              <li>
                <button
                  onClick={openConsentSettings}
                  className="hover:text-white underline text-left min-h-11"
                >
                  {lang === "de"
                    ? "Datenschutzeinstellungen"
                    : lang === "en"
                      ? "Privacy settings"
                      : "Cài đặt quyền riêng tư"}
                </button>
              </li>
              <li>
                <Link href="/datenschutz" className="hover:text-white transition">
                  {t.footer.datenschutz}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-white font-bold mb-3 md:mb-4 text-sm md:text-base">
              {t.footer.contact_header}
            </h3>
            <p className="text-xs md:text-sm mb-1.5 md:mb-2">
              {t.footer.email_label} {t.footer.email}
            </p>
            <p className="text-xs md:text-sm mb-1.5 md:mb-2">
              {t.footer.hotline_label} {t.footer.phone}
            </p>
            <p className="text-xs md:text-sm">{t.footer.address}</p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-6 md:mt-10 pt-4 md:pt-6 text-center text-[10px] md:text-xs opacity-60">
          © {new Date().getFullYear()} DMF Talents. {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
