import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: async () => ({ success: true, remaining: 19, resetIn: 60 }),
  getClientIp: () => "127.0.0.1",
  RATE_LIMITS: {
    CHAT: { limit: 20, windowSeconds: 60 },
    API: { limit: 30, windowSeconds: 60 },
  },
}));

import { POST as matchCandidates } from "@/app/api/candidates/match/route";
import { POST as parseHiring } from "@/app/api/hiring/parse/route";
import { POST as generateRoiBrief } from "@/app/api/roi/brief/route";
import { POST as checkPathway } from "@/app/api/pathway-check/route";
import { translateAndStandardizeCVEntries } from "@/lib/portal/ai-service";

describe("AI Ecosystem Endpoints & OpenRouter Unification", () => {
  beforeEach(() => {
    vi.stubEnv("OPENROUTER_API_KEY", "");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("scores and ranks candidate profiles via /api/candidates/match in guided and AI modes", async () => {
    const sampleCandidates = [
      {
        id: "cand-1",
        category: "skilled" as const,
        profession: "Pflegefachkraft",
        experience_years: 3,
        german_level: "B2" as const,
        visa_status: true,
      },
      {
        id: "cand-2",
        category: "azubi" as const,
        profession: "Koch / Gastronomie",
        experience_years: 1,
        german_level: "B1" as const,
        visa_status: false,
      },
    ];

    const guidedRes = await matchCandidates(
      new NextRequest("http://localhost/api/candidates/match", {
        method: "POST",
        body: JSON.stringify({
          query: "Suche Pflegefachkraft mit B2",
          candidates: sampleCandidates,
          lang: "de",
        }),
      })
    );
    expect(guidedRes.status).toBe(200);
    const guidedBody = await guidedRes.json();
    expect(guidedBody.mode).toBe("guided");
    expect(guidedBody.matches[0].id).toBe("cand-1");
    expect(guidedBody.matches[0].matchScore).toBeGreaterThan(guidedBody.matches[1].matchScore);

    // Now test OpenRouter AI mode
    vi.stubEnv("OPENROUTER_API_KEY", "test-or-key");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            model: "google/gemma-4-26b-a4b-it:free",
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    summary: "Top Pflege-Match mit B2 und 3 Jahren Krankenhauserfahrung.",
                    matches: [
                      {
                        id: "cand-1",
                        matchScore: 97,
                        reason: "Erfüllt B2-Pflegeanforderung und besitzt 3 Jahre Erfahrung.",
                      },
                    ],
                  }),
                },
              },
            ],
          }),
          { status: 200 }
        )
      )
    );

    const aiRes = await matchCandidates(
      new NextRequest("http://localhost/api/candidates/match", {
        method: "POST",
        body: JSON.stringify({
          query: "Suche Pflegefachkraft mit B2",
          candidates: sampleCandidates,
          lang: "de",
        }),
      })
    );
    const aiBody = await aiRes.json();
    expect(aiBody.mode).toBe("ai");
    expect(aiBody.matches[0].matchScore).toBe(97);
    expect(aiBody.summary).toContain("Top Pflege-Match");
  });

  it("extracts structured hiring requirements from free text via /api/hiring/parse", async () => {
    const res = await parseHiring(
      new NextRequest("http://localhost/api/hiring/parse", {
        method: "POST",
        body: JSON.stringify({
          text: "Wir suchen 3 Auszubildende in München ab Herbst 2026 für unsere Pflegeeinrichtung.",
          lang: "de",
        }),
      })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.service).toBe("azubi");
    expect(body.data.headcount).toBe("3");
    expect(body.data.location).toContain("München");
    expect(body.data.timing.toLowerCase()).toContain("herbst 2026");
  });

  it("generates an executive ROI brief via /api/roi/brief", async () => {
    const res = await generateRoiBrief(
      new NextRequest("http://localhost/api/roi/brief", {
        method: "POST",
        body: JSON.stringify({
          productType: "fachkraefte",
          industry: "pflege",
          germanSalary: 3800,
          dmfSalary: 3000,
          recruitmentFee: 1500,
          contractDuration: 3,
          savings: 29700,
          savingsPercentage: "20.0",
          lang: "de",
        }),
      })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.headline).toContain("29.700");
    expect(body.data.bullets).toHaveLength(3);
  });

  it("computes B2C pathway eligibility and timeline via /api/pathway-check", async () => {
    const res = await checkPathway(
      new NextRequest("http://localhost/api/pathway-check", {
        method: "POST",
        body: JSON.stringify({
          age: 20,
          education: "highschool",
          germanLevel: "A2",
          preferredField: "nursing",
          experienceYears: 0,
          lang: "vn",
        }),
      })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.recommendedTrack).toContain("Ausbildung");
    expect(body.data.legalBasis).toContain("16a");
    expect(body.data.roadmapSteps.length).toBeGreaterThanOrEqual(3);
  });

  it("routes Student Portal CV standardization through OpenRouter when OPENROUTER_API_KEY is configured", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-or-key");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          model: "google/gemma-4-26b-a4b-it:free",
          choices: [
            {
              message: {
                content: JSON.stringify({
                  education: [
                    {
                      id: "edu-1",
                      fromMonth: "2020-09",
                      toMonth: "2023-06",
                      institutionVn: "Trường THPT Lê Quý Đôn",
                      institutionDe: "Oberschule Le Quy Don",
                      location: "Da Nang",
                      degreeVn: "Tốt nghiệp THPT",
                      degreeDe: "Allgemeine Hochschulreife (Abitur-Äquivalent)",
                      detailsDe: "Schwerpunkt Naturwissenschaften",
                    },
                  ],
                  work: [],
                }),
              },
            },
          ],
        }),
        { status: 200 }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const standardized = await translateAndStandardizeCVEntries({
      targetProfession: "Pflegefachfrau",
      programTrack: "azubi",
      germanLevel: "B2",
      education: [
        {
          id: "edu-1",
          fromMonth: "2020-09",
          toMonth: "2023-06",
          institutionVn: "Trường THPT Lê Quý Đôn",
          institutionDe: "",
          location: "Da Nang",
          degreeVn: "Tốt nghiệp THPT",
          degreeDe: "",
          detailsDe: "",
        },
      ],
      work: [],
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(standardized.education[0].institutionDe).toBe("Oberschule Le Quy Don");
    expect(standardized.education[0].detailsDe).toBe("Schwerpunkt Naturwissenschaften");
  });
});
