import { createRequestContextTracker, requestContext } from "@/lib/intake/context";
import { requestContextSchema } from "@/lib/validations/hiring";
import { describe, expect, it, vi } from "vitest";

function expectSchemaParity(context: ReturnType<typeof requestContext>) {
  expect(requestContextSchema.parse(context)).toStrictEqual(context);
}

describe("browser request context", () => {
  it("loads and runs without the runtime server validators", async () => {
    vi.resetModules();
    vi.doMock("@/lib/validations/hiring", () => {
      throw new Error("Server validators must not enter the client context module");
    });
    try {
      const client = await import("@/lib/intake/context");
      expect(client.currentRequestContext("https://example.invalid/services")).toStrictEqual({
        sourcePath: "/services",
        campaign: {},
      });
    } finally {
      vi.doUnmock("@/lib/validations/hiring");
      vi.resetModules();
    }
  });

  it.each(["/", "/services/azubi", "/A_0/b-9/", `/${"a".repeat(299)}`])(
    "preserves valid bounded paths and campaigns: %s",
    (path) => {
      const campaign = { source: "Partner_1", medium: "paid search", campaign: "A.b-2026" };
      const query = new URLSearchParams({
        utm_campaign: campaign.campaign,
        utm_medium: campaign.medium,
        utm_source: campaign.source,
      });
      const context = requestContext(`https://example.invalid${path}?${query}`);
      expect(context).toStrictEqual({ sourcePath: path, campaign });
      expectSchemaParity(context);
      // Preserve the existing serialized field order, independent of query order.
      expect(JSON.stringify(context)).toBe(JSON.stringify({ sourcePath: path, campaign }));
    }
  );

  it.each([
    `/${"a".repeat(300)}`,
    "/services/file.html",
    "/private@example.invalid",
    "/bad%20path",
    "/services%2Fazubi",
    "/%61zubi",
    "/bad%0A",
    "/bad%0D%0A",
    "/bad%00",
    "/bad%",
    "/bad%GG",
    "/%252Fprivate",
    "/münchen",
  ])("falls back for overlong, malformed or encoded paths: %s", (path) => {
    const context = requestContext(`https://example.invalid${path}?utm_source=partner`);
    expect(context).toStrictEqual({ sourcePath: "/", campaign: { source: "partner" } });
    expectSchemaParity(context);
  });

  it("keeps URL path normalization and invalid URL behavior compatible", () => {
    const context = requestContext("https://example.invalid/services/../azubi?utm_source=ok");
    expect(context).toStrictEqual({ sourcePath: "/azubi", campaign: { source: "ok" } });
    expectSchemaParity(context);
    expect(() => requestContext("not an absolute URL")).toThrow(TypeError);
  });

  it("matches the server schema across campaign bounds and malformed characters", () => {
    const validValues = ["a", " ", "source_1.- 2026", "a".repeat(99), "a".repeat(100)];
    const invalidValues = [
      "",
      "a".repeat(101),
      "partner\n",
      `${"a".repeat(99)}\n`,
      `${"a".repeat(100)}\n`,
      "partner\r",
      "partner\r\n",
      "partner\t",
      "partner\u2028",
      "partner\u2029",
      "partner\0",
      "private@example.invalid",
      "https://example.invalid",
      "münchen",
      "a/b",
      "a+b",
      "%61",
    ];
    for (const key of ["source", "medium", "campaign"] as const) {
      for (const value of [...validValues, ...invalidValues]) {
        const query = new URLSearchParams({ [`utm_${key}`]: value });
        const context = requestContext(`https://example.invalid/services?${query}`);
        expect(context.campaign, `${key}: ${JSON.stringify(value)}`).toStrictEqual(
          validValues.includes(value) ? { [key]: value } : {}
        );
        expectSchemaParity(context);
      }
    }
  });

  it("decodes UTM values once and uses only the first occurrence", () => {
    const context = requestContext(
      "https://example.invalid/?utm_campaign=Spring%2E2026&utm_medium=paid+search" +
        "&utm_source=%70artner&utm_source=ignored"
    );
    expect(context).toStrictEqual({
      sourcePath: "/",
      campaign: { source: "partner", medium: "paid search", campaign: "Spring.2026" },
    });
    expectSchemaParity(context);
    for (const value of ["bad%", "%GG", "%FF", "%2561", "%0A", "%2B"]) {
      const rejected = requestContext(
        `https://example.invalid/?utm_source=${value}&utm_source=valid&utm_medium=ok`
      );
      expect(rejected.campaign).toStrictEqual({ medium: "ok" });
      expectSchemaParity(rejected);
    }
  });

  it("omits private query data, extra campaign keys, credentials, origin and fragment", () => {
    const context = requestContext(
      "https://user:password@example.invalid/services/azubi?email=private%40example.invalid" +
        "&referrer=https%3A%2F%2Fprivate.invalid&sourcePath=%2Fprivate&campaign=private" +
        "&utm_term=private&UTM_SOURCE=private&utm_content=private&__proto__=private" +
        "&utm_source=partner&utm_medium=email&utm_campaign=autumn#private@example.invalid"
    );
    expect(context).toStrictEqual({
      sourcePath: "/services/azubi",
      campaign: { source: "partner", medium: "email", campaign: "autumn" },
    });
    expect(JSON.stringify(context)).not.toContain("private");
    expectSchemaParity(context);
  });
});

describe("tab request context tracker", () => {
  it("retains the last valid campaign across navigation and replaces it on rollover", () => {
    const track = createRequestContextTracker();
    const contexts = [
      track("https://example.invalid/?utm_source=first&utm_medium=email&utm_campaign=autumn"),
      track("https://example.invalid/services?email=private%40example.invalid"),
      track("https://example.invalid/bad%0A?utm_source=invalid%0A&utm_campaign="),
      track("https://example.invalid/azubi?utm_medium=referral&utm_source=invalid%40"),
      track("https://example.invalid/contact"),
    ];
    expect(contexts.map((context) => context.campaign)).toStrictEqual([
      { source: "first", medium: "email", campaign: "autumn" },
      { source: "first", medium: "email", campaign: "autumn" },
      { source: "first", medium: "email", campaign: "autumn" },
      { medium: "referral" },
      { medium: "referral" },
    ]);
    expect(contexts.map((context) => context.sourcePath)).toStrictEqual([
      "/",
      "/services",
      "/",
      "/azubi",
      "/contact",
    ]);
    contexts.forEach(expectSchemaParity);
    const freshTab = createRequestContextTracker();
    expect(freshTab("https://example.invalid/")).toStrictEqual({ sourcePath: "/", campaign: {} });
  });

  it("resets the exported tracker when the document module is reloaded", async () => {
    vi.resetModules();
    const firstDocument = await import("@/lib/intake/context");
    expect(
      firstDocument.currentRequestContext("https://example.invalid/?utm_source=first").campaign
    ).toStrictEqual({ source: "first" });
    vi.resetModules();
    const nextDocument = await import("@/lib/intake/context");
    const context = nextDocument.currentRequestContext("https://example.invalid/contact");
    expect(context).toStrictEqual({ sourcePath: "/contact", campaign: {} });
    expectSchemaParity(context);
  });
});
