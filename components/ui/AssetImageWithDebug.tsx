"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";

/**
 * Client Component: Displays image with optional debug label showing the asset key
 * Used to show which asset key maps to which image on the homepage
 *
 * To disable debug labels, set NEXT_PUBLIC_SHOW_ASSET_DEBUG=false in .env.local
 * or comment out the showDebug check below
 */

// Helper function to validate if a string is a valid image URL/path
// Supports:
// - Relative paths: "/uploads/image.jpg"
// - Absolute URLs: "http://..." or "https://..."
// - Supabase Storage URLs: "https://*.supabase.co/storage/v1/object/public/..."
const isValidImagePath = (value: string | null | undefined): boolean => {
  if (!value || typeof value !== "string") return false;

  // Check if it starts with "/" (relative path)
  if (value.startsWith("/")) return true;

  // Check if it starts with "http://" or "https://" (absolute URL)
  if (value.startsWith("http://") || value.startsWith("https://")) return true;

  // Additional check: Supabase Storage URLs (should already be https://, but double-check)
  if (value.includes("supabase.co") && value.includes("storage")) return true;

  return false;
};

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
  fallbackClassName?: string; // Custom className for fallback UI
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
  fallbackClassName = "",
}: AssetImageWithDebugProps) => {
  // Check if debug mode is enabled
  // To disable: set NEXT_PUBLIC_SHOW_ASSET_DEBUG=false in .env.local
  // Or simply change this to: const showDebug = false;
  // TEMPORARILY DISABLED: Hide debug labels to prevent confusion
  const showDebug = false; // process.env.NEXT_PUBLIC_SHOW_ASSET_DEBUG !== "false";

  // Validate image path before rendering
  if (!src || !isValidImagePath(src)) {
    // Return fallback UI instead of crashing
    return (
      <div
        className={`relative bg-slate-100 flex items-center justify-center ${fill ? "w-full h-full" : ""} ${fallbackClassName}`}
      >
        <div className="flex flex-col items-center gap-2 text-slate-400 p-4">
          <ImageIcon size={24} className="opacity-50" />
          <span className="text-xs text-center">{src ? "Invalid image path" : "No image"}</span>
          {showDebug && src && (
            <span className="text-[10px] font-mono text-slate-300 truncate max-w-full px-2">
              {src}
            </span>
          )}
          {showDebug && (
            <span className="text-[10px] font-mono text-slate-400 bg-slate-200 px-2 py-1 rounded mt-1">
              Key: {configKey}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className={className}
          priority={priority}
          quality={quality}
          // For Supabase Storage URLs, use unoptimized to avoid 400 errors
          unoptimized={src.includes("supabase.co") || src.startsWith("http")}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
