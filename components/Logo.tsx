"use client";

import Image from "next/image";
import { useState } from "react";

// ============================================
// LOGO COMPONENT (Client Component)
// ============================================

interface LogoProps {
  logoUrl?: string | null;
  fallbackText?: string;
  className?: string;
  height?: number;
}

/**
 * Client Component: Displays logo from public folder or URL prop
 * Falls back to text if no logo is found
 * 
 * Logo paths (absolute paths starting with / point to public folder):
 * - logoUrl prop (if provided)
 * - /logo.png (default, in public folder)
 */
export const Logo = ({ 
  logoUrl,
  fallbackText = "DMF",
  className = "",
  height = 48
}: LogoProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Determine logo source: use prop if provided, otherwise use default from public folder
  // IMPORTANT: Path must start with / to point to public folder
  const logoSource = logoUrl && logoUrl.trim() ? logoUrl : "/logo.png";
  
  // Ensure path starts with / for public folder (not relative path)
  const normalizedSource = logoSource.startsWith("/") || logoSource.startsWith("http") 
    ? logoSource 
    : `/${logoSource}`;
  
  // If image error, show fallback text
  if (imageError) {
    return (
      <span className={`text-xl md:text-2xl font-bold tracking-tight text-primary ${className}`}>
        {fallbackText}
      </span>
    );
  }
  
  // Use a reasonable width estimate (adjust based on your logo aspect ratio)
  // Most logos are wider than tall, so we use 2.5x height as default
  const width = Math.round(height * 2.5);
  
  // Check if logoUrl is external URL
  const isExternalUrl = normalizedSource.startsWith("http");
  
  return (
    <div 
      className={`relative flex items-center ${className}`}
      style={{ height: `${height}px`, minWidth: "120px" }}
    >
      <Image
        src={normalizedSource}
        alt="DMF Logo"
        height={height}
        width={width}
        className="object-contain"
        style={{ 
          height: `${height}px`,
          width: "auto",
          maxHeight: `${height}px`
        }}
        priority={true}
        quality={90}
        unoptimized={isExternalUrl}
        onError={() => {
          // If image fails to load, show fallback text
          setImageError(true);
        }}
      />
    </div>
  );
};

