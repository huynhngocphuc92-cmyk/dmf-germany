import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Post } from "@/app/admin/posts/types";
import { BlogListClient } from "@/app/blog/blog-list-client";
import { BlogDetailClient } from "@/app/blog/[slug]/blog-detail-client";
import { formatBlogDate } from "@/lib/blog-date";

const language = vi.hoisted(() => ({ lang: "de" as "de" | "en" | "vn" }));
vi.mock("@/components/providers/LanguageProvider", () => ({ useLanguage: () => language }));

afterEach(() => {
  vi.unstubAllEnvs();
  language.lang = "de";
});

const translations = [
  {
    lang: "de",
    months: [
      ["Sept.", "September"],
      ["Jan.", "Januar"],
      ["März", "März"],
      ["Okt.", "Oktober"],
    ],
  },
  {
    lang: "en",
    months: [
      ["Sep", "September"],
      ["Jan", "January"],
      ["Mar", "March"],
      ["Oct", "October"],
    ],
  },
  {
    lang: "vn",
    months: [
      ["thg 9", "tháng 9"],
      ["thg 1", "tháng 1"],
      ["thg 3", "tháng 3"],
      ["thg 10", "tháng 10"],
    ],
  },
] as const;

const boundaries = [
  // Published at Berlin midnight in summer and winter.
  ["2026-09-22T22:00:00+00:00", "23", 0],
  ["2026-01-22T23:00:00+00:00", "23", 1],
  // Midnight boundaries on both sides of the spring/fall DST changes:
  // a fixed UTC+1 or UTC+2 offset would fail at least one of these.
  ["2026-03-28T22:00:00Z", "28", 2],
  ["2026-03-29T22:00:00Z", "30", 2],
  ["2026-10-24T22:00:00Z", "25", 3],
  ["2026-10-25T22:00:00Z", "25", 3],
  // Immediately before and after the actual clock changes.
  ["2026-03-29T00:59:59Z", "29", 2],
  ["2026-03-29T01:00:00Z", "29", 2],
  ["2026-10-25T00:59:59Z", "25", 3],
  ["2026-10-25T01:00:00Z", "25", 3],
] as const;

const post: Post = {
  id: "boundary-post",
  slug: "boundary-post",
  title: "Boundary post",
  content: "<p>Article content</p>",
  status: "published",
  published_at: boundaries[0][0],
  created_at: "2020-01-01T00:00:00Z",
  updated_at: "2026-09-23T00:00:00Z",
};

function timeElements(html: string) {
  return [...html.matchAll(/<time\b[^>]*datetime="([^"]*)"[^>]*>([\s\S]*?)<\/time>/gi)].map(
    ([, dateTime, content]) => ({ dateTime, text: content.replace(/<[^>]*>/g, "") })
  );
}

describe.each(["UTC", "Asia/Ho_Chi_Minh", "America/Los_Angeles"])(
  "blog dates on a %s host",
  (tz) => {
    it.each(translations)("formats exact Berlin calendar dates in $lang", ({ lang, months }) => {
      vi.stubEnv("TZ", tz);
      // Verify the host simulation really changes native Date behavior.
      const hostOffsets: Record<string, number> = {
        UTC: 0,
        "Asia/Ho_Chi_Minh": -420,
        "America/Los_Angeles": 420,
      };
      expect(new Date(boundaries[0][0]).getTimezoneOffset()).toBe(hostOffsets[tz]);
      for (const [timestamp, day, monthIndex] of boundaries) {
        expect(formatBlogDate(timestamp, lang, "short")).toBe(
          `${day} ${months[monthIndex][0]} 2026`
        );
        expect(formatBlogDate(timestamp, lang, "long")).toBe(
          `${day} ${months[monthIndex][1]} 2026`
        );
      }
      expect(formatBlogDate("2026-01-01T23:00:00Z", lang)).toBe(`02 ${months[1][0]} 2026`);
    });

    it.each(translations)(
      "renders list, detail and related dates consistently in $lang",
      ({ lang, months }) => {
        vi.stubEnv("TZ", tz);
        language.lang = lang;
        const relatedPost = { ...post, id: "related", published_at: boundaries[1][0] };
        const list = renderToStaticMarkup(<BlogListClient posts={[post]} />);
        const detail = renderToStaticMarkup(
          <BlogDetailClient post={post} relatedPosts={[relatedPost]} />
        );
        expect(timeElements(list)).toEqual([
          { dateTime: post.published_at, text: `23 ${months[0][0]} 2026` },
        ]);
        expect(timeElements(detail)).toEqual([
          { dateTime: post.published_at, text: `23 ${months[0][1]} 2026` },
          { dateTime: relatedPost.published_at, text: `23 ${months[1][0]} 2026` },
        ]);
      }
    );
  }
);

it.each([undefined, null, "", "invalid", "2026-99-99T00:00:00Z"])(
  "returns a neutral placeholder for an unusable timestamp (%s)",
  (timestamp) => {
    for (const { lang } of translations) {
      expect(formatBlogDate(timestamp, lang)).toBe("—");
      expect(formatBlogDate(timestamp, lang, "long")).toBe("—");
    }
  }
);

it("preserves the creation-date fallback and renders invalid dates without crashing", () => {
  const fallback = { ...post, published_at: undefined, created_at: boundaries[0][0] };
  const invalid = { ...post, published_at: "invalid" };
  expect(timeElements(renderToStaticMarkup(<BlogListClient posts={[fallback]} />))).toEqual([
    { dateTime: fallback.created_at, text: "23 Sept. 2026" },
  ]);
  expect(
    timeElements(renderToStaticMarkup(<BlogDetailClient post={invalid} relatedPosts={[invalid]} />))
  ).toEqual([
    { dateTime: "invalid", text: "—" },
    { dateTime: "invalid", text: "—" },
  ]);
});
