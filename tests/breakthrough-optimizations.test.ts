import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import {
  buildRegionalStandortSchemas,
  getRegionalStandortBySlug,
  REGIONAL_STANDORT_SLUGS,
  REGIONAL_STANDORTE,
} from "@/lib/content/standorte";
import { resolveMarkdownDocument } from "@/lib/geo/markdown-negotiation";
import { GET as getMcp, POST as postMcp } from "@/app/api/mcp/route";

describe("Breakthrough Optimizations (Regional § 81a Hub, E-E-A-T Proof, and Public MCP Server)", () => {
  it("defines all 8 German Bundesländer regional § 81a configurations with complete authority and nursing recognition data", () => {
    expect(REGIONAL_STANDORTE).toHaveLength(8);
    expect(REGIONAL_STANDORT_SLUGS).toEqual([
      "bayern",
      "baden-wuerttemberg",
      "nordrhein-westfalen",
      "niedersachsen",
      "hessen",
      "berlin-brandenburg",
      "sachsen-mitteldeutschland",
      "hamburg-norddeutschland",
    ]);

    const bayern = getRegionalStandortBySlug("bayern");
    expect(bayern).toBeDefined();
    expect(bayern?.authority81aName).toContain("ZSEF");
    expect(bayern?.nursingRecognitionOffice).toContain("LfP");

    const schemas = buildRegionalStandortSchemas(bayern!);
    expect(schemas.some((s) => s["@type"] === "Service")).toBe(true);
    expect(schemas.some((s) => s["@type"] === "FAQPage")).toBe(true);
    expect(schemas.some((s) => s["@type"] === "WebPage")).toBe(true);
  });

  it("serves Markdown mirrors for /fuer-arbeitgeber/standorte, regional slugs, and upgraded /referenzen", () => {
    const hubMd = resolveMarkdownDocument("/fuer-arbeitgeber/standorte.md");
    expect(hubMd?.status).toBe(200);
    expect(hubMd?.markdown).toContain("ZSEF");
    expect(hubMd?.markdown).toContain("LZF");

    const bayernMd = resolveMarkdownDocument("/fuer-arbeitgeber/standorte/bayern.md");
    expect(bayernMd?.status).toBe(200);
    expect(bayernMd?.markdown).toContain(
      "Zentrale Stelle für die Einwanderung von Fachkräften (ZSEF)"
    );
    expect(bayernMd?.markdown).toContain("Bayerisches Landesamt für Pflege (LfP)");

    const refMd = resolveMarkdownDocument("/referenzen.md");
    expect(refMd?.status).toBe(200);
    expect(refMd?.markdown).toContain("3-Jahres-Modellvergleich");
    expect(refMd?.markdown).toContain("Zeitarbeit");
  });

  it("supports GET and JSON-RPC 2.0 POST on the Public MCP Server (/api/mcp)", async () => {
    const getRes = await getMcp();
    expect(getRes.status).toBe(200);
    const manifest = await getRes.json();
    expect(manifest.serverInfo.name).toBe("dmf-talents-mcp-server");
    expect(manifest.tools).toHaveLength(4);

    // 1. initialize
    const initReq = new NextRequest("http://localhost:3000/api/mcp", {
      method: "POST",
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize" }),
    });
    const initRes = await postMcp(initReq);
    expect(initRes.status).toBe(200);
    const initJson = await initRes.json();
    expect(initJson.result.serverInfo.name).toBe("dmf-talents-mcp-server");

    // 2. tools/call -> get_regional_81a_authority
    const callReq = new NextRequest("http://localhost:3000/api/mcp", {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
          name: "get_regional_81a_authority",
          arguments: { regionOrCity: "München" },
        },
      }),
    });
    const callRes = await postMcp(callReq);
    expect(callRes.status).toBe(200);
    const callJson = await callRes.json();
    expect(callJson.result.isError).toBe(false);
    const parsedToolOutput = JSON.parse(callJson.result.content[0].text);
    expect(parsedToolOutput.matchedState).toBe("Bayern");
    expect(parsedToolOutput.authority81aName).toContain("ZSEF");

    // 3. tools/call -> compare_recruiting_models
    const tcoReq = new NextRequest("http://localhost:3000/api/mcp", {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
          name: "compare_recruiting_models",
          arguments: { headcount: 4 },
        },
      }),
    });
    const tcoRes = await postMcp(tcoReq);
    const tcoJson = await tcoRes.json();
    const parsedTco = JSON.parse(tcoJson.result.content[0].text);
    expect(parsedTco.headcount).toBe(4);
    expect(parsedTco.estimated3YearSavingsVsZeitarbeitEur).toBeGreaterThan(100000);
  });
});
