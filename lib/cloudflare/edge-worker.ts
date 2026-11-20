export interface EdgeExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException?: () => void;
}

export interface EdgeScheduledController {
  cron: string;
  scheduledTime: number;
  noRetry?: () => void;
}

export interface EdgeAnalyticsEngineBinding {
  writeDataPoint(event?: {
    blobs?: Array<string | ArrayBuffer | null>;
    doubles?: number[];
    indexes?: Array<string | ArrayBuffer | null>;
  }): void;
}

export interface EdgeServiceFetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

export interface EdgeWorkerEnv {
  DMF_OPS_TOKEN?: string;
  WORKER_SELF_REFERENCE?: EdgeServiceFetcher;
  DMF_TALENTS_ANALYTICS?: EdgeAnalyticsEngineBinding;
}

export type EdgeFetchHandler = (
  request: Request,
  env: EdgeWorkerEnv,
  ctx: EdgeExecutionContext
) => Promise<Response>;

export type RouteGroup =
  | "image"
  | "markdown"
  | "mcp"
  | "meta"
  | "home"
  | "blog"
  | "static"
  | "api"
  | "auth"
  | "private"
  | "other";

export interface EdgeCachePolicy {
  cacheKeyUrl: string;
  ttlSeconds: number;
  browserCacheControl: string;
  isImage: boolean;
  routeGroup: RouteGroup;
  preserveVaryAccept: boolean;
}

const BENIGN_QUERY_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "msclkid",
]);

const NON_CACHEABLE_PREFIXES = [
  "/admin",
  "/portal",
  "/login",
  "/auth",
  "/fuer-arbeitgeber/datenraum",
  "/monitoring",
  "/cdn-cgi",
  "/_next/",
];

const STATIC_PUBLIC_EXACT = new Set([
  "/datenschutz",
  "/impressum",
  "/privacy",
  "/about",
  "/contact",
  "/kontakt",
  "/terms",
  "/referenzen",
  "/services",
  "/ueber-uns",
  "/fuer-arbeitgeber",
]);

const STATIC_PUBLIC_PREFIXES = ["/services/", "/ueber-uns/", "/fuer-arbeitgeber/"];

function hasBypassHeaders(headers: Headers): boolean {
  const names = [
    "authorization",
    "rsc",
    "next-router-state-tree",
    "next-router-prefetch",
    "next-router-segment-prefetch",
    "next-action",
    "x-nextjs-data",
  ];
  return names.some((name) => headers.has(name));
}

function hasBypassCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  const lower = cookieHeader.toLowerCase();
  return (
    lower.includes("sb-") ||
    lower.includes("__prerender_bypass") ||
    lower.includes("__next_preview_data")
  );
}

function getImageFormatBucket(acceptHeader: string | null): "avif" | "webp" | "orig" {
  const lower = (acceptHeader ?? "").toLowerCase();
  if (lower.includes("image/avif")) return "avif";
  if (lower.includes("image/webp")) return "webp";
  return "orig";
}

function hasDisallowedQueryParams(searchParams: URLSearchParams): boolean {
  for (const key of searchParams.keys()) {
    if (!BENIGN_QUERY_PARAMS.has(key.toLowerCase())) {
      return true;
    }
  }
  return false;
}

