"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, GraduationCap, CalendarDays } from "lucide-react";
import type { PublicCandidate } from "@/lib/candidates/public-profile";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { EMPLOYER_COPY, servicePaths } from "@/lib/content/employers";
import { EmployerJourney } from "@/components/employers/EmployerJourney";
import { HiringRequestForm } from "@/components/employers/HiringRequestForm";
import { CandidateCard } from "@/components/candidates/CandidateCard";
import { InquiryModal } from "@/components/candidates/InquiryModal";
import { useState } from "react";
const serviceIcons = { skilled: BriefcaseBusiness, azubi: GraduationCap, seasonal: CalendarDays };
export function HomeClient({
  assets,
  featuredCandidates,
}: {
  assets: Record<string, string | null>;
  featuredCandidates: PublicCandidate[];
}) {
  const { lang } = useLanguage();
  const t = EMPLOYER_COPY[lang];
  const [candidate, setCandidate] = useState<PublicCandidate | null>(null);
  return (
    <div>
      <section className="pt-40 md:pt-48 pb-16 md:pb-24 bg-secondary">
        <div className="max-w-6xl mx-auto px-5 md:px-8 grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3">
            <p className="text-xs font-semibold tracking-widest text-primary">{t.eyebrow}</p>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight mt-6 text-primary">
              {t.title}
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground mt-6 max-w-xl">{t.intro}</p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="#contact"
                className="inline-flex items-center gap-3 min-h-12 rounded-lg bg-primary text-primary-foreground px-6 py-3 font-semibold"
              >
                {t.primary}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/fuer-arbeitgeber/kandidaten"
                className="inline-flex items-center min-h-12 rounded-lg border border-primary/25 px-5 py-3 font-semibold text-primary"
              >
                {t.secondary}
              </Link>
            </div>
          </div>
          <div className="lg:col-span-2 rounded-2xl overflow-hidden bg-primary text-primary-foreground">
            {assets.home_hero_bg && (
              <div className="relative aspect-video">
                <Image
                  src={assets.home_hero_bg}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 440px, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-7 md:p-8">
              <p className="text-sm font-medium text-primary-foreground/70">DMF TALENTS</p>
              <h2 className="text-2xl font-semibold mt-3">{t.servicesTitle}</h2>
              <ul className="divide-y divide-primary-foreground/20 mt-6">
                {Object.entries(servicePaths).map(([key, path]) => (
                  <li key={key}>
                    <Link
                      href={path}
                      className="flex justify-between items-center gap-4 py-4 font-medium"
                    >
                      {t.form.services[key as keyof typeof servicePaths]}
                      <ArrowUpRight className="h-4 w-4 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section id="services" className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.servicesTitle}</h2>
        <p className="mt-4 text-muted-foreground">{t.servicesIntro}</p>
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {(Object.keys(servicePaths) as (keyof typeof servicePaths)[]).map((key) => {
            const Icon = serviceIcons[key];
            return (
              <article key={key} className="rounded-xl border p-6 md:p-7 flex flex-col">
                <Icon className="h-7 w-7 text-primary" />
                <h3 className="text-2xl font-semibold mt-6">{t.services[key].title}</h3>
                <p className="text-muted-foreground leading-relaxed mt-4 mb-8">
                  {t.services[key].description}
                </p>
                <Link
                  href={servicePaths[key]}
                  className="mt-auto inline-flex gap-2 text-primary font-semibold text-sm items-center underline underline-offset-4"
                >
                  {t.readMore}
                  <ArrowUpRight className="h-4 w-4 shrink-0" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>
      <section className="bg-secondary py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.profilesTitle}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{t.profilesIntro}</p>
          </div>
          {featuredCandidates.length ? (
            <div className="grid md:grid-cols-3 gap-6 mt-9">
              {featuredCandidates.slice(0, 3).map((profile) => (
                <CandidateCard
                  key={profile.id}
                  candidate={profile}
                  onRequestProfile={setCandidate}
                />
              ))}
            </div>
          ) : (
            <p className="mt-8 p-6 bg-background rounded-xl border max-w-3xl leading-relaxed text-muted-foreground">
              {t.emptyProfiles}
            </p>
          )}
          <Link
            href={featuredCandidates.length ? "/fuer-arbeitgeber/kandidaten" : "#contact"}
            className="inline-block text-primary underline font-semibold mt-7"
          >
            {featuredCandidates.length ? t.secondary : t.primary}
          </Link>
        </div>
      </section>
      <EmployerJourney />
      <section
        id="about"
        className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 md:gap-16"
      >
        <div>
          <h2 className="text-3xl font-semibold">{t.aboutTitle}</h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">{t.aboutText}</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h2 className="text-2xl font-semibold">{t.supportTitle}</h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">{t.supportText}</p>
        </div>
      </section>
      <section id="contact" className="bg-secondary py-16 md:py-24 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <div className="bg-card border rounded-2xl p-6 md:p-10">
            <HiringRequestForm />
          </div>
        </div>
      </section>
      <InquiryModal
        key={candidate?.id ?? "none"}
        candidate={candidate}
        isOpen={Boolean(candidate)}
        onClose={() => setCandidate(null)}
      />
    </div>
  );
}
