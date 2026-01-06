import Image from "next/image";
import { getSiteConfigByKey } from "@/actions/theme-actions";
import { cn } from "@/lib/utils";

// ============================================
// DYNAMIC IMAGE - Server Component
// ============================================

interface DynamicImageProps {
  /** Key in site_config table, e.g., 'home_hero_bg' */
  configKey: string;
  /** Fallback image URL if database has no value */
  fallbackSrc: string;
  /** Alt text for accessibility */
  alt: string;
  /** Image width (required for Next/Image optimization) */
  width?: number;
  /** Image height (required for Next/Image optimization) */
  height?: number;
  /** Use fill mode instead of fixed dimensions */
  fill?: boolean;
  /** CSS class names */
  className?: string;
  /** Image priority (preload for LCP) */
  priority?: boolean;
  /** Object-fit style */
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  /** Image quality (1-100) */
  quality?: number;
  /** Image sizes for responsive loading */
  sizes?: string;
  /** Placeholder blur effect */
  placeholder?: "blur" | "empty";
  /** Blur data URL for placeholder */
  blurDataURL?: string;
}

/**
 * DynamicImage - A Server Component that fetches image URL from database
 * 
 * Usage:
 * ```tsx
 * <DynamicImage
 *   configKey="home_hero_bg"
 *   fallbackSrc="/images/default-hero.jpg"
 *   alt="Hero Background"
 *   fill
 *   className="object-cover"
 * />
 * ```
 */
export async function DynamicImage({
  configKey,
  fallbackSrc,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  objectFit = "cover",
  quality = 85,
  sizes,
  placeholder,
  blurDataURL,
}: DynamicImageProps) {
  // Fetch image URL from database
  const { data: config } = await getSiteConfigByKey(configKey);
  
  // Use database value if available, otherwise fallback (site_assets uses 'value' column)
  const imageSrc = config?.value || fallbackSrc;

  // Determine if image is external (Supabase storage)
  const isExternal = imageSrc.startsWith("http");

  // Common image styles
  const imageStyles = cn(
    objectFit === "cover" && "object-cover",
    objectFit === "contain" && "object-contain",
    objectFit === "fill" && "object-fill",
    className
  );

  // Fill mode (for backgrounds, hero images)
  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={imageStyles}
        priority={priority}
        quality={quality}
        sizes={sizes || "100vw"}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        unoptimized={isExternal}
      />
    );
  }

  // Fixed dimensions mode
  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={imageStyles}
      priority={priority}
      quality={quality}
      sizes={sizes}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      unoptimized={isExternal}
    />
  );
}

// ============================================
// DYNAMIC BACKGROUND - For CSS background-image
// ============================================

interface DynamicBackgroundProps {
  configKey: string;
  fallbackSrc: string;
  children: React.ReactNode;
  className?: string;
  overlay?: boolean;
  overlayClassName?: string;
}

/**
 * DynamicBackground - Wrapper with dynamic background image
 * 
 * Usage:
 * ```tsx
 * <DynamicBackground
 *   configKey="home_hero_bg"
 *   fallbackSrc="/images/default-hero.jpg"
 *   overlay
 *   className="min-h-screen"
 * >
 *   <h1>Content here</h1>
 * </DynamicBackground>
 * ```
 */
export async function DynamicBackground({
  configKey,
  fallbackSrc,
  children,
  className,
  overlay = false,
  overlayClassName,
}: DynamicBackgroundProps) {
  const { data: config } = await getSiteConfigByKey(configKey);
  // site_assets uses 'value' column
  const imageSrc = config?.value || fallbackSrc;

  return (
    <div
      className={cn("relative bg-cover bg-center bg-no-repeat", className)}
      style={{ backgroundImage: `url('${imageSrc}')` }}
    >
      {overlay && (
        <div
          className={cn(
            "absolute inset-0 bg-black/50",
            overlayClassName
          )}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default DynamicImage;