function isStaticPublicPath(pathname: string): boolean {
  if (STATIC_PUBLIC_EXACT.has(pathname)) return true;
  return STATIC_PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function getEdgeCachePolicy(request: Request, url: URL): EdgeCachePolicy | null {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return null;
  }

  if (hasBypassHeaders(request.headers)) {
    return null;
  }

  if (hasBypassCookie(request.headers.get("cookie"))) {
    return null;
  }

  const pathname = url.pathname;

  if (pathname === "/_next/image") {
    const format = getImageFormatBucket(request.headers.get("accept"));
    return {
      cacheKeyUrl: `${url.origin}/__edge_cache/v1/img/${format}${pathname}${url.search}`,
      ttlSeconds: 2592000,
      browserCacheControl: "public, max-age=2592000, s-maxage=31536000, immutable",
      isImage: true,
      routeGroup: "image",
      preserveVaryAccept: true,
    };
  }

  if (NON_CACHEABLE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix))) {
    return null;
  }

  if (pathname.startsWith("/api/") && pathname !== "/api/mcp") {
    return null;
  }

  if (hasDisallowedQueryParams(url.searchParams)) {
    return null;
  }

  const accept = (request.headers.get("accept") ?? "").toLowerCase();
  const isDirectMarkdown = pathname.endsWith(".md");
  if (!isDirectMarkdown && accept.includes("text/markdown")) {
    return null;
  }

  if (isDirectMarkdown) {
    return {
      cacheKeyUrl: `${url.origin}/__edge_cache/v1/md${pathname}`,
      ttlSeconds: 3600,
      browserCacheControl: "public, max-age=300, s-maxage=3600",
      isImage: false,
      routeGroup: "markdown",
      preserveVaryAccept: true,
    };
  }

  if (pathname === "/api/mcp") {
    return {
      cacheKeyUrl: `${url.origin}/__edge_cache/v1/mcp${pathname}`,
      ttlSeconds: 3600,
      browserCacheControl: "public, max-age=300, s-maxage=3600",
      isImage: false,
      routeGroup: "mcp",
      preserveVaryAccept: true,
    };
  }

  if (pathname === "/robots.txt") {
    return {
      cacheKeyUrl: `${url.origin}/__edge_cache/v1/meta${pathname}`,
      ttlSeconds: 3600,
      browserCacheControl: "public, max-age=300, s-maxage=3600",
      isImage: false,
      routeGroup: "meta",
      preserveVaryAccept: true,
    };
  }

  if (pathname === "/sitemap.xml") {
    return {
      cacheKeyUrl: `${url.origin}/__edge_cache/v1/meta${pathname}`,
      ttlSeconds: 600,
      browserCacheControl: "public, max-age=300, s-maxage=600",
      isImage: false,
      routeGroup: "meta",
      preserveVaryAccept: true,
    };
  }

  if (pathname === "/") {
    return {
      cacheKeyUrl: `${url.origin}/__edge_cache/v1/html${pathname}`,
      ttlSeconds: 60,
      browserCacheControl: "public, max-age=0, must-revalidate",
      isImage: false,
      routeGroup: "home",
      preserveVaryAccept: true,
    };
  }

  if (pathname === "/blog" || pathname.startsWith("/blog/")) {
    return {
      cacheKeyUrl: `${url.origin}/__edge_cache/v1/html${pathname}`,
      ttlSeconds: 300,
      browserCacheControl: "public, max-age=0, must-revalidate",
      isImage: false,
      routeGroup: "blog",
      preserveVaryAccept: true,
    };
  }

  if (isStaticPublicPath(pathname)) {
    return {
      cacheKeyUrl: `${url.origin}/__edge_cache/v1/html${pathname}`,
      ttlSeconds: 3600,
      browserCacheControl: "public, max-age=0, must-revalidate",
      isImage: false,
      routeGroup: "static",
      preserveVaryAccept: true,
    };
  }

  return null;
}

export function classifyRouteGroup(pathname: string): RouteGroup {
  if (pathname === "/_next/image") return "image";
  if (pathname.endsWith(".md")) return "markdown";
  if (pathname === "/api/mcp") return "mcp";
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") return "meta";
  if (pathname === "/") return "home";
  if (pathname === "/blog" || pathname.startsWith("/blog/")) return "blog";
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/portal") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth")
  ) {
    return "auth";
  }
  if (pathname.startsWith("/fuer-arbeitgeber/datenraum")) return "private";
  if (pathname.startsWith("/api/")) return "api";
  if (isStaticPublicPath(pathname)) return "static";
  return "other";
}

function getClientKind(request: Request, url: URL): string {
  const ua = (request.headers.get("user-agent") ?? "").toLowerCase();
  if (/gptbot|oai-searchbot|chatgpt-user|claudebot|anthropic|perplexitybot/.test(ua)) {
    return "ai_bot";
  }
  if (/googlebot|bingbot/.test(ua)) {
    return "search_bot";
  }
  const accept = (request.headers.get("accept") ?? "").toLowerCase();
  if (url.pathname.endsWith(".md") || accept.includes("text/markdown")) {
    return "markdown";
  }
  return "browser";
}

function getEdgeCfMeta(request: Request): { colo: string; country: string } {
  const reqWithCf = request as Request & { cf?: { colo?: unknown; country?: unknown } };
  const colo = typeof reqWithCf.cf?.colo === "string" ? reqWithCf.cf.colo : "unknown";
  const country = typeof reqWithCf.cf?.country === "string" ? reqWithCf.cf.country : "unknown";
  return { colo, country };
}

