"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import Link from "next/link";
import {
  Building2,
  Mail,
  Phone,
  User,
  MapPin,
  Globe,
  Scale,
  ShieldAlert,
  FileText,
} from "lucide-react";

export default function ImpressumPage() {
  const { t } = useLanguage();
  const impressum = t.legal?.impressum;

  // Early return if legal content is not available
  if (!impressum) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Impressum</h1>
          <p className="text-muted-foreground">Content wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group"
          >
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
            {impressum.backToHome}
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            {impressum.title}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">{impressum.subtitle}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        <div className="space-y-8">
          {/* Company Name */}
          <section className="p-6 md:p-8 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
                  {impressum.sections.company.title}
                </h2>
                <p className="text-base md:text-lg font-medium text-foreground mb-2">
                  {impressum.sections.company.name}
                </p>
                <p className="text-sm md:text-base text-muted-foreground">
                  {impressum.sections.company.legalForm}
                </p>
              </div>
            </div>
          </section>

          {/* Address */}
          <section className="p-6 md:p-8 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  {impressum.sections.address.title}
                </h2>
                <address className="not-italic text-base text-muted-foreground leading-relaxed space-y-1">
                  <p>{impressum.sections.address.street}</p>
                  <p>{impressum.sections.address.city}</p>
                  <p>{impressum.sections.address.province}</p>
                  <p className="font-medium text-foreground mt-2">
                    {impressum.sections.address.country}
                  </p>
                </address>
              </div>
            </div>
          </section>

          {/* Representative */}
          <section className="p-6 md:p-8 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  {impressum.sections.representative.title}
                </h2>
                <p className="text-base md:text-lg font-medium text-foreground mb-1">
                  {impressum.sections.representative.name}
                </p>
                <p className="text-sm md:text-base text-muted-foreground">
                  {impressum.sections.representative.role}
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="p-6 md:p-8 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6">
                  {impressum.sections.contact.title}
                </h2>

                <div className="space-y-6">
                  {/* Vietnam HQ */}
                  <div className="pb-6 border-b border-border">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      {impressum.sections.contact.vietnamHQ}
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                        <a
                          href={`tel:${t.contact?.phone || "+84 251 6609 500"}`}
                          className="text-base text-foreground hover:text-primary transition-colors"
                        >
                          {t.contact?.phone || "+84 251 6609 500"}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                        <a
                          href={`mailto:${t.contact?.email || "contact@dmf.edu.vn"}`}
                          className="text-base text-foreground hover:text-primary transition-colors break-all"
                        >
                          {t.contact?.email || "contact@dmf.edu.vn"}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-primary flex-shrink-0" />
                        <a
                          href="https://dmf.edu.vn"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base text-foreground hover:text-primary transition-colors"
                        >
                          dmf.edu.vn
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* German Contact */}
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      {impressum?.sections?.contact?.germanContact ||
                        "Ihr Ansprechpartner für Deutschland"}
                    </p>
                    <p className="text-base font-medium text-foreground mb-3">
                      {t.contact?.de_name || "Herr Achim Betticher"}
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                        <a
                          href="tel:+84855070773"
                          className="text-base text-foreground hover:text-primary transition-colors"
                        >
                          +84 855 070773
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                        <a
                          href="mailto:achim.betticher@dmf.edu.vn"
                          className="text-base text-foreground hover:text-primary transition-colors"
                        >
                          achim.betticher@dmf.edu.vn
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Register Entry */}
          {impressum.sections.registerEntry && (
            <section className="p-6 md:p-8 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                    {impressum.sections.registerEntry.title}
                  </h2>
                  <div className="space-y-2">
                    <p className="text-base text-muted-foreground">
                      <span className="font-medium text-foreground">Registergericht:</span>{" "}
                      {impressum.sections.registerEntry.court}
                    </p>
                    <p className="text-base text-muted-foreground">
                      <span className="font-medium text-foreground">Registernummer:</span>{" "}
                      {impressum.sections.registerEntry.number}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* VAT ID */}
          {impressum.sections.vatId && (
            <section className="p-6 md:p-8 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                    {impressum.sections.vatId.title}
                  </h2>
                  <p className="text-base text-muted-foreground">
                    {impressum.sections.vatId.number}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Business Activity */}
          {impressum.sections.businessActivity && (
            <section className="p-6 md:p-8 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                    {impressum.sections.businessActivity.title}
                  </h2>
                  <p className="text-base text-muted-foreground">
                    {impressum.sections.businessActivity.description}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Responsible for Content (§ 55 Abs. 2 RStV) */}
          <section className="p-6 md:p-8 rounded-xl bg-muted/50 border border-border shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  {impressum.sections.responsibleContent.title}
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {impressum.sections.responsibleContent.description}
                </p>
              </div>
            </div>
          </section>

          {/* Dispute Resolution (Streitschlichtung) */}
          <section className="p-6 md:p-8 rounded-xl bg-muted/50 border border-border shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  {impressum.sections.disputeResolution.title}
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-4">
                  {impressum.sections.disputeResolution.description}
                </p>
                <a
                  href={impressum.sections.disputeResolution.platformLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-base text-primary hover:underline font-medium"
                >
                  <Globe className="h-4 w-4" />
                  {impressum.sections.disputeResolution.platformText}
                </a>
                <p className="text-sm text-muted-foreground mt-4 italic">
                  {impressum.sections.disputeResolution.disclaimer}
                </p>
              </div>
            </div>
          </section>

          {/* Liability Disclaimer */}
          <section className="p-6 md:p-8 rounded-xl bg-muted/50 border border-border shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                <ShieldAlert className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6">
                  {impressum.sections.liability.title}
                </h2>

                <div className="space-y-6">
                  {/* Content Liability */}
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">
                      {impressum.sections.liability.contentTitle}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {impressum.sections.liability.contentText}
                    </p>
                  </div>

                  {/* Links Liability */}
                  <div className="pt-4 border-t border-border">
                    <h3 className="text-lg font-medium text-foreground mb-3">
                      {impressum.sections.liability.linksTitle}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {impressum.sections.liability.linksText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Copyright */}
          <section className="p-6 md:p-8 rounded-xl bg-muted/50 border border-border shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  {impressum.sections.copyright.title}
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {impressum.sections.copyright.text}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Back to Home Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
          >
            {impressum.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
