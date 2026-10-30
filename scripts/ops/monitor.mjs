#!/usr/bin/env node
// Local, finite observation only. Never logs response bodies, URLs or credentials.
import { execFile } from "node:child_process";
import { open, rename, unlink } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { performance } from "node:perf_hooks";
import { setTimeout as sleep } from "node:timers/promises";

const HOUR = 3_600_000;
const CHAT_MESSAGE =
  "Built-in scripted FAQ responder configured. This is not an availability guarantee or a backend health check.";
const exactKeys = (value, keys) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.keys(value).sort().join(",") === [...keys].sort().join(",");
export function validChat(value) {
  return (
    exactKeys(value, ["status", "mode", "aiEnabled", "message", "requestId", "durationMs"]) &&
    value.status === "ready" &&
    value.mode === "guided" &&
    value.aiEnabled === false &&
    value.message === CHAT_MESSAGE &&
    typeof value.requestId === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.requestId) &&
    Number.isFinite(value.durationMs) &&
    value.durationMs >= 0
  );
}
export function validHealth(value) {
  if (
    !exactKeys(value, ["status", "checks"]) ||
    !["ok", "degraded"].includes(value.status) ||
    !exactKeys(value.checks, ["database", "notifications", "configuration"])
  )
    return false;
  const { database, notifications, configuration } = value.checks;
  const counts = ["pending", "failed", "staleSending", "exhausted", "oldestPendingSeconds"];
  const flags = ["databaseConfigured", "smtpConfigured", "telegramConfigured", "deliveryEnabled"];
  if (
    !exactKeys(database, ["status"]) ||
    !exactKeys(notifications, ["status", ...counts]) ||
    !exactKeys(configuration, ["status", ...flags]) ||
    !Object.values(value.checks).every((v) => ["ok", "degraded"].includes(v.status)) ||
    !counts.every(
      (k) =>
        notifications[k] === null ||
        (Number.isSafeInteger(notifications[k]) && notifications[k] >= 0)
    ) ||
    !flags.every((k) => typeof configuration[k] === "boolean")
  )
    return false;
  return (
    value.status !== "ok" ||
    (Object.values(value.checks).every((v) => v.status === "ok") &&
      counts.every((k) => notifications[k] !== null) &&
      configuration.databaseConfigured &&
      configuration.smtpConfigured &&
      configuration.deliveryEnabled)
  );
}
export function safeOrigin(input, allowLocal = false) {
  const url = new URL(input);
  const local =
    url.hostname === "localhost" ||
    url.hostname.endsWith(".localhost") ||
    /^127\./.test(url.hostname) ||
    url.hostname === "[::1]" ||
    /^\[::ffff:7f[0-9a-f]{2}:/.test(url.hostname);
  if (
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/" ||
    (local ? !allowLocal || !["http:", "https:"].includes(url.protocol) : url.protocol !== "https:")
  )
    throw new Error(
      "Invalid origin; HTTPS required, loopback requires --allow-local; no credentials, path, query or fragment"
    );
  return url.origin;
}

// Read only a bounded body; the same abort signal covers headers and body reads.
async function readJson(response) {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("shape");
  let size = 0;
  const chunks = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 65_536) throw new Error("shape");
      chunks.push(Buffer.from(value));
    }
    try {
      return JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      throw new Error("shape");
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
}

