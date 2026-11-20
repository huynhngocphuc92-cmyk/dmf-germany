import "server-only";

export type AnalyticsWindow = "24h" | "7d";

export interface RouteGroupMetric {
  routeGroup: string;
  total: number;
  hits: number;
  misses: number;
  bypasses: number;
  hitRatePct: number | null;
  avgHitMs: number | null;
  avgMissMs: number | null;
  avgDurationMs: number;
}

export interface ClientKindMetric {
  clientKind: string;
  requests: number;
  avgMs: number;
}

export interface GeoMetric {
  key: string;
  requests: number;
}

export interface CronMetric {
  runs: number;
  okCount: number;
  errorCount: number;
  avgMs: number;
}

export interface EdgeAnalyticsReport {
  configured: boolean;
  available: boolean;
  window: AnalyticsWindow;
  error?: string;
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  cacheBypasses: number;
  cacheHitRatePct: number | null;
  avgHitMs: number | null;
  avgMissMs: number | null;
  aiCrawlerRequests: number;
  searchBotRequests: number;
  cron: CronMetric;
  routeGroups: RouteGroupMetric[];
  clientKinds: ClientKindMetric[];
  topCountries: GeoMetric[];
  topColos: GeoMetric[];
}

const SQL_INTERVALS: Record<AnalyticsWindow, string> = {
  "24h": "INTERVAL '24' HOUR",
  "7d": "INTERVAL '7' DAY",
};

interface RouteRow {
  route_group?: string;
  cache_status?: string;
  reqs?: string | number;
  avg_ms?: string | number;
}

interface ClientRow {
  client_kind?: string;
  reqs?: string | number;
  avg_ms?: string | number;
}

interface GeoRow {
  k?: string;
  reqs?: string | number;
}

function emptyReport(
  window: AnalyticsWindow,
  configured: boolean,
  error?: string
): EdgeAnalyticsReport {
  return {
    configured,
    available: false,
    window,
    ...(error ? { error } : {}),
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    cacheBypasses: 0,
    cacheHitRatePct: null,
    avgHitMs: null,
    avgMissMs: null,
    aiCrawlerRequests: 0,
    searchBotRequests: 0,
    cron: { runs: 0, okCount: 0, errorCount: 0, avgMs: 0 },
    routeGroups: [],
    clientKinds: [],
    topCountries: [],
    topColos: [],
  };
}

function toNum(value: string | number | undefined): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

