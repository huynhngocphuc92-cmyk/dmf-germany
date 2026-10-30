import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SiteConfigItem } from "@/types/theme";

vi.mock("@/actions/theme-actions", () => ({ getSiteConfigsByKeys: vi.fn() }));
import { getSiteConfigsByKeys } from "@/actions/theme-actions";
import { GET } from "@/app/api/logo/route";

const getConfigs = vi.mocked(getSiteConfigsByKeys);
const logoKeys = ["site_logo", "header_logo", "logo_url"];
const row = (
  key: string,
  value: string | null
): Pick<SiteConfigItem, "key" | "value" | "asset_type"> => ({
  key,
  value,
  asset_type: "image",
});

beforeEach(() => {
  getConfigs.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => vi.restoreAllMocks());

describe("logo API contract", () => {
  it.each([
    {
      name: "site logo wins over unordered lower priorities",
      data: [
        row("logo_url", "/legacy.svg"),
        row("header_logo", "/header.svg"),
        row("site_logo", "/site.svg"),
      ],
      expected: "/site.svg",
    },
    {
      name: "header logo wins when site logo is missing",
      data: [row("logo_url", "/legacy.svg"), row("header_logo", "/header.svg")],
      expected: "/header.svg",
    },
    {
      name: "empty site logo falls back to header logo",
      data: [row("header_logo", "/header.svg"), row("site_logo", "")],
      expected: "/header.svg",
    },
    {
      name: "null site logo falls back to header logo",
      data: [row("site_logo", null), row("header_logo", "/header.svg")],
      expected: "/header.svg",
    },
    {
      name: "empty and null higher priorities fall back to legacy logo",
      data: [row("logo_url", "/legacy.svg"), row("header_logo", null), row("site_logo", "")],
      expected: "/legacy.svg",
    },
    {
      name: "missing higher priorities fall back to legacy logo",
      data: [row("logo_url", "/legacy.svg")],
      expected: "/legacy.svg",
    },
    {
      name: "truthy values are preserved without trimming or validation",
      data: [row("site_logo", " "), row("header_logo", "/header.svg")],
      expected: " ",
    },
    {
      name: "all empty or null values yield null",
      data: [row("site_logo", null), row("header_logo", ""), row("logo_url", "")],
      expected: null,
    },
    { name: "all absent rows yield null", data: [], expected: null },
    { name: "null data yields null", data: null, expected: null },
  ])("$name", async ({ data, expected }) => {
    getConfigs.mockResolvedValue({ data, error: null });

    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(await response.json()).toEqual({ logoUrl: expected });
    expect(getConfigs).toHaveBeenCalledExactlyOnceWith(logoKeys);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("swallows a returned backend error with the existing successful null response", async () => {
    getConfigs.mockResolvedValue({ data: null, error: "backend failure fixture" });

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ logoUrl: null });
    expect(getConfigs).toHaveBeenCalledExactlyOnceWith(logoKeys);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("preserves the generic 500 response and existing logging for unexpected throws", async () => {
    const error = new Error("unexpected failure fixture");
    getConfigs.mockRejectedValue(error);

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ logoUrl: null, error: "Failed to fetch logo" });
    expect(getConfigs).toHaveBeenCalledExactlyOnceWith(logoKeys);
    expect(console.error).toHaveBeenCalledExactlyOnceWith("[Logo API] Error fetching logo:", error);
  });

  it("reads changed values on repeated GET calls without a cross-request cache", async () => {
    getConfigs
      .mockResolvedValueOnce({ data: [row("site_logo", "/old.svg")], error: null })
      .mockResolvedValueOnce({ data: [row("site_logo", "/new.svg")], error: null });

    const first = await GET();
    const second = await GET();

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(await first.json()).toEqual({ logoUrl: "/old.svg" });
    expect(await second.json()).toEqual({ logoUrl: "/new.svg" });
    expect(getConfigs).toHaveBeenCalledTimes(2);
    expect(getConfigs).toHaveBeenNthCalledWith(1, logoKeys);
    expect(getConfigs).toHaveBeenNthCalledWith(2, logoKeys);
  });
});
