import Image from "next/image";

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
 * Client Component: Displays logo from URL prop
 * Falls back to text if no logo URL is provided
 */
export const Logo = ({ 
  logoUrl,
  fallbackText = "DMF Vietnam",
  className = "",
  height = 50
}: LogoProps) => {
  // If logo exists, show image
  if (logoUrl) {
    // Use a reasonable width estimate (adjust based on your logo aspect ratio)
    // Most logos are wider than tall, so we use 2.5x height as default
    const width = Math.round(height * 2.5);
    
    return (
      <div 
        className={`flex items-center ${className}`} 
        style={{ height: `${height}px` }}
      >
        <Image
          src={logoUrl}
          alt="DMF Vietnam Logo"
          height={height}
          width={width}
          className="h-full w-auto object-contain max-h-full"
          style={{ maxHeight: `${height}px` }}
          priority={true}
          quality={90}
          unoptimized={logoUrl.startsWith("http")}
        />
      </div>
    );
  }

  // Fallback to text
  return (
    <span className={`text-xl md:text-2xl font-bold tracking-tight text-primary ${className}`}>
      {fallbackText}
    </span>
  );
};

