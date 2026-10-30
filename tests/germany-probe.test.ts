import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST as deployedPOST } from "../app/api/qa/germany-probe/route";

// The real run key is deliberately unavailable. Compile an in-memory fixture with only
// the public digest replaced by a known test digest. Crypto, guards and handler code
// remain real; no credential files are read and the deployed file is never rewritten.
const testKey = "local-test-key-only";
const source = readFileSync(
  new URL("../app/api/qa/germany-probe/route.ts", import.meta.url),
  "utf8"
);
const digest = "b047f56aaed790682f3e0235b7e4ebec1dbb21fc40abc1e1b920f69de81c4d4c";
if (source.split(digest).length !== 2) throw new Error("Public digest fixture drift");
const fixture = ts.transpileModule(
  source.replace(digest, createHash("sha256").update(testKey).digest("hex")),
  { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }
).outputText;
const exportsFixture = {} as { POST: typeof deployedPOST };
new Function("require", "exports", fixture)(createRequire(import.meta.url), exportsFixture);
const POST = exportsFixture.POST;
const oidc = "platform-token-never-output";
const home = "Fachkräfte aus Vietnam für Deutschland | DMF Talents";
const hosts = {
  control: "dmf-germany-pnz5rwdec-huynhngocphuc92-cmyks-projects.vercel.app",
  candidate: "dmf-germany-db76gq096-huynhngocphuc92-cmyks-projects.vercel.app",
};
const fetchMock = vi.fn<typeof fetch>();
function request(
  body: unknown = { variant: "control", mode: "measure", blockId: 0 },
  headers = {}
) {
  return new Request("https://probe.invalid/api/qa/germany-probe", {
    method: "POST",
    headers: { authorization: `Bearer ${testKey}`, "x-vercel-oidc-token": oidc, ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}
function upstream(url: string | URL | Request, headers = {}, status = 200, body?: string) {
  const target = new URL(String(url));
  const region = target.hostname === hosts.control ? "iad1" : "bom1";
  return new Response(
    body ?? (target.pathname === "/" ? `<title>${home}</title>` : '{"logoUrl":null}'),
    {
      status,
      headers: {
        "x-vercel-id": `fra1::${region}::abcde-1234-aabbcc`,
        "x-vercel-cache": "MISS",
        ...headers,
      },
    }
  );
}
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout", "performance"] });
  vi.setSystemTime(new Date("2026-10-30T10:00:00Z"));
  vi.stubEnv("VERCEL_ENV", "preview");
  vi.stubEnv("VERCEL_REGION", "fra1");
  vi.stubEnv("VERCEL_OIDC_TOKEN", "");
  fetchMock.mockReset().mockImplementation(async (url) => upstream(url));
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

async function result(req = request()) {
  const response = await POST(req);
  expect(response.headers.get("cache-control")).toBe("no-store");
  const text = await response.text();
  expect(text).not.toContain(oidc);
  expect(text).not.toContain(testKey);
  return { status: response.status, data: JSON.parse(text) };
}

describe("preview probe isolation and input boundary", () => {
  it("enforces environment, region, expiry, then real digest authentication without fetch", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("VERCEL_REGION", "iad1");
    vi.setSystemTime(new Date("2027-01-01"));
    expect((await result()).status).toBe(404);
    vi.stubEnv("VERCEL_ENV", "preview");
    expect((await result()).status).toBe(503);
    vi.stubEnv("VERCEL_REGION", "fra1");
    expect((await result()).status).toBe(410);
    vi.setSystemTime(new Date("2026-10-30T17:10:40.652Z"));
    expect((await result()).status).toBe(410);
    vi.setSystemTime(new Date("2026-10-30T10:00:00Z"));
    const real = await deployedPOST(request());
    expect(real.status).toBe(401);
    expect((await result(request(undefined, { authorization: "Bearer wrong" }))).status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it.each([
    null,
    [],
    {},
    "{",
    " ".repeat(1025),
    { variant: "production", mode: "measure", blockId: 0 },
    { variant: "constructor", mode: "measure", blockId: 0 },
    { variant: "control", mode: "other", blockId: 0 },
    ...[-1, 6, 0.5, "0", null].map((blockId) => ({ variant: "control", mode: "measure", blockId })),
    ...["url", "headers", "count"].map((key) => ({
      variant: "control",
      mode: "measure",
      blockId: 0,
      [key]: "untrusted",
    })),
  ])("rejects invalid body %# before fetch", async (body) => {
    expect((await result(request(body))).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("requires OIDC and treats an empty inbound header as present, without fallback", async () => {
    expect((await result(request(undefined, { "x-vercel-oidc-token": "" }))).status).toBe(503);
    vi.stubEnv("VERCEL_OIDC_TOKEN", "fallback");
    expect((await result(request(undefined, { "x-vercel-oidc-token": "" }))).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("bounded anonymous upstream evidence", () => {
  it.each(["control", "candidate"] as const)(
    "pins %s and completes exactly 22 alternating requests",
    async (variant) => {
      const { status, data } = await result(request({ variant, mode: "measure", blockId: 5 }));
      expect(status).toBe(200);
      expect(fetchMock).toHaveBeenCalledTimes(22);
      expect(data.samples).toHaveLength(22);
      expect(data.title).toBe(home);
      expect(data.logoSha256).toBe(createHash("sha256").update('{"logoUrl":null}').digest("hex"));
      const paths = fetchMock.mock.calls.map(([url, options]) => {
        expect(new URL(String(url)).hostname).toBe(hosts[variant]);
        expect(options).toMatchObject({ method: "GET", cache: "no-store", redirect: "manual" });
        expect(options?.headers).toEqual({
          "Cache-Control": "no-cache",
          "x-vercel-trusted-oidc-idp-token": oidc,
        });
        return new URL(String(url)).pathname;
      });
      expect(paths.slice(0, 6)).toEqual(["/api/logo", "/", "/", "/api/logo", "/api/logo", "/"]);
      for (const path of ["/", "/api/logo"]) {
        expect(
          data.samples.filter((s: { path: string; warmup: boolean }) => s.path === path && s.warmup)
        ).toHaveLength(1);
        expect(
          data.samples.filter(
            (s: { path: string; warmup: boolean }) => s.path === path && !s.warmup
          )
        ).toHaveLength(10);
      }
      expect(data.samples[0]).toMatchObject({
        status: 200,
        probeRegion: "fra1",
        regionMatch: true,
        cache: "MISS",
        ttfbMs: 0,
        totalMs: 0,
      });
    }
  );
  it("preflight exposes only the small contract summary", async () => {
    const { data } = await result(request({ variant: "control", mode: "preflight", blockId: 0 }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(data).toEqual({
      status: 200,
      region: "iad1",
      requestId: "fra1::iad1::abcde-1234-aabbcc",
      contract: true,
    });
  });
  it.each(["fra1:iad1::iad1::abcde-1234-aabbcc", "fra1:iad1:sfo1:fra1::iad1::abcde-1234-aabbcc"])(
    "recognizes the final execution region in observed multi-hop IDs: %s",
    async (id) => {
      fetchMock.mockImplementation(async (url) => upstream(url, { "x-vercel-id": id }));
      const { status, data } = await result(
        request({ variant: "control", mode: "preflight", blockId: 0 })
      );
      expect(status).toBe(200);
      expect(data).toMatchObject({ requestId: id, region: "iad1", contract: true });
    }
  );
  it("returns no upstream exception details or tokens", async () => {
    fetchMock.mockRejectedValue(new Error(oidc));
    const { data } = await result();
    expect(data.error).toBe("UPSTREAM_FAILED");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it("requires OIDC when both sources are absent", async () => {
    const req = request();
    req.headers.delete("x-vercel-oidc-token");
    expect((await result(req)).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("times out and cancels a stalled input stream before any fetch", async () => {
    let cancelled = false;
    const req = new Request("https://probe.invalid/api/qa/germany-probe", {
      method: "POST",
      headers: { authorization: `Bearer ${testKey}` },
      body: new ReadableStream({
        cancel() {
          cancelled = true;
        },
      }),
      duplex: "half",
    } as RequestInit);
    const pending = result(req);
    await vi.advanceTimersByTimeAsync(8000);
    expect((await pending).status).toBe(400);
    expect(cancelled).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("measures headers separately from a successfully streamed body", async () => {
    fetchMock.mockImplementation(async (url) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const response = upstream(url);
      const body = await response.text();
      return new Response(
        new ReadableStream({
          start(controller) {
            setTimeout(() => {
              controller.enqueue(new TextEncoder().encode(body));
              controller.close();
            }, 200);
          },
        }),
        { headers: response.headers }
      );
    });
    const pending = result();
    await vi.advanceTimersByTimeAsync(6600);
    const { data } = await pending;
    expect(data.samples).toHaveLength(22);
    expect(data.samples[0]).toMatchObject({ ttfbMs: 100, totalMs: 300 });
    expect(data.samples[0].bytes).toBeGreaterThan(0);
  });
  it("uses env OIDC only when inbound header is absent", async () => {
    vi.stubEnv("VERCEL_OIDC_TOKEN", oidc);
    const req = request({ variant: "control", mode: "preflight", blockId: 0 });
    req.headers.delete("x-vercel-oidc-token");
    expect((await result(req)).status).toBe(200);
    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({
      "x-vercel-trusted-oidc-idp-token": oidc,
    });
  });
  it.each([
    { status: 302, headers: { location: "https://elsewhere.invalid" }, code: "UPSTREAM_STATUS" },
    {
      status: 401,
      headers: { "x-vercel-error": "AUTHENTICATION_REQUIRED" },
      code: "AUTHENTICATION_REQUIRED",
    },
    { status: 403, headers: { "x-vercel-error": oidc }, code: "UPSTREAM_STATUS" },
    { headers: { "x-vercel-cache": "HIT" }, code: "CACHE_HIT" },
    { headers: { "x-vercel-id": "fra1::bom1::abcde-1234-aabbcc" }, code: "TARGET_REGION" },
    { headers: { "x-vercel-id": oidc }, code: "TARGET_REGION" },
    { body: "<title>Wrong page</title>", code: "HOME_TITLE" },
    { body: "x".repeat(4 * 1024 * 1024 + 1), code: "BODY_LIMIT" },
  ])(
    "stops immediately with sanitized partial evidence: $code",
    async ({ headers, status, body, code }) => {
      fetchMock.mockImplementation(async (url) => upstream(url, headers, status, body));
      const response = await result();
      expect(response.status).toBe(502);
      expect(response.data.error).toBe(code);
      expect(response.data.samples).toHaveLength(1);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    }
  );
  it("rejects a logo with extra private fields without returning body", async () => {
    fetchMock.mockImplementation(async (url) =>
      upstream(url, {}, 200, '{"logoUrl":null,"secret":"private"}')
    );
    const { data } = await result(request({ variant: "control", mode: "preflight", blockId: 0 }));
    expect(data).toMatchObject({ error: "LOGO_CONTRACT", contract: false });
    expect(JSON.stringify(data)).not.toContain("private");
  });
  it("times out a stalled header fetch at 8s and aborts without retry", async () => {
    fetchMock.mockImplementation(() => new Promise(() => {}));
    const pending = result();
    await vi.advanceTimersByTimeAsync(8000);
    expect((await pending).data.error).toBe("TIMEOUT");
    expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it("includes body time in the 8s timeout and TTFB excludes body time", async () => {
    fetchMock.mockImplementation(async (url) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const response = upstream(url);
      return new Response(
        new ReadableStream({
          start(controller) {
            setTimeout(() => {
              controller.enqueue(new TextEncoder().encode("late"));
            }, 9000);
          },
        }),
        { headers: response.headers }
      );
    });
    const pending = result();
    await vi.advanceTimersByTimeAsync(8000);
    const { data } = await pending;
    expect(data.error).toBe("TIMEOUT");
    expect(data.samples[0]).toMatchObject({ ttfbMs: 100, totalMs: 8000 });
  });
  it("caps the complete sequential run at 50s with no further requests", async () => {
    fetchMock.mockImplementation(async (url) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return upstream(url);
    });
    const pending = result();
    await vi.advanceTimersByTimeAsync(50_000);
    const { data } = await pending;
    expect(data.error).toBe("TIMEOUT");
    expect(fetchMock).toHaveBeenCalledTimes(17);
    expect(
      data.samples.reduce((sum: number, sample: { totalMs: number }) => sum + sample.totalMs, 0)
    ).toBe(50_000);
  });
});
