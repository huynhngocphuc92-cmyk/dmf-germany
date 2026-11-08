import { MetadataRoute } from "next";
import { siteUrl, SITE_URL } from "@/lib/site";

export const AI_SEARCH_USER_AGENTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "YouBot",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/portal/"],
      },
      {
        userAgent: [...AI_SEARCH_USER_AGENTS],
        allow: ["/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/api/", "/admin/", "/portal/"],
      },
    ],
    sitemap: siteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
