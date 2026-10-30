"use client";

import type { ComponentType } from "react";
import { withDeadline } from "@/lib/requests/deadline";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { salarySimulatorContent } from "@/components/tools/salary-content";

function SalaryPreview({ onLoad, failed = false }: { onLoad?: () => void; failed?: boolean }) {
  const { lang, t } = useLanguage();
  const content = salarySimulatorContent[lang];
  return (
    <section
      id="salary-calculator"
      className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background"
    >
      <div className="container mx-auto px-4 text-center">
        <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
          {content.badge}
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
          {t.simulator.title}
        </h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          {content.subtitle}
        </p>
        <div className="max-w-4xl mx-auto mt-10 rounded-xl border bg-muted/30 p-8">
          {failed && (
            <p role="alert" className="mb-4 text-sm text-amber-800">
              {lang === "de"
                ? "Der Rechner konnte nicht geladen werden. Bitte erneut versuchen."
                : lang === "en"
                  ? "The calculator could not load. Please try again."
                  : "Không thể tải công cụ tính lương. Vui lòng thử lại."}
            </p>
          )}
          {onLoad && (
            <button
              type="button"
              onClick={onLoad}
              className="rounded-lg bg-primary px-6 py-3 text-primary-foreground"
            >
              {t.simulator.title}
            </button>
          )}
          <p className="text-xs text-muted-foreground mt-6">{content.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}

/** Only this optional interactive tool waits for proximity; core homepage content stays SSR. */
export function DeferredSalarySimulator() {
  const target = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [Calculator, setCalculator] = useState<ComponentType | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!active) return;
    const controller = new AbortController();
    // Handle chunk failures locally so an optional tool cannot replace the homepage.
    void withDeadline(() => import("@/components/tools/SalarySimulator"), 15000, controller)
      .then((module) => {
        if (!controller.signal.aborted) {
          setCalculator(() => module.SalarySimulator);
          setFailed(false);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted || controller.signal.reason?.name === "TimeoutError")
          setFailed(true);
      });
    return () => controller.abort();
  }, [active, attempt]);

  useEffect(() => {
    if (active) return;
    // Older browsers still receive the tool, without depending on observation support.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setActive(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px" }
    );
    if (target.current) observer.observe(target.current);
    return () => observer.disconnect();
  }, [active]);

  return (
    <div ref={target} className="min-h-[1050px] md:min-h-[1000px]">
      {Calculator ? (
        <Calculator />
      ) : (
        <SalaryPreview
          failed={failed}
          onLoad={
            !active || failed
              ? () => {
                  setFailed(false);
                  setActive(true);
                  setAttempt((value) => value + 1);
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
