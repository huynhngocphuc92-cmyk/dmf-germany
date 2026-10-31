// Runs a production build against a local fixture backend. Never uses production credentials.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { createHmac } from "node:crypto";
import { createServerClient } from "@supabase/ssr";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";

const p1Backend = process.argv.includes("--p1-backend");
const intakeOnly = process.argv.includes("--intake-only");
const webpackBuild = process.argv.includes("--webpack");
const sentinel = "DMF_PRIVATE_SENTINEL";
const candidate = {
  id: "12345678-1111-4111-8111-111111111111",
  category: "skilled",
  profession: "Elektriker",
  experience_years: 3,
  german_level: "B1",
  visa_status: true,
  is_featured: true,
  publication_status: "published",
  publication_valid_until: "2999-12-31",
  publication_consent_note: "Local fixture consent only",
  publication_reviewed_at: "2026-09-29T00:00:00Z",
  updated_at: "2026-09-29T00:00:00Z",
  created_at: "2026-09-01T00:00:00Z",
  avatar_url: null,
  video_url: null,
  full_name: sentinel,
  email: sentinel,
  phone: sentinel,
  date_of_birth: sentinel,
  notes: sentinel,
  unexpected_secret: sentinel,
};
const blogPost = {
  id: "23456789-1111-4111-8111-111111111111",
  slug: "fixture-current",
  title: "Fixture editorial article",
  status: "published",
  content: "<p>Fixture article body</p>",
  excerpt: "Fixture excerpt",
  created_at: "2026-09-01T00:00:00Z",
  updated_at: "2026-09-29T00:00:00Z",
  published_at: "2026-09-01T00:00:00Z",
};
let blogPublished = true;
let candidateMode = "allow";
let candidateGate = null;
let candidateQueries = 0;
const candidateRequests = [];
const heroFixture = "/streaming-hero-fixture.webp";
const receipts = new Map();
const inbox = new Map();
// Controllable backend faults exercise the real HTTP/API boundary, not a live database.
let rateMode = "allow";
let writeMode = "allow";
const heldWrites = [];
const historyRows = new Map();
const rpcCalls = new Map();
const fixtureAdmin = {
  id: "00000000-0000-4000-8000-000000000001",
  aud: "authenticated",
  role: "authenticated",
  email: "admin@example.invalid",
  app_metadata: { role: "admin" },
  user_metadata: {},
  created_at: "2026-09-01T00:00:00Z",
  is_anonymous: false,
};
const tokenPart = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
const tokenPayload = `${tokenPart({ alg: "HS256", typ: "JWT" })}.${tokenPart({ sub: fixtureAdmin.id, role: "authenticated", app_metadata: { role: "admin" }, exp: Math.floor(Date.now() / 1000) + 3600 })}`;
const fixtureToken = `${tokenPayload}.${createHmac("sha256", "local-fixture-only").update(tokenPayload).digest("base64url")}`;
const fixture = createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");
  response.setHeader("Content-Type", "application/json");
  if (url.pathname === "/auth/v1/token") {
    let raw = "";
    for await (const chunk of request) raw += chunk;
    const login = JSON.parse(raw);
    if (login.email !== "admin@example.invalid" || login.password !== "local-fixture-only") {
      response.writeHead(400);
      response.end(JSON.stringify({ message: "Invalid login credentials" }));
      return;
    }
    response.end(
      JSON.stringify({
        access_token: fixtureToken,
        refresh_token: "fixture-refresh",
        expires_in: 3600,
        token_type: "bearer",
        user: fixtureAdmin,
      })
    );
  } else if (
    url.pathname === "/auth/v1/user" &&
    request.headers.authorization === `Bearer ${fixtureToken}`
  ) {
    response.end(JSON.stringify(fixtureAdmin));
  } else if (url.pathname === "/rest/v1/rpc/dmf_request_assignees") {
    assert.equal(request.headers.authorization, `Bearer ${fixtureToken}`);
    response.end(JSON.stringify([{ id: fixtureAdmin.id, label: fixtureAdmin.email }]));
  } else if (
    url.pathname === "/rest/v1/dmf_request_inbox" ||
    ["/rest/v1/inquiries", "/rest/v1/leads"].includes(url.pathname)
  ) {
    if (request.headers.authorization !== `Bearer ${fixtureToken}`) {
      response.writeHead(403);
      response.end("[]");
      return;
    }
    let rows = [...inbox.values()].filter(
      (row) =>
        url.pathname.endsWith("dmf_request_inbox") ||
        row.source === (url.pathname.endsWith("leads") ? "lead" : "inquiry")
    );
    for (const [field, filter] of url.searchParams) {
      if (filter.startsWith("eq."))
        rows = rows.filter((row) => String(row[field]) === filter.slice(3));
      if (filter === "is.null") rows = rows.filter((row) => row[field] === null);
      if (filter.startsWith("neq.")) rows = rows.filter((row) => row[field] !== filter.slice(4));
      if (filter.startsWith("lt."))
        rows = rows.filter((row) => row[field] && row[field] < filter.slice(3));
      if (filter.startsWith("ilike."))
        rows = rows.filter((row) =>
          String(row[field])
            .toLowerCase()
            .includes(filter.slice(6).replaceAll("%", "").toLowerCase())
        );
    }
    if (request.method === "PATCH") {
      let raw = "";
      for await (const chunk of request) raw += chunk;
      const update = JSON.parse(raw);
      for (const row of rows)
        Object.assign(row, update, {
          workflow_version: row.workflow_version + 1,
          stage:
            update.status === "new"
              ? "new"
              : ["completed", "converted", "lost"].includes(update.status)
                ? "closed"
                : "active",
          updated_at: new Date().toISOString(),
        });
    }
    rows.sort((a, b) => b.created_at.localeCompare(a.created_at));
    response.setHeader("Content-Range", `0-${Math.max(0, rows.length - 1)}/${rows.length}`);
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    const single = request.headers.accept?.includes("vnd.pgrst.object");
    response.end(JSON.stringify(single ? (rows[0] ?? null) : rows));
  } else if (url.pathname.startsWith("/rest/v1/rpc/")) {
    assert.equal(
      request.headers.apikey,
      "fixture-service-key",
      "intake must use the server credential"
    );
    let raw = "";
    for await (const chunk of request) raw += chunk;
    const input = JSON.parse(raw);
    const rpcName = url.pathname.split("/").at(-1);
    rpcCalls.set(rpcName, (rpcCalls.get(rpcName) || 0) + 1);
    if (rpcName === "dmf_check_rate_limit" && rateMode === "network") {
      request.socket.destroy();
      return;
    }
    if (rpcName === "dmf_check_rate_limit" && rateMode === "hang") return;
    if (["dmf_receive_intake", "dmf_save_chat"].includes(rpcName)) {
      if (writeMode === "network") {
        request.socket.destroy();
        return;
      }
      if (writeMode === "error") {
        response.writeHead(503);
        response.end('{"message":"synthetic write unavailable"}');
        return;
      }
      if (writeMode === "hold") {
        heldWrites.push({ response, input });
        return;
      }
    }
    if (url.pathname.endsWith("/dmf_check_rate_limit")) {
      if (rateMode === "unavailable") {
        response.writeHead(503);
        response.end(JSON.stringify({ code: "08006", message: "fixture limiter unavailable" }));
      } else {
        response.end(JSON.stringify({ success: rateMode !== "deny", remaining: 0, resetIn: 25 }));
      }
    } else if (url.pathname.endsWith("/dmf_receive_intake")) {
      if (input.p_payload.email === "failure@example.invalid") {
        response.writeHead(503);
        response.end(
          JSON.stringify({ code: "TEST_FAILURE", message: "fixture persistence unavailable" })
        );
      } else {
        const duplicate = receipts.has(input.p_id);
        if (duplicate && JSON.stringify(receipts.get(input.p_id)) !== JSON.stringify(input)) {
          response.writeHead(409);
          response.end(JSON.stringify({ code: "23505", message: "synthetic conflicting key" }));
          return;
        }
        receipts.set(input.p_id, input);
        if (!duplicate) {
          const p = input.p_payload;
          const source = input.p_kind === "lead" ? "lead" : "inquiry";
          inbox.set(`${source}:${input.p_id}`, {
            reference: input.p_id,
            id: input.p_id,
            source,
            kind: p.requestPurpose || input.p_kind,
            contact_name: p.name || null,
            email: p.email,
            phone: p.phone || null,
            company: p.company || null,
            message: p.message || p.interest || null,
            status: "new",
            stage: "new",
            candidate_id: p.candidateId || null,
            candidate_code: p.candidateId?.slice(0, 8).toUpperCase() || null,
            service: p.service || null,
            headcount: p.headcount || null,
            work_location: p.location || null,
            start_window: p.timing || null,
            source_path: p.sourcePath || null,
            campaign: p.campaign || {},
            assigned_to: null,
            follow_up_on: null,
            next_action: null,
            notes: null,
            workflow_version: 0,
            created_at: new Date().toISOString(),
            updated_at: null,
            search_text: [p.company, p.name, p.email].filter(Boolean).join(" "),
          });
        }
        if (writeMode === "commit-network") {
          request.socket.destroy();
          return;
        }
        response.end(JSON.stringify({ duplicate }));
      }
    } else if (url.pathname.endsWith("/dmf_save_chat")) {
      const previous = historyRows.get(input.p_session_id);
      const allowed = !previous || previous.p_owner_token === input.p_owner_token;
      if (allowed) historyRows.set(input.p_session_id, input);
      response.end(JSON.stringify(allowed));
    } else {
      response.writeHead(404);
      response.end("{}");
    }
  } else if (url.pathname === "/rest/v1/candidates") {
    if (request.headers.authorization === `Bearer ${fixtureToken}`) {
      if (request.method === "PATCH") {
        let raw = "";
        for await (const chunk of request) raw += chunk;
        Object.assign(candidate, JSON.parse(raw), { updated_at: new Date().toISOString() });
      }
      response.end(
        JSON.stringify(
          request.headers.accept?.includes("vnd.pgrst.object") ? candidate : [candidate]
        )
      );
      return;
    }
    if (
      url.searchParams.get("publication_status") !== "eq.published" ||
      !url.searchParams.get("publication_valid_until")?.startsWith("gte.")
    ) {
      response.writeHead(400);
      response.end(JSON.stringify({ message: "Publication filter required" }));
      return;
    }
    candidateQueries++;
    candidateRequests.push(url);
    if (candidateGate) await candidateGate;
    if (candidateMode === "fail") {
      response.writeHead(503);
      response.end(JSON.stringify({ message: "synthetic candidate query failure" }));
      return;
    }
    const cutoff = url.searchParams.get("publication_valid_until").slice(4);
    const visible =
      candidate.publication_status === "published" &&
      candidate.publication_valid_until != null &&
      candidate.publication_valid_until >= cutoff &&
      (url.searchParams.get("is_featured") !== "eq.true" || candidate.is_featured);
    // Over-return fields deliberately: the application's DTO must strip them.
    response.end(JSON.stringify(visible ? [candidate] : []));
  } else if (url.pathname === "/rest/v1/site_assets") {
    response.end(
      JSON.stringify([{ key: "home_hero_bg", value: heroFixture, asset_type: "IMAGE" }])
    );
  } else if (url.pathname === "/rest/v1/posts") {
    const rows =
      blogPublished &&
      (!url.searchParams.has("slug") || url.searchParams.get("slug") === "eq.fixture-current")
        ? [blogPost]
        : [];
    if (request.headers.accept?.includes("vnd.pgrst.object")) {
      if (!rows.length) {
        response.writeHead(406);
        response.end(JSON.stringify({ code: "PGRST116", message: "No rows" }));
      } else response.end(JSON.stringify(rows[0]));
    } else response.end(JSON.stringify(rows));
  } else if (url.pathname === "/rest/v1/post_slug_redirects") {
    response.end(
      JSON.stringify(
        blogPublished && url.searchParams.get("slug") === "eq.fixture-old"
          ? [{ post_id: blogPost.id }]
          : []
      )
    );
  } else {
    response.end("[]");
  }
});
fixture.listen(0, "127.0.0.1");
await once(fixture, "listening");
const fixturePort = fixture.address().port;
const appPort = Number(process.env.SMOKE_PORT || 4198);
const env = {
  ...process.env,
  NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${fixturePort}`,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "fixture-anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "fixture-service-key",
  NEXT_TELEMETRY_DISABLED: "1",
  VERCEL_ENV: "preview",
  INTAKE_TEST_BACKEND: "true",
  NOTIFICATION_DELIVERY: "disabled",
  XAI_API_KEY: "",
  GEMINI_API_KEY: "",
  GOOGLE_GENERATIVE_AI_API_KEY: "",
  SUPABASE_SECRET_KEY: "",
  SMTP_HOST: "",
  SMTP_PORT: "",
  OPENAI_API_KEY: "",
  ANTHROPIC_API_KEY: "",
  SMTP_USER: "",
  SMTP_PASSWORD: "",
  CONTACT_EMAIL: "",
  TELEGRAM_BOT_TOKEN: "",
  TELEGRAM_CHAT_ID: "",
  NEXT_PUBLIC_GA_ID: "",
  SENTRY_DSN: "",
  SENTRY_AUTH_TOKEN: "",
};
let app;
try {
  if (!intakeOnly) {
    const build = spawn(
      process.execPath,
      ["node_modules/next/dist/bin/next", "build", ...(webpackBuild ? ["--webpack"] : [])],
      {
        env,
        stdio: "inherit",
      }
    );
    const [code] = await once(build, "exit");
    assert.equal(code, 0, "production build failed");
  }
  app = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      intakeOnly ? "dev" : "start",
      ...(intakeOnly ? ["--webpack"] : []),
      "--hostname",
      "127.0.0.1",
      "--port",
      String(appPort),
    ],
    { env, stdio: "inherit" }
  );
  const base = `http://127.0.0.1:${appPort}`;
  for (let attempt = 0; attempt < 50; attempt++) {
    if (
      await fetch(base).then(
        async (response) => {
          // Drain the warmup stream before installing the candidate gate.
          await response.text();
          return true;
        },
        () => false
      )
    )
      break;
    await delay(200);
  }
  if (!intakeOnly && !p1Backend) {
    const browserHeaders = {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
    };
    // Strip complete AND partially received scripts: Flight strings must never
    // satisfy an assertion about actual server-rendered elements.
    const markup = (html) =>
      html.replace(/<script\b[^>]*>[\s\S]*?(?:<\/script>|$)/gi, "").replace(/<!--[\s\S]*?-->/g, "");
    const waitFor = async (predicate, label) => {
      const deadline = Date.now() + 15000;
      while (!predicate()) {
        assert.ok(Date.now() < deadline, label);
        await delay(20);
      }
    };
    const originalCandidate = { ...candidate };
    const code = "87654321";
    const freshProfession = "Fresh streaming fixture profession";
    Object.assign(candidate, {
      id: `${code}-1111-4111-8111-111111111111`,
      profession: freshProfession,
    });
    const assertBothRegions = (html) => {
      const ssr = markup(html);
      assert.match(ssr, new RegExp(`<h3[^>]*>DMF-${code}</h3>`), "desktop SSR profile");
      const lower = ssr.match(/<section\b[^>]*id="talent-showcase"[\s\S]*?<\/section>/)?.[0] ?? "";
      assert.match(lower, new RegExp(`#${code}</p>`), "lower SSR profile");
      assert.ok(lower.includes(freshProfession), "lower SSR fresh profession");
      assert.equal(
        ssr.split(freshProfession).length - 1,
        2,
        "same fresh profile in both SSR regions"
      );
      assert.ok(!html.includes(sentinel), "streamed HTML/Flight leaked private fields");
      assert.ok(!html.includes(originalCandidate.id), "previous profile reused");
    };
    let releaseCandidates;
    candidateGate = new Promise((resolve) => {
      releaseCandidates = resolve;
    });
    const before = candidateQueries;
    let streamed = "";
    let finished = false;
    // Start reading immediately; a buffered response must fail while the gate is held.
    const reading = (async () => {
      const response = await fetch(base, {
        headers: browserHeaders,
        signal: AbortSignal.timeout(20000),
      });
      assert.equal(response.status, 200);
      const decoder = new TextDecoder();
      for await (const chunk of response.body) streamed += decoder.decode(chunk, { stream: true });
      streamed += decoder.decode();
      finished = true;
    })().then(
      () => null,
      (error) => error
    );
    try {
      await waitFor(() => candidateQueries > before, "candidate query never reached held backend");
      await waitFor(() => {
        const hero =
          markup(streamed).match(/<section\b[^>]*id="home"[\s\S]*?<\/section>/)?.[0] ?? "";
        return (
          /<h1\b[^>]*>[^<]+<\/h1>/.test(hero) &&
          /<a\b[^>]*href="#contact"/.test(hero) &&
          /<img\b[^>]*>/.test(hero) &&
          hero.includes("streaming-hero-fixture")
        );
      }, "actual SSR hero image/heading/CTA did not stream before candidate release");
      assert.equal(finished, false, "response finished while candidate response held");
      assert.ok(
        !streamed.includes(code) && !streamed.includes(freshProfession),
        "profile arrived before release"
      );
      assert.equal(candidateQueries - before, 1, "both regions must share one query");
    } finally {
      candidateGate = null;
      releaseCandidates();
    }
    const readError = await reading;
    if (readError) throw readError;
    assertBothRegions(streamed);
    assert.equal(candidateQueries - before, 1);
    const query = candidateRequests.at(-1).searchParams;
    assert.equal(query.get("is_featured"), "eq.true");
    assert.equal(query.get("limit"), "20");
    assert.equal(query.get("publication_status"), "eq.published");
    assert.equal(
      query.get("publication_valid_until"),
      `gte.${new Date().toISOString().slice(0, 10)}`
    );

    const requestHome = async () => {
      const count = candidateQueries;
      const response = await fetch(base, {
        headers: browserHeaders,
        signal: AbortSignal.timeout(20000),
      });
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.equal(
        candidateQueries - count,
        1,
        "every request must issue one fresh candidate query"
      );
      assert.ok(!html.includes(sentinel), "private fields leaked");
      return html;
    };
    for (const [label, change] of [
      ["withdrawn", { publication_status: "draft" }],
      ["expired", { publication_status: "published", publication_valid_until: "2000-01-01" }],
      ["nonfeatured", { publication_valid_until: "2999-12-31", is_featured: false }],
      ["null expiry", { is_featured: true, publication_valid_until: null }],
    ]) {
      Object.assign(candidate, change);
      const html = await requestHome();
      assert.ok(
        !html.includes(code) && !html.includes(freshProfession),
        `${label}: stale profile in HTML/Flight`
      );
    }
    // An inclusive UTC date must still publish, then an outage must not reuse it.
    candidate.publication_valid_until = new Date().toISOString().slice(0, 10);
    assertBothRegions(await requestHome());
    candidateMode = "fail";
    const failed = await requestHome();
    assert.ok(
      !failed.includes(code) && !failed.includes(freshProfession),
      "failure reused previous success"
    );
    assert.equal(
      markup(failed).split("Fehler beim Laden der Kandidaten").length - 1,
      2,
      "both regions show unavailable state"
    );
    candidateMode = "allow";
    Object.assign(candidate, originalCandidate);
    process.stdout.write(
      "PASS homepage streaming: SSR hero before candidate release, one shared query, fresh withdrawal/expiry/featured/error states\n"
    );
  }
  if (!intakeOnly && !p1Backend) {
    for (const path of ["/", "/fuer-arbeitgeber/kandidaten"]) {
      const response = await fetch(`${base}${path}`);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.ok(html.includes(candidate.profession), `${path}: fixture was not rendered`);
      assert.ok(!html.includes(sentinel), `${path}: private data leaked in HTML/RSC`);
      assert.ok(!html.includes("example@example.com"), `${path}: mock profile fallback rendered`);
      process.stdout.write(
        `PASS ${path}: published fixture rendered; HTML/RSC has no private fields\n`
      );
    }

    const publicPaths = [
      "/",
      "/services/azubi",
      "/services/skilled-workers",
      "/services/seasonal",
      "/ueber-uns/ausbildung",
      "/ueber-uns/studium",
      "/ueber-uns/skilled-workers",
      "/fuer-arbeitgeber/kandidaten",
      "/fuer-arbeitgeber/personalbedarf",
      "/fuer-arbeitgeber/roi-rechner",
      "/fuer-arbeitgeber/zeitplan",
      "/roi-rechner",
      "/referenzen",
      "/blog",
      "/impressum",
      "/datenschutz",
      "/blog/fixture-current",
    ];
    for (const path of publicPaths) {
      const response = await fetch(`${base}${path}`, { headers: { "User-Agent": "Googlebot" } });
      assert.equal(response.status, 200, path);
      const html = await response.text();
      const canonical = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map(
        (m) => new URL(m[1]).href
      );
      assert.deepEqual(canonical, [`https://www.dmf-talents.de${path}`], `${path}: canonical`);
      const title = html.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
      assert.equal(
        (title.match(/DMF Talents/g) ?? []).length,
        1,
        `${path}: duplicated/missing brand: ${title}`
      );
      assert.equal(
        new URL(html.match(/property="og:url" content="([^"]+)"/)?.[1]).href,
        `https://www.dmf-talents.de${path}`,
        `${path}: OG URL`
      );
      // Restoring owner-authored layout/copy supersedes M2 editorial exclusions.
      // Privacy boundaries and the ban on fictional candidate/video fallbacks remain.
      for (const sample of ["dQw4w9WgXcQ", "DMF-2401"])
        assert.ok(!html.includes(sample), `${path}: unverified content ${sample}`);
      if (path === "/blog/fixture-current") {
        const schemas = [
          ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
        ].flatMap((match) => JSON.parse(match[1]));
        const article = schemas.find((schema) => schema["@type"] === "BlogPosting");
        assert.equal(article?.headline, blogPost.title, "server-rendered article schema");
        assert.equal(article?.url, canonical[0]);
        assert.equal(article?.datePublished, "2026-09-01T00:00:00.000Z");
        assert.ok(!article?.image, "no invented cover image in article schema");
        const breadcrumbs = schemas.find((schema) => schema["@type"] === "BreadcrumbList");
        assert.equal(breadcrumbs?.itemListElement.at(-1)?.item, canonical[0]);
        assert.ok(html.includes('<time dateTime="2026-09-01T00:00:00Z"'), "semantic visible date");
        assert.ok(
          html.includes('name="twitter:image" content="https://www.dmf-talents.de/opengraph-image"')
        );
      }
    }
    const robotText = await (await fetch(`${base}/robots.txt`)).text();
    assert.ok(robotText.includes("https://www.dmf-talents.de/sitemap.xml"));
    assert.ok(!robotText.includes("/_next/"));
    const loginHtml = await (await fetch(`${base}/login`)).text();
    assert.ok(loginHtml.includes('name="robots" content="noindex, nofollow"'));
    const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
    assert.ok(sitemap.includes("https://www.dmf-talents.de/fuer-arbeitgeber/kandidaten"));
    assert.ok(
      sitemap.includes("/blog/fixture-current") &&
        !sitemap.includes("/admin") &&
        !sitemap.includes("/login")
    );
    const oldPost = await fetch(`${base}/blog/fixture-old`, { redirect: "manual" });
    assert.equal(oldPost.status, 308);
    assert.ok(oldPost.headers.get("location").endsWith("/blog/fixture-current"));
    blogPublished = false;
    assert.equal((await fetch(`${base}/blog/fixture-old`, { redirect: "manual" })).status, 404);
    assert.equal((await fetch(`${base}/blog/fixture-current`)).status, 404);
    assert.ok(
      !(await (await fetch(`${base}/sitemap.xml`)).text()).includes("/blog/fixture-current")
    );
    process.stdout.write(
      "PASS M2/M3: 17 canonical/OG/title pages, no sample profiles/videos, robots/login, sitemap, 308 alias and unpublished 404s\n"
    );
  }
  for (const path of ["/api/chat/history", "/api/leads"]) {
    const response = await fetch(`${base}${path}`);
    assert.equal(response.status, 401, `${path}: anonymous read must fail`);
    assert.ok(response.headers.get("cache-control").includes("no-store"));
    process.stdout.write(`PASS ${path}: anonymous request denied, no-store\n`);
  }
  const contact = {
    name: "Fixture Company",
    email: "fixture@example.invalid",
    message: "Synthetic smoke test request",
    privacy: true,
  };
  const post = (path, body, key = crypto.randomUUID()) =>
    fetch(`${base}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": key },
      body: JSON.stringify(body),
    });
  // Public chat is a built-in scripted FAQ, independent of provider readiness.
  const chatHealth = await fetch(`${base}/api/chat`);
  assert.equal(chatHealth.headers.get("cache-control"), "no-store");
  assert.equal(chatHealth.status, 200);
  const health = await chatHealth.json();
  assert.equal(health.mode, "guided");
  assert.equal(health.status, "ready");
  assert.equal(health.aiEnabled, false);
  assert.ok(!("providers" in health));
  for (const [language, message, expected] of [
    ["de", "Ausbildung Kosten", "**Kosten:**"],
    ["en", "nursing visa", "**Visa and recognition:**"],
    ["vn", "giay to lao dong thoi vu", "**Hồ sơ:**"],
    ["en", "xyzzy", "I have no prepared answer"],
  ]) {
    const response = await post("/api/chat", {
      language,
      message,
      mode: "ai",
      bypassRateLimit: true,
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    const body = await response.json();
    assert.deepEqual(body.usage, { inputTokens: 0, outputTokens: 0 });
    assert.equal(body.mode, "guided");
    assert.equal(body.provider, "guided_engine");
    assert.ok(body.message.startsWith(expected));
    assert.ok(body.message.includes("mailto:contact@dmf.edu.vn"));
    assert.ok(body.requestId && Number.isFinite(body.durationMs));
  }
  assert.equal((await post("/api/chat", { message: "" })).status, 400);
  assert.equal((await fetch(`${base}/api/chat?diagnostics=1`)).status, 401);
  process.stdout.write(
    "PASS public chat: guided FAQ, mixed intents, vn alias, unknown handoff, guarded diagnostics\n"
  );
  const key = crypto.randomUUID();
  assert.equal((await post("/api/contact", contact, key)).status, 200);
  const duplicate = await post("/api/contact", contact, key);
  assert.equal((await duplicate.json()).duplicate, true);
  assert.equal(receipts.size, 1, "retry duplicated a receipt");
  const failure = await post("/api/contact", { ...contact, email: "failure@example.invalid" });
  assert.equal(failure.status, 503);
  assert.equal((await failure.json()).success, false);
  assert.equal((await post("/api/contact", { ...contact, privacy: false })).status, 400);
  assert.equal((await post("/api/inquiry", { ...contact, candidateId: candidate.id })).status, 200);
  const leadKey = crypto.randomUUID();
  const lead = {
    email: "chat-lead@example.invalid",
    company: "Fixture Chat Lead",
    interest: "Synthetic guided chat callback request",
    sessionId: "fixture-smoke-chat",
  };
  const leadReceipt = await post("/api/leads", lead, leadKey);
  assert.equal(leadReceipt.status, 200);
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(await leadReceipt.json()).filter(([field]) =>
        ["success", "saved", "accepted", "requestId"].includes(field)
      )
    ),
    { success: true, saved: true, accepted: true, requestId: leadKey }
  );
  assert.equal((await (await post("/api/leads", lead, leadKey)).json()).duplicate, true);
  assert.equal(receipts.size, 3);
  const chat = await post("/api/chat/history", { sessionId: "fixture-smoke-chat", messages: [] });
  assert.equal(chat.status, 200);
  assert.ok(chat.headers.get("set-cookie").includes("HttpOnly"));
  assert.equal((await post("/api/telegram", { message: "must never dispatch" })).status, 410);
  process.stdout.write(
    "PASS intake: persisted contact/profile/lead, duplicate safe, database failure rejected, owned chat cookie; legacy sender disabled\n"
  );
  const hiring = {
    ...contact,
    company: "Fixture Hiring Works",
    service: "azubi",
    headcount: 3,
    location: "Hamburg",
    timing: "2027",
    sourcePath: "/services/azubi",
    campaign: { source: "fixture" },
  };
  const hiringKey = crypto.randomUUID();
  assert.equal((await post("/api/hiring", hiring, hiringKey)).status, 200);
  assert.equal((await (await post("/api/hiring", hiring, hiringKey)).json()).duplicate, true);
  assert.equal((await post("/api/hiring", { ...hiring, privacy: false })).status, 400);
  const profileKey = crypto.randomUUID();
  assert.equal(
    (await post("/api/hiring", { ...hiring, candidateId: candidate.id }, profileKey)).status,
    200
  );
  assert.equal(receipts.get(profileKey).p_kind, "profile");
  assert.equal(receipts.get(profileKey).p_payload.candidateId, candidate.id);
  assert.equal(inbox.get(`inquiry:${hiringKey}`).headcount, 3);
  assert.equal(receipts.size, 5);
  // These responses are what the forms use to decide whether to show a saved state.
  // Faults must never produce a saved receipt or an admin row.
  for (const [path, payload, invalid] of [
    ["/api/contact", contact, { ...contact, privacy: false }],
    ["/api/hiring", hiring, { ...hiring, privacy: false }],
    ["/api/leads", lead, { ...lead, email: "not-an-email" }],
  ]) {
    const before = receipts.size;
    const beforeInbox = inbox.size;
    for (const [input, expected, mode] of [
      [invalid, 400, "allow"],
      [{ ...payload, email: "failure@example.invalid" }, 503, "allow"],
      [payload, 429, "deny"],
      [payload, 503, "unavailable"],
    ]) {
      rateMode = mode;
      const rejected = await post(path, input);
      assert.equal(rejected.status, expected, `${path}: ${mode}`);
      assert.equal(rejected.headers.get("cache-control"), "no-store");
      if (expected === 429) assert.equal(rejected.headers.get("retry-after"), "25");
      const rejection = await rejected.json();
      assert.equal(rejection.success, false);
      assert.notEqual(rejection.saved, true);
      assert.notEqual(rejection.accepted, true);
      assert.equal(receipts.size, before, `${path}: failure persisted a receipt`);
      assert.equal(inbox.size, beforeInbox, `${path}: failure appeared in admin inbox`);
    }
    rateMode = "allow";
  }
  if (!p1Backend) {
    const authCookies = [];
    const authClient = createServerClient(`http://127.0.0.1:${fixturePort}`, "fixture-anon-key", {
      cookies: { getAll: () => authCookies, setAll: (values) => authCookies.push(...values) },
    });
    const signedIn = await authClient.auth.signInWithPassword({
      email: fixtureAdmin.email,
      password: "local-fixture-only",
    });
    assert.equal(signedIn.error, null);
    const headers = { Cookie: authCookies.map((c) => `${c.name}=${c.value}`).join("; ") };
    // Each public path must produce an authenticated admin receipt with the same reference.
    for (const [source, reference, expected] of [
      ["inquiry", key, contact.email],
      ["inquiry", hiringKey, hiring.company],
      ["lead", leadKey, lead.email],
    ]) {
      const receipt = await fetch(`${base}/admin/requests/${source}/${reference}`, { headers });
      assert.equal(receipt.status, 200);
      const receiptHtml = await receipt.text();
      assert.ok(
        receiptHtml.includes(expected),
        `${source}: submitted data missing in admin receipt`
      );
      assert.ok(receiptHtml.includes(reference), `${source}: receipt reference missing`);
    }
    process.stdout.write(
      "PASS fixture intake HTTP -> persistence -> authenticated admin: contact/hiring/chat lead; retries, validation, limiter denial/outage and database failure never claim saved\n"
    );
    const adminInbox = await fetch(`${base}/admin/requests?kind=hiring`, { headers });
    assert.equal(adminInbox.status, 200);
    assert.ok((await adminInbox.text()).includes("Fixture Hiring Works"));
    const detail = await fetch(`${base}/admin/requests/inquiry/${hiringKey}`, { headers });
    assert.equal(detail.status, 200);
    const detailHtml = await detail.text();
    for (const value of ["Hamburg", "2027", "Bearbeitung speichern", "admin@example.invalid"])
      assert.ok(detailHtml.includes(value), value);
    const legacyLeads = await fetch(`${base}/admin/leads`, { headers, redirect: "manual" });
    // Admin has a loading boundary; a navigation redirect may use the framework stream.
    assert.ok([200, 307].includes(legacyLeads.status));
    process.stdout.write(
      "PASS M3: employer and profile hiring intake, consent validation, retry, source/campaign, signed-in unified inbox and request detail\n"
    );
    const redirect = await fetch(`${base}/admin`, { redirect: "manual" });
    assert.equal(redirect.status, 307);
    assert.ok(redirect.headers.get("location").endsWith("/login"));
    process.stdout.write("PASS /admin: anonymous user redirected to login\n");
  }
  // The default CI smoke also gates the backend failure/timeout regressions.
  const { verifyP1Http } = await import("./p1-backend-http.mjs");
  await verifyP1Http({
    base,
    post,
    receipts,
    historyRows,
    rpcCalls,
    setRate: (mode) => {
      rateMode = mode;
    },
    setWrite: (mode) => {
      writeMode = mode;
    },
    heldWrites,
  });
  if (process.env.SMOKE_KEEP_SERVER === "1") {
    process.stdout.write(
      `LOCAL BROWSER FIXTURE READY ${base} (synthetic admin: admin@example.invalid / local-fixture-only)\n`
    );
    await new Promise((resolve) => {
      process.once("SIGTERM", resolve);
      process.once("SIGINT", resolve);
    });
  }
} finally {
  if (app && app.exitCode === null) {
    app.kill("SIGTERM");
    await once(app, "exit");
  }
  fixture.closeAllConnections();
  await new Promise((resolve) => fixture.close(resolve));
}
