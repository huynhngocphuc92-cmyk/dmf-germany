#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * IndexNow Instant AI Search Indexing Dispatcher (Bing / ChatGPT Search / Copilot / Perplexity)
 *
 * Pushes all canonical URLs of https://www.dmf-talents.de (public routes, AI discovery
 * manifests, Markdown mirrors, and all 158 GEO/AEO blog articles) directly to:
 *   - https://api.indexnow.org/indexnow
 *   - https://www.bing.com/indexnow
 *
 * Usage:
 *   npm run geo:indexnow
 */

import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://www.dmf-talents.de";
const INDEXNOW_HOST = "www.dmf-talents.de";
const INDEXNOW_KEY = "d4f81a18ab16a296a59b3c0de2026da1";
const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

const PUBLIC_ROUTES = [
  "/",
  "/services/skilled-workers",
  "/services/azubi",
  "/services/seasonal",
  "/ueber-uns/ausbildung",
  "/ueber-uns/studium",
  "/ueber-uns/skilled-workers",
  "/fuer-arbeitgeber/branchen",
  "/fuer-arbeitgeber/branchen/pflege-gesundheit",
  "/fuer-arbeitgeber/branchen/gastronomie-hotellerie",
  "/fuer-arbeitgeber/branchen/handwerk-bau",
  "/fuer-arbeitgeber/branchen/industrie-metall-technik",
  "/fuer-arbeitgeber/branchen/logistik-lager",
  "/fuer-arbeitgeber/standorte",
  "/fuer-arbeitgeber/standorte/bayern",
  "/fuer-arbeitgeber/standorte/baden-wuerttemberg",
  "/fuer-arbeitgeber/standorte/nordrhein-westfalen",
  "/fuer-arbeitgeber/standorte/niedersachsen",
  "/fuer-arbeitgeber/standorte/hessen",
  "/fuer-arbeitgeber/standorte/berlin-brandenburg",
  "/fuer-arbeitgeber/standorte/sachsen-mitteldeutschland",
  "/fuer-arbeitgeber/standorte/hamburg-norddeutschland",
  "/fuer-arbeitgeber/kandidaten",
  "/fuer-arbeitgeber/personalbedarf",
  "/roi-rechner",
  "/fuer-arbeitgeber/roi-rechner",
  "/fuer-arbeitgeber/zeitplan",
  "/referenzen",
  "/blog",
  "/impressum",
  "/datenschutz",
];

const AI_DISCOVERY_PATHS = [
  "/llms.txt",
  "/llms-full.txt",
  "/openapi.json",
  "/api/mcp",
  "/.well-known/agent.json",
  "/.well-known/ai-plugin.json",
  "/index.md",
  "/referenzen.md",
  "/fuer-arbeitgeber/standorte.md",
  "/services/skilled-workers.md",
  "/services/azubi.md",
  "/services/seasonal.md",
  "/roi-rechner.md",
  "/fuer-arbeitgeber/zeitplan.md",
];

function extractBlogSlugs() {
  const catalogPath = path.join(process.cwd(), "lib/geo/blog-catalog.ts");
  const content = fs.readFileSync(catalogPath, "utf8");
  const slugs = [];
  const regex = /slug:\s*"([^"]+)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (match[1] !== "fixture-current") {
      slugs.push(match[1]);
    }
  }
  return slugs;
}

async function main() {
  const slugs = extractBlogSlugs();
  const urlSet = new Set();

  for (const r of PUBLIC_ROUTES) {
    urlSet.add(new URL(r, `${SITE_URL}/`).toString());
  }
  for (const p of AI_DISCOVERY_PATHS) {
    urlSet.add(new URL(p, `${SITE_URL}/`).toString());
  }
  for (const slug of slugs) {
    urlSet.add(`${SITE_URL}/blog/${encodeURIComponent(slug)}`);
  }

  const urlList = Array.from(urlSet);

  console.log("==================================================================");
  console.log("🚀 DMF TALENTS — INDEXNOW INSTANT AI SEARCH INDEXING DISPATCHER");
  console.log("==================================================================");
  console.log(`• Host:            ${INDEXNOW_HOST}`);
  console.log(`• Key Location:    ${INDEXNOW_KEY_LOCATION}`);
  console.log(
    `• Total URLs:      ${urlList.length} (${PUBLIC_ROUTES.length} core + ${AI_DISCOVERY_PATHS.length} AI/MD + ${slugs.length} blog posts)`
  );
  console.log("------------------------------------------------------------------");

  // 1. Check live key file availability
  try {
    const keyRes = await fetch(INDEXNOW_KEY_LOCATION);
    const keyBody = (await keyRes.text()).trim();
    const keyValid = keyRes.ok && keyBody === INDEXNOW_KEY;
    console.log(
      `${keyValid ? "✅" : "⏳"} Live Key File Check (${INDEXNOW_KEY_LOCATION}): HTTP ${keyRes.status} (${keyValid ? "Verified match" : "Pending deploy"})`
    );
  } catch (err) {
    console.log(`⏳ Live Key File Check: ${err.message}`);
  }

  // 2. Warm up Sitemap & llms.txt on Production
  for (const warmPath of ["/sitemap.xml", "/llms.txt", "/.well-known/agent.json"]) {
    try {
      const res = await fetch(`${SITE_URL}${warmPath}`);
      console.log(`✅ Warmed ${SITE_URL}${warmPath} → HTTP ${res.status}`);
    } catch (err) {
      console.log(`⚠️ Failed to warm ${warmPath}: ${err.message}`);
    }
  }

  // 3. Submit batch to IndexNow & Bing
  const endpoints = ["https://api.indexnow.org/indexnow", "https://www.bing.com/indexnow"];
  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList,
  };

  console.log("------------------------------------------------------------------");
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      });
      const accepted = res.status === 200 || res.status === 202;
      console.log(
        `${accepted ? "✅" : "⚠️"} POST ${endpoint.padEnd(36)} → HTTP ${res.status} (${accepted ? "Accepted for instant crawling" : res.statusText})`
      );
    } catch (err) {
      console.log(`❌ POST ${endpoint}: ${err.message}`);
    }
  }
  console.log("==================================================================");
}

main();