async function runAnalyticsSql<T>(accountId: string, token: string, sql: string): Promise<T[]> {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/analytics_engine/sql`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body: sql,
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error(`Analytics Engine SQL failed: HTTP ${res.status}`);
  }
  const parsed = (await res.json()) as { data?: T[] };
  return Array.isArray(parsed?.data) ? parsed.data : [];
}

export async function fetchEdgeAnalyticsReport(
  window: AnalyticsWindow = "24h"
): Promise<EdgeAnalyticsReport> {
  const accountId = (
    process.env.CF_ACCOUNT_ID ||
    process.env.CF_AI_GATEWAY_ACCOUNT_ID ||
    ""
  ).trim();
  const token = (process.env.CF_ANALYTICS_API_TOKEN || "").trim();

  if (!accountId || !token) {
    return emptyReport(window, false);
  }

  const interval = SQL_INTERVALS[window] ?? SQL_INTERVALS["24h"];

  try {
    const [routeRows, clientRows, countryRows, coloRows] = await Promise.all([
      runAnalyticsSql<RouteRow>(
        accountId,
        token,
        `SELECT blob1 AS route_group, blob3 AS cache_status, count() AS reqs, round(avg(double2), 1) AS avg_ms FROM dmf_talents_telemetry WHERE timestamp >= NOW() - ${interval} GROUP BY route_group, cache_status ORDER BY reqs DESC FORMAT JSON`
      ),
      runAnalyticsSql<ClientRow>(
        accountId,
        token,
        `SELECT blob6 AS client_kind, count() AS reqs, round(avg(double2), 1) AS avg_ms FROM dmf_talents_telemetry WHERE blob1 != 'cron' AND timestamp >= NOW() - ${interval} GROUP BY client_kind ORDER BY reqs DESC FORMAT JSON`
      ),
      runAnalyticsSql<GeoRow>(
        accountId,
        token,
        `SELECT blob5 AS k, count() AS reqs FROM dmf_talents_telemetry WHERE blob1 != 'cron' AND blob5 != '' AND timestamp >= NOW() - ${interval} GROUP BY k ORDER BY reqs DESC LIMIT 8 FORMAT JSON`
      ),
      runAnalyticsSql<GeoRow>(
        accountId,
        token,
        `SELECT blob4 AS k, count() AS reqs FROM dmf_talents_telemetry WHERE blob1 != 'cron' AND blob4 != '' AND timestamp >= NOW() - ${interval} GROUP BY k ORDER BY reqs DESC LIMIT 8 FORMAT JSON`
      ),
    ]);

    const groupMap = new Map<
      string,
      {
        hits: number;
        misses: number;
        bypasses: number;
        hitWeightedMs: number;
        missWeightedMs: number;
        totalWeightedMs: number;
      }
    >();

    const cron: CronMetric = { runs: 0, okCount: 0, errorCount: 0, avgMs: 0 };
    let cronWeightedMs = 0;

    let cacheHits = 0;
    let cacheMisses = 0;
    let cacheBypasses = 0;
    let totalHitWeightedMs = 0;
    let totalMissWeightedMs = 0;

    for (const row of routeRows) {
      const group = row.route_group || "other";
      const status = row.cache_status || "BYPASS";
      const count = toNum(row.reqs);
      const avgMs = toNum(row.avg_ms);

      if (group === "cron") {
        cron.runs += count;
        if (status === "OK") cron.okCount += count;
        else cron.errorCount += count;
        cronWeightedMs += avgMs * count;
        continue;
      }

      const acc = groupMap.get(group) ?? {
        hits: 0,
        misses: 0,
        bypasses: 0,
        hitWeightedMs: 0,
        missWeightedMs: 0,
        totalWeightedMs: 0,
      };

      acc.totalWeightedMs += avgMs * count;
      if (status === "HIT") {
        acc.hits += count;
        acc.hitWeightedMs += avgMs * count;
        cacheHits += count;
        totalHitWeightedMs += avgMs * count;
      } else if (status === "MISS") {
        acc.misses += count;
        acc.missWeightedMs += avgMs * count;
        cacheMisses += count;
        totalMissWeightedMs += avgMs * count;
      } else {
        acc.bypasses += count;
        cacheBypasses += count;
      }

      groupMap.set(group, acc);
    }

    if (cron.runs > 0) {
      cron.avgMs = Math.round(cronWeightedMs / cron.runs);
    }

    const routeGroups: RouteGroupMetric[] = [...groupMap.entries()]
      .map(([routeGroup, acc]) => {
        const total = acc.hits + acc.misses + acc.bypasses;
        const cacheableTotal = acc.hits + acc.misses;
        return {
          routeGroup,
          total,
          hits: acc.hits,
          misses: acc.misses,
          bypasses: acc.bypasses,
          hitRatePct:
            cacheableTotal > 0 ? Math.round((acc.hits / cacheableTotal) * 1000) / 10 : null,
          avgHitMs: acc.hits > 0 ? Math.round((acc.hitWeightedMs / acc.hits) * 10) / 10 : null,
          avgMissMs:
            acc.misses > 0 ? Math.round((acc.missWeightedMs / acc.misses) * 10) / 10 : null,
          avgDurationMs: total > 0 ? Math.round((acc.totalWeightedMs / total) * 10) / 10 : 0,
        };
      })
      .sort((a, b) => b.total - a.total);

    const clientKinds: ClientKindMetric[] = clientRows.map((r) => ({
      clientKind: r.client_kind || "browser",
      requests: toNum(r.reqs),
      avgMs: toNum(r.avg_ms),
    }));

    const aiCrawlerRequests = clientKinds
      .filter((c) => c.clientKind === "ai_bot" || c.clientKind === "markdown")
      .reduce((sum, c) => sum + c.requests, 0);
    const searchBotRequests = clientKinds
      .filter((c) => c.clientKind === "search_bot")
      .reduce((sum, c) => sum + c.requests, 0);

    const totalRequests = cacheHits + cacheMisses + cacheBypasses;
    const cacheableTotal = cacheHits + cacheMisses;

    return {
      configured: true,
      available: true,
      window,
      totalRequests,
      cacheHits,
      cacheMisses,
      cacheBypasses,
      cacheHitRatePct:
        cacheableTotal > 0 ? Math.round((cacheHits / cacheableTotal) * 1000) / 10 : null,
      avgHitMs: cacheHits > 0 ? Math.round((totalHitWeightedMs / cacheHits) * 10) / 10 : null,
      avgMissMs: cacheMisses > 0 ? Math.round((totalMissWeightedMs / cacheMisses) * 10) / 10 : null,
      aiCrawlerRequests,
      searchBotRequests,
      cron,
      routeGroups,
      clientKinds,
      topCountries: countryRows
        .map((r) => ({ key: r.k || "unknown", requests: toNum(r.reqs) }))
        .filter((r) => r.requests > 0),
      topColos: coloRows
        .map((r) => ({ key: r.k || "unknown", requests: toNum(r.reqs) }))
        .filter((r) => r.requests > 0),
    };
  } catch {
    return emptyReport(window, true, "Cloudflare Analytics Engine tạm thời không phản hồi.");
  }
}
