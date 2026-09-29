// Runs a production build against a local fixture backend. Never uses production credentials.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
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
  avatar_url: null,
  video_url: null,
  full_name: sentinel,
  email: sentinel,
  phone: sentinel,
  date_of_birth: sentinel,
  notes: sentinel,
  unexpected_secret: sentinel,
};
const fixture = createServer((request, response) => {
  const url = new URL(request.url, "http://localhost");
  response.setHeader("Content-Type", "application/json");
  if (url.pathname === "/rest/v1/candidates") {
    if (url.searchParams.get("is_featured") !== "eq.true") {
      response.writeHead(400);
      response.end(JSON.stringify({ message: "Publication filter required" }));
      return;
    }
    // Over-return fields deliberately: the application's DTO must strip them.
    response.end(JSON.stringify([candidate]));
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
  for (const path of ["/api/chat/history", "/api/leads"]) {
    const response = await fetch(`${base}${path}`);
    assert.equal(response.status, 401, `${path}: anonymous read must fail`);
    assert.ok(response.headers.get("cache-control").includes("no-store"));
    process.stdout.write(`PASS ${path}: anonymous request denied, no-store\n`);
  }
  const redirect = await fetch(`${base}/admin`, { redirect: "manual" });
  assert.equal(redirect.status, 307);
  assert.ok(redirect.headers.get("location").endsWith("/login"));
  process.stdout.write("PASS /admin: anonymous user redirected to login\n");
} finally {
  if (app && app.exitCode === null) {
    app.kill("SIGTERM");
    await once(app, "exit");
  }
  fixture.closeAllConnections();
  await new Promise((resolve) => fixture.close(resolve));
}
