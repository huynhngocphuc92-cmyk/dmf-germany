"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail, MapPin, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import {
  isTurnstileEnabled,
  TurnstileWidget,
  type TurnstileWidgetHandle,
} from "@/components/security/TurnstileWidget";
import type { BlogClusterConfig } from "@/lib/blog/seo-taxonomy";
import { useSubmissionKey } from "@/lib/intake/client";
import { currentRequestContext } from "@/lib/intake/context";

interface InlineBlogLeadCardProps {
  postSlug: string;
  postTitle: string;
  cluster: BlogClusterConfig;
  regionalLink?: { href: string; label: string } | null;
}

const uiCopy = {
  de: {
    trust: "Kostenlos & unverbindlich · Direkte Vertretung in Deutschland · Antwort binnen 24h",
    emailLabel: "Geschäftliche E-Mail *",
    emailPlaceholder: "hr@ihr-unternehmen.de",
    companyLabel: "Unternehmen / Einrichtung",
    companyPlaceholder: "z. B. Seniorenheim Musterstadt GmbH",
    phoneLabel: "Telefon für Rückruf (optional)",
    phonePlaceholder: "+49 ...",
    privacyPrefix: "Ich stimme der Verarbeitung meiner Angaben gemäß ",
    privacyLink: "Datenschutzerklärung",
    privacySuffix: " zur Bearbeitung meiner Anfrage zu. *",
    submitting: "Wird übermittelt...",
    successTitle: "Anfrage gespeichert – vielen Dank!",
    successBody:
      "Unser B2B-Team in Deutschland stellt Ihnen passende Unterlagen und Profile zusammen und meldet sich kurzfristig bei Ihnen.",
    errorPrivacy: "Bitte bestätigen Sie die Datenschutzzustimmung.",
    errorEmail: "Bitte geben Sie eine gültige geschäftliche E-Mail-Adresse ein.",
    errorSubmit:
      "Die Anfrage konnte gerade nicht gespeichert werden. Bitte prüfen Sie Ihre Eingaben oder nutzen Sie direkt unsere Bedarfsseite.",
    explorePillar: "Zur Branchen- & Lösungsseite",
  },
  en: {
    trust: "Free & non-binding · Direct office in Germany · Reply within 24 hours",
    emailLabel: "Business Email *",
    emailPlaceholder: "hr@your-company.de",
    companyLabel: "Company / Organization",
    companyPlaceholder: "e.g. Muster Clinic GmbH",
    phoneLabel: "Phone for callback (optional)",
    phonePlaceholder: "+49 ...",
    privacyPrefix: "I consent to the processing of my data in accordance with the ",
    privacyLink: "Privacy Policy",
    privacySuffix: " to process my inquiry. *",
    submitting: "Sending...",
    successTitle: "Request saved – thank you!",
    successBody:
      "Our B2B team in Germany will prepare matching candidate profiles and respond within 24 hours.",
    errorPrivacy: "Please confirm your privacy consent.",
    errorEmail: "Please enter a valid business email address.",
    errorSubmit: "Could not save your request right now. Please check your input and try again.",
    explorePillar: "Explore solution page",
  },
  vn: {
    trust: "Miễn phí & không ràng buộc · Đại diện trực tiếp tại Đức · Phản hồi trong 24h",
    emailLabel: "Email doanh nghiệp *",
    emailPlaceholder: "hr@cong-ty-cua-ban.de",
    companyLabel: "Tên doanh nghiệp / Cơ sở",
    companyPlaceholder: "VD: Pflegeheim Musterstadt GmbH",
    phoneLabel: "Số điện thoại liên hệ (không bắt buộc)",
    phonePlaceholder: "+49 ...",
    privacyPrefix: "Tôi đồng ý xử lý thông tin theo ",
    privacyLink: "Chính sách bảo mật",
    privacySuffix: " để phản hồi yêu cầu này. *",
    submitting: "Đang gửi...",
    successTitle: "Đã lưu yêu cầu – cảm ơn bạn!",
    successBody:
      "Đội ngũ B2B của DMF tại Đức sẽ tổng hợp hồ sơ phù hợp và liên hệ lại với bạn trong 24 giờ.",
    errorPrivacy: "Vui lòng đánh dấu đồng ý chính sách bảo mật.",
    errorEmail: "Vui lòng nhập địa chỉ email hợp lệ.",
    errorSubmit: "Không thể lưu yêu cầu lúc này. Vui lòng kiểm tra lại thông tin.",
    explorePillar: "Xem trang giải pháp chính",
  },
};

