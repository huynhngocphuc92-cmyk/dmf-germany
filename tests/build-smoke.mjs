// Runs a production build against a local fixture backend. Never uses production credentials.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { createHmac } from "node:crypto";
import { createServerClient } from "@supabase/ssr";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";

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
const receipts = new Map();
const inbox = new Map();
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
    if (url.pathname.endsWith("/dmf_check_rate_limit")) {
      response.end(JSON.stringify({ success: true, remaining: 4, resetIn: 60 }));
    } else if (url.pathname.endsWith("/dmf_receive_intake")) {
      if (input.p_payload.email === "failure@example.invalid") {
        response.writeHead(503);
        response.end(
          JSON.stringify({ code: "TEST_FAILURE", message: "fixture persistence unavailable" })
        );
      } else {
        const duplicate = receipts.has(input.p_id);
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
        response.end(JSON.stringify({ duplicate }));
      }
    } else if (url.pathname.endsWith("/dmf_save_chat")) response.end("true");
    else {
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
    // Over-return fields deliberately: the application's DTO must strip them.
    response.end(JSON.stringify(candidate.publication_status === "published" ? [candidate] : []));
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
  SUPABASE_SECRET_KEY: "",
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
  const build = spawn(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
    env,
    stdio: "inherit",
  });
  const [code] = await once(build, "exit");
  assert.equal(code, 0, "production build failed");
  app = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
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
        () => true,
        () => false
      )
    )
      break;
    await delay(200);
  }
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
  assert.ok(!(await (await fetch(`${base}/sitemap.xml`)).text()).includes("/blog/fixture-current"));
  process.stdout.write(
    "PASS M2/M3: 17 canonical/OG/title pages, no sample profiles/videos, robots/login, sitemap, 308 alias and unpublished 404s\n"
  );
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
  assert.equal(
    (await post("/api/leads", { email: contact.email, company: "Fixture Company" })).status,
    200
  );
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
