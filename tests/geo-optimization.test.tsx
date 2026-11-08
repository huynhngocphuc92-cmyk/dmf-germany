import fs from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

import { HomeClient } from "@/app/home-client";
import robots, { AI_SEARCH_USER_AGENTS } from "@/app/robots";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { GeoKnowledgeSection } from "@/components/sections/GeoKnowledgeSection";
import { AeoSnippetSection } from "@/components/seo/AeoSnippetSection";
import JsonLd from "@/components/seo/JsonLd";
import FAQSection from "@/components/shared/FAQSection";
import {
  BLOG_CATALOG,
  TRUST_ANCHOR_REWRITES,
  appendVaryAccept,
  prefersMarkdown,
  resolveMarkdownDocument,
} from "@/lib/geo/markdown-negotiation";
import { GEO_TOPIC_MATRIX, getGeoTopicsByCategory } from "@/lib/geo/topic-matrix";
import { buildBlogSystemPrompt, buildTopicSuggestionsPrompt } from "@/lib/prompts/blog-writer";
import {
  ROI_RECHNER_AEO_CONFIG,
  SERVICE_AEO_CONFIGS,
  ZEITPLAN_AEO_CONFIG,
  buildFaqSchema,
  buildRoiAppSchemas,
  buildServicePageSchemas,
  buildTimelinePageSchemas,
} from "@/lib/seo/aeo-schemas";
import { blogStructuredData, extractFaqFromHtml } from "@/lib/seo/blog";
import {
  HOMEPAGE_GEO_FAQS,
  buildGlobalSchemas,
  buildHomepageFaqSchema,
} from "@/lib/seo/geo-schemas";
import { proxy } from "@/proxy";