export function InlineBlogLeadCard({
  postSlug,
  postTitle,
  cluster,
  regionalLink,
}: InlineBlogLeadCardProps) {
  const { lang: currentLang } = useLanguage();
  const lang = (currentLang as "de" | "en" | "vn") || "de";
  const copy = uiCopy[lang] || uiCopy.de;
  const offer = cluster.inlineLeadOffer;
  const primaryPillar = cluster.pillarLinks[0];
  const submissionKey = useSubmissionKey();

  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    if (isTurnstileEnabled && !turnstileToken) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage(copy.errorEmail);
      return;
    }
    if (!privacy) {
      setErrorMessage(copy.errorPrivacy);
      return;
    }

    const trimmedCompany = company.trim();
    const trimmedPhone = phone.trim();
    const context =
      typeof window !== "undefined"
        ? currentRequestContext(window.location.href)
        : { sourcePath: `/blog/${postSlug}`, campaign: {} };

    const payload = {
      email: trimmedEmail.toLowerCase(),
      ...(trimmedCompany ? { company: trimmedCompany } : {}),
      ...(trimmedPhone ? { phone: trimmedPhone } : {}),
      interest: `[${cluster.id}] ${offer.defaultInterest} | ${postTitle}`.slice(0, 2000),
      source: "blog-inline-cta",
      ...context,
    };

    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": submissionKey.forPayload(payload),
        },
        body: JSON.stringify(
          turnstileToken ? { ...payload, "cf-turnstile-response": turnstileToken } : payload
        ),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        setErrorMessage(result?.error || copy.errorSubmit);
        return;
      }
      submissionKey.reset();
      setSubmitted(true);
    } catch {
      setErrorMessage(copy.errorSubmit);
    } finally {
      turnstileRef.current?.reset();
      setTurnstileToken("");
      setSubmitting(false);
    }
  };

  return (
    <aside
      aria-label={offer.headline[lang]}
      data-blog-inline-cta={cluster.id}
      className="rounded-2xl border border-blue-200 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white shadow-lg"
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 border border-blue-400/30 px-3 py-1 text-xs font-semibold text-blue-200 mb-3">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>{offer.badge[lang]}</span>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-2">
        {offer.headline[lang]}
      </h3>
      <p className="text-sm text-slate-300 leading-relaxed mb-5">{offer.subheadline[lang]}</p>

      {submitted ? (
        <div className="rounded-xl bg-emerald-500/15 border border-emerald-400/40 p-4 text-emerald-100">
          <div className="flex items-center gap-2 font-semibold text-base mb-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{copy.successTitle}</span>
          </div>
          <p className="text-sm text-emerald-100/90">{copy.successBody}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label
                htmlFor={`inline-lead-email-${postSlug}`}
                className="block text-xs font-medium text-slate-300 mb-1"
              >
                {copy.emailLabel}
              </label>
              <input
                id={`inline-lead-email-${postSlug}`}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={copy.emailPlaceholder}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label
                htmlFor={`inline-lead-company-${postSlug}`}
                className="block text-xs font-medium text-slate-300 mb-1"
              >
                {copy.companyLabel}
              </label>
              <input
                id={`inline-lead-company-${postSlug}`}
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={copy.companyPlaceholder}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label
                htmlFor={`inline-lead-phone-${postSlug}`}
                className="block text-xs font-medium text-slate-300 mb-1"
              >
                {copy.phoneLabel}
              </label>
              <input
                id={`inline-lead-phone-${postSlug}`}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={copy.phonePlaceholder}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
          </div>

          <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={privacy}
              onChange={(e) => setPrivacy(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-400"
            />
            <span>
              {copy.privacyPrefix}
              <Link href="/datenschutz" className="underline text-blue-300 hover:text-white">
                {copy.privacyLink}
              </Link>
              {copy.privacySuffix}
            </span>
          </label>

          <TurnstileWidget
            ref={turnstileRef}
            action="lead"
            theme="dark"
            language={lang}
            onToken={setTurnstileToken}
          />

          {errorMessage && (
            <p role="alert" className="text-xs font-medium text-amber-300">
              {errorMessage}
            </p>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={submitting || (isTurnstileEnabled && !turnstileToken)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 px-5 py-3 text-sm font-bold text-white shadow-md transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span>{submitting ? copy.submitting : offer.ctaLabel[lang]}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
            <span className="text-xs text-slate-400">{copy.trust}</span>
          </div>
        </form>
      )}

      <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-blue-200">
        {primaryPillar && (
          <Link
            href={primaryPillar.href}
            className="inline-flex items-center gap-1.5 hover:text-white underline underline-offset-4"
          >
            <span>
              {copy.explorePillar}: {primaryPillar.label[lang]}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
        {regionalLink && (
          <Link
            href={regionalLink.href}
            className="inline-flex items-center gap-1.5 hover:text-white underline underline-offset-4"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{regionalLink.label}</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
