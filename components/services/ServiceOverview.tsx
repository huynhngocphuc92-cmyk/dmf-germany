"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { ServiceOverviewKey } from "@/lib/content/service-overviews";

export function ServiceOverview({ service }: { service: ServiceOverviewKey }) {
  const { t } = useLanguage();
  const copy = t.service_pages.overview;
  const item = copy.items[service];
  return (
    <div>
      <section className="bg-gradient-to-br from-slate-950 to-slate-800 text-white pt-32 md:pt-40 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-blue-200 font-medium mb-6">{copy.badge}</p>
          <h1 className="text-4xl md:text-6xl font-bold max-w-4xl leading-tight">{item.title}</h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-3xl mt-7 leading-relaxed">
            {item.description}
          </p>
          <div className="flex flex-wrap gap-4 mt-9">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 bg-primary text-white rounded-lg px-6 py-3 font-medium"
            >
              {copy.contact}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/fuer-arbeitgeber/kandidaten"
              className="border border-white/50 rounded-lg px-6 py-3"
            >
              {copy.candidates}
            </Link>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <h2 className="text-3xl font-bold mb-8">{copy.heading}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {item.points.map((point) => (
            <div key={point} className="rounded-2xl border border-slate-200 bg-white p-7">
              <CheckCircle2 className="w-7 h-7 text-primary mb-5" />
              <p className="text-lg font-medium text-slate-800">{point}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-2xl bg-slate-50 p-7 md:p-10">
          <h2 className="text-2xl font-bold mb-4">{copy.next}</h2>
          <p className="text-lg text-slate-700">{item.next}</p>
          <p className="text-sm text-slate-600 mt-5 leading-relaxed">{copy.note}</p>
        </div>
      </section>
    </div>
  );
}
