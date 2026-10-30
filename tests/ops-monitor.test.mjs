// All network requests target disposable loopback HTTP fixtures.
import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { mkdtemp, readFile, stat, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  probe,
  runMonitor,
  safeOrigin,
  evidenceWriter,
  main,
  validHealth,
  notifyLocal,
} from "../scripts/ops/monitor.mjs";
const chat = {
  status: "ready",
  mode: "guided",
  aiEnabled: false,
  message:
    "Built-in scripted FAQ responder configured. This is not an availability guarantee or a backend health check.",
  requestId: "10000000-0000-4000-8000-000000000001",
  durationMs: 1,
};
async function fixture(t, handler) {
  const server = createServer(handler);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  });
  return `http://127.0.0.1:${server.address().port}`;
}
function json(res, body, status = 200) {
  res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
}
const check = (origin, overrides = {}) =>
  probe({ origin, path: "/api/chat", kind: "chat", timeoutMs: 1000, ...overrides });
test("strict HTTPS/origin options and explicit loopback opt-in", async () => {
  assert.equal(safeOrigin("https://www.dmf-talents.de"), "https://www.dmf-talents.de");
  for (const input of [
    "http://example.invalid",
    "http://127.0.0.1",
    "https://localhost",
    "https://127.0.0.2",
    "https://[::ffff:127.0.0.2]",
    "https://user:secret@example.invalid",
    "https://example.invalid?token=secret",
    "https://example.invalid/api/chat",
    "ftp://example.invalid",
  ])
    assert.throws(() => safeOrigin(input));
  assert.equal(safeOrigin("http://127.0.0.1:1234", true), "http://127.0.0.1:1234");
  for (const args of [
    ["--observe-hours", "73"],
    ["--interval-minutes", "1"],
    ["--timeout-seconds", "NaN"],
    ["--unknown"],
    ["--recover-notifications"],
  ])
    await assert.rejects(main(args));
});
test("exact guided schema rejects AI, extra/provider fields, bad shapes and oversized responses", async (t) => {
  let body = chat;
  const origin = await fixture(t, (_, res) => json(res, body));
  assert.equal((await check(origin)).outcome, "ok");
  for (body of [
    { ...chat, aiEnabled: true },
    { ...chat, mode: "ai" },
    { ...chat, providers: [] },
    { ...chat, requestId: "secret" },
    { ...chat, durationMs: -1 },
    {},
    null,
    { ...chat, message: "x".repeat(70_000) },
  ])
    assert.equal((await check(origin)).outcome, "shape");
});
test("HTTP errors, malformed JSON, network failure and hanging body stay bounded", async (t) => {
  const origin = await fixture(t, (req, res) => {
    if (req.url === "/status") {
      res.writeHead(503);
      res.end("private backend error");
    } else if (req.url === "/bad") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end("{");
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write("{");
    }
  });
  assert.equal((await check(origin, { path: "/status" })).outcome, "http");
  assert.equal((await check(origin, { path: "/bad" })).outcome, "shape");
  const start = Date.now();
  assert.equal((await check(origin, { timeoutMs: 40 })).outcome, "timeout");
  assert.ok(Date.now() - start < 1000);
  assert.equal(
    (
      await check(origin, {
        fetchImpl: async () => {
          throw new Error("private bearer");
        },
      })
    ).outcome,
    "network"
  );
});
test("cross-origin and query redirects never forward auth, same-origin redirects work", async (t) => {
  let outsideRequests = 0;
  const outside = await fixture(t, (_, res) => {
    outsideRequests++;
    res.end();
  });
  let location = `${outside}/stolen`;
  const origin = await fixture(t, (req, res) => {
    if (req.url === "/good") {
      json(res, chat);
      return;
    }
    res.writeHead(302, { Location: location });
    res.end();
  });
  assert.equal((await check(origin, { token: "private-token" })).outcome, "redirect");
  assert.equal(outsideRequests, 0);
  location = "/good?token=private";
  assert.equal((await check(origin)).outcome, "redirect");
  location = "/good";
  assert.equal((await check(origin)).outcome, "ok");
  location = "/loop";
  assert.equal((await check(origin)).outcome, "redirect");
});
test("default is public GET only; optional protected checks retain no auth/body/URL data", async (t) => {
  const requests = [],
    events = [];
  const token = "PRIVATE_TOKEN_SENTINEL";
  const origin = await fixture(t, (req, res) => {
    requests.push({ path: req.url, method: req.method, auth: req.headers.authorization });
    if (req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("PRIVATE_BODY_SENTINEL");
    } else if (req.url === "/api/chat") json(res, chat);
    else if (req.url === "/api/ops/health")
      json(
        res,
        {
          status: "degraded",
          checks: {
            database: { status: "ok" },
            notifications: {
              status: "degraded",
              pending: 0,
              failed: 1,
              staleSending: 0,
              exhausted: 0,
              oldestPendingSeconds: 0,
            },
            configuration: {
              status: "ok",
              databaseConfigured: true,
              smtpConfigured: true,
              telegramConfigured: false,
              deliveryEnabled: true,
            },
          },
        },
        503
      );
    else json(res, { private: "PRIVATE_BODY_SENTINEL" });
  });
  await runMonitor({ origin, emit: (e) => events.push(e) });
  assert.deepEqual(
    requests.map((r) => [r.method, r.path, r.auth]),
    [
      ["GET", "/", undefined],
      ["GET", "/api/chat", undefined],
    ]
  );
  requests.length = 0;
  await runMonitor({ origin, health: true, token, emit: (e) => events.push(e) });
  assert.equal(requests.length, 3);
  assert.equal(requests[2].auth, `Bearer ${token}`);
  assert.ok(events.some((e) => e.outcome === "degraded"));
  await runMonitor({ origin, health: true, recover: true, token, emit: (e) => events.push(e) });
  assert.equal(requests.filter((r) => r.method === "POST").length, 1);
  for (const secret of [token, "PRIVATE_BODY_SENTINEL", origin, "Bearer"])
    assert.ok(!JSON.stringify(events).includes(secret));
});
test("503 health must match degraded schema and 200 must be healthy", async (t) => {
  let status = 503,
    body = {
      status: "degraded",
      checks: {
        database: { status: "degraded" },
        notifications: {
          status: "ok",
          pending: 0,
          failed: 0,
          staleSending: 0,
          exhausted: 0,
          oldestPendingSeconds: 0,
        },
        configuration: {
          status: "ok",
          databaseConfigured: true,
          smtpConfigured: true,
          telegramConfigured: false,
          deliveryEnabled: true,
        },
      },
    };
  const origin = await fixture(t, (_, res) => json(res, body, status));
  assert.equal((await check(origin, { kind: "health" })).outcome, "degraded");
  body = { status: "degraded", checks: {} };
  assert.equal((await check(origin, { kind: "health" })).outcome, "shape");
  status = 200;
  assert.equal((await check(origin, { kind: "health" })).outcome, "shape");
});
test("transition alerts are deduplicated, outage backs off, recovery resets and deadline ends", async (t) => {
  const siteTimes = [],
    events = [];
  let cycle = 0;
  const origin = await fixture(t, (req, res) => {
    if (req.url === "/") {
      cycle++;
      siteTimes.push(Date.now());
      res.writeHead(cycle < 3 ? 503 : 200, { "Content-Type": "text/html" });
      res.end();
    } else json(res, chat);
  });
  const summary = await runMonitor({
    origin,
    durationMs: 380,
    intervalMs: 15,
    timeoutMs: 100,
    emit: (e) => events.push(e),
  });
  assert.deepEqual(
    events.filter((e) => e.event === "alert" && e.check === "site").map((e) => e.state),
    ["outage", "ok"]
  );
  assert.ok(siteTimes[2] - siteTimes[1] >= 55, "second outage delays at least 4 intervals");
  assert.ok(summary.elapsedMs >= 375 && summary.elapsedMs < 1000);
  assert.equal(summary.stopped, "deadline");
  assert.ok(summary.maxSampleGapMs >= 55);
});
test("observation-limited requests never emit outage alerts, including clipped recovery", async () => {
  const healthy = {
    status: "ok",
    checks: {
      database: { status: "ok" },
      notifications: {
        status: "ok",
        pending: 0,
        failed: 0,
        staleSending: 0,
        exhausted: 0,
        oldestPendingSeconds: 0,
      },
      configuration: {
        status: "ok",
        databaseConfigured: true,
        smtpConfigured: true,
        telegramConfigured: false,
        deliveryEnabled: true,
      },
    },
  };
  for (const recover of [false, true]) {
    const events = [];
    const summary = await runMonitor({
      origin: "https://example.invalid",
      durationMs: 40,
      intervalMs: 5,
      timeoutMs: 1000,
      health: recover,
      recover,
      token: recover ? "local-fixture-only" : undefined,
      fetchImpl: async (url, { signal }) => {
        // For recovery, first return healthy public/protected checks immediately.
        if (recover && url.pathname !== "/api/ops/notifications") {
          if (url.pathname === "/")
            return new Response("fixture", { headers: { "Content-Type": "text/html" } });
          return new Response(JSON.stringify(url.pathname === "/api/chat" ? chat : healthy), {
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
          });
        }
        await new Promise((_, reject) => {
          const timer = setTimeout(() => reject(new Error("test safety deadline")), 500);
          const abort = () => {
            clearTimeout(timer);
            reject(signal.reason);
          };
          if (signal.aborted) abort();
          else signal.addEventListener("abort", abort, { once: true });
        });
      },
      emit: (event) => events.push(event),
    });
    assert.ok(events.some((e) => e.outcome === "aborted"));
    assert.equal(
      events.some((e) => e.event === "alert" && e.state === "outage"),
      false
    );
    const count = summary.counts[recover ? "recovery" : "site"];
    assert.ok(count.aborted >= 1);
    assert.equal(count.failed, 0);
  }
});
test("abort interrupts in-flight requests and final summary reports actual short coverage", async (t) => {
  const origin = await fixture(t, () => {});
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 40);
  t.after(() => clearTimeout(timer));
  const events = [];
  const summary = await runMonitor({
    origin,
    durationMs: 72 * 3_600_000,
    signal: controller.signal,
    emit: (e) => events.push(e),
  });
  assert.equal(summary.stopped, "aborted");
  assert.ok(summary.elapsedMs < 1000);
  assert.equal(summary.counts.site.aborted, 1);
  assert.equal(summary.counts.chat, undefined);
  assert.equal(events.at(-1).event, "summary");
});
test("evidence is private, bounded JSONL and refuses existing paths", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "dmf-monitor-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const file = join(dir, "evidence.jsonl");
  const write = await evidenceWriter(file, 180);
  for (let i = 0; i < 30; i++)
    await write({
      timestamp: new Date().toISOString(),
      event: "check",
      outcome: "ok",
      status: 200,
    });
  const raw = await readFile(file, "utf8");
  assert.ok(Buffer.byteLength(raw) <= 180);
  assert.ok(
    raw
      .trim()
      .split("\n")
      .every((line) => JSON.parse(line).outcome === "ok")
  );
  assert.equal((await stat(file)).mode & 0o777, 0o600);
  await assert.rejects(evidenceWriter(file));
});

