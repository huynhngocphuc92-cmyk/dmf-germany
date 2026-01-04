"use client";

import { siteContent } from "@/config/site-content";
import { motion } from "framer-motion";
import { Mail, Phone, Globe, User, Send, Building2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ContactSection = () => {
  return (
    <section id="contact" className="py-16 md:py-28 lg:py-36 bg-muted/20 relative overflow-hidden">
      {/* Background decorations - Hidden on mobile for performance */}
      <div className="hidden md:block absolute top-20 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="hidden md:block absolute bottom-20 left-0 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 md:space-y-6 mb-12 md:mb-20"
          >
            <span className="inline-block px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium">
              Jetzt Kontakt aufnehmen
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              {siteContent.contact.title}
            </h2>
            {/* Decorative underline */}
            <div className="flex justify-center pt-2">
              <div className="w-16 md:w-24 h-1 md:h-1.5 bg-gradient-to-r from-primary to-accent rounded-full" />
            </div>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              {siteContent.contact.description}
            </p>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            {/* Left Column - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="pb-4 md:pb-6 px-4 md:px-6 pt-4 md:pt-6">
                  <CardTitle className="text-xl md:text-2xl">Nachricht senden</CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Füllen Sie das Formular aus und wir melden uns zeitnah bei Ihnen.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
                  <form
                    className="space-y-4 md:space-y-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      // Form submission logic
                    }}
                  >
                    {/* Name & Email Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-1.5 md:space-y-2">
                        <label
                          htmlFor="name"
                          className="text-xs md:text-sm font-medium text-foreground"
                        >
                          {siteContent.contact.form.nameLabel} *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder={siteContent.contact.form.namePlaceholder}
                          required
                          className="h-10 md:h-12 text-sm md:text-base"
                        />
                      </div>
                      <div className="space-y-1.5 md:space-y-2">
                        <label
                          htmlFor="email"
                          className="text-xs md:text-sm font-medium text-foreground"
                        >
                          {siteContent.contact.form.emailLabel} *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder={siteContent.contact.form.emailPlaceholder}
                          required
                          className="h-10 md:h-12 text-sm md:text-base"
                        />
                      </div>
                    </div>

                    {/* Company Field */}
                    <div className="space-y-1.5 md:space-y-2">
                      <label
                        htmlFor="company"
                        className="text-xs md:text-sm font-medium text-foreground"
                      >
                        {siteContent.contact.form.companyLabel}
                      </label>
                      <Input
                        id="company"
                        name="company"
                        placeholder={siteContent.contact.form.companyPlaceholder}
                        className="h-10 md:h-12 text-sm md:text-base"
                      />
                    </div>

                    {/* Message Field */}
                    <div className="space-y-1.5 md:space-y-2">
                      <label
                        htmlFor="message"
                        className="text-xs md:text-sm font-medium text-foreground"
                      >
                        {siteContent.contact.form.messageLabel} *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder={siteContent.contact.form.messagePlaceholder}
                        rows={4}
                        required
                        className="min-h-[120px] md:min-h-[140px] resize-none text-sm md:text-base"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-12 md:h-14 text-sm md:text-base font-medium gap-2 group"
                    >
                      {siteContent.contact.form.submitLabel}
                      <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4 md:space-y-8"
            >
              {/* Vietnam Headquarters */}
              <Card className="border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="pb-3 md:pb-4 px-4 md:px-6 pt-4 md:pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-primary/10 group-hover:bg-primary transition-colors duration-300 flex-shrink-0">
                      <Building2 className="h-5 w-5 md:h-6 md:w-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <CardTitle className="text-base md:text-lg">
                        {siteContent.contact.headquarters.title}
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm">Đồng Nai, Vietnam</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4 px-4 md:px-6 pb-4 md:pb-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <Phone className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                    <a
                      href={`tel:${siteContent.contact.headquarters.phone}`}
                      className="text-sm md:text-base text-foreground hover:text-primary transition-colors"
                    >
                      {siteContent.contact.headquarters.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4">
                    <Mail className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                    <a
                      href={`mailto:${siteContent.contact.headquarters.email}`}
                      className="text-sm md:text-base text-foreground hover:text-primary transition-colors break-all"
                    >
                      {siteContent.contact.headquarters.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4">
                    <Globe className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                    <a
                      href={`https://${siteContent.contact.headquarters.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm md:text-base text-foreground hover:text-primary transition-colors"
                    >
                      {siteContent.contact.headquarters.website}
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* German Contact */}
              <Card className="border-border/50 hover:border-accent/30 hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="pb-3 md:pb-4 px-4 md:px-6 pt-4 md:pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-accent/10 group-hover:bg-accent transition-colors duration-300 flex-shrink-0">
                      <User className="h-5 w-5 md:h-6 md:w-6 text-accent group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <CardTitle className="text-base md:text-lg">
                        {siteContent.contact.germanContact.title}
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        {siteContent.contact.germanContact.name}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4 px-4 md:px-6 pb-4 md:pb-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <Phone className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                    <a
                      href={`tel:${siteContent.contact.germanContact.phone}`}
                      className="text-sm md:text-base text-foreground hover:text-accent transition-colors"
                    >
                      {siteContent.contact.germanContact.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4">
                    <Mail className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                    <a
                      href={`mailto:${siteContent.contact.germanContact.email}`}
                      className="text-sm md:text-base text-foreground hover:text-accent transition-colors break-all"
                    >
                      {siteContent.contact.germanContact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm md:text-base text-foreground">Deutschland 🇩🇪</span>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Card */}
              <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="p-2 md:p-3 rounded-full bg-accent/20 flex-shrink-0">
                      <span className="text-xl md:text-2xl">💼</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm md:text-base mb-1 md:mb-2">
                        Fachkräfte gesucht?
                      </h4>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                        Wir helfen Ihnen, qualifizierte vietnamesische Fachkräfte für
                        Ihr Unternehmen zu finden.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
