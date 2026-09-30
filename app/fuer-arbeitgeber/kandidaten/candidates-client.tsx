"use client";
import Link from "next/link";
import { useState } from "react";
import { Users } from "lucide-react";
import { CandidateCard } from "@/components/candidates/CandidateCard";
import { InquiryModal } from "@/components/candidates/InquiryModal";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { PublicCandidate } from "@/lib/candidates/public-profile";
import { EMPLOYER_COPY } from "@/lib/content/employers";
export function CandidatesClient({
  initialCandidates,
  error,
}: {
  initialCandidates: PublicCandidate[];
  error: string | null;
}) {
  const { lang } = useLanguage();
  const copy = EMPLOYER_COPY[lang];
  const t = copy.pool;
  const [category, setCategory] = useState("all");
  const [german, setGerman] = useState("all");
  const [visa, setVisa] = useState("all");
  const [candidate, setCandidate] = useState<PublicCandidate | null>(null);
  const filtered = initialCandidates.filter(
    (c) =>
      (category === "all" || c.category === category) &&
      (german === "all" || c.german_level === german) &&
      (visa === "all" || c.visa_status)
  );
  const field =
    "block w-full min-h-12 mt-2 rounded-lg border border-input bg-background px-3 text-base";
  return (
    <div>
      <section className="bg-secondary pt-40 md:pt-48 pb-16">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-primary">
            {t.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mt-5 leading-relaxed">{t.intro}</p>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-16">
        <div className="grid sm:grid-cols-3 gap-5">
          <label className="text-sm font-medium">
            {t.category}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={field}
            >
              <option value="all">{t.all}</option>
              {(["skilled", "azubi", "seasonal"] as const).map((s) => (
                <option key={s} value={s}>
                  {copy.form.services[s]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            {t.german}
            <select value={german} onChange={(e) => setGerman(e.target.value)} className={field}>
              <option value="all">{t.all}</option>
              {["A1", "A2", "B1", "B2", "C1", "C2"].map((v) => (
                <option value={v} key={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            {t.visa}
            <select value={visa} onChange={(e) => setVisa(e.target.value)} className={field}>
              <option value="all">{t.all}</option>
              <option value="yes">{t.visaYes}</option>
            </select>
          </label>
        </div>
        <p className="text-xs text-muted-foreground mt-3">{t.visaNote}</p>
        <div className="flex justify-between gap-4 my-6">
          <p role="status" className="text-sm text-muted-foreground">
            {filtered.length} {t.count}
          </p>
          <button
            onClick={() => {
              setCategory("all");
              setGerman("all");
              setVisa("all");
            }}
            className="text-sm text-primary underline"
          >
            {t.reset}
          </button>
        </div>
        {error ? (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
            <p>{t.error}</p>
            <button className="underline mt-3" onClick={() => window.location.reload()}>
              {t.retry}
            </button>
          </div>
        ) : filtered.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <CandidateCard key={c.id} candidate={c} onRequestProfile={setCandidate} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border bg-secondary px-6 py-12 text-center">
            <Users className="h-10 w-10 text-primary mx-auto" />
            <h2 className="text-xl font-semibold mt-5">{t.empty}</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              {!initialCandidates.length
                ? copy.emptyProfiles
                : lang === "de"
                  ? "Passen Sie die Filter an oder senden Sie uns Ihren Bedarf. Wir klären passende Möglichkeiten mit Ihnen."
                  : lang === "en"
                    ? "Adjust the filters or send us your requirements so we can discuss suitable options."
                    : "Anh chị có thể thay đổi bộ lọc hoặc gửi nhu cầu để DMF trao đổi phương án phù hợp."}
            </p>
            <Link
              href="/fuer-arbeitgeber/personalbedarf"
              className="inline-flex min-h-12 items-center bg-primary text-primary-foreground rounded-lg px-6 mt-6 font-semibold"
            >
              {copy.primary}
            </Link>
          </div>
        )}
      </div>
      <InquiryModal
        key={candidate?.id ?? "none"}
        candidate={candidate}
        isOpen={Boolean(candidate)}
        onClose={() => setCandidate(null)}
      />
    </div>
  );
}
