import Link from "next/link";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bot,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  Server,
  Zap,
} from "lucide-react";
import { fetchEdgeAnalyticsReport, type AnalyticsWindow } from "@/lib/cloudflare/analytics";

export const dynamic = "force-dynamic";

const ROUTE_GROUP_LABELS: Record<string, string> = {
  home: "Trang chủ (/)",
  blog: "Bài viết SEO (/blog*)",
  static: "Trang tĩnh B2B (/datenschutz, /services*...)",
  image: "Tối ưu ảnh (/_next/image)",
  markdown: "GEO Markdown (*.md)",
  mcp: "Public MCP (/api/mcp)",
  meta: "SEO Meta (robots.txt, sitemap.xml)",
  api: "API động (/api/*)",
  auth: "Xác thực (/admin, /portal, /login)",
  private: "Datenraum (/fuer-arbeitgeber/datenraum)",
  other: "Khác",
};

const CLIENT_KIND_LABELS: Record<string, string> = {
  browser: "Trình duyệt người dùng",
  ai_bot: "AI Bot (GPTBot, ClaudeBot, Perplexity...)",
  search_bot: "Search Crawler (Googlebot, Bingbot)",
  markdown: "Agent đọc Markdown (.md / Accept)",
};

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range } = await searchParams;
  const window: AnalyticsWindow = range === "7d" ? "7d" : "24h";
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const report = await fetchEdgeAnalyticsReport(window);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Website &amp; Edge Analytics</h1>
          <p className="text-sm text-slate-500">
            Telemetry thời gian thực từ Cloudflare Workers Analytics Engine (
            <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">
              dmf_talents_telemetry
            </code>
            ) &amp; GA4.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 text-xs font-medium">
            <Link
              href="/admin/analytics?range=24h"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                window === "24h" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              24 giờ qua
            </Link>
            <Link
              href="/admin/analytics?range=7d"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                window === "7d" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              7 ngày qua
            </Link>
          </div>

          <span
            className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 ${
              report.available
                ? "bg-emerald-100 text-emerald-800"
                : report.configured
                  ? "bg-amber-100 text-amber-800"
                  : "bg-slate-100 text-slate-700"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                report.available
                  ? "bg-emerald-500 animate-pulse"
                  : report.configured
                    ? "bg-amber-500"
                    : "bg-slate-400"
              }`}
            />
            {report.available
              ? "Cloudflare Edge: Live"
              : report.configured
                ? "Cloudflare Edge: Tạm gián đoạn"
                : "Cloudflare Edge: Local Mode"}
          </span>
        </div>
      </div>

      {report.configured && !report.available && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{report.error || "Không thể tải dữ liệu từ Cloudflare Analytics Engine."}</span>
        </div>
      )}

      {!report.configured && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-slate-500" />
          <span>
            Biến <code>CF_ANALYTICS_API_TOKEN</code> chưa được cấu hình trong môi trường local — chỉ
            hiển thị số liệu live khi chạy trên Cloudflare Workers.
          </span>
        </div>
      )}

      {/* Real-time Edge KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Tổng Edge Requests
            </span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {report.totalRequests.toLocaleString("de-DE")}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {report.cacheHits.toLocaleString("de-DE")} HIT ·{" "}
            {report.cacheMisses.toLocaleString("de-DE")} MISS ·{" "}
            {report.cacheBypasses.toLocaleString("de-DE")} BYPASS
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Tỷ lệ Edge Cache HIT
            </span>
            <Zap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {report.cacheHitRatePct !== null ? `${report.cacheHitRatePct}%` : "—"}
          </div>
          <p className="mt-1 text-xs text-slate-500">Tính trên nhóm URL có bật Edge Cache</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Latency Edge HIT TB
            </span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {report.avgHitMs !== null ? `${report.avgHitMs} ms` : "—"}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            So với MISS TB: {report.avgMissMs !== null ? `${report.avgMissMs} ms` : "—"}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              AI Crawler &amp; Cron */5m
            </span>
            <Bot className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {report.aiCrawlerRequests.toLocaleString("de-DE")} AI
          </div>
          <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              Cron: {report.cron.okCount}/{report.cron.runs} OK (
              {report.cron.runs > 0 ? `${report.cron.avgMs} ms` : "đang chờ"})
            </span>
          </p>
        </div>
      </div>

      {/* Route Groups Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Hiệu năng Edge Cache theo nhóm Route</h2>
          <span className="text-xs text-slate-500">
            Cửa sổ: {window === "24h" ? "24 giờ gần nhất" : "7 ngày gần nhất"}
          </span>
        </div>

        {report.routeGroups.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            Chưa có mẫu request trong khoảng thời gian này.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-medium">Nhóm Route</th>
                  <th className="px-4 py-3 font-medium text-right">Requests</th>
                  <th className="px-4 py-3 font-medium text-right">HIT</th>
                  <th className="px-4 py-3 font-medium text-right">MISS</th>
                  <th className="px-4 py-3 font-medium text-right">BYPASS</th>
                  <th className="px-4 py-3 font-medium text-right">HIT Rate</th>
                  <th className="px-4 py-3 font-medium text-right">HIT TB</th>
                  <th className="px-6 py-3 font-medium text-right">MISS TB</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.routeGroups.map((row) => (
                  <tr key={row.routeGroup} className="hover:bg-slate-50/70">
                    <td className="px-6 py-3 font-medium text-slate-900">
                      {ROUTE_GROUP_LABELS[row.routeGroup] || row.routeGroup}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700">
                      {row.total.toLocaleString("de-DE")}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-700">
                      {row.hits.toLocaleString("de-DE")}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-amber-700">
                      {row.misses.toLocaleString("de-DE")}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-500">
                      {row.bypasses.toLocaleString("de-DE")}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-900">
                      {row.hitRatePct !== null ? `${row.hitRatePct}%` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-700">
                      {row.avgHitMs !== null ? `${row.avgHitMs} ms` : "—"}
                    </td>
                    <td className="px-6 py-3 text-right font-mono text-slate-600">
                      {row.avgMissMs !== null ? `${row.avgMissMs} ms` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Client Kinds + Geography & PoPs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="w-5 h-5 text-violet-600" />
            <h2 className="font-semibold text-slate-900">Phân loại Client &amp; AI Bots</h2>
          </div>
          {report.clientKinds.length === 0 ? (
            <p className="text-sm text-slate-500">Chưa có dữ liệu.</p>
          ) : (
            <div className="space-y-3">
              {report.clientKinds.map((item) => {
                const pct =
                  report.totalRequests > 0
                    ? Math.round((item.requests / report.totalRequests) * 100)
                    : 0;
                return (
                  <div key={item.clientKind} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-800">
                        {CLIENT_KIND_LABELS[item.clientKind] || item.clientKind}
                      </span>
                      <span className="font-mono text-xs text-slate-600">
                        {item.requests.toLocaleString("de-DE")} ({pct}%) · TB {item.avgMs} ms
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${Math.min(100, Math.max(pct, 2))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-slate-900">Top Quốc gia &amp; Edge PoP</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="text-xs font-semibold uppercase text-slate-500 mb-2">Quốc gia</h3>
                <ul className="space-y-1.5">
                  {report.topCountries.length === 0 ? (
                    <li className="text-slate-400 text-xs">Chưa có dữ liệu</li>
                  ) : (
                    report.topCountries.map((c) => (
                      <li key={c.key} className="flex justify-between text-slate-700">
                        <span className="font-medium">{c.key}</span>
                        <span className="font-mono text-xs">
                          {c.requests.toLocaleString("de-DE")}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase text-slate-500 mb-2 flex items-center gap-1">
                  <Server className="w-3.5 h-3.5" /> Edge PoP
                </h3>
                <ul className="space-y-1.5">
                  {report.topColos.length === 0 ? (
                    <li className="text-slate-400 text-xs">Chưa có dữ liệu</li>
                  ) : (
                    report.topColos.map((c) => (
                      <li key={c.key} className="flex justify-between text-slate-700">
                        <span className="font-mono text-xs font-semibold">{c.key}</span>
                        <span className="font-mono text-xs">
                          {c.requests.toLocaleString("de-DE")}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Analytics 4 + Cloudflare Dashboards */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">
              Google Analytics 4 &amp; Công cụ đo lường Cloudflare
            </h3>
            <p className="text-sm text-slate-500 mb-3">
              Mã đo lường GA4:{" "}
              <code className="bg-slate-100 px-2 py-0.5 rounded">{gaId || "Chưa cấu hình"}</code>
            </p>

            {gaId === "G-0P6ECEDSWG" ? (
              <div className="text-sm text-emerald-700 flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Mã GA4 khớp với cấu hình production
              </div>
            ) : (
              <div className="text-sm text-amber-700 flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4" />
                Mã môi trường ({gaId || "Chưa có"}) khác với cấu hình mặc định (G-0P6ECEDSWG)
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-sm">
              <a
                href="https://analytics.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-600 hover:underline font-medium"
              >
                <span>Google Analytics 4</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://dash.cloudflare.com/cd2355b1655a8bf991ab9faaa0d14d5f/web-analytics"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-600 hover:underline font-medium"
              >
                <span>Cloudflare Web Analytics (RUM)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://dash.cloudflare.com/cd2355b1655a8bf991ab9faaa0d14d5f/ai/ai-gateway/gateways/dmf-ai-gateway"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-600 hover:underline font-medium"
              >
                <span>Cloudflare AI Gateway (dmf-ai-gateway)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