export function recordEdgeTelemetry(
  env: EdgeWorkerEnv,
  request: Request,
  url: URL,
  routeGroup: RouteGroup | string,
  cacheStatus: "HIT" | "MISS" | "BYPASS",
  status: number,
  durationMs: number
): void {
  try {
    const binding = env.DMF_TALENTS_ANALYTICS;
    if (!binding || typeof binding.writeDataPoint !== "function") return;
    const { colo, country } = getEdgeCfMeta(request);
    const clientKind = getClientKind(request, url);
    binding.writeDataPoint({
      blobs: [routeGroup, request.method, cacheStatus, colo, country, clientKind],
      doubles: [status, Math.max(0, durationMs)],
      indexes: [routeGroup],
    });
  } catch {
    // Telemetry errors must never disrupt request handling.
  }
}

function getDefaultCache(): Cache | undefined {
  const cacheStorage = globalThis.caches as unknown as { default?: Cache } | undefined;
  return cacheStorage?.default;
}

export async function invalidateEdgeCachePaths(
  paths: string[],
  origin = "https://www.dmf-talents.de"
): Promise<void> {
  const cache = getDefaultCache();
  if (!cache || paths.length === 0) return;

  const baseOrigin = origin.replace(/\/+$/, "");
  await Promise.all(
    paths.map(async (rawPath) => {
      const normalizedPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
      const variant =
        normalizedPath === "/robots.txt" || normalizedPath === "/sitemap.xml"
          ? "meta"
          : normalizedPath.endsWith(".md")
            ? "md"
            : normalizedPath === "/api/mcp"
              ? "mcp"
              : "html";
      const keyUrl = `${baseOrigin}/__edge_cache/v1/${variant}${normalizedPath}`;
      try {
        await cache.delete(new Request(keyUrl, { method: "GET" }));
      } catch {
        // Cache invalidation is best-effort.
      }
    })
  );
}

function withVaryAccept(headers: Headers): void {
  const existing = headers.get("vary");
  if (!existing) {
    headers.set("Vary", "Accept");
    return;
  }
  const lower = existing.toLowerCase();
  if (!lower.includes("accept")) {
    headers.set("Vary", `${existing}, Accept`);
  }
}

const MEDIA_PUBLIC_ORIGIN = "https://media.dmf-talents.de";
const LEGACY_HANDBUCH_PATHS = new Set([
  "/DMF Vietnam Handbuch.pdf",
  "/DMF%20Vietnam%20Handbuch.pdf",
]);

export function resolveLegacyMediaRedirect(url: URL): string | null {
  if (LEGACY_HANDBUCH_PATHS.has(url.pathname)) {
    return `${MEDIA_PUBLIC_ORIGIN}/DMF-Vietnam-Handbuch.pdf`;
  }
  if (
    url.pathname.startsWith("/candidates/videos/") ||
    url.pathname.startsWith("/candidates/dossiers/")
  ) {
    return `${MEDIA_PUBLIC_ORIGIN}${url.pathname}`;
  }
  return null;
}

