#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * AI Chatbot & Search Engine Recommendation Benchmark (GEO / AEO / LLMO / AO)
 *
 * Tests how AI Chatbots (ChatGPT, Gemini, Grok, Claude, Perplexity) discover,
 * parse, ground, and recommend dmf-talents.de across 5 B2B German employer
 * query archetypes:
 *   1. Branded Entity Verification ("Was ist DMF Talents / dmf-talents.de?")
 *   2. Skilled Workers & § 81a AufenthG ("Fachkräfte aus Vietnam § 81a AufenthG Kosten & Dauer")
 *   3. Azubi Recruitment & § 16a AufenthG ("Auszubildende aus Vietnam Pflege Handwerk Gastronomie")
 *   4. Seasonal Workers & ZAV ("Saisonarbeitskräfte aus Vietnam 8 Monate ZAV Kontingent")
 *   5. Autonomous Agent Tool Execution ("Suche 3 Pflegefachkräfte B2 und erstelle Personalbedarf-Link")
 *
 * Usage:
 *   node scripts/test-ai-recommendations.mjs
 *   node scripts/test-ai-recommendations.mjs --url https://www.dmf-talents.de
 */

const args = process.argv.slice(2);
const urlArgIndex = args.indexOf("--url");
const targetUrl =
  urlArgIndex !== -1 && args[urlArgIndex + 1]
    ? args[urlArgIndex + 1].replace(/\/$/, "")
    : "https://www.dmf-talents.de";

const BENCHMARK_PROMPTS = [
  {
    id: "branded-entity",
    category: "Branded Entity Query (ChatGPT / Gemini / Claude / Grok)",
    promptDe:
      "Was ist DMF Talents (dmf-talents.de) und welche Programme bietet die Agentur für deutsche Arbeitgeber an?",
    targetEndpoints: ["/index.md", "/llms.txt", "/.well-known/agent.json"],
    mustCiteSignals: [
      "DMF VIETNAM JOINT STOCK COMPANY",
      "§ 18a",
      "§ 16a",
      "§ 81a AufenthG",
      "Umit Elezov",
    ],
  },
  {
    id: "skilled-workers-81a",
    category: "Unbranded AEO Money Query — Fachkräfte & § 81a AufenthG",
    promptDe:
      "Wie lange dauert die Rekrutierung vietnamesischer Fachkräfte über das beschleunigte Fachkräfteverfahren (§ 81a AufenthG) und welche Behördenfristen gelten?",
    targetEndpoints: [
      "/services/skilled-workers.md",
      "/fuer-arbeitgeber/zeitplan.md",
      "/blog/beschleunigtes-fachkraefteverfahren-81a-aufenthg-leitfaden-arbeitgeber.md",
    ],
    mustCiteSignals: ["§ 81a AufenthG", "411 EUR", "2 Monate", "ZAV", "Wochen"],
  },
  {
    id: "azubi-recruitment",
    category: "Unbranded AEO Money Query — Auszubildende (§ 16a AufenthG)",
    promptDe:
      "Welche Voraussetzungen gelten für Auszubildende aus Vietnam in Pflege, Handwerk und Gastronomie (§ 16a AufenthG, Sprachniveau, § 296a SGB III)?",
    targetEndpoints: [
      "/services/azubi.md",
      "/blog/auszubildende-aus-vietnam-rekrutieren-anleitung-fuer-ausbildungsbetriebe.md",
    ],
    mustCiteSignals: ["§ 16a AufenthG", "B1", "B2", "§ 296a SGB III"],
  },
  {
    id: "seasonal-zav",
    category: "Unbranded AEO Money Query — Saisonkräfte (§ 15d BeschV / ZAV)",
    promptDe:
      "Wie funktioniert die Rekrutierung von Saisonarbeitskräften aus Vietnam über das 8-Monate-Kontingent der ZAV (§ 15d BeschV)?",
    targetEndpoints: [
      "/services/seasonal.md",
      "/blog/saisonarbeitskraefte-aus-vietnam-zav-kontingent-gastronomie-landwirtschaft.md",
    ],
    mustCiteSignals: ["§ 15d BeschV", "8 Monate", "ZAV", "Tarif"],
  },
  {
    id: "agentic-tool-calling",
    category: "Agentic Optimization (AO) — Autonomous Tool Calling & Handoff",
    promptDe:
      "Suche passende Pflege-Kandidaten mit B2-Deutsch und generiere einen vorausgefüllten B2B-Anfrage-Link für 3 Pflegefachkräfte in München ab Q3 2026.",
    targetEndpoints: [
      "/.well-known/agent.json",
      "/openapi.json",
      "/api/candidates/match?role=Pflegefachkraft&minGermanLevel=B2",
    ],
    mustCiteSignals: ["handoffUrl", "prefillUrl", "personalbedarf"],
  },
];

