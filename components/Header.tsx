"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
  Home,
  Users,
  Newspaper,
  Award,
  Building2,
  Calculator,
  MapPin,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { TRANSLATIONS } from "@/lib/translations";

// ============================================
// HEADER PROPS INTERFACE
// ============================================

interface HeaderProps {
  logoUrl?: string | null;
  hotline?: string | null;
  email?: string | null;
}

// ============================================
// MAIN HEADER COMPONENT
// ============================================

export const Header = ({ logoUrl, hotline, email }: HeaderProps = {}) => {
  const { lang, setLang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isEmployerMenuOpen, setIsEmployerMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const pathname = usePathname();

  // Language options for buttons
  const languageOptions = [
    { code: "de" as const, label: "DE" },
    { code: "en" as const, label: "EN" },
    { code: "vn" as const, label: "VN" },
  ];

  // Display values with fallbacks
  const displayHotline = hotline || "+84 85 507 0773";
  const displayEmail = email || "contact@dmf.edu.vn";

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isScrolled = scrollY > 20;
  const shouldHideTopBar = isScrolled;

  // Active route checking
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };


  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300">
      {/* Top Bar - Ẩn khi scroll > 20px */}
      <div
        className={cn(
          "bg-primary text-white flex items-center justify-between px-4 transition-all duration-500 ease-in-out",
          shouldHideTopBar ? "h-0 opacity-0 overflow-hidden" : "h-10 opacity-100"
        )}
      >
        <div className="container mx-auto flex items-center justify-center md:justify-start px-4 lg:px-8 h-full">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Hotline */}
            <a
              href={`tel:${displayHotline.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 hover:text-primary-foreground/80 transition-colors text-xs md:text-sm"
            >
              <Phone className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs md:text-sm">
                {displayHotline}
              </span>
            </a>
            {/* Email */}
            <a
              href={`mailto:${displayEmail}`}
              className="flex items-center gap-1.5 hover:text-primary-foreground/80 transition-colors text-xs md:text-sm"
            >
              <Mail className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs md:text-sm truncate max-w-[120px] sm:max-w-none">
                {displayEmail}
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Bar - Glass Effect với hiệu ứng scroll */}
      <div
        className={cn(
          "flex items-center px-4 transition-all duration-500 ease-in-out",
          isScrolled
            ? "h-16 py-2 shadow-md bg-white/90 backdrop-blur-md"
            : "h-20 bg-white/95 backdrop-blur-md shadow-sm"
        )}
      >
        <div className="container mx-auto flex items-center justify-between w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Logo
              logoUrl={logoUrl}
              fallbackText="DMF"
              className="h-12 w-auto object-contain"
              height={48}
            />
          </Link>

          {/* Desktop Navigation - Giữa */}
          <nav className="hidden md:flex items-center gap-1 md:gap-2 lg:gap-4 flex-1 justify-center">
            {/* Home */}
            <Link
              href="/"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors relative",
                "hover:text-primary",
                "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full",
                isActive("/") && "text-primary font-semibold after:w-full"
              )}
            >
              <Home className="w-4 h-4 inline-block mr-2" />
              {t.header.home}
            </Link>

            {/* Solutions - Dropdown */}
            <div className="relative group">
              <button
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 relative",
                  "hover:text-primary",
                  "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                )}
              >
                <Users className="w-4 h-4 inline-block mr-2" />
                {t.header.solutions}
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>

              {/* Dropdown Content - Transparent Padding */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 pt-4 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4">
                  <div className="space-y-2">
                    <Link href="/services/azubi" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 rounded-lg">
                      {lang === "de" ? "Auszubildende" : lang === "en" ? "Apprentices" : "Du học nghề"}
                    </Link>
                    <Link href="/services/skilled-workers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 rounded-lg">
                      {lang === "de" ? "Fachkräfte" : lang === "en" ? "Skilled Workers" : "Nhân sự chuyên môn"}
                    </Link>
                    <Link href="/services/seasonal" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 rounded-lg">
                      {lang === "de" ? "Saisonkräfte" : lang === "en" ? "Seasonal Workers" : "Lao động thời vụ"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Blog */}
            <Link
              href="/blog"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors relative",
                "hover:text-primary",
                "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full",
                isActive("/blog") && "text-primary font-semibold after:w-full"
              )}
            >
              <Newspaper className="w-4 h-4 inline-block mr-2" />
              {t.header.blog}
            </Link>

            {/* Für Arbeitgeber - Dropdown */}
            <div className="relative group">
              <button
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 relative",
                  "hover:text-primary",
                  "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full",
                  (isActive("/referenzen") || isActive("/roi-rechner") || isActive("/fuer-arbeitgeber/zeitplan") || isActive("/fuer-arbeitgeber/kandidaten")) && "text-primary font-semibold after:w-full"
                )}
              >
                <Building2 className="w-4 h-4 inline-block mr-2" />
                {t.nav?.employers || "Für Arbeitgeber"}
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>

              {/* Dropdown Content */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-72 pt-4 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2">
                  <div className="space-y-1">
                    <Link 
                      href="/referenzen" 
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors",
                        isActive("/referenzen") && "bg-primary/10 text-primary font-medium"
                      )}
                      onClick={(e) => {
                        // Allow link to work normally
                      }}
                    >
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">{t.nav?.references || "Referenzen"}</div>
                        <div className="text-xs text-gray-500">{t.nav?.references_desc || "Erfolgreiche Vermittlungen"}</div>
                      </div>
                    </Link>
                    <Link 
                      href="/roi-rechner" 
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors",
                        isActive("/roi-rechner") && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      <Calculator className="w-4 h-4 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">{t.nav?.roi_calculator || "ROI-Rechner"}</div>
                        <div className="text-xs text-gray-500">{t.nav?.roi_calculator_desc || "Kostenvergleich berechnen"}</div>
                      </div>
                    </Link>
                    <Link 
                      href="/fuer-arbeitgeber/zeitplan" 
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors",
                        isActive("/fuer-arbeitgeber/zeitplan") && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">{t.nav?.timeline || "Ablauf & Zeitplan"}</div>
                        <div className="text-xs text-gray-500">{t.nav?.timeline_desc || "Prozessdauer simulieren"}</div>
                      </div>
                    </Link>
                    <Link 
                      href="/fuer-arbeitgeber/kandidaten" 
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors",
                        isActive("/fuer-arbeitgeber/kandidaten") && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">{t.nav?.candidates || "Kandidaten-Pool"}</div>
                        <div className="text-xs text-gray-500">{t.nav?.candidates_desc || "Top-Talente entdecken"}</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <Link
              href="/#about"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors relative",
                "hover:text-primary",
                "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              )}
            >
              {t.header.about}
            </Link>
          </nav>

          {/* Right Side - Language Buttons & Contact Button (Desktop) */}
          <div className="hidden md:flex items-center gap-2 md:gap-3 flex-shrink-0">
            {/* Language Buttons - 3 nút bấm vật lý */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              {languageOptions.map((langOption) => (
                <button
                  key={langOption.code}
                  type="button"
                  onClick={() => setLang(langOption.code)}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200",
                    lang === langOption.code
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "bg-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-800"
                  )}
                >
                  {langOption.label}
                </button>
              ))}
            </div>

            {/* Contact Button */}
            <Link
              href="/#contact"
              onClick={(e) => {
                // Handle smooth scroll when already on homepage
                if (pathname === '/') {
                  e.preventDefault();
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
              }}
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span className="font-semibold">{t.header.contact}</span>
            </Link>
          </div>

          {/* Mobile - Language Buttons & Hamburger Menu */}
          <div className="md:hidden flex items-center gap-2">
            {/* Language Buttons - Mobile */}
            <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
              {languageOptions.map((langOption) => (
                <button
                  key={langOption.code}
                  type="button"
                  onClick={() => setLang(langOption.code)}
                  className={cn(
                    "px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200",
                    lang === langOption.code
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "bg-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-800"
                  )}
                >
                  {langOption.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-white z-40 p-4 border-t overflow-y-auto">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-lg font-medium py-2",
                isActive("/") ? "text-primary font-semibold" : "text-foreground"
              )}
            >
                      {t.header.home}
            </Link>
            <Link
              href="/services/azubi"
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium py-2 text-foreground"
            >
                            {t.header.solutions}
            </Link>
            <Link
              href="/blog"
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-lg font-medium py-2",
                isActive("/blog") ? "text-primary font-semibold" : "text-foreground"
              )}
            >
              {t.header.blog}
            </Link>

            {/* Für Arbeitgeber - Mobile Dropdown */}
            <div>
              <button
                onClick={() => setIsEmployerMenuOpen(!isEmployerMenuOpen)}
                className={cn(
                  "w-full text-left text-lg font-medium py-2 flex items-center justify-between",
                  (isActive("/referenzen") || isActive("/roi-rechner") || isActive("/fuer-arbeitgeber/zeitplan") || isActive("/fuer-arbeitgeber/kandidaten")) 
                    ? "text-primary font-semibold" 
                    : "text-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {t.nav?.employers || "Für Arbeitgeber"}
                </span>
                <ChevronDown 
                  className={cn(
                    "w-5 h-5 transition-transform",
                    isEmployerMenuOpen && "rotate-180"
                  )} 
                />
              </button>
              {isEmployerMenuOpen && (
                <div className="ml-6 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
                  <Link
                    href="/referenzen"
                    onClick={() => {
                      setIsOpen(false);
                      setIsEmployerMenuOpen(false);
                    }}
                    className={cn(
                      "block text-base py-2 flex items-center gap-2",
                      isActive("/referenzen") 
                        ? "text-primary font-semibold" 
                        : "text-gray-700"
                    )}
                  >
                    <MapPin className="w-4 h-4" />
                    {t.nav?.references || "Referenzen"}
                  </Link>
                  <Link
                    href="/roi-rechner"
                    onClick={() => {
                      setIsOpen(false);
                      setIsEmployerMenuOpen(false);
                    }}
                    className={cn(
                      "block text-base py-2 flex items-center gap-2",
                      isActive("/roi-rechner") 
                        ? "text-primary font-semibold" 
                        : "text-gray-700"
                    )}
                  >
                    <Calculator className="w-4 h-4" />
                    {t.nav?.roi_calculator || "ROI-Rechner"}
                  </Link>
                  <Link
                    href="/fuer-arbeitgeber/zeitplan"
                    onClick={() => {
                      setIsOpen(false);
                      setIsEmployerMenuOpen(false);
                    }}
                    className={cn(
                      "block text-base py-2 flex items-center gap-2",
                      isActive("/fuer-arbeitgeber/zeitplan") 
                        ? "text-primary font-semibold" 
                        : "text-gray-700"
                    )}
                  >
                    <Calendar className="w-4 h-4" />
                    {t.nav?.timeline || "Ablauf & Zeitplan"}
                  </Link>
                  <Link
                    href="/fuer-arbeitgeber/kandidaten"
                    onClick={() => {
                      setIsOpen(false);
                      setIsEmployerMenuOpen(false);
                    }}
                    className={cn(
                      "block text-base py-2 flex items-center gap-2",
                      isActive("/fuer-arbeitgeber/kandidaten") 
                        ? "text-primary font-semibold" 
                        : "text-gray-700"
                    )}
                  >
                    <Users className="w-4 h-4" />
                    {t.nav?.candidates || "Kandidaten-Pool"}
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/#about"
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium py-2 text-foreground"
            >
              {t.header.about}
            </Link>
            <Link
              href="/#contact"
              onClick={(e) => {
                setIsOpen(false);
                // Handle smooth scroll when already on homepage
                if (pathname === '/') {
                  e.preventDefault();
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
              }}
              className="text-lg font-medium py-2 text-primary font-semibold"
            >
              {t.header.contact}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};