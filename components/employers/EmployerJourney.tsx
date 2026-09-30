"use client";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { EMPLOYER_COPY } from "@/lib/content/employers";
export function EmployerJourney() {
  const { lang } = useLanguage();
  const t = EMPLOYER_COPY[lang];
  return (
    <section className="bg-primary text-primary-foreground py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t.processTitle}</h2>
          <p className="mt-5 leading-relaxed text-primary-foreground/80">{t.processIntro}</p>
        </div>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {t.steps.map((step, i) => (
            <li key={step.title} className="border-t border-primary-foreground/25 pt-6">
              <span className="text-sm font-mono text-primary-foreground/60">0{i + 1}</span>
              <h3 className="text-lg font-semibold mt-4">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
