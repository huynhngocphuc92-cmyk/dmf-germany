import { NextRequest, NextResponse } from "next/server";
import { GERMANY_CONTACT, VIETNAM_OFFICE_CONTACT } from "@/lib/company/contact";
import { REGIONAL_STANDORTE } from "@/lib/content/standorte";
import { mergeWithDmfFeaturedCandidates } from "@/lib/candidates/dmf-pool-data";
import { getFeaturedCandidates } from "@/lib/supabase/candidates";
import { SITE_NAME, SITE_URL, siteUrl } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MCP_PROTOCOL_VERSION = "2025-03-26";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Mcp-Session-Id",
  "Cache-Control": "no-store",
};

const MCP_TOOLS = [
  {
    name: "match_candidates",
    description:
      "Search and rank pre-vetted Vietnamese skilled workers (§ 18a/b AufenthG), apprentices/Azubis (§ 16a AufenthG), and seasonal staff (§ 15d BeschV) from the DMF Talents pool, including direct B2B handoff URLs.",
    inputSchema: {
      type: "object",
      properties: {
        role: {
          type: "string",
          description:
            "Target profession or keyword in German or English (e.g. 'Pflegefachkraft', 'Elektroniker', 'Koch', 'Azubi', 'Lagerlogistik').",
        },
        minGermanLevel: {
          type: "string",
          enum: ["A1", "A2", "B1", "B2", "C1"],
          description: "Minimum required CEFR German level (default: B1).",
        },
        category: {
          type: "string",
          enum: ["skilled", "azubi", "seasonal"],
          description:
            "Optional program filter: skilled (§ 18a/b), azubi (§ 16a), or seasonal (§ 15d BeschV).",
        },
      },
      required: ["role"],
    },
  },
  {
    name: "get_regional_81a_authority",
    description:
      "Look up the responsible § 81a AufenthG Central Immigration Office (e.g., ZSEF Nürnberg in Bayern, LZF in Baden-Württemberg, ZFE in NRW, LEA BIS in Berlin) and the state nursing recognition office for any German Bundesland or city.",
    inputSchema: {
      type: "object",
      properties: {
        regionOrCity: {
          type: "string",
          description:
            "German Bundesland or city name (e.g., 'Bayern', 'München', 'Baden-Württemberg', 'Stuttgart', 'NRW', 'Köln', 'Niedersachsen', 'Meppen', 'Hessen', 'Frankfurt', 'Berlin', 'Sachsen', 'Leipzig', 'Hamburg').",
        },
      },
      required: ["regionOrCity"],
    },
  },
  {
    name: "compare_recruiting_models",
    description:
      "Compare 3-year Total Cost of Ownership (TCO), retention rate, processing time, and § 296a SGB III compliance between DMF Talents Full-Service Direct Recruiting, Zeitarbeit (temp staffing), and DIY foreign recruiting.",
    inputSchema: {
      type: "object",
      properties: {
        headcount: {
          type: "number",
          description:
            "Number of workers or apprentices to calculate 3-year savings for (default: 3).",
        },
      },
    },
  },
  {
    name: "build_prefilled_hiring_link",
    description:
      "Generate a pre-filled B2B employer intake URL on dmf-talents.de (/fuer-arbeitgeber/personalbedarf) so a German HR manager can review and submit their staffing request in one click.",
    inputSchema: {
      type: "object",
      properties: {
        company: { type: "string", description: "Company or clinic name in Germany." },
        service: {
          type: "string",
          enum: ["skilled", "azubi", "seasonal"],
          description: "Recruitment track: skilled (§ 18a/b), azubi (§ 16a), or seasonal (§ 15d).",
        },
        headcount: { type: "number", description: "Number of candidates requested." },
        location: { type: "string", description: "City or Bundesland in Germany." },
        timing: {
          type: "string",
          description: "Desired start window (e.g., 'Q3 2026', 'Ab sofort').",
        },
        message: { type: "string", description: "Additional role or language requirements." },
      },
      required: ["service"],
    },
  },
] as const;

