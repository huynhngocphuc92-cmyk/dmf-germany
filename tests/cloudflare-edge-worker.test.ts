import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  classifyRouteGroup,
  getEdgeCachePolicy,
  handleEdgeFetch,
  handleEdgeScheduled,
  invalidateEdgeCachePaths,
  type EdgeWorkerEnv,
} from "@/lib/cloudflare/edge-worker";

function makeMemoryCache() {
  const store = new Map<string, Response>();
  const cache: Cache = {
    async match(request: RequestInfo | URL) {
      const key =
        typeof request === "string"
          ? request
          : request instanceof URL
            ? request.toString()
            : request.url;
      const found = store.get(key);
      return found ? found.clone() : undefined;
    },
    async put(request: RequestInfo | URL, response: Response) {
      const key =
        typeof request === "string"
          ? request
          : request instanceof URL
            ? request.toString()
            : request.url;
      store.set(key, response.clone());
    },
    async delete(request: RequestInfo | URL) {
      const key =
        typeof request === "string"
          ? request
          : request instanceof URL
            ? request.toString()
            : request.url;
      return store.delete(key);
    },
    async add() {},
    async addAll() {},
    async keys() {
      return [];
    },
    async matchAll() {
      return [];
    },
  };
  return { cache, store };
}

describe("Cloudflare Edge Worker Policy & Handlers", () => {
  const originalCaches = globalThis.caches;

  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(globalThis, "caches", {
      value: originalCaches,
      configurable: true,
      writable: true,
    });
  });

  it("assigns distinct immutable cache policies for /_next/image by Accept format", () => {
    const url = new URL("https://www.dmf-talents.de/_next/image?url=%2Flogo.png&w=256&q=75");

    const avif = getEdgeCachePolicy(
      new Request(url, { headers: { accept: "image/avif,image/webp,*/*" } }),
      url
    );
    const webp = getEdgeCachePolicy(
      new Request(url, { headers: { accept: "image/webp,*/*" } }),
      url
    );
    const orig = getEdgeCachePolicy(new Request(url, { headers: { accept: "*/*" } }), url);

    expect(avif?.routeGroup).toBe("image");
    expect(avif?.ttlSeconds).toBe(2592000);
    expect(avif?.browserCacheControl).toContain("immutable");
    expect(avif?.cacheKeyUrl).toContain("/__edge_cache/v1/img/avif/_next/image");
    expect(webp?.cacheKeyUrl).toContain("/__edge_cache/v1/img/webp/_next/image");
    expect(orig?.cacheKeyUrl).toContain("/__edge_cache/v1/img/orig/_next/image");
  });

  it("assigns expected TTLs for public HTML, Markdown, MCP, and metadata routes", () => {
    const cases: Array<{ path: string; ttl: number; group: string }> = [
      { path: "/datenschutz", ttl: 3600, group: "static" },
      { path: "/blog", ttl: 300, group: "blog" },
      { path: "/blog/test-slug", ttl: 300, group: "blog" },
      { path: "/", ttl: 60, group: "home" },
      { path: "/index.md", ttl: 3600, group: "markdown" },
      { path: "/api/mcp", ttl: 3600, group: "mcp" },
      { path: "/robots.txt", ttl: 3600, group: "meta" },
      { path: "/sitemap.xml", ttl: 600, group: "meta" },
    ];

    for (const item of cases) {
      const url = new URL(`https://www.dmf-talents.de${item.path}`);
      const policy = getEdgeCachePolicy(new Request(url), url);
      expect(policy).not.toBeNull();
      expect(policy?.ttlSeconds).toBe(item.ttl);
      expect(policy?.routeGroup).toBe(item.group);
    }
  });

  it("strips benign UTM query parameters while bypassing disallowed query params", () => {
    const utmUrl = new URL("https://www.dmf-talents.de/blog?utm_source=linkedin&fbclid=123");
    const utmPolicy = getEdgeCachePolicy(new Request(utmUrl), utmUrl);
    expect(utmPolicy?.cacheKeyUrl).toBe("https://www.dmf-talents.de/__edge_cache/v1/html/blog");

    const dynamicUrl = new URL("https://www.dmf-talents.de/blog?q=pflege");
    expect(getEdgeCachePolicy(new Request(dynamicUrl), dynamicUrl)).toBeNull();
  });

  it("never caches markdown negotiation, authenticated sessions, RSC requests, or private routes", () => {
    const blogUrl = new URL("https://www.dmf-talents.de/blog");
    expect(
      getEdgeCachePolicy(
        new Request(blogUrl, { headers: { accept: "text/markdown, text/html;q=0.8" } }),
        blogUrl
      )
    ).toBeNull();
    expect(
      getEdgeCachePolicy(
        new Request(blogUrl, { headers: { cookie: "sb-access-token=abc" } }),
        blogUrl
      )
    ).toBeNull();
    expect(getEdgeCachePolicy(new Request(blogUrl, { headers: { rsc: "1" } }), blogUrl)).toBeNull();
    expect(getEdgeCachePolicy(new Request(blogUrl, { method: "POST" }), blogUrl)).toBeNull();

    for (const priv of [
      "/admin",
      "/portal",
      "/login",
      "/fuer-arbeitgeber/datenraum",
      "/api/chat",
    ]) {
      const privUrl = new URL(`https://www.dmf-talents.de${priv}`);
      expect(getEdgeCachePolicy(new Request(privUrl), privUrl)).toBeNull();
    }
  });

  it("caches 200 GET responses cleanly without Vary/Set-Cookie and serves subsequent hits", async () => {
    const { cache, store } = makeMemoryCache();
    Object.defineProperty(globalThis, "caches", {
      value: { default: cache },
      configurable: true,
      writable: true,
    });

    const analyticsPoints: unknown[] = [];
    const env: EdgeWorkerEnv = {
      DMF_TALENTS_ANALYTICS: {
        writeDataPoint(point) {
          analyticsPoints.push(point);
        },
      },
    };
    const pending: Promise<unknown>[] = [];
    const ctx = { waitUntil: (p: Promise<unknown>) => void pending.push(p) };

    const nextFetch = vi.fn(async () => {
      return new Response("<html><body>Blog</body></html>", {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          Vary: "Accept, Accept-Encoding",
        },
      });
    });

    const req1 = new Request("https://www.dmf-talents.de/blog");
    const res1 = await handleEdgeFetch(req1, env, ctx, nextFetch);
    await Promise.all(pending);

    expect(res1.status).toBe(200);
    expect(res1.headers.get("X-DMF-Edge-Cache")).toBe("MISS");
    expect(nextFetch).toHaveBeenCalledTimes(1);
    expect(store.size).toBe(1);

    const stored = [...store.values()][0];
    expect(stored.headers.get("vary")).toBeNull();
    expect(stored.headers.get("set-cookie")).toBeNull();
    expect(stored.headers.get("cache-control")).toBe("public, max-age=300");

    const res2 = await handleEdgeFetch(
      new Request("https://www.dmf-talents.de/blog"),
      env,
      ctx,
      nextFetch
    );
    expect(res2.status).toBe(200);
    expect(res2.headers.get("X-DMF-Edge-Cache")).toBe("HIT");
    expect(res2.headers.get("Vary")).toContain("Accept");
    expect(nextFetch).toHaveBeenCalledTimes(1);
    expect(analyticsPoints).toHaveLength(2);

    await invalidateEdgeCachePaths(["/blog"]);
    expect(store.size).toBe(0);
  });

  it("never stores responses containing Set-Cookie or non-200 status codes", async () => {
    const { cache, store } = makeMemoryCache();
    Object.defineProperty(globalThis, "caches", {
      value: { default: cache },
      configurable: true,
      writable: true,
    });

    const pending: Promise<unknown>[] = [];
    const ctx = { waitUntil: (p: Promise<unknown>) => void pending.push(p) };
    const env: EdgeWorkerEnv = {};

    const cookieRes = await handleEdgeFetch(
      new Request("https://www.dmf-talents.de/datenschutz"),
      env,
      ctx,
      async () =>
        new Response("ok", {
          status: 200,
          headers: { "Set-Cookie": "sb-session=xyz; Path=/" },
        })
    );
    expect(cookieRes.headers.get("X-DMF-Edge-Cache")).toBe("MISS");

    const notFoundRes = await handleEdgeFetch(
      new Request("https://www.dmf-talents.de/blog/missing"),
      env,
      ctx,
      async () => new Response("Not Found", { status: 404 })
    );
    expect(notFoundRes.status).toBe(404);
    await Promise.all(pending);
    expect(store.size).toBe(0);
  });

  it("triggers POST /api/ops/notifications with Bearer token and zero body on cron", async () => {
    const fetchMock = vi.fn(
      async () => new Response(JSON.stringify({ sent: 1, failed: 0 }), { status: 200 })
    );
    const writeDataPoint = vi.fn();
    const pending: Promise<unknown>[] = [];

    await handleEdgeScheduled(
      { cron: "*/5 * * * *", scheduledTime: Date.now() },
      {
        DMF_OPS_TOKEN: "secret-ops-token",
        WORKER_SELF_REFERENCE: { fetch: fetchMock },
        DMF_TALENTS_ANALYTICS: { writeDataPoint },
      },
      { waitUntil: (p) => void pending.push(p) }
    );
    await Promise.all(pending);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [targetUrl, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(targetUrl).toBe("https://www.dmf-talents.de/api/ops/notifications");
    expect(init.method).toBe("POST");
    expect(init.body).toBeUndefined();
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer secret-ops-token");
    expect(writeDataPoint).toHaveBeenCalledTimes(1);
  });

  it("skips scheduled drain cleanly when token or binding is missing", async () => {
    const pending: Promise<unknown>[] = [];
    await handleEdgeScheduled(
      { cron: "*/5 * * * *", scheduledTime: Date.now() },
      {},
      { waitUntil: (p) => void pending.push(p) }
    );
    await Promise.all(pending);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("cron_notification_drain_skipped")
    );
  });

  it("classifies route groups accurately", () => {
    expect(classifyRouteGroup("/_next/image")).toBe("image");
    expect(classifyRouteGroup("/blog/a.md")).toBe("markdown");
    expect(classifyRouteGroup("/api/mcp")).toBe("mcp");
    expect(classifyRouteGroup("/api/chat")).toBe("api");
    expect(classifyRouteGroup("/admin/posts")).toBe("auth");
    expect(classifyRouteGroup("/fuer-arbeitgeber/datenraum")).toBe("private");
  });
});