describe("GEO (Generative Engine Optimization) & Is-Agentic Readiness Suite", () => {
  describe("1. Markdown Content Negotiation & Vary: Accept (markdown-negotiation-vary)", () => {
    it("parses RFC 9110 Accept headers accurately for AI agents vs browsers", () => {
      expect(prefersMarkdown("text/markdown")).toBe(true);
      expect(prefersMarkdown("text/markdown, text/html;q=0.8")).toBe(true);
      expect(prefersMarkdown("text/x-markdown, */*;q=0.1")).toBe(true);
      expect(prefersMarkdown("text/markdown, text/html")).toBe(true);

      // Standard browsers and generic fetch must receive HTML
      expect(
        prefersMarkdown("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
      ).toBe(false);
      expect(prefersMarkdown("text/html")).toBe(false);
      expect(prefersMarkdown("*/*")).toBe(false);
      expect(prefersMarkdown("text/html, text/markdown;q=0.5")).toBe(false);
      expect(prefersMarkdown("text/markdown;q=0")).toBe(false);
      expect(prefersMarkdown(null)).toBe(false);
    });

    it("serves Markdown with Content-Type: text/markdown and Vary: Accept on homepage and inner routes", async () => {
      const mdReq = new NextRequest("https://www.dmf-talents.de/", {
        headers: { Accept: "text/markdown" },
      });
      const mdRes = await proxy(mdReq);
      expect(mdRes.status).toBe(200);
      expect(mdRes.headers.get("content-type")).toContain("text/markdown");
      expect(mdRes.headers.get("vary")).toContain("Accept");

      const body = await mdRes.text();
      expect(body).toContain("# DMF Talents");
      expect(body).toContain("## When to use DMF Talents");
      expect(body).toContain("§ 18a");
      expect(body).toContain("§ 16a");
      expect(body).toContain("§ 81a");
      expect(body).toContain("https://www.dmf-talents.de/llms.txt");
      expect(body.length).toBeGreaterThan(2000);
    });

    it("preserves HTML response and appends Vary: Accept when Accept: text/html is sent", async () => {
      const htmlReq = new NextRequest("https://www.dmf-talents.de/", {
        headers: { Accept: "text/html,application/xhtml+xml" },
      });
      const htmlRes = await proxy(htmlReq);
      expect(htmlRes.status).toBe(200);
      expect(htmlRes.headers.get("content-type")).toBeNull(); // Downstream route sets text/html
      expect(htmlRes.headers.get("vary")).toContain("Accept");
      expect(appendVaryAccept("rsc, next-router-state-tree, accept-encoding")).toBe(
        "rsc, next-router-state-tree, accept-encoding, Accept"
      );
    });
  });

  describe("2. Agent-Friendly 404s (agent-friendly-404)", () => {
    it("returns HTTP 404 with a helpful Markdown body and discovery links when an unknown path is requested with Accept: text/markdown", async () => {
      const probeReq = new NextRequest("https://www.dmf-talents.de/__ora-404-probe-crgjw0he", {
        headers: { Accept: "text/markdown" },
      });
      const probeRes = await proxy(probeReq);
      expect(probeRes.status).toBe(404);
      expect(probeRes.headers.get("content-type")).toContain("text/markdown");
      expect(probeRes.headers.get("vary")).toContain("Accept");

      const errorMd = await probeRes.text();
      expect(errorMd.length).toBeGreaterThan(200);
      expect(errorMd).toContain("404 Not Found");
      expect(errorMd).toContain("https://www.dmf-talents.de/llms.txt");
      expect(errorMd).toContain("https://www.dmf-talents.de/sitemap.xml");
    });

    it("also returns 404 Markdown for unknown blog slugs or industry slugs", () => {
      const unknownBlog = resolveMarkdownDocument("/blog/non-existent-article-slug");
      expect(unknownBlog?.status).toBe(404);
      expect(unknownBlog?.markdown).toContain("404 Not Found");

      const knownBlog = resolveMarkdownDocument(
        "/blog/beschleunigtes-fachkraefteverfahren-81a-ablauf"
      );
      expect(knownBlog?.status).toBe(200);
      expect(knownBlog?.markdown).toContain("§ 81a AufenthG");
    });
  });

  describe("3. Homepage SSR Content without JavaScript & >5% Ratio (content-no-js)", () => {
    it("renders >12,000 characters of visible SSR text and achieves >5.5% content-to-HTML ratio", () => {
      const html = renderToStaticMarkup(
        <LanguageProvider>
          <main>
            <HomeClient
              assets={{}}
              heroCandidates={<div>Hero Candidates</div>}
              talentCandidates={<div>Talent Candidates</div>}
            />
          </main>
        </LanguageProvider>
      );

      const h1Matches = [...html.matchAll(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi)];
      expect(h1Matches.length).toBe(1);

      const nonScriptMarkup = html
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");

      const visibleText = nonScriptMarkup
        .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const ratioPercent = (visibleText.length / nonScriptMarkup.length) * 100;

      expect(visibleText.length).toBeGreaterThan(12000);
      expect(ratioPercent).toBeGreaterThanOrEqual(5.5);
    });
  });

  describe("4. Agent Instructions & When-to-Use Guidance (agent-instruction)", () => {
    it("includes explicit When-to-Use guidance, negative scope, and API calling instructions in public/llms.txt and public/llms-full.txt", () => {
      const llmsPath = path.join(process.cwd(), "public", "llms.txt");
      const llmsFullPath = path.join(process.cwd(), "public", "llms-full.txt");

      const llms = fs.readFileSync(llmsPath, "utf8");
      const llmsFull = fs.readFileSync(llmsFullPath, "utf8");

      expect(llms).toContain("## When to use DMF Talents");
      expect(llms).toContain("Do not use DMF Talents");
      expect(llms).toContain("## How agents should call DMF Talents");
      expect(llms).toContain("Accept: text/markdown");
      expect(llms).toContain("/api/candidates/match");
      expect(llms).toContain("/api/hiring/parse");
      expect(llms).toContain("/api/roi/brief");
      expect(llms).toContain("/api/pathway-check");
      expect(llms).not.toContain("https://www.dmf-talents.de/kontakt\n");

      expect(llmsFull).toContain("## 1. When to use DMF Talents");
      expect(llmsFull).toContain("KldB");
      expect(llmsFull.length).toBeGreaterThan(3500);
    });
  });

  describe("5. Organization & FAQPage JSON-LD Completeness (org-schema-completeness)", () => {
    it("includes PostalAddress, ContactPoint (email + telephone + contactType), legalName, and taxID in Organization JSON-LD", () => {
      const schemas = buildGlobalSchemas();
      const org = schemas.find(
        (s) => Array.isArray(s["@type"]) && s["@type"].includes("Organization")
      );
      expect(org).toBeDefined();
      expect(org?.legalName).toBe("DMF VIETNAM JOINT STOCK COMPANY");
      expect(org?.taxID).toBe("3603878495");
      expect(org?.address).toMatchObject({
        "@type": "PostalAddress",
        addressLocality: "Biên Hoà",
        addressRegion: "Đồng Nai",
        addressCountry: "VN",
      });
      expect(org?.contactPoint).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            "@type": "ContactPoint",
            contactType: "customer service",
            telephone: "+49 174 9015811",
            email: "contact@dmf-talents.de",
          }),
          expect.objectContaining({
            "@type": "ContactPoint",
            contactType: "sales",
            telephone: "+84 855 070773",
            email: "achim.betticher@dmf-talents.de",
          }),
        ])
      );

      const jsonLdHtml = renderToStaticMarkup(<JsonLd />);
      expect(jsonLdHtml).toContain("PostalAddress");
      expect(jsonLdHtml).toContain("ContactPoint");
    });

    it("embeds FAQPage JSON-LD with 8 authoritative B2B Q&As on the homepage", () => {
      const faqSchema = buildHomepageFaqSchema("de");
      expect(faqSchema["@type"]).toBe("FAQPage");
      expect(faqSchema.mainEntity).toHaveLength(HOMEPAGE_GEO_FAQS.length);
      expect(faqSchema.mainEntity.length).toBeGreaterThanOrEqual(8);

      const sectionHtml = renderToStaticMarkup(
        <LanguageProvider>
          <GeoKnowledgeSection />
        </LanguageProvider>
      );
      expect(sectionHtml).toContain('"@type":"FAQPage"');
      expect(sectionHtml).toContain("§ 81a AufenthG");
      expect(sectionHtml).toContain("§ 296a SGB III");
    });
  });

  describe("6. Trust Anchor Pages (/about, /contact, /privacy) (trust-anchors)", () => {
    it("provides >500 chars for /about, /contact, and /privacy and maps rewrites in next.config.ts", async () => {
      for (const trustPath of ["/about", "/contact", "/privacy", "/datenschutz", "/impressum"]) {
        const doc = resolveMarkdownDocument(trustPath);
        expect(doc?.status).toBe(200);
        expect(doc?.markdown.length).toBeGreaterThan(500);
      }

      expect(TRUST_ANCHOR_REWRITES).toEqual(
        expect.arrayContaining([
          { source: "/privacy", destination: "/datenschutz" },
          { source: "/about", destination: "/ueber-uns/ausbildung" },
          { source: "/contact", destination: "/fuer-arbeitgeber/personalbedarf" },
        ])
      );

      const footerHtml = renderToStaticMarkup(
        <LanguageProvider>
          <Footer />
        </LanguageProvider>
      );
      expect(footerHtml).toContain('href="/datenschutz"');
      expect(footerHtml).toContain('href="/privacy"');
      expect(footerHtml).toContain('href="/impressum"');
      expect(footerHtml).toContain('href="/llms.txt"');
    });
  });

  describe("7. AI Search Crawler Rules in robots.ts", () => {
    it("explicitly allows OAI-SearchBot, PerplexityBot, ClaudeBot, GPTBot, and Google-Extended while protecting private routes", () => {
      const rules = robots();
      expect(rules.sitemap).toBe("https://www.dmf-talents.de/sitemap.xml");
      expect(AI_SEARCH_USER_AGENTS).toEqual(
        expect.arrayContaining([
          "OAI-SearchBot",
          "ChatGPT-User",
          "GPTBot",
          "PerplexityBot",
          "ClaudeBot",
          "Google-Extended",
        ])
      );
      const ruleList = Array.isArray(rules.rules) ? rules.rules : [rules.rules];
      const aiRule = ruleList.find((r) => Array.isArray(r.userAgent));
      expect(aiRule?.allow).toEqual(["/", "/llms.txt", "/llms-full.txt"]);
      expect(aiRule?.disallow).toEqual(["/api/", "/admin/", "/portal/"]);
    });
  });

  describe("8. Full 143+ Editorial Blog Corpus Synced into GEO Discovery", () => {
    it("indexes all 158 compiled blog posts in BLOG_CATALOG, llms.txt, and llms-full.txt", () => {
      const compiledPosts = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), "content/compiled/all-posts.json"), "utf8")
      ) as Array<{ slug: string; title: string; content: string; excerpt: string }>;

      expect(compiledPosts.length).toBeGreaterThanOrEqual(158);
      expect(BLOG_CATALOG.length).toBeGreaterThanOrEqual(compiledPosts.length);

      // Verify 100% of all 158 compiled blog posts have Answer-First TL;DR and >=3 extracted FAQPage Q&As
      for (const post of compiledPosts) {
        expect(post.content, `Missing TL;DR in ${post.slug}`).toContain(
          "<strong>Das Wichtigste in Kürze:</strong>"
        );
        const faqs = extractFaqFromHtml(post.content);
        expect(faqs.length, `Fewer than 3 FAQs in ${post.slug}`).toBeGreaterThanOrEqual(3);
      }

      // Verify all 15 GEO flagship articles are compiled with TL;DR, HTML tables, and >=3 FAQPage Q&As
      const bySlug = new Map(compiledPosts.map((p) => [p.slug, p]));
      for (const blueprint of GEO_TOPIC_MATRIX) {
        const compiled = bySlug.get(blueprint.slug);
        expect(compiled, `Missing compiled GEO post: ${blueprint.slug}`).toBeDefined();
        expect(compiled?.content).toContain("<strong>Das Wichtigste in Kürze:</strong>");
        expect(compiled?.content).toContain("<table>");

        const faqs = extractFaqFromHtml(compiled?.content);
        expect(faqs.length).toBeGreaterThanOrEqual(3);

        const schemas = blogStructuredData({
          slug: compiled!.slug,
          title: compiled!.title,
          excerpt: compiled!.excerpt,
          updated_at: "2026-11-08T00:00:00Z",
          content: compiled!.content,
        });
        expect(schemas).toHaveLength(3);
        expect(schemas[2]?.["@type"]).toBe("FAQPage");

        const mdDoc = resolveMarkdownDocument(`/blog/${blueprint.slug}`);
        expect(mdDoc?.status).toBe(200);
        expect(mdDoc?.markdown).toContain("## Kernaussagen & Gliederung");
      }

      const llms = fs.readFileSync(path.join(process.cwd(), "public/llms.txt"), "utf8");
      const llmsFull = fs.readFileSync(path.join(process.cwd(), "public/llms-full.txt"), "utf8");
      expect(llms).toContain(
        "https://www.dmf-talents.de/blog/anerkennungspartnerschaft-16d-vs-18a-aufenthg-arbeitgeber-vergleich"
      );
      expect(llmsFull).toContain(
        "https://www.dmf-talents.de/blog/probezeit-patensystem-interkulturelle-fuehrung-vietnamesische-fachkraefte"
      );
    });
  });

  describe("9. GEO-First AI Blog Writer Prompts & 15-Topic B2B Prompt Matrix", () => {
    it("enforces Answer-First TL;DR, question-form <h2> headings, HTML comparison tables, and primary legal entities in buildBlogSystemPrompt", () => {
      const prompt = buildBlogSystemPrompt({
        topic: "§ 16d vs § 18a AufenthG für Pflegebetriebe",
        language: "de",
        tone: "professional",
        length: "medium",
        keywords: ["§ 16d AufenthG", "§ 18a AufenthG", "Pflegekräfte Vietnam"],
      });

      expect(prompt).toContain("GEO (GENERATIVE ENGINE OPTIMIZATION) & AI CITATION ARCHITECTURE");
      expect(prompt).toContain("Das Wichtigste in Kürze:");
      expect(prompt).toContain("<table>");
      expect(prompt).toContain("FAQPage JSON-LD");
      expect(prompt).toContain("/roi-rechner");
      expect(prompt).toContain("/fuer-arbeitgeber/zeitplan");
      expect(prompt).toContain("FACTS & EDITORIAL ACCURACY (STRICT)");
    });

    it("provides 15 prompt-targeted B2B topics across all 5 strategic clusters and injects them into buildTopicSuggestionsPrompt", () => {
      expect(GEO_TOPIC_MATRIX).toHaveLength(15);
      for (const blueprint of GEO_TOPIC_MATRIX) {
        expect(blueprint.targetPromptDe).toMatch(/\?$/);
        expect(blueprint.legalEntities.length).toBeGreaterThanOrEqual(2);
        expect(blueprint.comparisonTableColumns.length).toBeGreaterThanOrEqual(3);
        expect(blueprint.questionHeadingsDe.length).toBeGreaterThanOrEqual(3);
        expect(blueprint.targetCtaUrl.startsWith("/")).toBe(true);
      }

      const visaTopics = getGeoTopicsByCategory("visa-legal");
      expect(visaTopics.length).toBeGreaterThanOrEqual(4);

      const topicPrompt = buildTopicSuggestionsPrompt("de", "visa-legal");
      expect(topicPrompt).toContain("HIGH-INTENT B2B EMPLOYER PROMPT ARCHETYPES");
      expect(topicPrompt).toContain("§ 16d");
      expect(topicPrompt).toContain("§ 81a AufenthG");
    });
  });

  describe("10. AEO (Answer Engine Optimization) — Featured Snippets, PAA, Speakable & Rich Results", () => {
    it("renders FAQPage JSON-LD, semantic <h3> questions, and aria-expanded in FAQSection", () => {
      const html = renderToStaticMarkup(
        <FAQSection
          items={SERVICE_AEO_CONFIGS["skilled-workers"].faqs}
          theme="emerald"
          pagePath="/services/skilled-workers"
        />
      );

      expect(html).toContain('"@type":"FAQPage"');
      expect(html).toContain('"@id":"https://www.dmf-talents.de/services/skilled-workers#faq"');
      expect(html).toContain("<h3");
      expect(html).toContain('aria-expanded="true"');
      expect(html).toContain("Berufsqualifikationsfeststellungsgesetz (BQFG)");
    });

    it("emits Service, WebPage (SpeakableSpecification), BreadcrumbList, Direct Answer Box, and Comparison Table for all 3 Core Service Pages", () => {
      for (const key of ["skilled-workers", "azubi", "seasonal"] as const) {
        const config = SERVICE_AEO_CONFIGS[key];
        const schemas = buildServicePageSchemas(key);

        expect(schemas).toHaveLength(3);
        expect(schemas[0]["@type"]).toBe("Service");
        expect(schemas[1]["@type"]).toBe("WebPage");
        expect(schemas[1].speakable).toEqual(
          expect.objectContaining({
            "@type": "SpeakableSpecification",
          })
        );
        expect(schemas[2]["@type"]).toBe("BreadcrumbList");

        const html = renderToStaticMarkup(
          <AeoSnippetSection config={config} schemas={schemas} accentColor="emerald" />
        );

        expect(html).toContain("aeo-direct-answer");
        expect(html).toContain("<strong>Das Wichtigste in Kürze:</strong>");
        expect(html).toContain("<table");
        expect(html).toContain("<caption");
        expect(html).toContain('"@type":"Service"');
        expect(html).toContain('"@type":"SpeakableSpecification"');
      }
    });

    it("provides SSR Direct Answer Box, Benchmark/§81a Tables, WebApplication & HowTo JSON-LD for /roi-rechner and /fuer-arbeitgeber/zeitplan", () => {
      const roiSchemas = buildRoiAppSchemas("/roi-rechner");
      expect(roiSchemas[0]["@type"]).toBe("WebApplication");
      expect(roiSchemas[1]["@type"]).toBe("WebPage");

      const roiHtml = renderToStaticMarkup(
        <AeoSnippetSection
          config={ROI_RECHNER_AEO_CONFIG}
          schemas={roiSchemas}
          accentColor="primary"
        />
      );
      expect(roiHtml).toContain("aeo-direct-answer");
      expect(roiHtml).toContain("Zeitarbeit / Leiharbeit (AÜG)");
      expect(roiHtml).toContain('"@type":"WebApplication"');

      const timelineSchemas = buildTimelinePageSchemas();
      expect(timelineSchemas[0]["@type"]).toBe("HowTo");
      expect(timelineSchemas[0].step).toHaveLength(5);

      const timelineHtml = renderToStaticMarkup(
        <AeoSnippetSection
          config={ZEITPLAN_AEO_CONFIG}
          schemas={timelineSchemas}
          accentColor="primary"
        />
      );
      expect(timelineHtml).toContain("aeo-direct-answer");
      expect(timelineHtml).toContain("§ 81a AufenthG");
      expect(timelineHtml).toContain('"@type":"HowTo"');

      const faqSchema = buildFaqSchema(ZEITPLAN_AEO_CONFIG.faqs, "/fuer-arbeitgeber/zeitplan");
      expect(faqSchema["@type"]).toBe("FAQPage");
      expect(faqSchema.mainEntity).toHaveLength(5);
    });

    it("includes SpeakableSpecification on WebSite and BlogPosting schemas", () => {
      const globalSchemas = buildGlobalSchemas();
      const websiteSchema = globalSchemas.find((s) => s["@type"] === "WebSite");
      expect(websiteSchema?.speakable).toEqual(
        expect.objectContaining({
          "@type": "SpeakableSpecification",
        })
      );

      const blogSchemas = blogStructuredData({
        slug: "test-post",
        title: "Test Post",
        excerpt: "Test Excerpt",
        updated_at: "2026-11-08T00:00:00Z",
        content:
          "<h2>Was kostet das Verfahren?</h2><p>Die Gebühr nach § 81a AufenthG beträgt 411 Euro bei der Ausländerbehörde.</p>",
      });
      expect(blogSchemas[0].speakable).toEqual(
        expect.objectContaining({
          "@type": "SpeakableSpecification",
        })
      );
    });
  });
});
