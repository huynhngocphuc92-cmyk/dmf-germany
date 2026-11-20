import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { BlogPostSummary, Post } from "@/app/admin/posts/types";
import { BlogListClient } from "@/app/blog/blog-list-client";
import {
  BlogDetailClient,
  splitArticleHtmlForInlineCta,
} from "@/app/blog/[slug]/blog-detail-client";
import {
  NOINDEX_BLOG_CONSOLIDATION_MAP,
  classifyBlogPost,
  isNoindexBlogSlug,
  matchRegionalStandort,
} from "@/lib/blog/seo-taxonomy";
import { GEO_TOPIC_MATRIX } from "@/lib/geo/topic-matrix";
import { blogMetadata } from "@/lib/seo/blog";

vi.mock("next/navigation", () => ({
  usePathname: () => "/blog",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

const language = vi.hoisted(() => ({ lang: "de" as "de" | "en" | "vn" }));
vi.mock("@/components/providers/LanguageProvider", () => ({ useLanguage: () => language }));

const LIVE_TRAFFIC_SLUGS = [
  "blaue-karte-eu-2027-mindestlohn-gehaltsgrenzen-drittstaaten",
  "beschleunigtes-fachkraefteverfahren-81a-ablauf",
  "nebenjob-minijob-auszubildende-fachkraefte-drittstaaten-erlaubnis",
  "fachkraefte-nachwuchs-vietnam-ostdeutschland-sachsen-thueringen",
  "handwerk-azubis-vietnam-niedersachsen-bremen-industrie",
  "hotelfachmann-restaurantfachkraft-vietnam-dehoga-gastronomie",
];

describe("SEO & Growth Optimization Suite", () => {
  it("never marks GEO flagship articles or live-traffic articles as noindex", () => {
    const consolidatedSlugs = new Set(Object.keys(NOINDEX_BLOG_CONSOLIDATION_MAP));
    expect(consolidatedSlugs.size).toBe(33);

    for (const blueprint of GEO_TOPIC_MATRIX) {
      expect(consolidatedSlugs.has(blueprint.slug)).toBe(false);
    }
    for (const liveSlug of LIVE_TRAFFIC_SLUGS) {
      expect(consolidatedSlugs.has(liveSlug)).toBe(false);
    }
  });

  it("classifies blog posts into strategic B2B clusters and matches regional § 81a pages", () => {
    expect(classifyBlogPost("pflegekraefte-aus-vietnam-anerkennung").id).toBe("pflege");
    expect(classifyBlogPost("anlagenmechaniker-shk-waermepumpen-monteure-vietnam").id).toBe(
      "handwerk"
    );
    expect(
      classifyBlogPost("hotelfachmann-restaurantfachkraft-vietnam-dehoga-gastronomie").id
    ).toBe("gastronomie");
    expect(
      classifyBlogPost("cnc-zerspaner-iso-9606-schweisser-vietnam-industrie-leitfaden").id
    ).toBe("industrie");
    expect(
      classifyBlogPost("azubi-16a-oder-fachkraft-18a-vietnam-entscheidungshilfe-arbeitgeber").id
    ).toBe("azubi");
    expect(
      classifyBlogPost("3-jahres-tco-vollkostenrechnung-direktrekrutierung-vs-headhunter").id
    ).toBe("kosten-praxis");
    expect(classifyBlogPost("beschleunigtes-fachkraefteverfahren-81a-ablauf").id).toBe(
      "visum-recht"
    );

    expect(matchRegionalStandort("zsef-nuernberg-bayern-81a-lfp-amberg-fast-lane")?.href).toBe(
      "/fuer-arbeitgeber/standorte/bayern"
    );
    expect(
      matchRegionalStandort("zfe-nrw-bonn-bezirksregierung-koeln-zag-muenster-81a")?.href
    ).toBe("/fuer-arbeitgeber/standorte/nordrhein-westfalen");
    expect(
      matchRegionalStandort("fachkraefte-nachwuchs-vietnam-ostdeutschland-sachsen-thueringen")?.href
    ).toBe("/fuer-arbeitgeber/standorte/sachsen-mitteldeutschland");
  });

  it("emits robots noindex, follow only on consolidated posts", () => {
    const consolidatedSlug = "wohnung-anmeldung-bmg-rundfunkbeitrag-gez-unterkunft-arbeitgeber";
    expect(isNoindexBlogSlug(consolidatedSlug)).toBe(true);

    const noindexMeta = blogMetadata({
      slug: consolidatedSlug,
      title: "Wohnungsanmeldung BMG & GEZ",
      excerpt: "Hinweis",
      updated_at: "2026-11-19T00:00:00Z",
    });
    expect(noindexMeta.robots).toEqual({
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    });

    const flagshipMeta = blogMetadata({
      slug: "beschleunigtes-fachkraefteverfahren-81a-unterlagen-fristen-praxis",
      title: "§ 81a AufenthG Praxis-Leitfaden",
      excerpt: "Leitfaden",
      updated_at: "2026-11-19T00:00:00Z",
    });
    expect(flagshipMeta.robots).toBeUndefined();
  });

  it("renders BlogListClient with Pillar links, topic filters, pagination, and lightweight summaries", () => {
    const summaries: BlogPostSummary[] = Array.from({ length: 22 }, (_, i) => ({
      id: `sum-${i + 1}`,
      created_at: "2026-11-01T10:00:00Z",
      updated_at: "2026-11-01T10:00:00Z",
      published_at: "2026-11-01T10:00:00Z",
      status: "published",
      slug: i % 2 === 0 ? `pflege-artikel-${i + 1}` : `handwerk-artikel-${i + 1}`,
      title: i % 2 === 0 ? `Pflege Artikel ${i + 1}` : `Handwerk Artikel ${i + 1}`,
      excerpt: "Kurzbeschreibung",
      read_time_minutes: 6,
    }));

    const html = renderToStaticMarkup(<BlogListClient posts={summaries} />);
    expect(html).toContain("Fachkräfte &amp; Azubis aus Vietnam: Arbeitgeber-Ratgeber");
    expect(html).toContain('href="/services/skilled-workers"');
    expect(html).toContain('href="/services/azubi"');
    expect(html).toContain("Pflege &amp; Gesundheit (11)");
    expect(html).toContain("Handwerk &amp; Bau (11)");
    expect(html).toContain("Seite 1 von 2");
    expect(html).toContain("6 Min. Lesezeit");
    // Only 18 cards rendered on page 1
    expect(html.match(/<article\b/g)?.length).toBe(18);
  });

  it("splits long article HTML cleanly before H2 and injects mid-article CRO + Pillar links in BlogDetailClient", () => {
    const longHtml = `
      <p><strong>Das Wichtigste in Kürze:</strong> ${"Langer Einführungstext über die Rekrutierung von Pflegefachkräften aus Vietnam. ".repeat(10)}</p>
      <h2>1. Voraussetzungen für Kliniken und Pflegeheime</h2>
      <p>${"Ausführliche Details zur Gleichwertigkeitsprüfung und den Sprachanforderungen B1/B2 für Pflegekräfte aus Vietnam. ".repeat(8)}</p>
      <h2>2. Ablauf des beschleunigten Verfahrens nach § 81a AufenthG</h2>
      <p>Die Dauer beträgt durchschnittlich vier bis sechs Monate bis zur Einreise.</p>
    `;
    const [part1, part2] = splitArticleHtmlForInlineCta(longHtml);
    expect(part2).not.toBeNull();
    expect(part2?.startsWith("<h2")).toBe(true);
    expect(part1).toContain("1. Voraussetzungen");

    const post: Post = {
      id: "detail-1",
      created_at: "2026-11-01T10:00:00Z",
      updated_at: "2026-11-01T10:00:00Z",
      published_at: "2026-11-01T10:00:00Z",
      status: "published",
      slug: "pflegekraefte-vietnam-nordrhein-westfalen-nrw-kliniken",
      title: "Pflegekräfte aus Vietnam für Kliniken in NRW",
      content: longHtml,
      excerpt: "Praxisleitfaden für NRW",
    };

    const html = renderToStaticMarkup(<BlogDetailClient post={post} relatedPosts={[]} />);
    expect(html).not.toContain('style="opacity:0"');
    expect(html).toContain('data-blog-inline-cta="pflege"');
    expect(html).toContain('href="/fuer-arbeitgeber/branchen/pflege-gesundheit"');
    expect(html).toContain('href="/fuer-arbeitgeber/standorte/nordrhein-westfalen"');

    // Mid-article CTA sits strictly between section 1 and section 2
    const idxSec1 = html.indexOf("1. Voraussetzungen");
    const idxInlineCta = html.indexOf('data-blog-inline-cta="pflege"');
    const idxSec2 = html.indexOf("2. Ablauf des beschleunigten Verfahrens");
    expect(idxSec1).toBeGreaterThan(-1);
    expect(idxInlineCta).toBeGreaterThan(idxSec1);
    expect(idxSec2).toBeGreaterThan(idxInlineCta);
  });

  it("keeps experimental.inlineCss disabled in next.config.ts to prevent HTML/RSC CSS bloat", () => {
    const nextConfig = fs.readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8");
    expect(nextConfig).not.toMatch(/\binlineCss\s*:\s*true/);
  });
});
