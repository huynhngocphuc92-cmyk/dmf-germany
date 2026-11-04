"use client";
import { useId, useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ArrowRight, Loader2, Sparkles, UserCheck, PlusCircle } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { EMPLOYER_COPY } from "@/lib/content/employers";
import {
  hiringFormSchema,
  type HiringFormValues,
  type HiringService,
} from "@/lib/validations/hiring";
import type { InstantMatchedCandidate } from "@/app/api/hiring/parse/route";
import { currentRequestContext } from "@/lib/intake/context";
import { useSubmissionKey } from "@/lib/intake/client";
import { trackEvent } from "@/components/analytics/GoogleAnalytics";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2 min-w-0">
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
export function HiringRequestForm({
  service = "unsure",
  candidateId,
  candidateCode,
  candidateProfession,
  shortlistedCandidates,
  initialBrancheLabel,
  headingLevel = 2,
}: {
  service?: HiringService;
  candidateId?: string;
  candidateCode?: string;
  candidateProfession?: string | null;
  shortlistedCandidates?: string;
  initialBrancheLabel?: string;
  headingLevel?: 1 | 2;
}) {
  const { lang } = useLanguage();
  const t = EMPLOYER_COPY[lang].form;
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const prefix = useId();
  const { forPayload, reset: resetKey } = useSubmissionKey();
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [jdText, setJdText] = useState("");
  const [isParsingJd, setIsParsingJd] = useState(false);
  const [jdSuccess, setJdSuccess] = useState(false);
  const [matchedCandidates, setMatchedCandidates] = useState<InstantMatchedCandidate[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<HiringFormValues>({
    resolver: zodResolver(hiringFormSchema),
    defaultValues: {
      company: "",
      name: "",
      email: "",
      service,
      phone: "",
      location: "",
      timing: "",
      headcount: "",
      message: "",
      privacy: false,
      bot_check: "",
    },
  });

  useEffect(() => {
    const currentMsg = getValues("message");
    if (shortlistedCandidates && !currentMsg) {
      const prefixMsg =
        lang === "de"
          ? `Wir bitten um die vollständigen Bewerbungsmappen (Dossiers) und Terminvorschläge für folgende Kandidaten aus unserer Merkliste:\n${shortlistedCandidates}`
          : lang === "en"
            ? `We would like to request the full dossiers and interview availability for our shortlisted candidates:\n${shortlistedCandidates}`
            : `Chúng tôi muốn yêu cầu trọn bộ hồ sơ (Bewerbungsmappe) và đặt lịch phỏng vấn cho các ứng viên đã chọn:\n${shortlistedCandidates}`;
      setValue("message", prefixMsg, { shouldValidate: true });
    } else if (initialBrancheLabel && !currentMsg) {
      const brancheMsg =
        lang === "de"
          ? `Branchen-Anfrage (${initialBrancheLabel}): Wir suchen qualifizierte Kandidaten für unseren Betrieb.`
          : lang === "en"
            ? `Sector inquiry (${initialBrancheLabel}): We are looking for qualified candidates for our company.`
            : `Yêu cầu nhân sự ngành (${initialBrancheLabel}): Doanh nghiệp cần tư vấn hồ sơ ứng viên phù hợp.`;
      setValue("message", brancheMsg);
    }
  }, [shortlistedCandidates, initialBrancheLabel, lang, getValues, setValue]);

  const id = (name: string) => `${prefix}-${name}`;
  const input =
    "w-full min-h-12 rounded-lg border border-input bg-background px-3 py-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-red-600";
  const accessibility = (name: keyof HiringFormValues) => ({
    id: id(name),
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${id(name)}-error` : undefined,
  });
  async function handleParseJobDescription() {
    if (jdText.trim().length < 5 || isParsingJd) return;
    setIsParsingJd(true);
    setJdSuccess(false);
    setError(null);
    try {
      const response = await fetch("/api/hiring/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: jdText, lang }),
      });
      const result = await response.json();
      if (!response.ok || !result.data) {
        setError(result.error || t.error);
        return;
      }
      const { service: parsedService, headcount, location, timing, summaryMessage } = result.data;
      if (parsedService) setValue("service", parsedService, { shouldValidate: true });
      if (summaryMessage) setValue("message", summaryMessage, { shouldValidate: true });
      if (headcount) setValue("headcount", String(headcount), { shouldValidate: true });
      if (location) setValue("location", location, { shouldValidate: true });
      if (timing) setValue("timing", timing, { shouldValidate: true });
      if (headcount || location || timing) setDetailsOpen(true);
      if (Array.isArray(result.matchedCandidates)) {
        setMatchedCandidates(result.matchedCandidates);
      }
      setJdSuccess(true);
    } catch {
      setError(t.error);
    } finally {
      setIsParsingJd(false);
    }
  }

  function handleIncludeCandidateInMessage(candidate: InstantMatchedCandidate) {
    const current = getValues("message") || "";
    const tag = `#${candidate.code} (${candidate.profession})`;
    if (current.includes(candidate.code)) return;
    const note =
      lang === "de"
        ? `\nInteresse an Kandidat: ${tag}`
        : lang === "en"
          ? `\nInterested in candidate: ${tag}`
          : `\nQuan tâm ứng viên: ${tag}`;
    setValue("message", `${current.trim()}${note}`.trim(), { shouldValidate: true });
  }
  async function submit(values: HiringFormValues) {
    if (saved) return;
    setError(null);
    const body = {
      ...values,
      headcount: values.headcount ? Number(values.headcount) : undefined,
      candidateId,
      ...currentRequestContext(window.location.href),
    };
    const key = forPayload(body);
    try {
      const response = await fetch("/api/hiring", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": key },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.saved) {
        setError(result.error || t.error);
        return;
      }
      setSaved(result.requestId || key);
      if (!result.duplicate)
        trackEvent("generate_lead", {
          form: candidateId ? "profile" : "hiring",
          service: values.service,
        });
    } catch {
      setError(t.error);
    }
  }
  if (saved)
    return (
      <div
        ref={(node) => {
          node?.focus();
        }}
        tabIndex={-1}
        role="status"
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 md:p-8 text-emerald-950 focus-visible:outline-2"
      >
        <CheckCircle2 className="h-9 w-9 mb-4" />
        <Heading className="text-2xl font-bold">{t.success}</Heading>
        <p className="mt-4 leading-relaxed">{t.next}</p>
        <p className="mt-5 text-sm">
          {t.reference}: <span className="font-mono break-all">{saved}</span>
        </p>
        <button
          type="button"
          className="mt-6 underline underline-offset-4 font-semibold"
          onClick={() => {
            reset();
            resetKey();
            setSaved(null);
          }}
        >
          {t.again}
        </button>
      </div>
    );
  return (
    <div>
      <Heading className="text-2xl md:text-3xl font-bold tracking-tight">{t.title}</Heading>
      <p className="mt-3 text-muted-foreground leading-relaxed">{t.intro}</p>
      {candidateId && (
        <p className="my-4 rounded-lg bg-secondary p-3 text-sm">
          <strong>
            {t.profile} #{candidateCode || candidateId.slice(0, 8).toUpperCase()}
          </strong>
          {candidateProfession && ` · ${candidateProfession}`}
        </p>
      )}
      {shortlistedCandidates && (
        <div className="my-4 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-sm text-emerald-950 flex items-start gap-2.5">
          <UserCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block">
              {lang === "de"
                ? "Ausgewählte Kandidaten aus Ihrer Merkliste:"
                : lang === "en"
                  ? "Selected Candidates from Your Shortlist:"
                  : "Ứng viên đã chọn từ danh sách của bạn:"}
            </strong>
            <span className="text-xs text-emerald-900">{shortlistedCandidates}</span>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit(submit, (invalid) => {
          if (invalid.phone || invalid.location || invalid.headcount || invalid.timing)
            setDetailsOpen(true);
        })}
        noValidate
        className="mt-7 space-y-5"
        aria-label={t.title}
      >
        <p className="text-xs text-muted-foreground">{t.required}</p>
        <input
          {...register("bot_check")}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
          autoComplete="off"
        />
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">
            {error}
          </p>
        )}

        {/* Smart AI JD Parser Box */}
        <details className="rounded-xl border border-primary/25 bg-primary/5 p-4">
          <summary className="cursor-pointer font-semibold text-sm text-primary flex items-center gap-2">
            <Sparkles className="h-4 w-4 flex-shrink-0" />
            <span>
              {lang === "de"
                ? "KI-Schnellausfüllung: Stellenbeschreibung oder Freitext einfügen"
                : lang === "en"
                  ? "AI Quick-Fill: Paste job description or requirement notes"
                  : "Trợ lý AI Điền Nhanh: Dán mô tả công việc (JD) hoặc ghi chú tuyển dụng"}
            </span>
          </summary>
          <div className="mt-3 space-y-3">
            <p className="text-xs text-muted-foreground">
              {lang === "de"
                ? "Kopieren Sie einfach Ihre bestehende Stellenanzeige oder Stichpunkte hier hinein. Unsere KI erkennt automatisch Berufsgruppe, Anzahl, Standort, Zeitraum und fasst den Bedarf zusammen."
                : lang === "en"
                  ? "Paste your job posting or bullet points below. Our AI automatically extracts category, headcount, location, timing, and summarizes your request."
                  : "Dán nội dung tin tuyển dụng hoặc yêu cầu sơ bộ vào ô dưới đây. AI sẽ tự động bóc tách nhóm dịch vụ, số lượng, địa điểm, thời gian và tóm tắt yêu cầu."}
            </p>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              rows={3}
              maxLength={4000}
              placeholder={
                lang === "de"
                  ? "z.B. Wir suchen für unsere Klinik in München ab Herbst 2026 insgesamt 3 Pflegefachkräfte oder Auszubildende mit B2..."
                  : lang === "en"
                    ? "e.g. We are looking for 3 nursing professionals in Munich starting Autumn 2026 with German B2..."
                    : "VD: Công ty tại München cần tuyển 3 điều dưỡng viên trình độ B2 làm việc từ mùa thu 2026..."
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-primary"
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                disabled={isParsingJd || jdText.trim().length < 5}
                onClick={handleParseJobDescription}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isParsingJd ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                {lang === "de"
                  ? "Formular mit KI ausfüllen"
                  : lang === "en"
                    ? "Auto-fill form with AI"
                    : "Tự động điền biểu mẫu bằng AI"}
              </button>
              {jdSuccess && (
                <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {lang === "de"
                    ? "Felder wurden erfolgreich vorausgefüllt!"
                    : lang === "en"
                      ? "Form fields auto-populated!"
                      : "Đã tự động điền thông tin vào biểu mẫu!"}
                </span>
              )}
            </div>

            {matchedCandidates.length > 0 && (
              <div className="mt-3 pt-3 border-t border-primary/20 space-y-2">
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  {lang === "de"
                    ? "Sofort-Match: Diese aktuellen Profile passen zu Ihrer Stellenbeschreibung:"
                    : lang === "en"
                      ? "Instant Match: These active profiles match your job description:"
                      : "Gợi ý tức thì: Các hồ sơ đang có sẵn khớp với mô tả công việc của bạn:"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {matchedCandidates.map((mc) => (
                    <div
                      key={mc.id}
                      className="rounded-lg border border-emerald-200 bg-white p-2.5 text-xs flex flex-col justify-between gap-2 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <Link
                            href={`/fuer-arbeitgeber/kandidaten/${mc.id}`}
                            target="_blank"
                            className="font-mono font-bold text-primary hover:underline"
                          >
                            #{mc.code}
                          </Link>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            {mc.matchScore}% Match
                          </span>
                        </div>
                        <p className="font-semibold text-slate-900 line-clamp-1">{mc.profession}</p>
                        {mc.german_level && (
                          <span className="text-[11px] text-slate-500">
                            Deutsch {mc.german_level}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleIncludeCandidateInMessage(mc)}
                        className="inline-flex items-center justify-center gap-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-1 font-medium transition-colors"
                      >
                        <PlusCircle className="w-3 h-3" />
                        {lang === "de"
                          ? "In Anfrage aufnehmen"
                          : lang === "en"
                            ? "Include in request"
                            : "Đưa vào yêu cầu"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </details>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field id={id("company")} label={`${t.company} *`} error={errors.company?.message}>
            <input
              {...register("company")}
              {...accessibility("company")}
              autoComplete="organization"
              maxLength={500}
              className={input}
            />
          </Field>
          <Field id={id("name")} label={`${t.name} *`} error={errors.name?.message}>
            <input
              {...register("name")}
              {...accessibility("name")}
              autoComplete="name"
              maxLength={200}
              className={input}
            />
          </Field>
          <Field id={id("email")} label={`${t.email} *`} error={errors.email?.message}>
            <input
              {...register("email")}
              {...accessibility("email")}
              type="email"
              autoComplete="email"
              maxLength={320}
              className={input}
            />
          </Field>
          <Field id={id("service")} label={`${t.service} *`} error={errors.service?.message}>
            <select {...register("service")} {...accessibility("service")} className={input}>
              {Object.entries(t.services).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field id={id("message")} label={`${t.message} *`} error={errors.message?.message}>
          {/* Quick Choice Suggestion Chips */}
          <div className="mb-2">
            <span className="text-xs text-muted-foreground block mb-1.5 font-medium">
              {lang === "de"
                ? "Schnellauswahl per Klick (optional):"
                : lang === "en"
                  ? "Quick select (optional):"
                  : "Chọn nhanh nội dung (tùy chọn):"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                lang === "de"
                  ? "2 Auszubildende ab Herbst 2026 gesucht"
                  : lang === "en"
                    ? "Looking for 2 apprentices starting Autumn 2026"
                    : "Cần tuyển 2 học viên nghề từ Thu 2026",
                lang === "de"
                  ? "Pflegefachkräfte mit Anerkennung (§ 18a/b)"
                  : lang === "en"
                    ? "Qualified nursing professionals with recognition (§ 18a/b)"
                    : "Điều dưỡng viên có chứng nhận (§ 18a/b)",
                lang === "de"
                  ? "CNC- & Zerspanungsmechaniker gesucht"
                  : lang === "en"
                    ? "CNC and machining technicians needed"
                    : "Thợ tiện CNC và cơ khí chính xác",
                lang === "de"
                  ? "Unverbindliches Beratungsgespräch & Angebot"
                  : lang === "en"
                    ? "Non-binding consultation & customized proposal"
                    : "Yêu cầu tư vấn miễn phí & nhận báo giá",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setValue("message", chip, { shouldValidate: true })}
                  className="text-xs px-2.5 py-1 rounded-full bg-secondary hover:bg-primary/10 hover:text-primary text-secondary-foreground transition-colors border border-border"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>
          <textarea
            {...register("message")}
            {...accessibility("message")}
            rows={4}
            maxLength={10000}
            placeholder={t.messagePlaceholder}
            className={input}
          />
        </Field>
        <details
          open={detailsOpen}
          onToggle={(event) => setDetailsOpen(event.currentTarget.open)}
          className="rounded-lg border p-4"
        >
          <summary className="cursor-pointer font-medium text-sm py-1">{t.optional}</summary>
          <div className="grid sm:grid-cols-2 gap-5 mt-5">
            <Field id={id("phone")} label={t.phone} error={errors.phone?.message}>
              <input
                {...register("phone")}
                {...accessibility("phone")}
                type="tel"
                autoComplete="tel"
                className={input}
              />
            </Field>
            <Field id={id("location")} label={t.location} error={errors.location?.message}>
              <input
                {...register("location")}
                {...accessibility("location")}
                maxLength={200}
                className={input}
              />
            </Field>
            <Field id={id("headcount")} label={t.headcount} error={errors.headcount?.message}>
              <input
                {...register("headcount")}
                {...accessibility("headcount")}
                inputMode="numeric"
                maxLength={4}
                className={input}
              />
            </Field>
            <Field id={id("timing")} label={t.timing} error={errors.timing?.message}>
              <input
                {...register("timing")}
                {...accessibility("timing")}
                maxLength={200}
                className={input}
              />
            </Field>
          </div>
        </details>
        <div>
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              {...register("privacy")}
              {...accessibility("privacy")}
              className="mt-1 h-5 w-5 shrink-0 accent-primary"
            />
            <label
              htmlFor={id("privacy")}
              className="text-sm leading-relaxed text-muted-foreground"
            >
              {t.privacy}{" "}
              <Link
                href="/datenschutz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                {t.privacyLink}
              </Link>
              . *
            </label>
          </div>
          {errors.privacy && (
            <p id={`${id("privacy")}-error`} role="alert" className="mt-2 text-sm text-red-700">
              {errors.privacy.message}
            </p>
          )}
        </div>
        <button
          disabled={isSubmitting}
          type="submit"
          className="inline-flex min-h-12 w-full sm:w-auto justify-center items-center gap-3 rounded-lg bg-primary px-6 py-3 text-primary-foreground font-semibold disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          {isSubmitting ? t.sending : t.submit}
        </button>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-border/80 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>100% FEG & § 296a SGB III konform</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>Erfolgsbasiertes Honorar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>Kostenlose Ersatzgarantie</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>DSGVO-Datenschutz</span>
          </div>
        </div>
      </form>
    </div>
  );
}
