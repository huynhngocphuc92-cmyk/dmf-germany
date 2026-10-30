import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { isOptimizablePublicImage } from "@/lib/images/optimization";
import { AssetImageWithDebug } from "@/components/ui/AssetImageWithDebug";
import { Logo } from "@/components/Logo";
const image = "https://fixture.supabase.co/storage/v1/object/public/images/photo.jpg";
it("optimizes public raster images and local public files", () => {
  expect(isOptimizablePublicImage(image)).toBe(true);
  expect(isOptimizablePublicImage("/images/logo.png")).toBe(true);
});
it("keeps signed/private/unknown image URLs outside the shared optimizer", () => {
  for (const value of [
    image + "?token=not-a-real-token",
    "https://fixture.supabase.co/storage/v1/object/sign/private/photo.jpg?token=fixture",
    "https://fixture.supabase.co/storage/v1/object/authenticated/private/photo.jpg",
    "https://fixture.supabase.co.evil.invalid/storage/v1/object/public/images/photo.jpg",
    "https://unknown.example.invalid/photo.jpg",
    "http://fixture.supabase.co/storage/v1/object/public/images/photo.jpg",
    "//fixture.supabase.co/storage/v1/object/public/images/photo.jpg",
    "/api/portal/asset.jpg",
    "/portal/private.jpg",
    "/images/../api/private.jpg",
    "/images/photo.jpg?token=fixture",
    "blob:fixture",
    "/images/animation.gif",
    "/images/logo.svg",
  ])
    expect(isOptimizablePublicImage(value), value).toBe(false);
});
it("renders responsive optimized public service images while retaining direct signed sources", () => {
  const publicHtml = renderToStaticMarkup(
    <AssetImageWithDebug src={image} configKey="test" alt="Public service" fill />
  );
  expect(publicHtml).toContain("/_next/image?");
  expect(publicHtml).toContain("srcSet=");
  const privateHtml = renderToStaticMarkup(
    <AssetImageWithDebug
      src={image + "?token=fixture"}
      configKey="test"
      alt="Private preview"
      fill
    />
  );
  expect(privateHtml).not.toContain("/_next/image?");
});
it("serves the public header logo at responsive sizes instead of its multi-megapixel original", () => {
  expect(renderToStaticMarkup(<Logo logoUrl={image} />)).toContain("/_next/image?");
});
