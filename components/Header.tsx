"use client";

import { useLanguage } from "@/lib/language-context";
import {
  Menu,
  Download,
  GraduationCap,
  Briefcase,
  Sun,
  Home,
  Users,
  Phone,
  Mail,
  Newspaper,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// ============================================
// SERVICE SOLUTIONS DATA
// ============================================

interface ServiceItem {
  titleDe: string;
  titleVn: string;
  descDe: string;
  descVn: string;
  href: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}

const serviceSolutions: ServiceItem[] = [
  {
    titleDe: "Auszubildende",
    titleVn: "Du học nghề",
    descDe: "Duale Ausbildung & Langfristige Bindung",
    descVn: "Đào tạo kép & Gắn bó lâu dài",
    href: "/services/azubi",
    icon: GraduationCap,
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100",
    borderColor: "border-blue-200",
  },
  {
    titleDe: "Fachkräfte",
    titleVn: "Nhân sự chuyên môn",
    descDe: "Qualifizierte Experten (Visa §18a/b)",
    descVn: "Chuyên gia có trình độ (Visa §18a/b)",
    href: "/services/skilled-workers",
    icon: Briefcase,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 hover:bg-emerald-100",
    borderColor: "border-emerald-200",
  },
  {
    titleDe: "Saisonkräfte",
    titleVn: "Lao động thời vụ",
    descDe: "Flexible Unterstützung für die Saison",
    descVn: "Hỗ trợ linh hoạt cho mùa vụ",
    href: "/services/seasonal",
    icon: Sun,
    color: "text-amber-600",
    bgColor: "bg-amber-50 hover:bg-amber-100",
    borderColor: "border-amber-200",
  },
];

// ============================================
// NAVIGATION CONTENT
// ============================================

const navContent = {
  de: {
    home: "Startseite",
    solutions: "Lösungen",
    blog: "Blog",
    about: "Über uns",
    contact: "Kontakt",
    downloadProfile: "Unternehmensprofil (PDF)",
    menuLabel: "Menü öffnen",
    closeMenu: "Menü schließen",
  },
  vn: {
    home: "Trang chủ",
    solutions: "Giải pháp",
    blog: "Tin tức",
    about: "Về chúng tôi",
    contact: "Liên hệ",
    downloadProfile: "Hồ sơ năng lực (PDF)",
    menuLabel: "Mở menu",
    closeMenu: "Đóng menu",
  },
};

// ============================================
// MOBILE SERVICE LINK COMPONENT
// ============================================

interface MobileServiceLinkProps {
  service: ServiceItem;
  language: "de" | "vn";
  onClose: () => void;
}

function MobileServiceLink({ service, language, onClose }: MobileServiceLinkProps) {
  const Icon = service.icon;
  return (
    <Link
      href={service.href}
      onClick={onClose}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
        service.bgColor,
        "border",
        service.borderColor
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          "bg-white border",
          service.borderColor
        )}
      >
        <Icon className={cn("w-5 h-5", service.color)} />
      </div>
      <div className="flex-1">
        <div className={cn("font-medium", service.color)}>
          {language === "de" ? service.titleDe : service.titleVn}
        </div>
        <p className="text-xs text-muted-foreground">
          {language === "de" ? service.descDe : service.descVn}
        </p>
      </div>
    </Link>
  );
}

// ============================================
// MAIN HEADER COMPONENT
// ============================================

interface HeaderProps {
  logoUrl?: string | null;
  hotline?: string | null;
  email?: string | null;
}

