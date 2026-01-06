import { getSiteConfigByKey } from "@/actions/theme-actions";
import Image from "next/image";

// ============================================
// DYNAMIC ASSET COMPONENT
// ============================================

interface DynamicAssetProps {
  configKey: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
}

/**
 * Server Component: Loads image from site_assets table
 * Falls back to fallbackSrc if asset not found
 */
export const DynamicAsset = async ({
  configKey,
  fallbackSrc,
  alt,
  className,
  width,
  height,
  fill = false,
  priority = false,
  quality = 90,
}: DynamicAssetProps) => {
  const { data: asset } = await getSiteConfigByKey(configKey);
  
  // Get image URL from asset (site_assets uses 'value' column)
  const imageUrl = asset?.value || fallbackSrc;
  
  if (!imageUrl) {
    console.warn(`DynamicAsset: No image found for key "${configKey}" and no fallback provided`);
    return null;
  }

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className={className}
        priority={priority}
        quality={quality}
        unoptimized={imageUrl.startsWith("http")}
      />
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      priority={priority}
      quality={quality}
      unoptimized={imageUrl.startsWith("http")}
    />
  );
};

// ============================================
// DYNAMIC BACKGROUND COMPONENT
// ============================================

interface DynamicBackgroundProps {
  configKey: string;
  fallbackSrc?: string;
  overlayOpacity?: number;
  overlayColor?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Server Component: Loads background image from site_assets table
 * Supports overlay with customizable opacity
 */
export const DynamicBackground = async ({
  configKey,
  fallbackSrc,
  overlayOpacity = 0.4,
  overlayColor = "#000000",
  className = "",
  children,
}: DynamicBackgroundProps) => {
  const { data: asset } = await getSiteConfigByKey(configKey);
  
  // Get image URL from asset (site_assets uses 'value' column)
  const imageUrl = asset?.value || fallbackSrc;
  
  // Get overlay opacity from database if available
  const { data: overlayAsset } = await getSiteConfigByKey(`${configKey}_overlay_opacity`);
  const dbOverlayOpacity = overlayAsset?.value 
    ? parseFloat(overlayAsset.value) 
    : overlayOpacity;

  if (!imageUrl) {
    console.warn(`DynamicBackground: No image found for key "${configKey}" and no fallback provided`);
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={`relative ${className}`}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      {dbOverlayOpacity > 0 && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
            opacity: dbOverlayOpacity,
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// ============================================
// DYNAMIC TEXT COMPONENT
// ============================================

interface DynamicTextProps {
  configKey: string;
  fallbackText: string;
  className?: string;
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "span" | "div";
}

/**
 * Server Component: Loads text from site_assets table
 */
export const DynamicText = async ({
  configKey,
  fallbackText,
  className = "",
  as: Component = "p",
}: DynamicTextProps) => {
  const { data: asset } = await getSiteConfigByKey(configKey);
  const text = asset?.value || fallbackText;

  return <Component className={className}>{text}</Component>;
};

