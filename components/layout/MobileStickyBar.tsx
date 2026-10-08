"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Phone, ClipboardCheck } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { GERMANY_CONTACT } from "@/lib/company/contact";

export function MobileStickyBar() {
  const pathname = usePathname();
  const { lang } = useLanguage();

  // Hide on admin routes, login or if already on the intake page
  if (
    pathname.startsWith("/admin") ||
    pathname === "/fuer-arbeitgeber/personalbedarf" ||
    pathname.startsWith("/login")
  ) {
    return null;
  }

  const phoneText = lang === "de" ? "Anrufen" : lang === "en" ? "Call us" : "Gọi điện";
  const ctaText = lang === "de" ? "Bedarf melden" : lang === "en" ? "Inquire now" : "Gửi nhu cầu";

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-3 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <a
          href={GERMANY_CONTACT.phoneHref}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-900 font-bold text-xs sm:text-sm transition-all"
          aria-label={phoneText}
        >
          <Phone className="w-4 h-4 text-blue-700 flex-shrink-0" />
          <span className="truncate">{phoneText}</span>
        </a>

        <Link
          href="/fuer-arbeitgeber/personalbedarf"
          className="flex-[2] inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20"
        >
          <ClipboardCheck className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{ctaText}</span>
        </Link>
      </div>
    </div>
  );
}
