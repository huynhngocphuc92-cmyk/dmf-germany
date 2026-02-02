"use client";

import { useState, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Building2,
  MapPin,
  Calculator,
  Calendar,
  Users,
  Handshake,
  GraduationCap,
  School,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import {
  EMPLOYER_ITEMS,
  EMPLOYER_ACTIVE_ROUTES,
  COOPERATION_ITEMS,
  COOPERATION_ACTIVE_ROUTES,
  getCooperationLabel,
} from "./nav-data";

interface MobileMenuProps {
  onContactClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  isScrolled?: boolean;
}

export const MobileMenu = memo(function MobileMenu({
  onContactClick,
  isScrolled = false,
}: MobileMenuProps) {
  const { t, lang } = useLanguage();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isEmployerMenuOpen, setIsEmployerMenuOpen] = useState(false);
  const [isCooperationMenuOpen, setIsCooperationMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isEmployerActive = EMPLOYER_ACTIVE_ROUTES.some((route) => pathname.startsWith(route));
  const isCooperationActive = COOPERATION_ACTIVE_ROUTES.some((route) => pathname.startsWith(route));

  const closeMenu = () => {
    setIsOpen(false);
    setIsEmployerMenuOpen(false);
    setIsCooperationMenuOpen(false);
  };

  const iconMap: Record<string, typeof MapPin> = {
    references: MapPin,
    roi_calculator: Calculator,
    timeline: Calendar,
    candidates: Users,
  };

  const cooperationIconMap: Record<string, typeof GraduationCap> = {
    dual_training: GraduationCap,
    study_germany: School,
    skilled_program: Briefcase,
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="p-2 rounded-lg hover:bg-muted transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div
          id="mobile-menu"
          role="navigation"
          aria-label="Hauptnavigation"
          className={cn(
            "md:hidden fixed inset-0 bg-white z-[60] p-4 border-t overflow-y-auto",
            isScrolled ? "top-16" : "top-[120px]"
          )}
        >
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={closeMenu}
              className={cn(
                "text-lg font-medium py-2",
                isActive("/") ? "text-primary font-semibold" : "text-foreground"
              )}
            >
              {t.header.home}
            </Link>

            <Link
              href="/services/azubi"
              onClick={closeMenu}
              className="text-lg font-medium py-2 text-foreground"
            >
              {t.header.solutions}
            </Link>

            {/* TODO: Uncomment when blog has content
            <Link
              href="/blog"
              onClick={closeMenu}
              className={cn(
                "text-lg font-medium py-2",
                isActive("/blog") ? "text-primary font-semibold" : "text-foreground"
              )}
            >
              {t.header.blog}
            </Link>
            */}

            {/* Für Arbeitgeber - Mobile Dropdown */}
            <div>
              <button
                onClick={() => setIsEmployerMenuOpen(!isEmployerMenuOpen)}
                aria-expanded={isEmployerMenuOpen}
                aria-controls="employer-submenu"
                className={cn(
                  "w-full text-left text-lg font-medium py-2 flex items-center justify-between",
                  isEmployerActive ? "text-primary font-semibold" : "text-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {t.nav?.employers || "Für Arbeitgeber"}
                </span>
                <ChevronDown
                  className={cn("w-5 h-5 transition-transform", isEmployerMenuOpen && "rotate-180")}
                />
              </button>

              {isEmployerMenuOpen && (
                <div
                  id="employer-submenu"
                  className="ml-6 mt-2 space-y-2 border-l-2 border-gray-200 pl-4"
                >
                  {EMPLOYER_ITEMS.map((item) => {
                    const Icon = iconMap[item.labelKey] || MapPin;
                    const label = t.nav?.[item.labelKey as keyof typeof t.nav] || item.labelKey;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenu}
                        className={cn(
                          "block text-base py-2 flex items-center gap-2",
                          isActive(item.href) ? "text-primary font-semibold" : "text-gray-700"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Kooperation & Programme - Mobile Dropdown */}
            <div>
              <button
                onClick={() => setIsCooperationMenuOpen(!isCooperationMenuOpen)}
                aria-expanded={isCooperationMenuOpen}
                aria-controls="cooperation-submenu"
                className={cn(
                  "w-full text-left text-lg font-medium py-2 flex items-center justify-between",
                  isCooperationActive ? "text-primary font-semibold" : "text-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  <Handshake className="w-5 h-5" />
                  {getCooperationLabel("cooperation", lang)}
                </span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 transition-transform",
                    isCooperationMenuOpen && "rotate-180"
                  )}
                />
              </button>

              {isCooperationMenuOpen && (
                <div
                  id="cooperation-submenu"
                  className="ml-6 mt-2 space-y-2 border-l-2 border-gray-200 pl-4"
                >
                  {COOPERATION_ITEMS.map((item) => {
                    const Icon = cooperationIconMap[item.labelKey] || GraduationCap;
                    const label = getCooperationLabel(item.labelKey, lang);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenu}
                        className={cn(
                          "block text-base py-2 flex items-center gap-2",
                          isActive(item.href) ? "text-primary font-semibold" : "text-gray-700"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/#about"
              onClick={closeMenu}
              className="text-lg font-medium py-2 text-foreground"
            >
              {t.header.about}
            </Link>

            <Link
              href="/#contact"
              onClick={(e) => {
                closeMenu();
                onContactClick(e);
              }}
              className="text-lg font-medium py-2 text-primary font-semibold"
            >
              {t.header.contact}
            </Link>
          </div>
        </div>
      )}
    </>
  );
});
