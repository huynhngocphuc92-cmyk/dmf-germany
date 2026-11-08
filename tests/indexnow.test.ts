import { describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";

vi.mock("server-only", () => ({}));

import {
  buildIndexNowUrlList,
  INDEXNOW_KEY,
  INDEXNOW_KEY_LOCATION,
  submitIndexNowBatch,
} from "@/lib/seo/indexnow";
import { GET, POST } from "@/app/api/ops/indexnow/route";

describe("IndexNow Instant AI Indexing System", () => {
  it("verifies the static IndexNow key file exists in public/ with matching content", () => {
    const keyFilePath = path.join(process.cwd(), "public", `${INDEXNOW_KEY}.txt`);
    expect(fs.existsSync(keyFilePath)).toBe(true);
    const content = fs.readFileSync(keyFilePath, "utf8").trim();
    expect(content).toBe(INDEXNOW_KEY);
    expect(INDEXNOW_KEY_LOCATION).toBe(`https://www.dmf-talents.de/${INDEXNOW_KEY}.txt`);
  });

  it("builds a complete deduplicated URL list of 180+ canonical pages, AI manifests, and blog posts", () => {
    const urls = buildIndexNowUrlList();
    expect(urls.length).toBeGreaterThanOrEqual(185);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toContain("https://www.dmf-talents.de/");
    expect(urls).toContain("https://www.dmf-talents.de/services/skilled-workers");
    expect(urls).toContain("https://www.dmf-talents.de/services/azubi");
    expect(urls).toContain("https://www.dmf-talents.de/roi-rechner");
    expect(urls).toContain("https://www.dmf-talents.de/llms.txt");
    expect(urls).toContain("https://www.dmf-talents.de/.well-known/agent.json");
  });

  it("submits the URL batch to IndexNow and Bing endpoints", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 200,
      statusText: "OK",
    }) as unknown as typeof fetch;

    const summary = await submitIndexNowBatch(
      ["https://www.dmf-talents.de/", "https://www.dmf-talents.de/services/skilled-workers"],
      mockFetch
    );

    expect(summary.ok).toBe(true);
    expect(summary.urlCount).toBe(2);
    expect(summary.results).toHaveLength(2);
    expect(summary.results.every((r) => r.ok && r.status === 200)).toBe(true);
  });

  it("enforces Bearer token authorization on GET and POST /api/ops/indexnow", async () => {
    process.env.DMF_OPS_TOKEN = "test-ops-secret-token";

    const unauthReq = new Request("http://localhost:3000/api/ops/indexnow");
    const unauthRes = await GET(unauthReq);
    expect(unauthRes.status).toBe(401);

    const authReq = new Request("http://localhost:3000/api/ops/indexnow", {
      headers: { Authorization: "Bearer test-ops-secret-token" },
    });
    const authRes = await GET(authReq);
    expect(authRes.status).toBe(200);
    const body = await authRes.json();
    expect(body.status).toBe("ready");
    expect(body.urlCount).toBeGreaterThanOrEqual(185);

    const postUnauth = await POST(
      new Request("http://localhost:3000/api/ops/indexnow", { method: "POST" })
    );
    expect(postUnauth.status).toBe(401);
  });
});