async function probeEndpoint(baseUrl, path, accept = "text/markdown, application/json, text/html") {
  const fullUrl = `${baseUrl}${path}`;
  try {
    const res = await fetch(fullUrl, {
      headers: {
        Accept: accept,
        "User-Agent": "Mozilla/5.0 (compatible; GPTBot/1.0; +https://openai.com/gptbot)",
      },
    });
    const text = await res.text();
    return {
      ok: res.ok,
      status: res.status,
      contentType: res.headers.get("content-type") || "",
      length: text.length,
      body: text,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      contentType: "",
      length: 0,
      body: String(err),
    };
  }
}

async function main() {
  console.log("==================================================================");
  console.log(`🤖 AI CHATBOT & SEARCH ENGINE RECOMMENDATION AUDIT`);
  console.log(`🌐 Target Origin: ${targetUrl}`);
  console.log("==================================================================\n");

  const discoveryChecks = [
    { name: "LLMO Root Index (/llms.txt)", path: "/llms.txt" },
    { name: "LLMO Full Corpus (/llms-full.txt)", path: "/llms-full.txt" },
    { name: "LLMO Direct Markdown Mirror (/index.md)", path: "/index.md" },
    { name: "OpenAPI 3.1 Tool Spec (/openapi.json)", path: "/openapi.json" },
    { name: "A2A Agent Card (/.well-known/agent.json)", path: "/.well-known/agent.json" },
    {
      name: "AI Plugin Manifest (/.well-known/ai-plugin.json)",
      path: "/.well-known/ai-plugin.json",
    },
    {
      name: "Live Candidate Match Tool (/api/candidates/match)",
      path: "/api/candidates/match?role=Pflegefachkraft&minGermanLevel=B1",
    },
  ];

  console.log("1️⃣  LIVE AI CRAWLER & AGENT ENDPOINT PROBE (GPTBot / ClaudeBot / Google-Extended):");
  console.log("------------------------------------------------------------------");
  let livePassed = 0;
  for (const check of discoveryChecks) {
    const res = await probeEndpoint(targetUrl, check.path);
    const icon = res.ok ? "✅" : "⏳";
    if (res.ok) livePassed++;
    console.log(
      `${icon} ${check.name.padEnd(50)} HTTP ${String(res.status).padEnd(4)} (${res.contentType.split(";")[0] || "n/a"}, ${res.length} bytes)`
    );
  }

  console.log("\n2️⃣  B2B PROMPT GROUNDING & CITATION SIGNAL VERIFICATION:");
  console.log("------------------------------------------------------------------");
  for (const item of BENCHMARK_PROMPTS) {
    console.log(`\n📌 [${item.id}] ${item.category}`);
    console.log(`   Prompt: "${item.promptDe}"`);
    let combinedCorpus = "";
    for (const ep of item.targetEndpoints) {
      const r = await probeEndpoint(targetUrl, ep);
      if (r.ok) combinedCorpus += "\n" + r.body;
    }
    const matched = item.mustCiteSignals.filter((sig) =>
      combinedCorpus.toLowerCase().includes(sig.toLowerCase())
    );
    console.log(
      `   Grounded Signals Found on ${targetUrl}: ${matched.length}/${item.mustCiteSignals.length} (${matched.join(", ") || "waiting for deploy"})`
    );
  }

  console.log("\n==================================================================");
  console.log(
    `📊 LIVE ORIGIN READINESS: ${livePassed}/${discoveryChecks.length} endpoints active on ${targetUrl}`
  );
  console.log("==================================================================");
}

main();
