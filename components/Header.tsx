"use client";

import { useLanguage } from "@/lib/language-context";
import { Menu, Download } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export const Header = () => {
  const { language, setLanguage, content } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tách navItems để nút Kontakt riêng biệt
  const regularNavItems = content.header.navItems.filter(
    (item) => item.href !== "#contact"
  );
  const contactItem = content.header.navItems.find(
    (item) => item.href === "#contact"
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl md:text-2xl font-bold tracking-tight text-primary transition-colors group-hover:text-primary/80">
            {content.header.logo}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {regularNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium text-foreground/70 transition-colors hover:text-foreground after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side - Language Toggle & Contact Button (Desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language Toggle */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50 border border-border">
            <button
              onClick={() => setLanguage("de")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                language === "de"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              DE
            </button>
            <button
              onClick={() => setLanguage("vn")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                language === "vn"
                  ? "bg-accent text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              VN
            </button>
          </div>

          {/* Contact Button */}
          {contactItem && (
            <Button asChild className="px-5">
              <Link href={contactItem.href}>{contactItem.label}</Link>
            </Button>
          )}
        </div>

        {/* Mobile - Language Toggle & Hamburger Menu */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Language Toggle - Mobile (compact) */}
          <div className="flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-muted/50 border border-border">
            <button
              onClick={() => setLanguage("de")}
              className={`px-2 py-1 rounded-full text-[10px] font-semibold transition-all ${
                language === "de"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              DE
            </button>
            <button
              onClick={() => setLanguage("vn")}
              className={`px-2 py-1 rounded-full text-[10px] font-semibold transition-all ${
                language === "vn"
                  ? "bg-accent text-white"
                  : "text-muted-foreground"
              }`}
            >
              VN
            </button>
          </div>

          {/* Sheet Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{language === "de" ? "Menü öffnen" : "Mở menu"}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <SheetHeader className="text-left pb-6 border-b">
                <SheetTitle className="text-xl font-bold text-primary">
                  {content.header.logo}
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-1 py-6">
                {regularNavItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center px-4 py-3 text-base font-medium text-foreground/80 rounded-lg hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="flex flex-col gap-3 pt-4 border-t">
                {/* Download Profile Button */}
                <Button variant="outline" asChild className="w-full justify-start gap-2">
                  <a
                    href="/DMF Vietnam Handbuch.pdf"
                    download="DMF_Vietnam_Unternehmensprofil.pdf"
                  >
                    <Download className="h-4 w-4" />
                    {content.hero.downloadProfile}
                  </a>
                </Button>

                {/* Contact Button */}
                {contactItem && (
                  <SheetClose asChild>
                    <Button asChild className="w-full">
                      <Link href={contactItem.href}>{contactItem.label}</Link>
                    </Button>
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
