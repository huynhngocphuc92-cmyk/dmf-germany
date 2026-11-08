#!/usr/bin/env node
/**
 * Syncs all compiled blog posts from `content/compiled/all-posts.json` into:
 * 1. `lib/geo/blog-catalog.ts` (for Markdown Content Negotiation & LLMO Deep Chunk Serving on `/blog/[slug]` and `/blog/[slug].md`)
 * 2. `public/llms.txt` (concise LLM discovery index of all 158+ blog posts)
 * 3. `public/llms-full.txt` (comprehensive LLM knowledge base with article summaries and subheadings)
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const COMPILED_POSTS_PATH = path.join(ROOT, "content/compiled/all-posts.json");
const BLOG_CATALOG_TS_PATH = path.join(ROOT, "lib/geo/blog-catalog.ts");
const LLMS_TXT_PATH = path.join(ROOT, "public/llms.txt");
const LLMS_FULL_TXT_PATH = path.join(ROOT, "public/llms-full.txt");

function stripHtml(html) {
  return String(html || "")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function extractHeadings(html) {
  const headings = [];
  const regex = /<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi;
  let match;
  while ((match = regex.exec(String(html || ""))) !== null) {
    const clean = stripHtml(match[1]);
    if (clean && clean.length >= 4 && headings.length < 8) {
      headings.push(clean);
    }
  }
  return headings;
}

function extractTldr(html) {
  const raw = String(html || "");
  const match = raw.match(
    /<p[^>]*>\s*<strong>\s*Das Wichtigste in Kürze:\s*<\/strong>([\s\S]*?)<\/p>/i
  );
  if (match) {
    return stripHtml(match[1]);
  }
  const firstP = raw.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  return firstP ? stripHtml(firstP[1]) : undefined;
}

function extractFaqs(html) {
  const raw = String(html || "");
  const results = [];
  const headingRegex = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi;
  const matches = Array.from(raw.matchAll(headingRegex));

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const questionText = stripHtml(match[2] || "");
    if (!questionText.endsWith("?") || questionText.length < 10) {
      continue;
    }

    const sectionStart = (match.index ?? 0) + match[0].length;
    const sectionEnd = i + 1 < matches.length ? (matches[i + 1].index ?? raw.length) : raw.length;
    const sectionHtml = raw.slice(sectionStart, sectionEnd);

    const paragraphs = Array.from(sectionHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi))
      .map((m) => stripHtml(m[1] || ""))
      .filter((p) => p.length > 0);

    if (paragraphs.length === 0) continue;

    const answerText = paragraphs.slice(0, 2).join(" ").trim();
    if (answerText.length >= 35) {
      results.push({
        question: questionText,
        answer: answerText,
      });
    }
  }

  return results.slice(0, 6);
}

function extractTableMarkdown(html) {
  const raw = String(html || "");
  const tableMatch = raw.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
  if (!tableMatch) return undefined;

  const tableInner = tableMatch[1];
  const captionMatch = tableInner.match(/<caption[^>]*>([\s\S]*?)<\/caption>/i);
  const caption = captionMatch ? stripHtml(captionMatch[1]) : "";

  const rows = [];
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch;
  while ((trMatch = trRegex.exec(tableInner)) !== null) {
    const cells = [];
    const cellRegex = /<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi;
    let cellMatch;
    while ((cellMatch = cellRegex.exec(trMatch[1])) !== null) {
      cells.push(stripHtml(cellMatch[1]).replace(/\|/g, "/"));
    }
    if (cells.length >= 2) {
      rows.push(cells);
    }
  }

  if (rows.length < 2) return undefined;

  const colCount = rows[0].length;
  const headerLine = `| ${rows[0].join(" | ")} |`;
  const sepLine = `| ${Array(colCount).fill("---").join(" | ")} |`;
  const bodyLines = rows.slice(1).map((r) => {
    const padded = Array.from({ length: colCount }, (_, i) => r[i] || "");
    return `| ${padded.join(" | ")} |`;
  });

  return [
    ...(caption ? [`**Tabelle: ${caption}**`, ""] : []),
    headerLine,
    sepLine,
    ...bodyLines,
  ].join("\n");
}

function main() {
  const rawPosts = JSON.parse(fs.readFileSync(COMPILED_POSTS_PATH, "utf8"));
  const catalog = rawPosts.map((post) => {
    const summary = stripHtml(post.excerpt || post.meta_description || post.title);
    const headings = extractHeadings(post.content);
    const tldr = extractTldr(post.content);
    const faqs = extractFaqs(post.content);
    const tableMarkdown = extractTableMarkdown(post.content);
    return {
      slug: String(post.slug).trim(),
      title: stripHtml(post.title),
      summary,
      ...(tldr ? { tldr } : {}),
      headings,
      ...(tableMarkdown ? { tableMarkdown } : {}),
      ...(faqs.length > 0 ? { faqs } : {}),
    };
  });

  // Ensure smoke-test fixture entry is always present at the end
  const fullCatalog = [
    ...catalog,
    {
      slug: "fixture-current",
      title: "Fixture editorial article",
      summary: "Fixture excerpt",
      tldr: "Fixture Zusammenfassung für automatisierte Rauchtests.",
      headings: ["Welche Kriterien gelten im Auswahlprozess?"],
      faqs: [
        {
          question: "Welche Kriterien gelten im Auswahlprozess?",
          answer:
            "Im Auswahlprozess prüfen wir Sprachzertifikate (B1/B2), Berufsabschlüsse nach BQFG und die praktische Eignung für deutsche Arbeitgeber.",
        },
      ],
    },
  ];

  // 1. Write `lib/geo/blog-catalog.ts`
  const tsContent = `// AUTO-GENERATED by scripts/sync-geo-blog-catalog.mjs from content/compiled/all-posts.json
// Total compiled editorial articles: ${catalog.length}

export interface BlogCatalogFaq {
  question: string;
  answer: string;
}

export interface BlogCatalogEntry {
  slug: string;
  title: string;
  summary: string;
  tldr?: string;
  headings?: string[];
  tableMarkdown?: string;
  faqs?: BlogCatalogFaq[];
}

export const BLOG_CATALOG: BlogCatalogEntry[] = ${JSON.stringify(fullCatalog, null, 2)};
`;
  fs.writeFileSync(BLOG_CATALOG_TS_PATH, tsContent, "utf8");

  // 2. Update `public/llms.txt` blog section
  const llmsTxt = fs.readFileSync(LLMS_TXT_PATH, "utf8");
  const blogMarker = "## Redaktionelle Leitfäden & Wissensdatenbank (Blog)";
  const markerIdx = llmsTxt.indexOf(blogMarker);
  const baseLlmsTxt = markerIdx !== -1 ? llmsTxt.slice(0, markerIdx).trimEnd() : llmsTxt.trimEnd();

  const llmsBlogLines = catalog.map(
    (entry) =>
      `- **${entry.title}:** ${entry.summary} (URL: https://www.dmf-talents.de/blog/${entry.slug})`
  );

  const updatedLlmsTxt = [
    baseLlmsTxt,
    "",
    `${blogMarker} (${catalog.length} Fachbeiträge)`,
    ...llmsBlogLines,
    "",
  ].join("\n");
  fs.writeFileSync(LLMS_TXT_PATH, updatedLlmsTxt, "utf8");

  // 3. Update `public/llms-full.txt` with section 5 for all 158 blog posts
  const llmsFullTxt = fs.readFileSync(LLMS_FULL_TXT_PATH, "utf8");
  const fullBlogMarker = "## 5. Vollständiges Verzeichnis der Redaktionellen Wissensdatenbank";
  const fullMarkerIdx = llmsFullTxt.indexOf(fullBlogMarker);
  const baseLlmsFullTxt =
    fullMarkerIdx !== -1
      ? llmsFullTxt
          .slice(0, fullMarkerIdx)
          .replace(/\n---\s*$/, "")
          .trimEnd()
      : llmsFullTxt.trimEnd();

  const fullBlogBlocks = catalog.map((entry, idx) => {
    const headingText =
      entry.headings && entry.headings.length > 0
        ? ` | Schwerpunkte: ${entry.headings.slice(0, 4).join(" • ")}`
        : "";
    return `${idx + 1}. **[${entry.title}](https://www.dmf-talents.de/blog/${entry.slug})** — ${entry.summary}${headingText}`;
  });

  const updatedLlmsFullTxt = [
    baseLlmsFullTxt,
    "",
    "---",
    "",
    `${fullBlogMarker} (${catalog.length} B2B-Leitfäden)`,
    "",
    ...fullBlogBlocks,
    "",
  ].join("\n");
  fs.writeFileSync(LLMS_FULL_TXT_PATH, updatedLlmsFullTxt, "utf8");

  process.stdout.write(
    `Synced ${catalog.length} compiled blog posts (with TL;DR, Markdown tables, and Q&A chunks) into lib/geo/blog-catalog.ts, public/llms.txt, and public/llms-full.txt.\n`
  );
}

main();
