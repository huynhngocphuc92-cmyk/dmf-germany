"use client";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { EMPLOYER_COPY, servicePaths } from "@/lib/content/employers";
import { HiringRequestForm } from "./HiringRequestForm";
import { EmployerJourney } from "./EmployerJourney";
export function EmployerService({ service }: { service: keyof typeof servicePaths }) {
  const { lang } = useLanguage();
  const t = EMPLOYER_COPY[lang];
  const item = t.services[service];
  return (
    <div>
      <section className="pt-40 md:pt-48 pb-16 md:pb-24 bg-secondary">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <p className="text-sm text-primary font-semibold">{t.eyebrow}</p>
          <h1 className="mt-6 text-4xl md:text-6xl font-semibold text-primary tracking-tight max-w-3xl">
            {item.title}
          </h1>
          <p className="mt-6 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl">
            {item.description}
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href="#personalbedarf"
              className="inline-flex gap-3 items-center rounded-lg bg-primary text-primary-foreground min-h-12 px-6 py-3 font-semibold"
            >
              {t.primary}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/fuer-arbeitgeber/kandidaten"
              className="inline-flex items-center underline px-3 py-3 text-primary"
            >
              {t.secondary}
            </Link>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          <div>
            <h2 className="text-3xl font-semibold">{t.fit}</h2>
            <p className="mt-5 leading-relaxed text-muted-foreground text-lg">{item.fit}</p>
          </div>
          <div className="rounded-xl bg-secondary p-7">
            <h2 className="text-xl font-semibold">{t.requirements}</h2>
            <ul className="mt-5 space-y-4">
              {item.requirements.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-relaxed">
                  <Check className="w-4 h-4 shrink-0 text-primary mt-1" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {[
            { title: t.scope, points: item.scope },
            { title: t.employer, points: item.employer },
          ].map((block) => (
            <div key={block.title} className="rounded-xl border p-7">
              <h2 className="text-2xl font-semibold">{block.title}</h2>
              <ul className="list-disc pl-5 mt-5 space-y-3 text-muted-foreground leading-relaxed">
                {block.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm leading-relaxed text-muted-foreground max-w-4xl">
          {t.planningNote}
        </p>
      </section>
      <EmployerJourney />
      <section className="max-w-4xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <h2 className="text-3xl font-semibold mb-8">{t.faq}</h2>
        <div className="divide-y border-y">
          {item.faq.map(([q, a]) => (
            <details key={q} className="py-5">
              <summary className="cursor-pointer text-lg font-medium py-2">{q}</summary>
              <p className="mt-3 pr-4 leading-relaxed text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section id="personalbedarf" className="bg-secondary py-16 md:py-24 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <div className="rounded-2xl border bg-card p-6 md:p-10">
            <HiringRequestForm service={service} />
          </div>
        </div>
      </section>
    </div>
  );
}
