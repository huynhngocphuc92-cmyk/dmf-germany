"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

// Neutral space only: never show sample or previously published profiles.
export function CandidateRegionState({
  region,
  error = false,
}: {
  region: "hero" | "talent";
  error?: boolean;
}) {
  const { lang, t } = useLanguage();
  const message = error
    ? t.candidates.error_loading
    : lang === "de"
      ? "Profile werden geladen …"
      : lang === "en"
        ? "Loading profiles …"
        : "Đang tải hồ sơ …";
  const content = (
    <div
      role="status"
      aria-busy={!error}
      className="flex h-full items-center justify-center p-8 text-center"
    >
      {message}
    </div>
  );

  return region === "hero" ? (
    <div className="h-[500px] md:h-[600px] max-w-[300px] mx-auto rounded-2xl border border-white/20 bg-white/10 text-white">
      {content}
    </div>
  ) : (
    <section
      id="talent-showcase"
      className="min-h-[900px] py-20 md:py-28 bg-gradient-to-b from-muted/40 via-background to-background"
    >
      <div className="container mx-auto px-4 max-w-6xl text-muted-foreground">{content}</div>
    </section>
  );
}
