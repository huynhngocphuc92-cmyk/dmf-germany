import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { DeferredSalarySimulator } from "@/components/performance/DeferredSalarySimulator";
import { HeroSection } from "@/components/sections/HeroSection";

const mock = vi.hoisted(() => ({ assets: vi.fn(), candidates: vi.fn() }));
vi.mock("@/lib/theme-helpers", () => ({ loadAssets: mock.assets }));
vi.mock("@/lib/supabase/candidates", () => ({ getHomepageFeaturedCandidates: mock.candidates }));
vi.mock("@/app/home-client", () => ({ HomeClient: () => null }));
import Home, { dynamic } from "@/app/page";

describe("homepage critical path", () => {
  it("renders the hero visibly and prioritizes its full-width background without lazy loading", () => {
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <HeroSection heroBg="/hero-fixture.webp" />
      </LanguageProvider>
    );
    const heading = html.match(/<h1\b[^>]*>.*?<\/h1>/)?.[0];
    expect(heading).toBeDefined();
    expect(heading).not.toContain("opacity:0");
    const image = html.match(/<img\b[^>]*>/)?.[0];
    expect(image).toContain('fetchPriority="high"');
    expect(image).toContain('loading="eager"');
    expect(image).toContain('sizes="100vw"');
  });

  it("starts candidates while assets are still pending and retains request-time rendering", async () => {
    let resolveAssets!: (assets: Record<string, string | null>) => void;
    mock.assets.mockReturnValue(
      new Promise((resolve) => {
        resolveAssets = resolve;
      })
    );
    mock.candidates.mockResolvedValue({ data: [], error: null });
    const page = Home();
    expect(mock.assets).toHaveBeenCalledOnce();
    expect(mock.candidates).toHaveBeenCalledOnce();
    expect(dynamic).toBe("force-dynamic");
    resolveAssets({});
    await expect(page).resolves.toBeDefined();
  });

  it("server-renders a named salary section and truthful disclaimer before loading the tool", () => {
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <DeferredSalarySimulator />
      </LanguageProvider>
    );
    expect(html).toContain('id="salary-calculator"');
    expect(html).toContain("<h2");
    expect(html).toContain("Historische Brutto-Beispielwerte (2024/2025)");
    expect(html).toContain('type="button"');
    expect(html).toContain("min-h-[1050px]");
    expect(html).not.toContain("opacity:0");
  });
});