export async function probe({ origin, path, kind, token, timeoutMs, signal, fetchImpl = fetch }) {
  const start = performance.now();
  let status = null;
  let response;
  const deadline = AbortSignal.any([
    signal ?? new AbortController().signal,
    AbortSignal.timeout(timeoutMs),
  ]);
  try {
    let target = new URL(path, origin);
    for (let hops = 0; ; hops++) {
      response = await fetchImpl(target, {
        method: kind === "recovery" ? "POST" : "GET",
        redirect: "manual",
        signal: deadline,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          Accept: kind === "site" ? "text/html" : "application/json",
          "User-Agent": "DMF-Stability-Monitor/1.0",
        },
        cache: "no-store",
      });
      status = response.status;
      if (![301, 302, 303, 307, 308].includes(status)) break;
      const location = response.headers.get("location");
      await response.body?.cancel();
      if (!location || hops >= 3 || kind === "recovery") throw new Error("redirect");
      const next = new URL(location, target);
      if (next.origin !== origin || next.username || next.password || next.search || next.hash)
        throw new Error("redirect");
      target = next;
    }
    if (kind === "health" && status === 503) {
      const body = await readJson(response);
      if (!validHealth(body) || body.status !== "degraded") throw new Error("shape");
      return { outcome: "degraded", status, latencyMs: Math.round(performance.now() - start) };
    }
    if (status !== 200) {
      await response.body?.cancel();
      throw new Error("http");
    }
    if (kind === "chat" || kind === "health") {
      if (!response.headers.get("content-type")?.includes("application/json"))
        throw new Error("shape");
      const body = await readJson(response);
      if (kind === "chat" ? !validChat(body) : !validHealth(body) || body.status !== "ok")
        throw new Error("shape");
      if (kind === "chat" && !response.headers.get("cache-control")?.includes("no-store"))
        throw new Error("shape");
    } else {
      await response.body?.cancel();
      if (kind === "site" && !response.headers.get("content-type")?.includes("text/html"))
        throw new Error("shape");
    }
    return { outcome: "ok", status, latencyMs: Math.round(performance.now() - start) };
  } catch (error) {
    return {
      outcome: deadline.aborted
        ? signal?.aborted
          ? "aborted"
          : "timeout"
        : ["shape", "http", "redirect"].includes(error?.message)
          ? error.message
          : "network",
      status,
      latencyMs: Math.round(performance.now() - start),
    };
  } finally {
    await response?.body?.cancel().catch(() => {});
  }
}

export async function evidenceWriter(filename, maxBytes = 2_000_000) {
  const file = resolve(filename);
  const handle = await open(file, "wx", 0o600); // Never follow/overwrite an existing file.
  await handle.close();
  const lines = [];
  let bytes = 0;
  let retained = 0;
  return async (event) => {
    const line = JSON.stringify(event) + "\n";
    lines.push(line);
    bytes += Buffer.byteLength(line);
    while (bytes > maxBytes && lines.length > 1) {
      bytes -= Buffer.byteLength(lines.shift());
      retained++;
    }
    const temp = `${file}.${process.pid}.tmp`;
    let output;
    try {
      output = await open(temp, "wx", 0o600);
      await output.writeFile(lines.join(""));
      await output.close();
      output = null;
      await rename(temp, file);
    } finally {
      await output?.close();
      await unlink(temp).catch(() => {});
    }
    return retained;
  };
}

