"use client";

import { trackEvent } from "@/components/analytics/GoogleAnalytics";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { GERMANY_CONTACT, VIETNAM_OFFICE_CONTACT } from "@/lib/company/contact";
import { useSubmissionKey } from "@/lib/intake/client";
import { currentRequestContext } from "@/lib/intake/context";
import { contactFormSchema, type ContactFormData } from "@/lib/validations/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Loader2, Mail, MapPin, Phone, Send, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ContactSection() {
  const { t, lang } = useLanguage();
  const { forPayload: submissionKey, reset: resetSubmissionKey } = useSubmissionKey();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const copy =
    lang === "en"
      ? {
          title: t.contact?.title || "Contact Us",
          thankYou: "Thank you!",
          savedMsg: "Your inquiry has been saved. Our team will get back to you shortly.",
          newMsg: "Send another message",
          nameLabel: t.contact?.label_name || "Name *",
          namePlaceholder: t.contact?.placeholder_name || "Your Name",
          emailLabel: t.contact?.label_email || "Email *",
          emailPlaceholder: t.contact?.placeholder_email || "your.email@company.com",
          phoneLabel: t.contact?.info_phone || "Phone / Mobile",
          phonePlaceholder: "+49 123 45678",
          companyLabel: t.contact?.label_company || "Company",
          companyPlaceholder: t.contact?.placeholder_company || "Your Company GmbH",
          messageLabel: t.contact?.label_message || "Message *",
          messagePlaceholder:
            t.contact?.placeholder_message || "How can we support your staffing needs?",
          privacyPrefix: "I agree to the processing of my data in accordance with the ",
          privacyLink: "Privacy Policy",
          privacySuffix: ". *",
          submitBtn: t.contact?.btn_submit || "Send Message",
          errorMsg: t.contact?.error_message || "Error sending message. Please try again later.",
          badge1: "Compliant with FEG & §§ 296, 297 SGB III",
          badge2: "Free initial consultation",
          badge3: "Response within 24 hours",
          vnOfficeTitle: t.contact?.vn_office || "Headquarters in Vietnam",
          deContactTitle: t.contact?.de_office || "Your Contact for Germany",
        }
      : lang === "vn"
        ? {
            title: t.contact?.title || "Liên hệ với chúng tôi",
            thankYou: "Cảm ơn Quý khách!",
            savedMsg: "Yêu cầu của bạn đã được ghi nhận. Đội ngũ của chúng tôi sẽ sớm phản hồi.",
            newMsg: "Gửi tin nhắn mới",
            nameLabel: t.contact?.label_name || "Họ và tên *",
            namePlaceholder: t.contact?.placeholder_name || "Họ và tên của bạn",
            emailLabel: t.contact?.label_email || "Email *",
            emailPlaceholder: t.contact?.placeholder_email || "email@congty.de",
            phoneLabel: t.contact?.info_phone || "Số điện thoại",
            phonePlaceholder: "+49 123 45678",
            companyLabel: t.contact?.label_company || "Doanh nghiệp / Tổ chức",
            companyPlaceholder: t.contact?.placeholder_company || "Tên doanh nghiệp GmbH",
            messageLabel: t.contact?.label_message || "Nội dung *",
            messagePlaceholder:
              t.contact?.placeholder_message || "Chúng tôi có thể hỗ trợ gì cho Quý vị?",
            privacyPrefix: "Tôi đồng ý với việc xử lý dữ liệu cá nhân theo ",
            privacyLink: "Chính sách bảo mật",
            privacySuffix: ". *",
            submitBtn: t.contact?.btn_submit || "Gửi tin nhắn",
            errorMsg: t.contact?.error_message || "Đã xảy ra lỗi khi gửi. Vui lòng thử lại sau.",
            badge1: "Tuân thủ FEG & §§ 296, 297 SGB III",
            badge2: "Tư vấn ban đầu miễn phí",
            badge3: "Phản hồi trong 24 giờ",
            vnOfficeTitle: t.contact?.vn_office || "Trụ sở chính tại Việt Nam",
            deContactTitle: t.contact?.de_office || "Đại diện liên hệ tại CHLB Đức",
          }
        : {
            title: t.contact?.title || "Kontaktieren Sie uns",
            thankYou: "Vielen Dank!",
            savedMsg: "Ihre Anfrage wurde gespeichert. Unser Team meldet sich bei Ihnen.",
            newMsg: "Neue Nachricht",
            nameLabel: t.contact?.label_name || "Name *",
            namePlaceholder: t.contact?.placeholder_name || "Ihr Name",
            emailLabel: t.contact?.label_email || "E-Mail *",
            emailPlaceholder: t.contact?.placeholder_email || "ihre.email@unternehmen.de",
            phoneLabel: t.contact?.info_phone || "Telefon / Mobil",
            phonePlaceholder: "+49 123 45678",
            companyLabel: t.contact?.label_company || "Unternehmen",
            companyPlaceholder: t.contact?.placeholder_company || "Ihr Unternehmen GmbH",
            messageLabel: t.contact?.label_message || "Nachricht *",
            messagePlaceholder: t.contact?.placeholder_message || "Wie können wir Ihnen helfen?",
            privacyPrefix: "Ich stimme der Verarbeitung meiner Daten gemäß der ",
            privacyLink: "Datenschutzerklärung",
            privacySuffix: " zu. *",
            submitBtn: t.contact?.btn_submit || "Nachricht senden",
            errorMsg:
              t.contact?.error_message ||
              "Fehler beim Senden. Bitte versuchen Sie es später noch einmal.",
            badge1: "Rechtssichere Vermittlung nach FEG & §§ 296, 297 SGB III",
            badge2: "Kostenfreie Erstberatung",
            badge3: "Antwort in 24 Stunden",
            vnOfficeTitle: t.contact?.vn_office || "Hauptsitz in Vietnam",
            deContactTitle: t.contact?.de_office || "Ihr Ansprechpartner für Deutschland",
          };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
      privacy: false,
      bot_check: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // 1. Honeypot check (Spam protection)
    if (data.bot_check) return;

    setSubmitError(null);

    try {
      const payload = {
        ...data,
        ...currentRequestContext(window.location.href),
      };

      // 2. REAL API CALL
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": submissionKey(payload),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      if (!result.success || !result.saved) {
        throw new Error(result.message || copy.errorMsg);
      }

      // 3. Success State
      setIsSuccess(true);
      reset(); // Clear form

      // Conversion tracking (GA4) — only fires when user has consented to analytics
      if (!result.duplicate) trackEvent("generate_lead", { form: "contact" });
    } catch (err) {
      console.error("Contact form error:", err);
      setSubmitError(copy.errorMsg);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* LEFT COLUMN: THE FORM (Span 2) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-3xl font-bold mb-6 text-slate-900">{copy.title}</h2>

            {isSuccess ? (
              <div className="bg-emerald-50 text-emerald-700 p-8 rounded-xl text-center">
                <h3 className="text-2xl font-bold mb-2">{copy.thankYou}</h3>
                <p>{copy.savedMsg}</p>
                <button
                  onClick={() => {
                    resetSubmissionKey();
                    setIsSuccess(false);
                  }}
                  className="mt-4 text-sm font-bold underline"
                >
                  {copy.newMsg}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <input
                  type="text"
                  {...register("bot_check")}
                  className="hidden"
                  autoComplete="off"
                />

                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">{copy.nameLabel}</label>
                    <input
                      {...register("name")}
                      className={`w-full p-4 rounded-xl border ${errors.name ? "border-red-500" : "border-slate-200"} bg-slate-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder={copy.namePlaceholder}
                    />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">{copy.emailLabel}</label>
                    <input
                      {...register("email")}
                      type="email"
                      className={`w-full p-4 rounded-xl border ${errors.email ? "border-red-500" : "border-slate-200"} bg-slate-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder={copy.emailPlaceholder}
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                  </div>
                </div>

                {/* Phone & Company */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">{copy.phoneLabel}</label>
                    <input
                      {...register("phone")}
                      type="tel"
                      className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={copy.phonePlaceholder}
                    />
                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">{copy.companyLabel}</label>
                    <input
                      {...register("company")}
                      className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={copy.companyPlaceholder}
                    />
                    {errors.company && (
                      <p className="text-red-500 text-xs">{errors.company.message}</p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{copy.messageLabel}</label>
                  <textarea
                    {...register("message")}
                    rows={5}
                    className={`w-full p-4 rounded-xl border ${errors.message ? "border-red-500" : "border-slate-200"} bg-slate-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder={copy.messagePlaceholder}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs">{errors.message.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div
                    className={`rounded-xl border p-4 ${
                      errors.privacy
                        ? "border-red-500 bg-red-50/40"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        id="privacy"
                        type="checkbox"
                        {...register("privacy")}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="privacy" className="text-sm leading-6 text-slate-700">
                        {copy.privacyPrefix}
                        <Link
                          href="/datenschutz"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-blue-600 underline underline-offset-4 hover:text-blue-700"
                        >
                          {copy.privacyLink}
                        </Link>
                        {copy.privacySuffix}
                      </label>
                    </div>
                  </div>
                  {errors.privacy && (
                    <p className="text-red-500 text-xs">{errors.privacy.message}</p>
                  )}
                </div>

                {submitError && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{submitError}</div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin mr-2" size={18} />
                  ) : (
                    <Send className="mr-2" size={18} />
                  )}
                  {copy.submitBtn}
                </button>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 text-xs text-slate-500 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{copy.badge1}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{copy.badge2}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{copy.badge3}</span>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN: INFO CARDS */}
          <div className="space-y-6">
            {/* Card 1: Vietnam */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                  <MapPin size={20} />
                </div>
                <h3 className="font-bold text-slate-900">{copy.vnOfficeTitle}</h3>
              </div>
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex gap-3">
                  <Phone size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <a
                    href={VIETNAM_OFFICE_CONTACT.phoneHref}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {VIETNAM_OFFICE_CONTACT.phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <a
                    href={VIETNAM_OFFICE_CONTACT.emailHref}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {VIETNAM_OFFICE_CONTACT.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Globe size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <a
                    href={VIETNAM_OFFICE_CONTACT.websiteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition-colors"
                  >
                    {VIETNAM_OFFICE_CONTACT.website}
                  </a>
                </li>
                <li className="flex gap-3">
                  <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>{VIETNAM_OFFICE_CONTACT.location}</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Germany */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <User size={20} />
                </div>
                <h3 className="font-bold text-slate-900">{copy.deContactTitle}</h3>
              </div>
              <div className="mb-4">
                <p className="font-bold text-slate-900">{GERMANY_CONTACT.name}</p>
              </div>
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex gap-3">
                  <Phone size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <a
                    href={GERMANY_CONTACT.phoneHref}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {GERMANY_CONTACT.phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <a
                    href={GERMANY_CONTACT.emailHref}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {GERMANY_CONTACT.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>{GERMANY_CONTACT.location}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
