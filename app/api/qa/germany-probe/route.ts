import { createHash, timingSafeEqual } from "node:crypto";

// Temporary preview-only probe. Public settings; never store the bearer key here.
export const maxDuration = 60;
const KEY_SHA256 = "b047f56aaed790682f3e0235b7e4ebec1dbb21fc40abc1e1b920f69de81c4d4c";
const EXPIRES_AT = "2026-10-30T17:10:40.651903+00:00";
const TARGETS = {
  control: {
    host: "dmf-germany-pnz5rwdec-huynhngocphuc92-cmyks-projects.vercel.app",
    region: "iad1",
  },
  candidate: {
    host: "dmf-germany-db76gq096-huynhngocphuc92-cmyks-projects.vercel.app",
    region: "bom1",
  },
} as const;
const HOME_TITLE = "Fachkräfte aus Vietnam für Deutschland | DMF Talents";
const LIMIT = 4 * 1024 * 1024;
const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
const reply = (status: number, data: unknown) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

// Race as well as abort: enforce the budget even if a transport does not settle on abort.
async function within<T>(ms: number, controller: AbortController, work: () => Promise<T>) {
  if (ms <= 0) throw new Error("TIMEOUT");
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      work(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          controller.abort();
          reject(new Error("TIMEOUT"));
        }, ms);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

async function boundedBody(
  body: ReadableStream<Uint8Array> | null,
  limit: number,
  signal: AbortSignal,
  progress?: (bytes: number) => void
) {
  const reader = body?.getReader();
  const cancel = () => {
    void reader?.cancel().catch(() => {});
  };
  signal.addEventListener("abort", cancel, { once: true });
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        progress?.(bytes);
        if (bytes > limit) throw new Error("BODY_LIMIT");
        chunks.push(value);
      }
    }
    return { text: Buffer.concat(chunks).toString("utf8"), bytes };
  } finally {
    signal.removeEventListener("abort", cancel);
    // Do not wait for cancellation of an unresponsive peer.
    void reader?.cancel().catch(() => {});
  }
}

function source(headers: Headers, region: string) {
  const raw = headers.get("x-vercel-id") ?? "";
  const requestId =
    /^(?:[a-z]{3}\d:{1,2}){1,20}[a-z0-9]+-\d+-[a-f0-9]+$/i.test(raw) && raw.length <= 300
      ? raw
      : null;
  const locations = requestId?.split(/:+/).slice(0, -1);
  const selectedRegion = locations?.at(-1) ?? null;
  return { requestId, region: selectedRegion, regionMatch: selectedRegion === region };
}

function protectionCode(headers: Headers) {
  const code = headers.get("x-vercel-error");
  return code && ["DEPLOYMENT_PROTECTED", "AUTHENTICATION_REQUIRED", "FORBIDDEN"].includes(code)
    ? code
    : "UPSTREAM_STATUS";
}

type Sample = {
  timestamp: string;
  variant: keyof typeof TARGETS;
  path: "/" | "/api/logo";
  index: number;
  warmup: boolean;
  status: number | null;
  ttfbMs: number | null;
  totalMs: number;
  bytes: number;
  cache: string;
  region: string | null;
  regionMatch: boolean;
  requestId: string | null;
  probeRegion: "fra1";
};

