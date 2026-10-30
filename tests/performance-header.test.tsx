import { beforeEach, expect, it, vi } from "vitest";
const query = vi.hoisted(() => vi.fn());
vi.mock("@/actions/theme-actions", () => ({ getSiteConfigsByKeys: query }));
vi.mock("@/components/Header", () => ({ Header: () => null }));
import { HeaderWrapper } from "@/components/HeaderWrapper";
beforeEach(() => query.mockReset());
it("loads all branding in one query and preserves primary logo priority", async () => {
  query.mockResolvedValue({
    data: [
      { key: "header_logo", value: "/secondary.webp" },
      { key: "site_logo", value: "/primary.webp" },
      { key: "header_hotline", value: "+49 30 1234567" },
      { key: "contact_email", value: "office@example.invalid" },
    ],
    error: null,
  });
  const result = await HeaderWrapper();
  expect(result.props).toEqual({
    logoUrl: "/primary.webp",
    hotline: "+49 30 1234567",
    email: "office@example.invalid",
  });
  expect(query).toHaveBeenCalledExactlyOnceWith([
    "site_logo",
    "header_logo",
    "logo_url",
    "header_hotline",
    "contact_email",
  ]);
});
it("uses the next configured logo when the preferred key is absent", async () => {
  query.mockResolvedValue({ data: [{ key: "logo_url", value: "/legacy.webp" }], error: null });
  expect((await HeaderWrapper()).props).toEqual({
    logoUrl: "/legacy.webp",
    hotline: null,
    email: null,
  });
});
it("keeps default header available when the optional branding query fails", async () => {
  query.mockResolvedValue({
    data: [{ key: "site_logo", value: "/ignore.webp" }],
    error: "unavailable",
  });
  expect((await HeaderWrapper()).props).toEqual({ logoUrl: null, hotline: null, email: null });
});
