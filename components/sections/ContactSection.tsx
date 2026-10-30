"use client";

import { trackEvent } from "@/components/analytics/GoogleAnalytics";
import { GERMANY_CONTACT, VIETNAM_OFFICE_CONTACT } from "@/lib/company/contact";
import { useSubmissionKey } from "@/lib/intake/client";
import {
  readContactForm,
  submitContactForm,
  validateContactPhone,
} from "@/lib/contact/native-form";
import { Globe, Loader2, Mail, MapPin, Phone, Send, User } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";

export default function ContactSection() {
  const { forPayload: submissionKey, reset: resetSubmissionKey } = useSubmissionKey();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (submitting.current || !form.reportValidity()) return;
    const data = readContactForm(new FormData(form));
    if (data.bot_check) return;

    submitting.current = true;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const phoneError = await validateContactPhone(data.phone);
      if (phoneError) {
        const phone = form.elements.namedItem("phone") as HTMLInputElement;
        phone.setCustomValidity(phoneError);
        phone.reportValidity();
        return;
      }
      const result = await submitContactForm(data, submissionKey(data));
      setIsSuccess(true);
      form.reset();
      if (!result.duplicate) trackEvent("generate_lead", { form: "contact" });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Fehler beim Senden. Bitte versuchen Sie es später noch einmal."
      );
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* LEFT COLUMN: THE FORM (Span 2) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-3xl font-bold mb-6 text-slate-900">Kontaktieren Sie uns</h2>

            {isSuccess ? (
              <div className="bg-emerald-50 text-emerald-700 p-8 rounded-xl text-center">
                <h3 className="text-2xl font-bold mb-2">Vielen Dank!</h3>
                <p>Ihre Anfrage wurde gespeichert. Unser Team meldet sich bei Ihnen.</p>
                <button
                  onClick={() => {
                    resetSubmissionKey();
                    setIsSuccess(false);
                  }}
                  className="mt-4 text-sm font-bold underline"
                >
                  Neue Nachricht
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                <input type="text" name="bot_check" className="hidden" autoComplete="off" />

                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="text-sm font-bold text-slate-700">
                      Name *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      maxLength={200}
                      required
                      minLength={2}
                      className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ihr Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-email" className="text-sm font-bold text-slate-700">
                      E-Mail *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      maxLength={320}
                      required
                      type="email"
                      className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ihre.email@unternehmen.de"
                    />
                  </div>
                </div>

                {/* Phone & Company (RESTORED) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="contact-phone" className="text-sm font-bold text-slate-700">
                      Telefon / Mobil
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      maxLength={50}
                      onInput={(event) => event.currentTarget.setCustomValidity("")}
                      type="tel"
                      className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+49 123 45678"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-company" className="text-sm font-bold text-slate-700">
                      Unternehmen
                    </label>
                    <input
                      id="contact-company"
                      name="company"
                      maxLength={500}
                      className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ihr Unternehmen GmbH"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="contact-message" className="text-sm font-bold text-slate-700">
                    Nachricht *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    maxLength={10000}
                    required
                    minLength={10}
                    rows={5}
                    className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Wie können wir Ihnen helfen?"
                  />
                </div>

                <div className="space-y-2">
                  <div className="rounded-xl border p-4 border-slate-200 bg-slate-50">
                    <div className="flex items-start gap-3">
                      <input
                        id="contact-privacy"
                        type="checkbox"
                        name="privacy"
                        required
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="contact-privacy" className="text-sm leading-6 text-slate-700">
                        Ich stimme der Verarbeitung meiner Daten gemäß der{" "}
                        <Link
                          href="/datenschutz"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-blue-600 underline underline-offset-4 hover:text-blue-700"
                        >
                          Datenschutzerklärung
                        </Link>{" "}
                        zu. *
                      </label>
                    </div>
                  </div>
                </div>

                {submitError && (
                  <div role="alert" className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                    {submitError}
                  </div>
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
                  Nachricht senden
                </button>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 text-xs text-slate-500 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>100% FEG & § 296a SGB III</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Kostenfreie Erstberatung</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Antwort in 24 Stunden</span>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN: INFO CARDS (RESTORED) */}
          <div className="space-y-6">
            {/* Card 1: Vietnam */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                  <MapPin size={20} />
                </div>
                <h3 className="font-bold text-slate-900">Hauptsitz in Vietnam</h3>
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
                <h3 className="font-bold text-slate-900">Ihr Ansprechpartner für Deutschland</h3>
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
