import { siteContent } from "@/config/site-content";
import Link from "next/link";
import { Mail, Phone, Globe, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="border-t bg-primary/5">
      <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-xl md:text-2xl font-bold tracking-tight text-primary">
                {siteContent.footer.companyName}
              </span>
            </Link>
            <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">
              {siteContent.footer.tagline}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground italic">
              {siteContent.footer.closing}
            </p>
            
            {/* Download Profile Button */}
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-2"
              >
                <a
                  href="/DMF Vietnam Handbuch.pdf"
                  download="DMF_Vietnam_Unternehmensprofil.pdf"
                >
                  <Download className="h-4 w-4" />
                  Unternehmensprofil herunterladen
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs md:text-sm font-semibold text-foreground uppercase tracking-wider">
              {siteContent.footer.quickLinks.title}
            </h4>
            <ul className="space-y-2 md:space-y-3 text-sm text-muted-foreground">
              {siteContent.footer.quickLinks.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-xs md:text-sm font-semibold text-foreground uppercase tracking-wider">
              Kontakt
            </h4>
            <ul className="space-y-2 md:space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a
                  href={`mailto:${siteContent.contact.headquarters.email}`}
                  className="hover:text-primary transition-colors break-all"
                >
                  {siteContent.contact.headquarters.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a
                  href={`tel:${siteContent.contact.headquarters.phone}`}
                  className="hover:text-primary transition-colors"
                >
                  {siteContent.contact.headquarters.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary flex-shrink-0" />
                <a
                  href={`https://${siteContent.contact.headquarters.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {siteContent.contact.headquarters.website}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs md:text-sm text-muted-foreground text-center sm:text-left">
            {siteContent.footer.copyright}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
            <Link
              href="/impressum"
              className="hover:text-primary transition-colors"
            >
              {siteContent.footer.links.legal}
            </Link>
            <Link
              href="/datenschutz"
              className="hover:text-primary transition-colors"
            >
              {siteContent.footer.links.privacy}
            </Link>
            <span className="text-muted-foreground/50">🇻🇳 ↔ 🇩🇪</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