export async function POST(request: Request) {
  const deadline = performance.now() + 50_000;
  if (process.env.VERCEL_ENV !== "preview") return reply(404, { error: "NOT_FOUND" });
  if (process.env.VERCEL_REGION !== "fra1") return reply(503, { error: "PROBE_REGION" });
  if (Date.now() >= Date.parse(EXPIRES_AT)) return reply(410, { error: "EXPIRED" });
  const auth = request.headers.get("authorization") ?? "";
  if (
    !/^Bearer [^\s]+$/.test(auth) ||
    !timingSafeEqual(Buffer.from(sha256(auth.slice(7)), "hex"), Buffer.from(KEY_SHA256, "hex"))
  )
    return reply(401, { error: "UNAUTHORIZED" });

  if (request.method !== "POST") return reply(405, { error: "METHOD_NOT_ALLOWED" });

  let input: { variant: keyof typeof TARGETS; mode: "preflight" | "measure"; blockId: number };
  const bodyController = new AbortController();
  try {
    const { text } = await within(
      Math.min(8000, deadline - performance.now()),
      bodyController,
      () => boundedBody(request.body, 4096, bodyController.signal)
    );
    if (text.length > 1024) throw new Error("INPUT");
    const value = JSON.parse(text);
    if (
      !value ||
      Array.isArray(value) ||
      typeof value !== "object" ||
      Object.keys(value).sort().join(",") !== "blockId,mode,variant" ||
      !["control", "candidate"].includes(value.variant) ||
      !["preflight", "measure"].includes(value.mode) ||
      !Number.isInteger(value.blockId) ||
      value.blockId < 0 ||
      value.blockId > 5
    )
      throw new Error("INPUT");
    input = value;
  } catch {
    void request.body?.cancel().catch(() => {});
    return reply(400, { error: "INVALID_BODY" });
  }

  const token = request.headers.get("x-vercel-oidc-token") ?? process.env.VERCEL_OIDC_TOKEN;
  if (!token) return reply(503, { error: "OIDC_UNAVAILABLE" });
  const target = TARGETS[input.variant];
  const samples: Sample[] = [];
  let title: string | undefined;
  let logoSha256: string | undefined;
  let error: string | undefined;
  const paths = ["/", "/api/logo"] as const;
  // Alternating endpoint order per pair and block; each endpoint has one warmup + ten samples.
  const plan =
    input.mode === "preflight"
      ? [{ path: "/api/logo" as const, index: 0, warmup: false }]
      : Array.from({ length: 11 }, (_, index) =>
          ((index + input.blockId) % 2 ? [...paths].reverse() : [...paths]).map((path) => ({
            path,
            index: index - 1,
            warmup: index === 0,
          }))
        ).flat();

  for (const item of plan) {
    const started = performance.now();
    const controller = new AbortController();
    const sample: Sample = {
      timestamp: new Date().toISOString(),
      variant: input.variant,
      ...item,
      status: null,
      ttfbMs: null,
      totalMs: 0,
      bytes: 0,
      cache: "UNKNOWN",
      region: null,
      regionMatch: false,
      requestId: null,
      probeRegion: "fra1",
    };
    try {
      await within(Math.min(8000, deadline - started), controller, async () => {
        const response = await fetch(`https://${target.host}${item.path}`, {
          method: "GET",
          cache: "no-store",
          redirect: "manual",
          signal: controller.signal,
          headers: { "Cache-Control": "no-cache", "x-vercel-trusted-oidc-idp-token": token },
        });
        sample.ttfbMs = performance.now() - started;
        sample.status = response.status;
        Object.assign(sample, source(response.headers, target.region));
        const cache = response.headers.get("x-vercel-cache")?.toUpperCase() ?? "UNKNOWN";
        sample.cache = ["HIT", "MISS", "BYPASS", "STALE", "PRERENDER", "REVALIDATED"].includes(
          cache
        )
          ? cache
          : "UNKNOWN";
        let failure: string | undefined;
        if (response.status !== 200) failure = protectionCode(response.headers);
        else if (cache === "HIT") failure = "CACHE_HIT";
        else if (!sample.regionMatch) failure = "TARGET_REGION";
        if (failure) {
          void response.body?.cancel().catch(() => {});
          throw new Error(failure);
        }
        const body = await boundedBody(response.body, LIMIT, controller.signal, (bytes) => {
          sample.bytes = bytes;
        });
        sample.bytes = body.bytes;
        if (item.path === "/api/logo") {
          let logo;
          try {
            logo = JSON.parse(body.text);
          } catch {
            throw new Error("LOGO_CONTRACT");
          }
          if (
            !logo ||
            Object.keys(logo).join(",") !== "logoUrl" ||
            !(logo.logoUrl === null || typeof logo.logoUrl === "string")
          )
            throw new Error("LOGO_CONTRACT");
          const digest = sha256(JSON.stringify(logo));
          if (logoSha256 && logoSha256 !== digest) throw new Error("LOGO_CHANGED");
          logoSha256 = digest;
        } else {
          if (/<title[^>]*>([\s\S]*?)<\/title>/i.exec(body.text)?.[1]?.trim() !== HOME_TITLE)
            throw new Error("HOME_TITLE");
          title = HOME_TITLE;
        }
      });
    } catch (failure) {
      const code = failure instanceof Error ? failure.message : "";
      error = [
        "TIMEOUT",
        "BODY_LIMIT",
        "UPSTREAM_STATUS",
        "DEPLOYMENT_PROTECTED",
        "AUTHENTICATION_REQUIRED",
        "FORBIDDEN",
        "CACHE_HIT",
        "TARGET_REGION",
        "LOGO_CONTRACT",
        "LOGO_CHANGED",
        "HOME_TITLE",
      ].includes(code)
        ? code
        : "UPSTREAM_FAILED";
    } finally {
      controller.abort();
      sample.totalMs = performance.now() - started;
      samples.push(sample);
    }
    if (error) break;
  }
  if (input.mode === "preflight") {
    const sample = samples[0];
    return reply(error ? 502 : 200, {
      status: sample.status,
      ...(error ? { error } : {}),
      region: sample.region,
      requestId: sample.requestId,
      contract: !error,
    });
  }
  return reply(error ? 502 : 200, {
    timestamp: new Date().toISOString(),
    variant: input.variant,
    blockId: input.blockId,
    probeRegion: "fra1",
    ...(error ? { error } : {}),
    title,
    logoSha256,
    samples,
  });
}

// Explicit handlers keep no-store and preview guards on every supported HTTP method.
export const GET = POST;
export const HEAD = POST;
export const OPTIONS = POST;
export const PUT = POST;
export const PATCH = POST;
export const DELETE = POST;
