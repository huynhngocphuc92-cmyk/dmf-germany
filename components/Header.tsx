"use client";

import { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, Home, Users, Handshake } from "lucide-react";
// import { Newspaper } from "lucide-react"; // TODO: Uncomment when blog is enabled
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { LanguageSwitcher } from "@/components/header/LanguageSwitcher";
import { NavDropdown } from "@/components/header/NavDropdown";
import { MobileMenu } from "@/components/header/MobileMenu";
import {
  SOLUTIONS_ITEMS,
  EMPLOYER_ITEMS,
  EMPLOYER_ACTIVE_ROUTES,
  COOPERATION_ITEMS,
  COOPERATION_ACTIVE_ROUTES,
  getSolutionLabel,
  getCooperationLabel,
} from "@/components/header/nav-data";

// ============================================
// TYPES
// ============================================

interface HeaderProps {
  logoUrl?: string | null;
  hotline?: string | null;
  email?: string | null;
}

// ============================================
// NAV LINK COMPONENT (memoized)
// ============================================

interface NavLinkProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  isActive: boolean;
}

const NavLink = memo(function NavLink({ href, label, icon, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "px-4 py-2 rounded-lg text-sm font-medium transition-colors relative",
        "hover:text-primary",
        "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full",
        isActive && "text-primary font-semibold after:w-full"
      )}
    >
      {icon}
      {label}
    </Link>
  );
});

// ============================================
// TOP BAR COMPONENT (memoized)
// ============================================

interface TopBarProps {
  hotline: string;
  email: string;
  isHidden: boolean;
}

const TopBar = memo(function TopBar({ hotline, email, isHidden }: TopBarProps) {
  return (
    <div
      className={cn(
        "bg-primary text-white flex items-center justify-between px-4 transition-all duration-500 ease-in-out",
        isHidden ? "h-0 opacity-0 overflow-hidden" : "h-10 opacity-100"
      )}
    >
      <div className="container mx-auto flex items-center justify-center md:justify-start px-4 lg:px-8 h-full">
        <div className="flex items-center gap-4 md:gap-6">
          <a
            href={`tel:${hotline.replace(/\s/g, "")}`}
            className="flex items-center gap-1.5 hover:text-primary-foreground/80 transition-colors text-xs md:text-sm"
            aria-label={`Anrufen: ${hotline}`}
          >
            <Phone className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" />
            <span className="text-[10px] sm:text-xs md:text-sm">{hotline}</span>
          </a>
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-1.5 hover:text-primary-foreground/80 transition-colors text-xs md:text-sm"
            aria-label={`E-Mail senden an: ${email}`}
          >
            <Mail className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" />
            <span className="text-[10px] sm:text-xs md:text-sm truncate max-w-[120px] sm:max-w-none">
              {email}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
});

// ============================================
// CONTACT BUTTON COMPONENT (memoized)
// ============================================

interface ContactButtonProps {
  label: string;
  pathname: string;
}

const ContactButton = memo(function ContactButton({ label, pathname }: ContactButtonProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname === "/") {
        e.preventDefault();
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    },
    [pathname]
  );

  return (
    <Link
      href="/#contact"
      onClick={handleClick}
      className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
    >
      <Phone className="w-4 h-4" />
      <span className="font-semibold">{label}</span>
    </Link>
  );
});

// ============================================
// MAIN HEADER COMPONENT
// ============================================

export const Header = memo(function Header({ logoUrl, hotline, email }: HeaderProps = {}) {
  const { lang, t } = useLanguage();
  const pathname = usePathname();
  const [scrollY, setScrollY] = useState(0);

  // Display values with fallbacks
  const displayHotline = hotline || "+84 855 070773";
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

  // Active route checking
  const isActive = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname.startsWith(href);
    },
    [pathname]
  );

  // Handle contact click for mobile menu
  const handleContactClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname === "/") {
        e.preventDefault();
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    },
    [pathname]
  );

  // Prepare dropdown items with translations
  const solutionsItems = SOLUTIONS_ITEMS.map((item) => ({
    href: item.href,
    label: getSolutionLabel(item.labelKey, lang),
  }));

  const employerItems = EMPLOYER_ITEMS.map((item) => ({
    href: item.href,
    label: t.nav?.[item.labelKey as keyof typeof t.nav] || item.labelKey,
    description: item.descKey
      ? t.nav?.[item.descKey as keyof typeof t.nav] || item.descKey
      : undefined,
    icon: item.icon,
  }));

  // Prepare cooperation items with translations
  const cooperationItems = COOPERATION_ITEMS.map((item) => ({
    href: item.href,
    label: getCooperationLabel(item.labelKey, lang),
    description: item.descKey ? getCooperationLabel(item.descKey, lang) : undefined,
    icon: item.icon,
  }));

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300">
      {/* Top Bar */}
      <TopBar hotline={displayHotline} email={displayEmail} isHidden={isScrolled} />

      {/* Main Bar */}
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
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0"
            aria-label="DMF Germany - Startseite"
          >
            <Logo
              logoUrl={logoUrl}
              fallbackText="DMF"
              className="h-12 w-auto object-contain"
              height={48}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-1 md:gap-2 lg:gap-4 flex-1 justify-center"
            aria-label="Hauptnavigation"
          >
            <NavLink
              href="/"
              label={t.header.home}
              icon={<Home className="w-4 h-4 inline-block mr-2" />}
              isActive={isActive("/")}
            />

            <NavDropdown
              label={t.header.solutions}
              icon={Users}
              items={solutionsItems}
              variant="simple"
            />

            {/* TODO: Uncomment when blog has content
            <NavLink
              href="/blog"
              label={t.header.blog}
              icon={<Newspaper className="w-4 h-4 inline-block mr-2" />}
              isActive={isActive("/blog")}
            />
            */}

            <NavDropdown
              label={t.nav?.employers || "Für Arbeitgeber"}
              icon={undefined}
              items={employerItems}
              activeRoutes={EMPLOYER_ACTIVE_ROUTES}
              variant="detailed"
            />

            <NavDropdown
              label={getCooperationLabel("cooperation", lang)}
              icon={Handshake}
              items={cooperationItems}
              activeRoutes={COOPERATION_ACTIVE_ROUTES}
              variant="detailed"
            />

            <NavLink href="/#about" label={t.header.about} isActive={false} />
          </nav>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center gap-2 md:gap-3 flex-shrink-0">
            <LanguageSwitcher variant="desktop" />
            <ContactButton label={t.header.contact} pathname={pathname} />
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher variant="mobile" />
            <MobileMenu onContactClick={handleContactClick} isScrolled={isScrolled} />
          </div>
        </div>
      </div>
    </header>
  );
});