export async function runMonitor(options) {
  const {
    origin,
    durationMs = 0,
    intervalMs = 600_000,
    timeoutMs = 10_000,
    token,
    health = false,
    recover = false,
    signal = new AbortController().signal,
    emit = (event) => process.stdout.write(JSON.stringify(event) + "\n"),
    fetchImpl = fetch,
  } = options;
  if (
    !Number.isFinite(durationMs) ||
    durationMs < 0 ||
    durationMs > 72 * HOUR ||
    !Number.isFinite(intervalMs) ||
    intervalMs <= 0 ||
    !Number.isFinite(timeoutMs) ||
    timeoutMs <= 0
  )
    throw new Error("Invalid bounded observation settings");
  if ((health || recover) && (!token || /[\r\n]/.test(token)))
    throw new Error("DMF_OPS_TOKEN required");
  if (recover && !health) throw new Error("Recovery requires health monitoring");
  const started = performance.now();
  const startedAt = new Date().toISOString();
  const end = durationMs ? started + durationMs : started + timeoutMs * (health ? 3 : 2);
  const states = new Map();
  const counts = {};
  let cycles = 0,
    failures = 0,
    lastCycle = null,
    maxGapMs = 0,
    discarded = 0;
  const write = async (event) => {
    const result = await emit({ timestamp: new Date().toISOString(), ...event });
    if (Number.isInteger(result)) discarded = result;
  };
  const probes = [
    { name: "site", path: "/", kind: "site" },
    { name: "chat", path: "/api/chat", kind: "chat" },
    ...(health ? [{ name: "health", path: "/api/ops/health", kind: "health" }] : []),
  ];
  await write({
    event: "start",
    startedAt,
    deadlineAt: new Date(Date.now() + end - started).toISOString(),
    requestedDurationMs: durationMs,
    intervalMs,
    timeoutMs,
    protectedHealth: health,
    recoveryEnabled: recover,
  });
  do {
    if (signal.aborted || performance.now() >= end) break;
    const cycleAt = performance.now();
    if (lastCycle !== null) maxGapMs = Math.max(maxGapMs, Math.round(cycleAt - lastCycle));
    lastCycle = cycleAt;
    let outage = false;
    for (const item of probes) {
      const remaining = Math.floor(end - performance.now());
      if (signal.aborted || remaining <= 0) break;
      const result = await probe({
        origin,
        ...item,
        token: item.kind === "health" ? token : undefined,
        timeoutMs: Math.min(timeoutMs, remaining),
        signal,
        fetchImpl,
      });
      if (result.outcome === "timeout" && performance.now() >= end) result.outcome = "aborted";
      counts[item.name] ??= { observed: 0, ok: 0, failed: 0, aborted: 0 };
      counts[item.name].observed++;
      counts[item.name][
        result.outcome === "ok" ? "ok" : result.outcome === "aborted" ? "aborted" : "failed"
      ]++;
      await write({ event: "check", check: item.name, ...result });
      // An observation ending is not evidence of a service outage. Request timeouts
      // within the observation still alert; global deadline/operator aborts do not.
      if (result.outcome === "aborted" && (signal.aborted || performance.now() >= end)) continue;
      const state = result.outcome === "ok" ? "ok" : "outage";
      outage ||= state === "outage";
      if (states.get(item.name) !== state) {
        await write({
          event: "alert",
          check: item.name,
          previous: states.get(item.name) ?? "unknown",
          state,
        });
        states.set(item.name, state);
      }
      if (
        recover &&
        item.kind === "health" &&
        ["ok", "degraded"].includes(result.outcome) &&
        !signal.aborted &&
        performance.now() < end
      ) {
        const recovery = await probe({
          origin,
          path: "/api/ops/notifications",
          kind: "recovery",
          token,
          timeoutMs: Math.max(1, Math.min(timeoutMs, Math.floor(end - performance.now()))),
          signal,
          fetchImpl,
        });
        await write({ event: "recovery", ...recovery });
        counts.recovery ??= { observed: 0, ok: 0, failed: 0, aborted: 0 };
        counts.recovery.observed++;
        counts.recovery[
          recovery.outcome === "ok" ? "ok" : recovery.outcome === "aborted" ? "aborted" : "failed"
        ]++;
        if (recovery.outcome !== "aborted") {
          const recoveryState = recovery.outcome === "ok" ? "ok" : "outage";
          outage ||= recoveryState === "outage";
          if (states.get("recovery") !== recoveryState) {
            await write({
              event: "alert",
              check: "recovery",
              previous: states.get("recovery") ?? "unknown",
              state: recoveryState,
            });
            states.set("recovery", recoveryState);
          }
        }
      }
    }
    cycles++;
    failures = outage ? failures + 1 : 0;
    if (!durationMs || signal.aborted) break;
    const waitMs = Math.min(
      intervalMs * 2 ** Math.min(failures, 3),
      60 * 60_000,
      end - performance.now()
    );
    if (waitMs > 0) await sleep(waitMs, undefined, { signal }).catch(() => {});
  } while (performance.now() < end && !signal.aborted);
  const elapsedMs = Math.round(performance.now() - started);
  const summary = {
    event: "summary",
    startedAt,
    elapsedMs,
    requestedDurationMs: durationMs,
    cycles,
    counts,
    maxSampleGapMs: maxGapMs,
    tailGapMs: lastCycle === null ? elapsedMs : Math.round(performance.now() - lastCycle),
    discardedEvidenceEvents: discarded,
    stopped: signal.aborted ? "aborted" : durationMs ? "deadline" : "one-shot",
    coverage:
      "Point observations only; intervals, backoff and process downtime are unobserved. No availability or inbox-delivery guarantee.",
  };
  await write(summary);
  return summary;
}

