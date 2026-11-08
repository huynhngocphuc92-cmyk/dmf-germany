import { BLOG_CATALOG } from "../geo/blog-catalog";
import { PUBLIC_ROUTES, SITE_URL, siteUrl } from "../site";

export const INDEXNOW_KEY = "d4f81a18ab16a296a59b3c0de2026da1";
export const INDEXNOW_HOST = new URL(SITE_URL).host;
export const INDEXNOW_KEY_LOCATION = siteUrl(`/${INDEXNOW_KEY}.txt`);

export const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
] as const;

export const AI_DISCOVERY_PATHS = [
  "/llms.txt",
  "/llms-full.txt",
  "/openapi.json",
  "/.well-known/agent.json",
  "/.well-known/ai-plugin.json",
  "/index.md",
  "/services/skilled-workers.md",
  "/services/azubi.md",
  "/services/seasonal.md",
  "/roi-rechner.md",
  "/fuer-arbeitgeber/zeitplan.md",
] as const;

/**
 * Builds the complete, deduplicated list of canonical URLs for IndexNow submission,
 * covering all public pages, AI discovery manifests, Markdown mirrors, and all 158 blog posts.
 */
export function buildIndexNowUrlList(): string[] {
  const urls = new Set<string>();

  for (const route of PUBLIC_ROUTES) {
    urls.add(siteUrl(route));
  }

  for (const path of AI_DISCOVERY_PATHS) {
    urls.add(siteUrl(path));
  }

  for (const post of BLOG_CATALOG) {
    urls.add(siteUrl(`/blog/${encodeURIComponent(post.slug)}`));
  }

  return Array.from(urls);
}

export interface IndexNowEndpointResult {
  endpoint: string;
  status: number;
  ok: boolean;
  statusText: string;
}

export interface IndexNowSubmissionSummary {
  ok: boolean;
  host: string;
  key: string;
  keyLocation: string;
  urlCount: number;
  submittedAt: string;
  results: IndexNowEndpointResult[];
}

/**
 * Submits URLs to IndexNow endpoints (api.indexnow.org & www.bing.com/indexnow).
 * HTTP 200 (OK) and HTTP 202 (Accepted - key verification pending) both indicate success.
 */
export async function submitIndexNowBatch(
  customUrls?: string[],
  fetchImpl: typeof fetch = fetch
): Promise<IndexNowSubmissionSummary> {
  const urlList =
    customUrls && customUrls.length > 0
      ? Array.from(new Set(customUrls.filter((u) => u.startsWith(SITE_URL))))
      : buildIndexNowUrlList();

  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList,
  };

  const results: IndexNowEndpointResult[] = [];

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      const response = await fetchImpl(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      });
      const accepted = response.status === 200 || response.status === 202;
      results.push({
        endpoint,
        status: response.status,
        ok: accepted,
        statusText: response.statusText || (accepted ? "Accepted" : "Failed"),
      });
    } catch (error) {
      results.push({
        endpoint,
        status: 0,
        ok: false,
        statusText: error instanceof Error ? error.message : "Network error",
      });
    }
  }

  return {
    ok: results.some((r) => r.ok),
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlCount: urlList.length,
    submittedAt: new Date().toISOString(),
    results,
  };
}
