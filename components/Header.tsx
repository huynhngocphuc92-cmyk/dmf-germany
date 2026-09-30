"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail } from "lucide-react";
import { Logo } from "@/components/Logo";
import { GERMANY_CONTACT, PRIMARY_CONTACT } from "@/lib/company/contact";
import { LanguageSwitcher } from "@/components/header/LanguageSwitcher";
import { NavDropdown } from "@/components/header/NavDropdown";
import { MobileMenu } from "@/components/header/MobileMenu";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { EMPLOYER_COPY, servicePaths } from "@/lib/content/employers";
export function Header({
  logoUrl,
  hotline,
  email,
}: { logoUrl?: string | null; hotline?: string | null; email?: string | null } = {}) {
  const { lang, t } = useLanguage();
  const copy = EMPLOYER_COPY[lang];
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  const phone = hotline || GERMANY_CONTACT.phone;
  const mail = email || PRIMARY_CONTACT.email;
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-background border-b shadow-sm">
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-center sm:justify-start gap-5 text-xs">
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2">
            <Phone className="h-3 w-3" />
            {phone}
          </a>
          <a href={`mailto:${mail}`} className="inline-flex items-center gap-2 min-w-0">
            <Mail className="h-3 w-3 shrink-0" />
            <span className="truncate">{mail}</span>
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4">
        <Link href="/" aria-label="DMF Talents – Startseite" className="shrink-0">
          <Logo
            logoUrl={logoUrl}
            fallbackText="DMF"
            height={44}
            className="h-11 w-auto object-contain"
          />
        </Link>
        <nav
          aria-label="Hauptnavigation"
          className="hidden xl:flex items-center gap-5 text-sm font-medium"
        >
          <NavDropdown
            label={t.header.solutions}
            items={(Object.keys(servicePaths) as (keyof typeof servicePaths)[]).map((key) => ({
              href: servicePaths[key],
              label: copy.form.services[key],
            }))}
            variant="simple"
          />
          <Link href="/fuer-arbeitgeber/kandidaten" className="py-3 hover:underline">
            {copy.secondary}
          </Link>
          <Link href="/#about" className="py-3 hover:underline">
            {t.header.about}
          </Link>
          <Link href="/blog" className="py-3 hover:underline">
            Blog
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher variant="mobile" />
          <Link
            href={pathname === "/" ? "/#contact" : "/fuer-arbeitgeber/personalbedarf"}
            className="hidden xl:inline-flex min-h-11 items-center rounded-lg bg-primary px-5 py-2 text-primary-foreground text-sm font-semibold"
          >
            {copy.primary}
          </Link>
          <div className="xl:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