export const Header = ({ logoUrl, hotline, email }: HeaderProps = {}) => {
  const { language, setLanguage, content } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const nav = language === "de" ? navContent.de : navContent.vn;

  // ============================================
  // LOGIC RENDER - CHỈ HIỂN THỊ MỘT GIÁ TRỊ
  // Conditional Rendering chặt chẽ: Nếu có DB value thì dùng, không thì dùng default
  // ============================================
  const displayHotline = hotline || "+84 85 507 0773";
  const displayEmail = email || "contact@dmf.edu.vn";

  // ============================================
  // SCROLL TRACKING
  // ============================================
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isScrolled = scrollY > 20;
  const shouldHideTopBar = isScrolled;

  // ============================================
  // ACTIVE ROUTE CHECKING
  // ============================================
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isSolutionActive = serviceSolutions.some((s) => pathname.startsWith(s.href));

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300">
      {/* Top Bar - Ẩn khi scroll > 20px với hiệu ứng mượt mà */}
      <div
        className={cn(
          "bg-primary text-white flex items-center justify-between px-4 transition-all duration-500 ease-in-out",
          shouldHideTopBar ? "h-0 opacity-0 overflow-hidden" : "h-10 opacity-100"
        )}
      >
        <div className="container mx-auto flex items-center justify-center md:justify-start px-4 lg:px-8 h-full">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Hotline - CHỈ RENDER MỘT LẦN DUY NHẤT */}
            <a
              href={`tel:${displayHotline.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 hover:text-primary-foreground/80 transition-colors text-xs md:text-sm"
            >
              <Phone className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs md:text-sm">
                {displayHotline}
              </span>
            </a>
            {/* Email - CHỈ RENDER MỘT LẦN DUY NHẤT */}
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
          {/* Logo - Trái */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Logo
              logoUrl={logoUrl}
              fallbackText={content.header.logo}
              className="h-12 w-auto object-contain"
              height={48}
            />
          </Link>

          {/* Desktop Navigation - Giữa */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
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
              {nav.home}
            </Link>

            {/* Solutions - Simple Dropdown với CSS group-hover */}
            {/* Group chỉ ở div nhỏ bao quanh button, không phải container lớn */}
            <div className="relative">
              <div className="group inline-block">
                <button
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 relative",
                    "hover:text-primary",
                    "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full",
                    isSolutionActive && "text-primary font-semibold after:w-full"
                  )}
                >
                  <Users className="w-4 h-4 inline-block mr-2" />
                  {nav.solutions}
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                
                {/* Dropdown Menu - Trạng thái mặc định: Ẩn hoàn toàn */}
                <div className="absolute top-[100%] left-1/2 -translate-x-1/2 mt-2 w-96 bg-white rounded-lg shadow-lg border border-border z-50 opacity-0 invisible pointer-events-none translate-y-2 transition-all duration-200 ease-in-out group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0">
                <div className="p-4 space-y-2">
                  {serviceSolutions.map((service) => {
                    const Icon = service.icon;
                    return (
                      <Link
                        key={service.href}
                        href={service.href}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border transition-all",
                          "hover:shadow-md",
                          service.bgColor,
                          service.borderColor
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                            "bg-white border",
                            service.borderColor
                          )}
                        >
                          <Icon className={cn("w-5 h-5", service.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={cn("text-sm font-semibold mb-1", service.color)}>
                            {language === "de" ? service.titleDe : service.titleVn}
                          </div>
                          <p className="text-xs text-muted-foreground leading-snug">
                            {language === "de" ? service.descDe : service.descVn}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
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
              {nav.blog}
            </Link>

            {/* About */}
            <Link
              href="/#about"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors relative",
                "hover:text-primary",
                "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              )}
            >
              {nav.about}
            </Link>
          </nav>

          {/* Right Side - Language Toggle & Contact Button (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {/* Language Toggle */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50 border border-border">
              <button
                onClick={() => setLanguage("de")}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                  language === "de"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                DE
              </button>
              <button
                onClick={() => setLanguage("vn")}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                  language === "vn"
                    ? "bg-accent text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                VN
              </button>
            </div>

            {/* Contact Button */}
            <Button
              asChild
              className="bg-primary text-white hover:bg-primary/90 hover:shadow-lg transition-transform active:scale-95"
            >
              <Link href="/#contact" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="font-semibold">{nav.contact}</span>
              </Link>
            </Button>
          </div>

          {/* Mobile - Language Toggle & Hamburger Menu */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Language Toggle - Mobile */}
            <div className="flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-muted/50 border border-border">
              <button
                onClick={() => setLanguage("de")}
                className={cn(
                  "px-2 py-1 rounded-full text-[10px] font-semibold transition-all",
                  language === "de"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                )}
              >
                DE
              </button>
              <button
                onClick={() => setLanguage("vn")}
                className={cn(
                  "px-2 py-1 rounded-full text-[10px] font-semibold transition-all",
                  language === "vn"
                    ? "bg-accent text-white"
                    : "text-muted-foreground"
                )}
              >
                VN
              </button>
            </div>

            {/* Sheet Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{nav.menuLabel}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[380px] p-0">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center"
                  >
                    <Logo
                      logoUrl={logoUrl}
                      fallbackText={content.header.logo}
                      height={36}
                    />
                  </Link>
                </div>

                {/* Mobile Contact Info */}
                <div className="px-6 py-4 border-b bg-muted/30">
                  <div className="space-y-2">
                    <a
                      href={`tel:${displayHotline.replace(/\s/g, "")}`}
                      className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{displayHotline}</span>
                    </a>
                    <a
                      href={`mailto:${displayEmail}`}
                      className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{displayEmail}</span>
                    </a>
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex flex-col h-[calc(100vh-200px)] overflow-y-auto">
                  <nav className="flex-1 px-4 py-6">
                    {/* Home */}
                    <Link
                      href="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-colors",
                        isActive("/")
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground/80 hover:bg-muted hover:text-primary"
                      )}
                    >
                      <Home className="w-5 h-5" />
                      {nav.home}
                    </Link>

                    {/* Solutions Accordion */}
                    <Accordion type="single" collapsible className="mb-2">
                      <AccordionItem value="solutions" className="border-0">
                        <AccordionTrigger
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted hover:no-underline [&[data-state=open]]:bg-muted",
                            isSolutionActive && "text-primary font-semibold"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5" />
                            {nav.solutions}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-0">
                          <div className="space-y-2 pl-2">
                            {serviceSolutions.map((service) => (
                              <MobileServiceLink
                                key={service.href}
                                service={service}
                                language={language}
                                onClose={() => setIsMobileMenuOpen(false)}
                              />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    {/* Blog */}
                    <Link
                      href="/blog"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-colors",
                        isActive("/blog")
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground/80 hover:bg-muted hover:text-primary"
                      )}
                    >
                      <Newspaper className="w-5 h-5" />
                      {nav.blog}
                    </Link>

                    {/* About */}
                    <Link
                      href="/#about"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/80 hover:bg-muted hover:text-primary transition-colors"
                    >
                      <Users className="w-5 h-5" />
                      {nav.about}
                    </Link>
                  </nav>

                  {/* Mobile Actions */}
                  <div className="px-4 py-6 border-t bg-muted/30 space-y-3 mt-auto">
                    {/* Download Profile Button */}
                    <Button variant="outline" asChild className="w-full justify-start gap-2">
                      <a
                        href="/DMF Vietnam Handbuch.pdf"
                        download="DMF_Vietnam_Unternehmensprofil.pdf"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Download className="h-4 w-4" />
                        {nav.downloadProfile}
                      </a>
                    </Button>

                    {/* Contact Button */}
                    <Button
                      asChild
                      className="w-full gap-2 bg-primary text-white hover:bg-primary/90 hover:shadow-lg transition-transform active:scale-95"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/#contact">
                        <Phone className="w-4 h-4" />
                        {nav.contact}
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
