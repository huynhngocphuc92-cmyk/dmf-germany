import { beforeEach, describe, expect, it, vi } from "vitest";

const mock = vi.hoisted(() => ({ from: vi.fn(), select: vi.fn(), in: vi.fn() }));
vi.mock("@/utils/supabase/public", () => ({ createPublicClient: () => ({ from: mock.from }) }));
vi.mock("@/lib/auth/admin", () => ({ createAdminClient: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
import { loadAssets } from "@/lib/theme-helpers";
import { getSiteConfigsByKeys } from "@/actions/theme-actions";

beforeEach(() => {
  mock.from.mockReturnValue({ select: mock.select });
  mock.select.mockReturnValue({ in: mock.in });
  mock.in.mockResolvedValue({ data: [], error: null });
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

describe("batched optional public assets", () => {
  it("loads the nine homepage keys with one narrow query, deduplicating input keys", async () => {
    const keys = [
      "home_hero_bg",
      "home_hero_overlay_opacity",
      "home_partner_banner",
      "home_intro_img",
      "home_intro_video_thumb",
      "home_prog_nursing_img",
      "home_prog_tech_img",
      "home_prog_hotel_img",
      "home_cta_bg",
    ];
    mock.in.mockResolvedValue({
      data: [{ key: "home_hero_bg", value: "/hero.webp", asset_type: "image" }],
      error: null,
    });
    const result = await loadAssets([...keys, keys[0]]);
    expect(mock.from).toHaveBeenCalledExactlyOnceWith("site_assets");
    expect(mock.select).toHaveBeenCalledExactlyOnceWith("key,value,asset_type");
    expect(mock.in).toHaveBeenCalledExactlyOnceWith("key", [...keys].sort());
    expect(result.home_hero_bg).toBe("/hero.webp");
    expect(result.home_intro_img).toBeNull();
    expect(Object.keys(result)).toHaveLength(9);
  });

  it("preserves valid paths and text, rejecting invalid image values and key echoes", async () => {
    mock.in.mockResolvedValue({
      data: [
        { key: "local_img", value: "/local.webp" },
        { key: "remote_img", value: "https://example.com/image.webp" },
        { key: "invalid_img", value: "invalid" },
        { key: "typed_bg", value: "invalid", asset_type: "IMAGE" },
        { key: "echo", value: "echo" },
        { key: "empty_img", value: null },
        { key: "opacity", value: "0.75", asset_type: "text" },
      ],
      error: null,
    });
    expect(
      await loadAssets([
        "local_img",
        "remote_img",
        "invalid_img",
        "typed_bg",
        "echo",
        "empty_img",
        "opacity",
        "missing",
      ])
    ).toEqual({
      local_img: "/local.webp",
      remote_img: "https://example.com/image.webp",
      invalid_img: null,
      typed_bg: null,
      echo: null,
      empty_img: null,
      opacity: "0.75",
      missing: null,
    });
  });

  it("handles a successful null result and skips empty key sets", async () => {
    expect(await loadAssets([])).toEqual({});
    expect(mock.from).not.toHaveBeenCalled();
    mock.in.mockResolvedValue({ data: null, error: null });
    expect(await loadAssets(["missing"])).toEqual({ missing: null });
  });

  it("reports query errors, even without an error code, and ignores partial data", async () => {
    mock.in.mockResolvedValue({
      data: [{ key: "hero_img", value: "/ignore.webp" }],
      error: { message: "fixture failure" },
    });
    expect(await getSiteConfigsByKeys(["hero_img"])).toEqual({
      data: null,
      error: "fixture failure",
    });
    expect(await loadAssets(["hero_img"])).toEqual({ hero_img: null });
    expect(console.error).toHaveBeenCalled();
  });

  it("falls back for optional CMS transport failures without retrying per key", async () => {
    mock.in.mockRejectedValue(new Error("offline fixture"));
    expect(await loadAssets(["one_img", "two_img"])).toEqual({ one_img: null, two_img: null });
    expect(mock.from).toHaveBeenCalledOnce();
  });

  it("reads again on separate calls outside a React request cache scope", async () => {
    mock.in.mockResolvedValueOnce({ data: [{ key: "hero_img", value: "/old.webp" }], error: null });
    mock.in.mockResolvedValueOnce({ data: [{ key: "hero_img", value: "/new.webp" }], error: null });
    expect((await loadAssets(["hero_img"])).hero_img).toBe("/old.webp");
    expect((await loadAssets(["hero_img"])).hero_img).toBe("/new.webp");
    expect(mock.from).toHaveBeenCalledTimes(2);
  });
});