test("repeated health outages invoke bounded recovery once per cycle and idle wait aborts promptly", async (t) => {
  let healthChecks = 0,
    recoveries = 0;
  const events = [];
  const origin = await fixture(t, (req, res) => {
    if (req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end();
    } else if (req.url === "/api/chat") json(res, chat);
    else if (req.url === "/api/ops/health") {
      healthChecks++;
      json(
        res,
        {
          status: "degraded",
          checks: {
            database: { status: "ok" },
            notifications: {
              status: "degraded",
              pending: 0,
              failed: 1,
              staleSending: 0,
              exhausted: 0,
              oldestPendingSeconds: 0,
            },
            configuration: {
              status: "ok",
              databaseConfigured: true,
              smtpConfigured: true,
              telegramConfigured: false,
              deliveryEnabled: true,
            },
          },
        },
        503
      );
    } else {
      recoveries++;
      json(res, {});
    }
  });
  await runMonitor({
    origin,
    health: true,
    recover: true,
    token: "fixture-token",
    durationMs: 180,
    intervalMs: 10,
    timeoutMs: 50,
    emit: (e) => events.push(e),
  });
  assert.ok(healthChecks >= 3);
  assert.ok(recoveries >= 1);
  assert.ok(recoveries <= events.filter((e) => e.event === "check" && e.check === "health").length);
  assert.equal(events.filter((e) => e.event === "alert" && e.check === "health").length, 1);
  const controller = new AbortController();
  const started = Date.now();
  const summary = await runMonitor({
    origin,
    durationMs: 60_000,
    intervalMs: 30_000,
    signal: controller.signal,
    emit: (e) => {
      if (e.event === "check" && e.check === "chat") setTimeout(() => controller.abort(), 20);
    },
  });
  assert.equal(summary.stopped, "aborted");
  assert.ok(Date.now() - started < 1000);
});