const MCP_RESOURCES = [
  {
    uri: "dmf://standorte/81a-authorities",
    name: "German Bundesländer § 81a AufenthG & Nursing Recognition Directory",
    description:
      "Structured directory mapping German states to their § 81a AufenthG central authorities (ZSEF, LZF, ZFE, LEA BIS, HWC) and state nursing recognition offices.",
    mimeType: "application/json",
  },
  {
    uri: "dmf://comparison/3-year-tco",
    name: "3-Year TCO Comparison: DMF Direct Recruiting vs. Zeitarbeit vs. DIY",
    description:
      "Quantitative comparison of cost, retention (>95%), and legal compliance (§ 296a SGB III) for German employers.",
    mimeType: "application/json",
  },
  {
    uri: "dmf://contact/b2b-desk",
    name: "DMF Talents B2B Contact Desk (Germany & Vietnam)",
    description:
      "Direct contact points for German employers (Umit Elezov in Germany & Achim Betticher in Vietnam).",
    mimeType: "application/json",
  },
] as const;

const GERMAN_RANK: Record<string, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

async function executeMatchCandidates(args: Record<string, unknown>) {
  const role = String(args.role || "Fachkraft").trim();
  const minGermanLevel = String(args.minGermanLevel || "B1").toUpperCase();
  const categoryFilter = args.category ? String(args.category) : undefined;
  const minRank = GERMAN_RANK[minGermanLevel] || 3;

  let pool = mergeWithDmfFeaturedCandidates([]);
  try {
    const { data } = await getFeaturedCandidates();
    pool = mergeWithDmfFeaturedCandidates(data);
  } catch {
    // Fallback to deterministic pool
  }

  const qLower = role.toLowerCase();
  const scored = pool
    .filter((c) => !categoryFilter || c.category === categoryFilter)
    .map((c) => {
      const prof = (c.profession || "").toLowerCase();
      const rank = GERMAN_RANK[(c.german_level || "B1").toUpperCase()] || 3;
      let score = 72;
      if (prof.includes(qLower) || qLower.includes(prof)) score += 18;
      if (qLower.includes("pflege") && prof.includes("pflege")) score += 18;
      if (qLower.includes("elektro") && prof.includes("elektro")) score += 18;
      if (qLower.includes("koch") && (prof.includes("koch") || prof.includes("gastro")))
        score += 18;
      if (rank >= minRank) score += 7;
      else score -= 12;
      const code = c.display_code || c.id.slice(0, 8).toUpperCase();
      return {
        id: c.id,
        code,
        profession: c.profession,
        category: c.category,
        germanLevel: c.german_level,
        experienceYears: c.experience_years,
        matchScore: Math.min(99, Math.max(50, score)),
        handoffUrl: `${siteUrl("/fuer-arbeitgeber/personalbedarf")}?candidateId=${encodeURIComponent(c.id)}&candidateLabel=${encodeURIComponent(`#${code} (${c.profession || c.category})`)}&service=${encodeURIComponent(c.category)}`,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);

  return {
    query: { role, minGermanLevel, category: categoryFilter || "all" },
    matchedCount: scored.length,
    matches: scored,
    allCandidatesDirectoryUrl: siteUrl("/fuer-arbeitgeber/kandidaten"),
  };
}

function executeGetRegionalAuthority(args: Record<string, unknown>) {
  const query = String(args.regionOrCity || "")
    .toLowerCase()
    .trim();
  const matched =
    REGIONAL_STANDORTE.find(
      (s) =>
        s.slug.includes(query) ||
        s.stateName.toLowerCase().includes(query) ||
        s.shortName.toLowerCase() === query ||
        s.cities.some((c) => c.toLowerCase().includes(query))
    ) || REGIONAL_STANDORTE[0];

  return {
    matchedState: matched.stateName,
    shortName: matched.shortName,
    cities: matched.cities,
    authority81aName: matched.authority81aName,
    authority81aAddress: matched.authority81aAddress,
    authority81aModel: matched.authority81aModel,
    nursingRecognitionOffice: matched.nursingRecognitionOffice,
    ihkHwkRecognitionOffice: matched.ihkHwkRecognitionOffice,
    arrivalAirport: matched.arrivalAirport,
    statutoryFee81a: "411 EUR (§ 47 AufenthV)",
    statutoryDeadlines: {
      recognitionDecision: "max. 2 Monate",
      zavApproval: "1 Woche",
      embassyAppointment: "3 Wochen",
      totalEndToEndDuration: "4–6 Monate",
    },
    guideUrl: siteUrl(`/fuer-arbeitgeber/standorte/${matched.slug}`),
    prefilledInquiryUrl: `${siteUrl("/fuer-arbeitgeber/personalbedarf")}?location=${encodeURIComponent(matched.stateName)}`,
  };
}

function executeCompareRecruitingModels(args: Record<string, unknown>) {
  const headcount = Math.max(1, Math.min(50, Number(args.headcount) || 3));
  const dmfEstimatedCost = headcount * 5500;
  const zeitarbeit3YearMarkup = headcount * 21000 * 3;

  return {
    headcount,
    estimated3YearSavingsVsZeitarbeitEur: zeitarbeit3YearMarkup - dmfEstimatedCost,
    models: [
      {
        model: "DMF Talents Full-Service Direktvermittlung",
        contractType: "Direkter Arbeits-/Ausbildungsvertrag mit Ihrem Unternehmen",
        estimatedFeePerPersonEur: "3.500–6.500 EUR (einmalig, erfolgsbasiert)",
        retentionRateAfterProbation: "> 95 %",
        timeToArrival: "4–6 Monate (§ 81a AufenthG) / 6–9 Monate (§ 16a Azubi)",
        compliance: "100 % Employer-Pays (§ 296a SGB III), eigener Vollzeit-Campus in Vietnam",
      },
      {
        model: "Zeitarbeit / Arbeitnehmerüberlassung (AÜG)",
        contractType: "Leiharbeitsverhältnis (max. 18 Monate Überlassungshöchstdauer)",
        estimatedFeePerPersonEur: "18.000–25.000 EUR+ laufender Aufschlag pro Jahr",
        retentionRateAfterProbation: "Gering (kein eigenes Stammpersonal)",
        timeToArrival: "Kurzfristig (sofern verfügbar)",
        compliance: "AÜG-Restriktionen, hohe laufende Personalkosten",
      },
      {
        model: "Eigenständige Selbstrekrutierung im Ausland",
        contractType: "Direktvertrag, aber voller Eigenaufwand",
        estimatedFeePerPersonEur: "Hohe versteckte Reise-, Übersetzungs- und Ausfallkosten",
        retentionRateAfterProbation: "60–70 % (erhöhtes Abbruchrisiko ohne Vor-Ort-Betreuung)",
        timeToArrival: "9–15 Monate",
        compliance: "Hohes Risiko durch unlizenzierte lokale Zwischenhändler",
      },
    ],
    roiCalculatorUrl: siteUrl("/roi-rechner"),
    referencesUrl: siteUrl("/referenzen"),
  };
}

function executeBuildPrefilledHiringLink(args: Record<string, unknown>) {
  const params = new URLSearchParams();
  const service = ["skilled", "azubi", "seasonal"].includes(String(args.service))
    ? String(args.service)
    : "skilled";
  params.set("service", service);
  if (args.company) params.set("company", String(args.company));
  if (args.headcount) params.set("headcount", String(args.headcount));
  if (args.location) params.set("location", String(args.location));
  if (args.timing) params.set("timing", String(args.timing));
  if (args.message) params.set("message", String(args.message));

  return {
    prefillUrl: `${siteUrl("/fuer-arbeitgeber/personalbedarf")}?${params.toString()}`,
    parametersUsed: Object.fromEntries(params.entries()),
    directContactGermany: {
      name: GERMANY_CONTACT.name,
      phone: GERMANY_CONTACT.phone,
      email: GERMANY_CONTACT.email,
    },
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json(
    {
      protocol: "Model Context Protocol (MCP) Streamable HTTP",
      protocolVersion: MCP_PROTOCOL_VERSION,
      serverInfo: {
        name: "dmf-talents-mcp-server",
        title: `${SITE_NAME} — B2B Recruiting & § 81a AufenthG MCP Server`,
        version: "1.0.0",
        homepage: SITE_URL,
      },
      capabilities: {
        tools: { listChanged: false },
        resources: { listChanged: false },
      },
      tools: MCP_TOOLS,
      resources: MCP_RESOURCES,
      discoveryLinks: {
        agentCard: siteUrl("/.well-known/agent.json"),
        openApiSpec: siteUrl("/openapi.json"),
        llmsTxt: siteUrl("/llms.txt"),
        standorteHub: siteUrl("/fuer-arbeitgeber/standorte"),
      },
    },
    { status: 200, headers: CORS_HEADERS }
  );
}

export async function POST(request: NextRequest) {
  let body: {
    jsonrpc?: string;
    id?: string | number | null;
    method?: string;
    params?: Record<string, unknown>;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: "Parse error: Invalid JSON payload" },
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const { id = null, method, params = {} } = body;

  if (method === "notifications/initialized") {
    return new NextResponse(null, { status: 202, headers: CORS_HEADERS });
  }

  if (method === "initialize") {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: MCP_PROTOCOL_VERSION,
          capabilities: {
            tools: { listChanged: false },
            resources: { listChanged: false },
          },
          serverInfo: {
            name: "dmf-talents-mcp-server",
            version: "1.0.0",
          },
          instructions:
            "Use this MCP server to query pre-vetted Vietnamese skilled workers (§ 18a/b AufenthG) and apprentices (§ 16a AufenthG), look up German state § 81a AufenthG authorities (ZSEF, LZF, ZFE, LEA BIS), compare 3-year recruiting TCO vs. Zeitarbeit, and generate pre-filled B2B employer intake links on dmf-talents.de.",
        },
      },
      { status: 200, headers: CORS_HEADERS }
    );
  }

  if (method === "ping") {
    return NextResponse.json(
      { jsonrpc: "2.0", id, result: {} },
      { status: 200, headers: CORS_HEADERS }
    );
  }

  if (method === "tools/list") {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id,
        result: {
          tools: MCP_TOOLS,
        },
      },
      { status: 200, headers: CORS_HEADERS }
    );
  }

  if (method === "tools/call") {
    const toolName = String(params.name || "");
    const toolArgs = (params.arguments as Record<string, unknown>) || {};

    try {
      let output: unknown;
      if (toolName === "match_candidates") {
        output = await executeMatchCandidates(toolArgs);
      } else if (toolName === "get_regional_81a_authority") {
        output = executeGetRegionalAuthority(toolArgs);
      } else if (toolName === "compare_recruiting_models") {
        output = executeCompareRecruitingModels(toolArgs);
      } else if (toolName === "build_prefilled_hiring_link") {
        output = executeBuildPrefilledHiringLink(toolArgs);
      } else {
        return NextResponse.json(
          {
            jsonrpc: "2.0",
            id,
            error: { code: -32601, message: `Unknown MCP tool: ${toolName}` },
          },
          { status: 404, headers: CORS_HEADERS }
        );
      }

      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(output, null, 2),
              },
            ],
            isError: false,
          },
        },
        { status: 200, headers: CORS_HEADERS }
      );
    } catch (error) {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  error: error instanceof Error ? error.message : "Tool execution failed",
                }),
              },
            ],
            isError: true,
          },
        },
        { status: 200, headers: CORS_HEADERS }
      );
    }
  }

  if (method === "resources/list") {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id,
        result: {
          resources: MCP_RESOURCES,
        },
      },
      { status: 200, headers: CORS_HEADERS }
    );
  }

  if (method === "resources/read") {
    const uri = String(params.uri || "");
    if (uri === "dmf://standorte/81a-authorities") {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id,
          result: {
            contents: [
              {
                uri,
                mimeType: "application/json",
                text: JSON.stringify(REGIONAL_STANDORTE, null, 2),
              },
            ],
          },
        },
        { status: 200, headers: CORS_HEADERS }
      );
    }
    if (uri === "dmf://comparison/3-year-tco") {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id,
          result: {
            contents: [
              {
                uri,
                mimeType: "application/json",
                text: JSON.stringify(executeCompareRecruitingModels({ headcount: 3 }), null, 2),
              },
            ],
          },
        },
        { status: 200, headers: CORS_HEADERS }
      );
    }
    if (uri === "dmf://contact/b2b-desk") {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id,
          result: {
            contents: [
              {
                uri,
                mimeType: "application/json",
                text: JSON.stringify(
                  {
                    germanyRepresentative: GERMANY_CONTACT,
                    vietnamAcademyHeadquarters: VIETNAM_OFFICE_CONTACT,
                    intakeFormUrl: siteUrl("/fuer-arbeitgeber/personalbedarf"),
                  },
                  null,
                  2
                ),
              },
            ],
          },
        },
        { status: 200, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id,
        error: { code: -32602, message: `Unknown resource URI: ${uri}` },
      },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  return NextResponse.json(
    {
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: `Method not found: ${String(method)}` },
    },
    { status: 404, headers: CORS_HEADERS }
  );
}
