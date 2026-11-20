import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { handleEdgeFetch, resolveLegacyMediaRedirect } from "@/lib/cloudflare/edge-worker";
import { getPublicMediaUrl } from "@/lib/media/r2-public";

vi.mock("server-only", () => ({}));
import { fetchEdgeAnalyticsReport } from "@/lib/cloudflare/analytics";

describe("Phase 3: R2 Media Offload, 308 Legacy Redirects & Analytics Engine", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("maps brochure PDF, compressed candidate videos, and dossier PDFs to R2 public URLs", () => {
    expect(getPublicMediaUrl("/DMF Vietnam Handbuch.pdf")).toBe(
      "https://media.dmf-talents.de/DMF-Vietnam-Handbuch.pdf"
    );
    expect(getPublicMediaUrl("/DMF%20Vietnam%20Handbuch.pdf")).toBe(
      "https://media.dmf-talents.de/DMF-Vietnam-Handbuch.pdf"
    );
    expect(getPublicMediaUrl("/candidates/videos/dmf-int-001.mp4")).toBe(
      "https://media.dmf-talents.de/candidates/videos/dmf-int-001.mp4"
    );
    expect(getPublicMediaUrl("/candidates/dossiers/dmf-int-001-koch.pdf")).toBe(
      "https://media.dmf-talents.de/candidates/dossiers/dmf-int-001-koch.pdf"
    );
    expect(getPublicMediaUrl("/candidates/avatars/dmf-int-001.jpg")).toBe(
      "/candidates/avatars/dmf-int-001.jpg"
    );
    expect(getPublicMediaUrl("https://cdn.example.com/video.mp4")).toBe(
      "https://cdn.example.com/video.mp4"
    );
  });

  it("serves permanent 308 redirects in Edge Worker for legacy Handbuch and candidate media paths", async () => {
    expect(
      resolveLegacyMediaRedirect(new URL("https://www.dmf-talents.de/DMF%20Vietnam%20Handbuch.pdf"))
    ).toBe("https://media.dmf-talents.de/DMF-Vietnam-Handbuch.pdf");
    expect(
      resolveLegacyMediaRedirect(
        new URL("https://www.dmf-talents.de/candidates/videos/dmf-int-003.mp4")
      )
    ).toBe("https://media.dmf-talents.de/candidates/videos/dmf-int-003.mp4");
    expect(resolveLegacyMediaRedirect(new URL("https://www.dmf-talents.de/blog"))).toBeNull();

    const nextFetch = vi.fn();
    const res = await handleEdgeFetch(
      new Request("https://www.dmf-talents.de/candidates/dossiers/dmf-int-001-koch.pdf"),
      {},
      { waitUntil: () => {} },
      nextFetch
    );
    expect(res.status).toBe(308);
    expect(res.headers.get("Location")).toBe(
      "https://media.dmf-talents.de/candidates/dossiers/dmf-int-001-koch.pdf"
    );
    expect(nextFetch).not.toHaveBeenCalled();
  });

  it("returns unconfigured state gracefully when CF_ANALYTICS_API_TOKEN is absent", async () => {
    vi.stubEnv("CF_ACCOUNT_ID", "cd2355b1655a8bf991ab9faaa0d14d5f");
    vi.stubEnv("CF_ANALYTICS_API_TOKEN", "");

    const report = await fetchEdgeAnalyticsReport("24h");
    expect(report.configured).toBe(false);
    expect(report.available).toBe(false);
    expect(report.totalRequests).toBe(0);
  });

  it("aggregates Cloudflare Analytics Engine SQL metrics accurately across routes, bots, cron, and geo", async () => {
    vi.stubEnv("CF_ACCOUNT_ID", "acct-test");
    vi.stubEnv("CF_ANALYTICS_API_TOKEN", "analytics-read-token");

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: [
              { route_group: "blog", cache_status: "HIT", reqs: "80", avg_ms: 10 },
              { route_group: "blog", cache_status: "MISS", reqs: "20", avg_ms: 600 },
              { route_group: "auth", cache_status: "BYPASS", reqs: "10", avg_ms: 120 },
              { route_group: "cron", cache_status: "OK", reqs: "12", avg_ms: 900 },
              { route_group: "cron", cache_status: "ERR", reqs: "1", avg_ms: 500 },
            ],
          }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: [
              { client_kind: "browser", reqs: "70", avg_ms: 40 },
              { client_kind: "ai_bot", reqs: "18", avg_ms: 15 },
              { client_kind: "markdown", reqs: "12", avg_ms: 12 },
              { client_kind: "search_bot", reqs: "10", avg_ms: 18 },
            ],
          }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: [
              { k: "DE", reqs: "85" },
              { k: "VN", reqs: "25" },
            ],
          }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: [
              { k: "FRA", reqs: "80" },
              { k: "SIN", reqs: "30" },
            ],
          }),
          { status: 200 }
        )
      );
    vi.stubGlobal("fetch", fetchMock);

    const report = await fetchEdgeAnalyticsReport("7d");
    expect(report.configured).toBe(true);
    expect(report.available).toBe(true);
    expect(report.totalRequests).toBe(110);
    expect(report.cacheHits).toBe(80);
    expect(report.cacheMisses).toBe(20);
    expect(report.cacheBypasses).toBe(10);
    expect(report.cacheHitRatePct).toBe(80);
    expect(report.avgHitMs).toBe(10);
    expect(report.avgMissMs).toBe(600);
    expect(report.aiCrawlerRequests).toBe(30);
    expect(report.searchBotRequests).toBe(10);
    expect(report.cron).toEqual({ runs: 13, okCount: 12, errorCount: 1, avgMs: 869 });
    expect(report.topCountries[0]).toEqual({ key: "DE", requests: 85 });
    expect(report.topColos[0]).toEqual({ key: "FRA", requests: 80 });
    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(String(fetchMock.mock.calls[0][1].body)).toContain("INTERVAL '7' DAY");
    for (const [idx, call] of fetchMock.mock.calls.entries()) {
      const sql = String(call[1].body);
      expect(sql).toContain("SUM(_sample_interval)");
      if (idx < 2) {
        expect(sql).toContain("SUM(double2 * _sample_interval) / SUM(_sample_interval)");
      }
    }
  });

  it("handles Analytics Engine upstream failures without throwing", async () => {
    vi.stubEnv("CF_ACCOUNT_ID", "acct-test");
    vi.stubEnv("CF_ANALYTICS_API_TOKEN", "analytics-read-token");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("timeout")));

    const report = await fetchEdgeAnalyticsReport("24h");
    expect(report.configured).toBe(true);
    expect(report.available).toBe(false);
    expect(report.error).toBeTruthy();
  });

  it("configures CSP headers to permit regional GA4 endpoints, Cloudflare RUM, and R2 media", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "sb_publishable_test");
    const { default: nextConfig } = await import("../next.config");
    const rules = (await nextConfig.headers?.()) ?? [];
    const globalRule = rules.find((rule) => rule.source === "/:path*");
    expect(globalRule).toBeDefined();

    const csp =
      globalRule?.headers.find((header) => header.key === "Content-Security-Policy")?.value ?? "";
    const directives = Object.fromEntries(
      csp.split(";").map((part) => {
        const trimmed = part.trim();
        const firstSpace = trimmed.indexOf(" ");
        return firstSpace === -1
          ? [trimmed, ""]
          : [trimmed.slice(0, firstSpace), trimmed.slice(firstSpace + 1)];
      })
    );

    expect(directives["script-src"]).toContain("https://*.googletagmanager.com");
    expect(directives["script-src"]).toContain("https://static.cloudflareinsights.com");
    expect(directives["img-src"]).toContain("https://*.google-analytics.com");
    expect(directives["img-src"]).toContain("https://*.googletagmanager.com");
    expect(directives["connect-src"]).toContain("https://*.google-analytics.com");
    expect(directives["connect-src"]).toContain("https://*.analytics.google.com");
    expect(directives["connect-src"]).toContain("https://analytics.google.com");
    expect(directives["connect-src"]).toContain("https://*.googletagmanager.com");
    expect(directives["connect-src"]).toContain("https://cloudflareinsights.com");
    expect(directives["media-src"]).toContain(
      "'self' blob: https://*.supabase.co https://media.dmf-talents.de"
    );
  });
});