test("nested operations health contract rejects legacy string checks and leaked fields", () => {
  const body = {
    status: "ok",
    checks: {
      database: { status: "ok" },
      notifications: {
        status: "ok",
        pending: 0,
        failed: 0,
        staleSending: 0,
        exhausted: 0,
        oldestPendingSeconds: 0,
      },
      configuration: {
        status: "ok",
        databaseConfigured: true,
        smtpConfigured: true,
        telegramConfigured: false,
        deliveryEnabled: true,
      },
    },
  };
  assert.equal(validHealth(body), true);
  assert.equal(
    validHealth({ ...body, checks: { database: "ok", notifications: "ok", configuration: "ok" } }),
    false
  );
  body.checks.notifications.pending = -1;
  assert.equal(validHealth(body), false);
  body.checks.notifications.pending = 0;
  body.checks.configuration.token = "secret";
  assert.equal(validHealth(body), false);
});

test("local notifications announce only incidents and recoveries with fixed safe fields", async () => {
  const calls = [];
  const run = (...args) => {
    calls.push(args);
    args.at(-1)(null);
  };
  await notifyLocal({ event: "alert", check: "health", previous: "unknown", state: "ok" }, run);
  assert.equal(calls.length, 0);
  await notifyLocal({ event: "alert", check: "health", previous: "ok", state: "outage" }, run);
  await notifyLocal({ event: "alert", check: "health", previous: "outage", state: "ok" }, run);
  await notifyLocal(
    { event: "alert", check: "injected secret", previous: "ok", state: "outage" },
    run
  );
  assert.equal(calls.length, 2);
  assert.equal(calls[0][0], "/usr/bin/osascript");
  assert.ok(calls[0][1].at(-1).includes("needs attention"));
  assert.ok(calls[1][1].at(-1).includes("recovered"));
});
