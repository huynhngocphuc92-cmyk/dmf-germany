"use client";

import { useLanguage } from "@/lib/language-context";
import { motion } from "framer-motion";
import { Mail, Phone, Globe, User, Send, Building2, MapPin, Loader2 } from "lucide-react";
import Image from "next/image";
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
import { sendEmail } from "@/lib/actions";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ContactSectionProps {
  ctaBg?: string | null;
}

export const ContactSection = ({ ctaBg }: ContactSectionProps = {}) => {
  const { content, language } = useLanguage();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formRef.current) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(formRef.current);
      const result = await sendEmail(formData);
      
      if (result.success) {
        toast.success(language === "de" ? "Erfolgreich gesendet!" : "Gửi thành công!", {
          description: result.message,
          duration: 5000,
        });
        // Reset form after successful submission
        formRef.current.reset();
      } else {
        toast.error(language === "de" ? "Fehler beim Senden" : "Lỗi khi gửi", {
          description: result.message,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(language === "de" ? "Fehler" : "Lỗi", {
        description: language === "de" 
          ? "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut."
          : "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              {content.contact.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              {content.contact.title}
            </h2>
            {/* Decorative underline */}
            <div className="flex justify-center pt-2">
              <div className="w-16 md:w-24 h-1 md:h-1.5 bg-gradient-to-r from-primary to-accent rounded-full" />
            </div>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              {content.contact.description}
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
                  <CardTitle className="text-xl md:text-2xl">{content.contact.form.title}</CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    {content.contact.form.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
                  <form
                    ref={formRef}
                    className="space-y-4 md:space-y-6"
                    onSubmit={handleSubmit}
                  >
                    {/* Name & Email Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-1.5 md:space-y-2">
                        <label
                          htmlFor="name"
                          className="text-xs md:text-sm font-medium text-foreground"
                        >
                          {content.contact.form.nameLabel} *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder={content.contact.form.namePlaceholder}
                          required
                          disabled={isSubmitting}
                          className="h-10 md:h-12 text-sm md:text-base"
                        />
                      </div>
                      <div className="space-y-1.5 md:space-y-2">
                        <label
                          htmlFor="email"
                          className="text-xs md:text-sm font-medium text-foreground"
                        >
                          {content.contact.form.emailLabel} *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder={content.contact.form.emailPlaceholder}
                          required
                          disabled={isSubmitting}
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
                        {content.contact.form.companyLabel}
                      </label>
                      <Input
                        id="company"
                        name="company"
                        placeholder={content.contact.form.companyPlaceholder}
                        disabled={isSubmitting}
                        className="h-10 md:h-12 text-sm md:text-base"
                      />
                    </div>

                    {/* Message Field */}
                    <div className="space-y-1.5 md:space-y-2">
                      <label
                        htmlFor="message"
                        className="text-xs md:text-sm font-medium text-foreground"
                      >
                        {content.contact.form.messageLabel} *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder={content.contact.form.messagePlaceholder}
                        rows={4}
                        required
                        disabled={isSubmitting}
                        className="min-h-[120px] md:min-h-[140px] resize-none text-sm md:text-base"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full h-12 md:h-14 text-sm md:text-base font-medium gap-2 group"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {content.contact.form.sending}
                        </>
                      ) : (
                        <>
                          {content.contact.form.submitLabel}
                          <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
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
                        {content.contact.headquarters.title}
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        {content.contact.headquarters.location}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4 px-4 md:px-6 pb-4 md:pb-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <Phone className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                    <a
                      href={`tel:${content.contact.headquarters.phone}`}
                      className="text-sm md:text-base text-foreground hover:text-primary transition-colors"
                    >
                      {content.contact.headquarters.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4">
                    <Mail className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                    <a
                      href={`mailto:${content.contact.headquarters.email}`}
                      className="text-sm md:text-base text-foreground hover:text-primary transition-colors break-all"
                    >
                      {content.contact.headquarters.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4">
                    <Globe className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                    <a
                      href={`https://${content.contact.headquarters.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm md:text-base text-foreground hover:text-primary transition-colors"
                    >
                      {content.contact.headquarters.website}
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
                        {content.contact.germanContact.title}
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        {content.contact.germanContact.name}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4 px-4 md:px-6 pb-4 md:pb-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <Phone className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                    <a
                      href={`tel:${content.contact.germanContact.phone}`}
                      className="text-sm md:text-base text-foreground hover:text-accent transition-colors"
                    >
                      {content.contact.germanContact.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4">
                    <Mail className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                    <a
                      href={`mailto:${content.contact.germanContact.email}`}
                      className="text-sm md:text-base text-foreground hover:text-accent transition-colors break-all"
                    >
                      {content.contact.germanContact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm md:text-base text-foreground">Deutschland 🇩🇪</span>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Card */}
              <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5 overflow-hidden relative">
                {ctaBg && ctaBg.trim() !== "" ? (
                  <div className="absolute inset-0 opacity-10">
                    <Image
                      src={ctaBg}
                      alt="CTA Background"
                      fill
                      className="object-cover"
                      unoptimized={ctaBg.startsWith("http")}
                    />
                  </div>
                ) : (
                  // Fallback: Gradient background nếu không có ảnh
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                )}
                <CardContent className="p-4 md:p-6 relative z-10">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="p-2 md:p-3 rounded-full bg-accent/20 flex-shrink-0">
                      <span className="text-xl md:text-2xl">💼</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm md:text-base mb-1 md:mb-2">
                        {content.contact.cta.title}
                      </h4>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                        {content.contact.cta.description}
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
