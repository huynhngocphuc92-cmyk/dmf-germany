"use client";
import { useId, useState, type ReactNode } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { EMPLOYER_COPY } from "@/lib/content/employers";
import {
  hiringFormSchema,
  type HiringFormValues,
  type HiringService,
} from "@/lib/validations/hiring";
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
  candidateProfession,
  headingLevel = 2,
}: {
  service?: HiringService;
  candidateId?: string;
  candidateProfession?: string | null;
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
  const {
    register,
    handleSubmit,
    reset,
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
  const id = (name: string) => `${prefix}-${name}`;
  const input =
    "w-full min-h-12 rounded-lg border border-input bg-background px-3 py-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-red-600";
  const accessibility = (name: keyof HiringFormValues) => ({
    id: id(name),
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${id(name)}-error` : undefined,
  });
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
            {t.profile} #{candidateId.slice(0, 8).toUpperCase()}
          </strong>
          {candidateProfession && ` · ${candidateProfession}`}
        </p>
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
      </form>
    </div>
  );
}