export async function handleEdgeFetch(
  request: Request,
  env: EdgeWorkerEnv,
  ctx: EdgeExecutionContext,
  nextFetch: EdgeFetchHandler
): Promise<Response> {
  const start = Date.now();
  const url = new URL(request.url);
  if (request.method === "GET" || request.method === "HEAD") {
    const legacyMediaTarget = resolveLegacyMediaRedirect(url);
    if (legacyMediaTarget) {
      return new Response(null, {
        status: 308,
        headers: {
          Location: legacyMediaTarget,
          "Cache-Control": "public, max-age=86400",
        },
      });
    }
  }
  const policy = getEdgeCachePolicy(request, url);
  const routeGroup = policy?.routeGroup ?? classifyRouteGroup(url.pathname);
  const cache = policy ? getDefaultCache() : undefined;
  const cacheKey = policy ? new Request(policy.cacheKeyUrl, { method: "GET" }) : null;

  if (policy && cache && cacheKey) {
    try {
      const hit = await cache.match(cacheKey);
      if (hit) {
        const headers = new Headers(hit.headers);
        headers.set("X-DMF-Edge-Cache", "HIT");
        headers.set("Cache-Control", policy.browserCacheControl);
        if (policy.preserveVaryAccept) {
          withVaryAccept(headers);
        }
        recordEdgeTelemetry(env, request, url, routeGroup, "HIT", hit.status, Date.now() - start);
        return new Response(request.method === "HEAD" ? null : hit.body, {
          status: hit.status,
          statusText: hit.statusText,
          headers,
        });
      }
    } catch {
      // Fall through to origin on cache lookup failures.
    }
  }

  const response = await nextFetch(request, env, ctx);
  const contentType = (response.headers.get("content-type") ?? "").toLowerCase();
  const isUnexpectedMarkdown =
    policy !== null && policy.routeGroup !== "markdown" && contentType.includes("text/markdown");

  if (
    policy &&
    cache &&
    cacheKey &&
    request.method === "GET" &&
    response.status === 200 &&
    !response.headers.has("set-cookie") &&
    !isUnexpectedMarkdown
  ) {
    const toStore = response.clone();
    const storeHeaders = new Headers(toStore.headers);
    storeHeaders.delete("set-cookie");
    // Cloudflare Cache API ignores/rejects responses carrying Vary: Accept; our policy key isolates variants.
    storeHeaders.delete("vary");
    storeHeaders.set("cache-control", `public, max-age=${policy.ttlSeconds}`);
    ctx.waitUntil(
      cache
        .put(
          cacheKey,
          new Response(toStore.body, {
            status: 200,
            statusText: toStore.statusText,
            headers: storeHeaders,
          })
        )
        .catch(() => {})
    );
  }

  recordEdgeTelemetry(
    env,
    request,
    url,
    routeGroup,
    policy ? "MISS" : "BYPASS",
    response.status,
    Date.now() - start
  );

  if (!policy) {
    return response;
  }

  const outHeaders = new Headers(response.headers);
  outHeaders.set("X-DMF-Edge-Cache", "MISS");
  if (
    policy.isImage ||
    policy.routeGroup === "markdown" ||
    policy.routeGroup === "mcp" ||
    policy.routeGroup === "meta"
  ) {
    outHeaders.set("Cache-Control", policy.browserCacheControl);
  }
  if (policy.preserveVaryAccept) {
    withVaryAccept(outHeaders);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: outHeaders,
  });
}

export async function handleEdgeScheduled(
  controller: EdgeScheduledController,
  env: EdgeWorkerEnv,
  ctx: EdgeExecutionContext
): Promise<void> {
  if (!env.DMF_OPS_TOKEN || !env.WORKER_SELF_REFERENCE) {
    console.warn(
      JSON.stringify({
        event: "cron_notification_drain_skipped",
        cron: controller.cron,
        reason: "missing_binding_or_token",
      })
    );
    return;
  }

  const token = env.DMF_OPS_TOKEN;
  const selfRef = env.WORKER_SELF_REFERENCE;

  ctx.waitUntil(
    (async () => {
      const start = Date.now();
      let status = 0;
      let summary: unknown = null;
      try {
        const res = await selfRef.fetch("https://www.dmf-talents.de/api/ops/notifications", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Agent": "dmf-cloudflare-cron/1.0",
          },
        });
        status = res.status;
        try {
          summary = await res.json();
        } catch {
          summary = null;
        }
        const durationMs = Date.now() - start;
        const payload = JSON.stringify({
          event: "cron_notification_drain",
          cron: controller.cron,
          status,
          durationMs,
          summary,
        });
        if (res.ok) {
          console.warn(payload);
        } else {
          console.error(payload);
        }
        env.DMF_TALENTS_ANALYTICS?.writeDataPoint({
          blobs: ["cron", "POST", res.ok ? "OK" : "ERR", "global", "DE", "cron"],
          doubles: [status, durationMs],
          indexes: ["cron"],
        });
      } catch (err) {
        const durationMs = Date.now() - start;
        console.error(
          JSON.stringify({
            event: "cron_notification_drain_error",
            cron: controller.cron,
            durationMs,
            error: err instanceof Error ? err.message : "unknown_error",
          })
        );
        try {
          env.DMF_TALENTS_ANALYTICS?.writeDataPoint({
            blobs: ["cron", "POST", "ERR", "global", "DE", "cron"],
            doubles: [status, durationMs],
            indexes: ["cron"],
          });
        } catch {
          // Ignore analytics write failures during error reporting.
        }
      }
    })()
  );
}
