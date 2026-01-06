import { DynamicImage, DynamicBackground } from "@/components/ui/DynamicImage";

// ============================================
// HERO BANNER - Server Component with Dynamic Image
// ============================================

/**
 * Example usage of DynamicImage in a Server Component
 * This component demonstrates how to use dynamic images from the database
 * 
 * To use this:
 * 1. Add a config entry in site_config table with key "home_hero_banner"
 * 2. Import and use this component in your page
 */

interface HeroBannerProps {
  children?: React.ReactNode;
  className?: string;
  overlay?: boolean;
}

export async function HeroBanner({
  children,
  className = "min-h-[60vh]",
  overlay = true,
}: HeroBannerProps) {
  return (
    <DynamicBackground
      configKey="home_hero_banner"
      fallbackSrc="/images/hero-placeholder.jpg"
      className={className}
      overlay={overlay}
      overlayClassName="bg-gradient-to-b from-black/60 via-black/40 to-black/70"
    >
      {children}
    </DynamicBackground>
  );
}

/**
 * Simple Hero Image component
 * Use this when you just need an image, not a background
 */
interface HeroImageProps {
  configKey?: string;
  alt?: string;
  className?: string;
  priority?: boolean;
}

export async function HeroImage({
  configKey = "home_hero_image",
  alt = "Hero Image",
  className = "rounded-xl shadow-2xl",
  priority = true,
}: HeroImageProps) {
  return (
    <div className="relative aspect-video overflow-hidden">
      <DynamicImage
        configKey={configKey}
        fallbackSrc="/images/hero-placeholder.jpg"
        alt={alt}
        fill
        className={className}
        priority={priority}
        objectFit="cover"
      />
    </div>
  );
}

export default HeroBanner;

