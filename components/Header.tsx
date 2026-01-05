"use client";

import { useLanguage } from "@/lib/language-context";
import {
  Menu,
  Download,
  GraduationCap,
  Briefcase,
  Sun,
  ChevronDown,
  Home,
  Users,
  Phone,
  X,
  ChevronRight,
  Newspaper,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
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
// DESKTOP NAVIGATION LINK COMPONENT
// ============================================

interface ListItemProps {
  service: ServiceItem;
  language: "de" | "vn";
}

function ListItem({ service, language }: ListItemProps) {
  const Icon = service.icon;
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={service.href}
          className={cn(
            "block select-none rounded-xl p-4 no-underline outline-none transition-all duration-200",
            service.bgColor,
            "border",
            service.borderColor,
            "focus:shadow-md"
          )}
        >
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                service.bgColor,
                "border",
                service.borderColor
              )}
            >
              <Icon className={cn("w-6 h-6", service.color)} />
            </div>
            <div className="flex-1">
              <div className={cn("text-base font-semibold mb-1", service.color)}>
                {language === "de" ? service.titleDe : service.titleVn}
              </div>
              <p className="text-sm text-muted-foreground leading-snug">
                {language === "de" ? service.descDe : service.descVn}
              </p>
            </div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

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
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </Link>
  );
}

// ============================================
// MAIN HEADER COMPONENT
// ============================================

export const Header = () => {
  const { language, setLanguage, content } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const nav = language === "de" ? navContent.de : navContent.vn;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if current path is active
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Check if any solution is active
  const isSolutionActive = serviceSolutions.some((s) => pathname.startsWith(s.href));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b shadow-sm"
          : "bg-background/50 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl md:text-2xl font-bold tracking-tight text-primary transition-colors group-hover:text-primary/80">
            {content.header.logo}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="gap-1">
            {/* Home */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent",
                    isActive("/") && "text-primary font-semibold"
                  )}
                >
                  <Home className="w-4 h-4 mr-2" />
                  {nav.home}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Solutions Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  "bg-transparent",
                  isSolutionActive && "text-primary font-semibold"
                )}
              >
                <Users className="w-4 h-4 mr-2" />
                {nav.solutions}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[450px] gap-3 p-4">
                  {serviceSolutions.map((service) => (
                    <ListItem
                      key={service.href}
                      service={service}
                      language={language}
                    />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Blog */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/blog"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent",
                    isActive("/blog") && "text-primary font-semibold"
                  )}
                >
                  <Newspaper className="w-4 h-4 mr-2" />
                  {nav.blog}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* About */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/#about"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent"
                  )}
                >
                  {nav.about}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Side - Language Toggle & Contact Button (Desktop) */}
        <div className="hidden lg:flex items-center gap-3">
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
          <Button asChild className="px-5 gap-2">
            <Link href="/#contact">
              <Phone className="w-4 h-4" />
              {nav.contact}
            </Link>
          </Button>
        </div>

        {/* Mobile - Language Toggle & Hamburger Menu */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Language Toggle - Mobile (compact) */}
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
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl font-bold text-primary"
                >
                  {content.header.logo}
                </Link>
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col h-[calc(100vh-80px)] overflow-y-auto">
                <nav className="flex-1 px-4 py-6">
                  {/* Home */}
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-colors",
                      isActive("/")
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground/80 hover:bg-muted"
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
                        : "text-foreground/80 hover:bg-muted"
                    )}
                  >
                    <Newspaper className="w-5 h-5" />
                    {nav.blog}
                  </Link>

                  {/* About */}
                  <Link
                    href="/#about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/80 hover:bg-muted transition-colors"
                  >
                    <Users className="w-5 h-5" />
                    {nav.about}
                  </Link>
                </nav>

                {/* Mobile Actions */}
                <div className="px-4 py-6 border-t bg-muted/30 space-y-3">
                  {/* Download Profile Button */}
                  <Button variant="outline" asChild className="w-full justify-start gap-2">
                    <a
                      href="/DMF Vietnam Handbuch.pdf"
                      download="DMF_Vietnam_Unternehmensprofil.pdf"
                    >
                      <Download className="h-4 w-4" />
                      {nav.downloadProfile}
                    </a>
                  </Button>

                  {/* Contact Button */}
                  <Button
                    asChild
                    className="w-full gap-2"
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
    </header>
  );
};
