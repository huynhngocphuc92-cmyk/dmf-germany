"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import Link from "next/link";
import { Shield, Cookie, Mail, Database, Lock, Eye, FileCheck, AlertCircle } from "lucide-react";

export default function DatenschutzPage() {
  const { t } = useLanguage();
  const datenschutz = t.legal?.datenschutz;

  // Early return if legal content is not available
  if (!datenschutz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Datenschutz</h1>
          <p className="text-muted-foreground">Content wird geladen...</p>
        </div>
      </div>
    );
  }

  const sections = [
    {
      icon: Shield,
      title: datenschutz.sections.overview.title,
      subsections: [
        {
          subtitle: datenschutz.sections.overview.generalTitle,
          text: datenschutz.sections.overview.generalText,
        },
        {
          subtitle: datenschutz.sections.overview.responsibleTitle,
          text: datenschutz.sections.overview.responsibleText,
        },
      ],
    },
    {
      icon: Database,
      title: datenschutz.sections.dataCollection.title,
      subsections: [
        {
          subtitle: datenschutz.sections.dataCollection.whoTitle,
          text: datenschutz.sections.dataCollection.whoText,
        },
        {
          subtitle: datenschutz.sections.dataCollection.howTitle,
          text: datenschutz.sections.dataCollection.howText,
        },
        {
          subtitle: datenschutz.sections.dataCollection.purposeTitle,
          text: datenschutz.sections.dataCollection.purposeText,
        },
      ],
    },
    {
      icon: Cookie,
      title: datenschutz.sections.cookies.title,
      subsections: [
        {
          subtitle: datenschutz.sections.cookies.whatTitle,
          text: datenschutz.sections.cookies.whatText,
        },
        {
          subtitle: datenschutz.sections.cookies.whichTitle,
          text: datenschutz.sections.cookies.whichText,
        },
        {
          subtitle: datenschutz.sections.cookies.typesTitle,
          text: datenschutz.sections.cookies.typesText,
        },
      ],
    },
    {
      icon: Mail,
      title: datenschutz.sections.contactForm.title,
      highlight: true,
      subsections: [
        {
          subtitle: datenschutz.sections.contactForm.processingTitle,
          text: datenschutz.sections.contactForm.processingText,
        },
        {
          subtitle: datenschutz.sections.contactForm.legalBasisTitle,
          text: datenschutz.sections.contactForm.legalBasisText,
        },
        {
          subtitle: datenschutz.sections.contactForm.storageTitle,
          text: datenschutz.sections.contactForm.storageText,
        },
        {
          subtitle: datenschutz.sections.contactForm.nodemailerTitle,
          text: datenschutz.sections.contactForm.nodemailerText,
          important: true,
        },
      ],
    },
    {
      icon: FileCheck,
      title: datenschutz.sections.rights.title,
      subsections: [
        {
          subtitle: datenschutz.sections.rights.informationTitle,
          text: datenschutz.sections.rights.informationText,
        },
        {
          subtitle: datenschutz.sections.rights.rectificationTitle,
          text: datenschutz.sections.rights.rectificationText,
        },
        {
          subtitle: datenschutz.sections.rights.erasureTitle,
          text: datenschutz.sections.rights.erasureText,
        },
        {
          subtitle: datenschutz.sections.rights.restrictionTitle,
          text: datenschutz.sections.rights.restrictionText,
        },
        {
          subtitle: datenschutz.sections.rights.portabilityTitle,
          text: datenschutz.sections.rights.portabilityText,
        },
        {
          subtitle: datenschutz.sections.rights.objectionTitle,
          text: datenschutz.sections.rights.objectionText,
        },
        {
          subtitle: datenschutz.sections.rights.complaintTitle,
          text: datenschutz.sections.rights.complaintText,
        },
      ],
    },
    {
      icon: Lock,
      title: datenschutz.sections.ssl.title,
      subsections: [
        {
          subtitle: "",
          text: datenschutz.sections.ssl.text,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
          <Link 
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group"
          >
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
            {datenschutz.backToHome}
          </Link>
          <div className="flex items-start gap-4 mb-4">
            <div className="p-4 rounded-xl bg-primary/10 flex-shrink-0">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 tracking-tight">
                {datenschutz.title}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mb-2">
                {datenschutz.subtitle}
              </p>
              <p className="text-sm text-muted-foreground/80 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {datenschutz.lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
        <div className="space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <section 
                key={index}
                className={`p-6 md:p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow ${
                  section.highlight 
                    ? 'bg-primary/5 border-primary/20' 
                    : 'bg-card border-border'
                }`}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${
                    section.highlight ? 'bg-primary/20' : 'bg-primary/10'
                  }`}>
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-semibold text-foreground pt-2">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-6 ml-0 md:ml-14">
                  {section.subsections.map((subsection, idx) => {
                    const isImportant = 'important' in subsection && subsection.important;
                    return (
                      <div 
                        key={idx}
                        className={`${
                          isImportant 
                            ? 'p-4 rounded-lg bg-accent/10 border border-accent/30' 
                            : ''
                        }`}
                      >
                        {subsection.subtitle && (
                          <div className="flex items-start gap-2 mb-3">
                            {isImportant && (
                              <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                            )}
                            <h3 className="text-lg font-medium text-foreground">
                              {subsection.subtitle}
                            </h3>
                          </div>
                        )}
                        <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                          {subsection.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {/* Contact Information Card */}
          <section className="p-6 md:p-8 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/20 flex-shrink-0">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {t.contact?.title || "Kontakt"}
                </h3>
                <p className="text-base text-muted-foreground mb-4">
                  {t.contact?.subtitle || "Kontaktieren Sie uns für weitere Informationen."}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`mailto:${t.contact?.email || "contact@dmf.edu.vn"}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    {t.contact?.email || "contact@dmf.edu.vn"}
                  </a>
                  <a
                    href="/impressum"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
                  >
                    <FileCheck className="h-4 w-4" />
                    {t.footer?.impressum || "Impressum"}
                  </a>
                </div>
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
            {datenschutz.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
