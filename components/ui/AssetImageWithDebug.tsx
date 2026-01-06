"use client";

import Image from "next/image";

/**
 * Client Component: Displays image with optional debug label showing the asset key
 * Used to show which asset key maps to which image on the homepage
 * 
 * To disable debug labels, set NEXT_PUBLIC_SHOW_ASSET_DEBUG=false in .env.local
 * or comment out the showDebug check below
 */
interface AssetImageWithDebugProps {
  src: string | null | undefined; // Image URL (loaded from page.tsx)
  configKey: string; // The asset key for debug label
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
}

export const AssetImageWithDebug = ({
  src,
  configKey,
  alt,
  className = "",
  width,
  height,
  fill = false,
  priority = false,
  quality = 90,
}: AssetImageWithDebugProps) => {
  // Check if debug mode is enabled
  // To disable: set NEXT_PUBLIC_SHOW_ASSET_DEBUG=false in .env.local
  // Or simply change this to: const showDebug = false;
  const showDebug = process.env.NEXT_PUBLIC_SHOW_ASSET_DEBUG !== "false";

  if (!src) {
    return null;
  }

  if (fill) {
    return (
      <div className="relative">
        <Image
          src={src}
          alt={alt}
          fill
          className={className}
          priority={priority}
          quality={quality}
          unoptimized={src.startsWith("http")}
        />
        {showDebug && (
          <span className="absolute top-0 left-0 bg-red-600 text-white text-xs px-2 py-1 z-50 opacity-80 rounded-br">
            {configKey}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <Image
        src={src}
        alt={alt}
        width={width || 800}
        height={height || 600}
        className={className}
        priority={priority}
        quality={quality}
        unoptimized={src.startsWith("http")}
      />
      {showDebug && (
        <span className="absolute top-0 left-0 bg-red-600 text-white text-xs px-2 py-1 z-50 opacity-80 rounded-br">
          {configKey}
        </span>
      )}
    </div>
  );
};

