import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";

// Exercises real Next HTTP routes against the protocol fixture in build-smoke.
// This fixture does not establish PostgreSQL/RLS behavior; separate SQL tests do.
export async function verifyP1Http(ctx) {
  const { base, post, receipts, historyRows, rpcCalls, setRate, setWrite, heldWrites } = ctx;
  const cases = [];
  async function check(id, fn) {
    const start = Date.now();
    try {
      await fn();
      cases.push({ id, status: "pass", durationMs: Date.now() - start });
    } catch (error) {
      cases.push({ id, status: "fail", durationMs: Date.now() - start, evidence: error.message });
    }
    console.log("P1_CASE " + JSON.stringify(cases.at(-1)));
  }
  async function rejected(response, status) {
    assert.equal(response.status, status);
    const body = await response.json();
    assert.notEqual(body.saved, true);
    assert.notEqual(body.success, true);
    assert.notEqual(body.accepted, true);
    return body;
  }
  for (const [mode, status] of [
    ["deny", 429],
    ["unavailable", 503],
    ["network", 503],
    ["hang", 503],
  ]) {
    await check("chat-" + mode, async () => {
      setRate(mode);
      const started = Date.now();
      const response = await post("/api/chat", { message: "Kosten", bypassRateLimit: true });
      if (mode === "deny") assert.equal(response.headers.get("retry-after"), "25");
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.equal((await rejected(response, status)).message, undefined);
      if (mode === "hang")
        assert.ok(Date.now() - started < 5000, "limiter did not respect its 3s deadline");
      setRate("allow");
    });
    setRate("allow");
  }
  const message = (content) => ({
    id: "p1-message",
    role: "user",
    content,
    timestamp: "2026-10-30T00:00:00Z",
  });
  const payload = { sessionId: "p1-owned-history", messages: [message("synthetic first")] };
  let cookie;
  await check("history-create-cookie", async () => {
    const response = await post("/api/chat/history", payload);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true, saved: true });
    const header = response.headers.get("set-cookie");
    for (const flag of [
      "HttpOnly",
      "Secure",
      "SameSite=lax",
      "Path=/api/chat/history",
      "Max-Age=2592000",
    ])
      assert.ok(header.includes(flag), flag);
    cookie = header.split(";")[0];
  });
  const saveHistory = (body, owner = cookie) =>
    fetch(base + "/api/chat/history", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(owner ? { cookie: owner } : {}) },
      body: JSON.stringify(body),
    });
  for (const [label, owner] of [
    ["missing-or-browser-expired", ""],
    ["malformed", "dmf_chat_owner=expired"],
    ["wrong-owner", "dmf_chat_owner=" + "b".repeat(64)],
  ]) {
    await check("history-403-" + label, async () => {
      const before = structuredClone(historyRows.get(payload.sessionId));
      const response = await saveHistory(
        { ...payload, ownerToken: before.p_owner_token, messages: [message("forged")] },
        owner
      );
      await rejected(response, 403);
      assert.equal(response.headers.get("set-cookie"), null);
      assert.deepEqual(historyRows.get(payload.sessionId), before);
    });
  }
  await check("history-owned-ordered-snapshots", async () => {
    for (const content of ["second", "newest"]) {
      const response = await saveHistory({ ...payload, messages: [message(content)] });
      assert.equal(response.status, 200);
      assert.equal((await response.json()).saved, true);
    }
    assert.deepEqual(historyRows.get(payload.sessionId).p_messages, [message("newest")]);
  });
  for (const mode of ["error", "network"]) {
    for (const path of ["/api/leads", "/api/chat/history"]) {
      await check(path + "-write-" + mode, async () => {
        const before = receipts.size;
        const previous = structuredClone(historyRows.get(payload.sessionId));
        setWrite(mode);
        await rejected(
          path.endsWith("history")
            ? await saveHistory(payload)
            : await post(path, { email: "p1-failure@example.invalid" }),
          503
        );
        assert.equal(receipts.size, before);
        assert.deepEqual(historyRows.get(payload.sessionId), previous);
      });
      setWrite("allow");
    }
  }
  await check("lead-ambiguous-commit-exact-retry-and-conflict", async () => {
    const lead = { email: "p1-ambiguous@example.invalid", interest: "Synthetic callback" };
    const key = crypto.randomUUID();
    const before = receipts.size;
    setWrite("commit-network");
    await rejected(await post("/api/leads", lead, key), 503);
    assert.equal(receipts.size, before + 1, "fixture must retain ambiguous commit");
    setWrite("allow");
    const response = await post("/api/leads", lead, key);
    assert.equal(response.status, 200);
    assert.deepEqual(
      await response.json().then(({ success, saved, duplicate, requestId }) => ({
        success,
        saved,
        duplicate,
        requestId,
      })),
      { success: true, saved: true, duplicate: true, requestId: key }
    );
    await rejected(await post("/api/leads", { ...lead, interest: "Different intent" }, key), 409);
    assert.equal(receipts.size, before + 1);
  });
  setWrite("allow");
  await check("notifications-disabled-no-queue-access", async () => {
    assert.equal(
      [...rpcCalls.keys()].filter((name) => /notification|dispatch/.test(name)).length,
      0
    );
    for (const path of ["/api/ops/health", "/api/ops/notifications"]) {
      const response = await fetch(base + path, {
        method: path.endsWith("notifications") ? "POST" : "GET",
      });
      assert.equal(response.status, 401);
      assert.equal(response.headers.get("cache-control"), "no-store");
    }
  });
  // Observe beyond actual client deadlines (history 8s; lead 20s), then release
  // the synthetic backend. No hanging request or process is left behind.
  setWrite("hold");
  const writeStarted = Date.now();
  let historyDurationMs, leadDurationMs;
  let historySettled = false,
    leadSettled = false;
  const history = saveHistory(payload).then((response) => {
    historySettled = true;
    historyDurationMs = Date.now() - writeStarted;
    return response;
  });
  const leadKey = crypto.randomUUID();
  const leadBody = { email: "p1-timeout@example.invalid" };
  const lead = post("/api/leads", leadBody, leadKey).then((response) => {
    leadSettled = true;
    leadDurationMs = Date.now() - writeStarted;
    return response;
  });
  try {
    await delay(9000);
    assert.equal(heldWrites.length, 2, "both requests must reach the backend hold");
    await check("history-backend-deadline", async () => {
      assert.ok(
        historySettled,
        "HTTP history still pending after 9000ms, beyond client 8000ms deadline; write RPC has no server deadline"
      );
      assert.ok(historyDurationMs < 8000, `history response took ${historyDurationMs}ms`);
      console.log(
        "P1_WRITE_DEADLINE " + JSON.stringify({ route: "history", durationMs: historyDurationMs })
      );
    });
    await delay(12000);
    await check("lead-backend-deadline", async () => {
      assert.ok(
        leadSettled,
        "HTTP lead still pending after 21000ms, beyond client 20000ms deadline; write RPC has no server deadline"
      );
      assert.ok(leadDurationMs < 20000, `lead response took ${leadDurationMs}ms`);
      console.log(
        "P1_WRITE_DEADLINE " + JSON.stringify({ route: "lead", durationMs: leadDurationMs })
      );
    });
  } finally {
    setWrite("allow");
    for (const { response } of heldWrites.splice(0)) {
      response.writeHead(503);
      response.end('{"message":"synthetic hold released"}');
    }
    await rejected(await history, 503);
    await rejected(await lead, 503);
  }
  await check("lead-retry-after-backend-hold", async () => {
    const before = receipts.size;
    const first = await post("/api/leads", leadBody, leadKey);
    assert.equal(first.status, 200);
    assert.equal((await first.json()).duplicate, false);
    const retry = await post("/api/leads", leadBody, leadKey);
    assert.equal(retry.status, 200);
    assert.equal((await retry.json()).duplicate, true);
    assert.equal(receipts.size, before + 1);
  });
  console.log(
    "P1_HTTP_SUMMARY " +
      JSON.stringify({
        cases,
        pass: cases.filter((x) => x.status === "pass").length,
        fail: cases.filter((x) => x.status === "fail").length,
      })
  );
  if (cases.some((x) => x.status === "fail")) process.exitCode = 1;
}
