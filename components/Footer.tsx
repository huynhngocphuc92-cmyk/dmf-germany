"use client"; // BẮT BUỘC có dòng này

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider"; // 👈 ĐÃ SỬA ĐƯỜNG DẪN ĐÚNG

export default function Footer() {
  // Lấy bộ từ điển ra dùng
  const { t } = useLanguage();

  return (
    <footer
      className="bg-slate-900 text-slate-300 py-12 mt-20"
      role="contentinfo"
      aria-label="Seitenende"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Cột 1: Thông tin công ty */}
          <div>
            <div className="text-2xl font-bold text-white mb-4">{t.footer.company_name}</div>
            <p className="text-sm opacity-80 mb-4">{t.hero.subtitle}</p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h3 className="text-white font-bold mb-4">{t.footer.links_title}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition">
                  {t.header.home}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  {t.header.about}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition">
                  {t.header.blog}
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Pháp lý */}
          <div>
            <h3 className="text-white font-bold mb-4">{t.footer.legal_title}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/impressum" className="hover:text-white transition">
                  {t.footer.impressum}
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="hover:text-white transition">
                  {t.footer.datenschutz}
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h3 className="text-white font-bold mb-4">{t.footer.contact_header}</h3>
            <p className="text-sm mb-2">
              {t.footer.email_label} {t.footer.email}
            </p>
            <p className="text-sm mb-2">
              {t.footer.hotline_label} {t.footer.phone}
            </p>
            <p className="text-sm">{t.footer.address}</p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-xs opacity-60">
          © {new Date().getFullYear()} DMF Vietnam. {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