// Optional same-user macOS notifications; never sends email or third-party messages.
export async function notifyLocal(event, runner = execFile) {
  if (event.event !== "alert" || (event.state === "ok" && event.previous !== "outage")) return;
  if (
    !["site", "chat", "health", "recovery"].includes(event.check) ||
    !["ok", "outage"].includes(event.state)
  )
    return;
  const message = `DMF ${event.check}: ${event.state === "ok" ? "recovered" : "needs attention"}. See local monitoring evidence.`;
  const script =
    'on run argv\n display notification (item 1 of argv) with title "DMF stability"\nend run';
  await new Promise((resolve, reject) =>
    runner("/usr/bin/osascript", ["-e", script, message], { timeout: 5000 }, (error) =>
      error ? reject(new Error("Local notification unavailable")) : resolve()
    )
  );
}

export async function main(args = process.argv.slice(2)) {
  const values = {};
  const flags = new Set(["--allow-local", "--health", "--recover-notifications", "--notify-local"]);
  const valued = new Set([
    "--origin",
    "--observe-hours",
    "--interval-minutes",
    "--timeout-seconds",
    "--evidence",
  ]);
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    if ((!flags.has(key) && !valued.has(key)) || key in values)
      throw new Error("Unknown or repeated option");
    if (flags.has(key)) values[key] = true;
    else {
      if (!args[i + 1] || args[i + 1].startsWith("--")) throw new Error("Missing option value");
      values[key] = args[++i];
    }
  }
  const durationMs = Number(values["--observe-hours"] ?? 0) * HOUR;
  const intervalMs = Number(values["--interval-minutes"] ?? 10) * 60_000;
  const timeoutMs = Number(values["--timeout-seconds"] ?? 10) * 1000;
  if (
    !Number.isFinite(durationMs) ||
    durationMs < 0 ||
    durationMs > 72 * HOUR ||
    !Number.isFinite(intervalMs) ||
    intervalMs < 300_000 ||
    intervalMs > 900_000 ||
    !Number.isFinite(timeoutMs) ||
    timeoutMs < 100 ||
    timeoutMs > 60_000
  )
    throw new Error("Observe 0–72 hours, interval 5–15 minutes, timeout 0.1–60 seconds");
  const origin = safeOrigin(
    values["--origin"] ?? "https://www.dmf-talents.de",
    values["--allow-local"]
  );
  const health = Boolean(values["--health"]);
  const recover = Boolean(values["--recover-notifications"]);
  const token = health || recover ? process.env.DMF_OPS_TOKEN : undefined;
  if ((health || recover) && (!token || /[\r\n]/.test(token)))
    throw new Error("DMF_OPS_TOKEN required");
  if (recover && !health) throw new Error("Recovery requires --health");
  if (values["--notify-local"] && process.platform !== "darwin")
    throw new Error("Local notifications require macOS");
  const evidence = await evidenceWriter(values["--evidence"] ?? `dmf-monitor-${Date.now()}.jsonl`);
  const controller = new AbortController();
  const stop = () => controller.abort();
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
  try {
    const result = await runMonitor({
      origin,
      durationMs,
      intervalMs,
      timeoutMs,
      health,
      recover,
      token,
      signal: controller.signal,
      emit: async (event) => {
        const dropped = await evidence(event);
        process.stdout.write(JSON.stringify(event) + "\n");
        if (values["--notify-local"]) {
          try {
            await notifyLocal(event);
          } catch {
            await evidence({
              timestamp: new Date().toISOString(),
              event: "local_notification",
              outcome: "unavailable",
            });
          }
        }
        return dropped;
      },
    });
    if (Object.values(result.counts).some((count) => count.failed) || !result.cycles)
      process.exitCode = 1;
  } finally {
    process.removeListener("SIGINT", stop);
    process.removeListener("SIGTERM", stop);
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(() => {
    process.stderr.write(
      "Monitor failed: check options, token presence, or writable new evidence path. No sensitive details logged.\n"
    );
    process.exitCode = 1;
  });
}
