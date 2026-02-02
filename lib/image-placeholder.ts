/**
 * Image Placeholder Utilities
 *
 * Provides blur placeholders for Next.js Image optimization.
 * For dynamically loaded images (user uploads, external URLs),
 * we use a shimmer effect or generic blur data URL.
 */

// Tiny SVG shimmer placeholder (300 bytes base64)
// Creates a subtle shimmer animation effect while image loads
const shimmerSVG = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f1f5f9" />
      <stop offset="50%" stop-color="#e2e8f0" />
      <stop offset="100%" stop-color="#f1f5f9" />
    </linearGradient>
  </defs>
  <rect fill="url(#g)" width="${w}" height="${h}" />
</svg>`;

// Convert SVG to base64 data URL
const toBase64 = (str: string) =>
  typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str);

/**
 * Generate a shimmer placeholder data URL
 * @param w Width of the placeholder
 * @param h Height of the placeholder
 */
export const shimmerPlaceholder = (w: number = 700, h: number = 475) =>
  `data:image/svg+xml;base64,${toBase64(shimmerSVG(w, h))}`;

// Pre-generated blur placeholder for common aspect ratios
// These are tiny (< 100 bytes) gray placeholders

// 1:1 Square (avatars, icons)
export const BLUR_SQUARE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23e2e8f0' width='40' height='40'/%3E%3C/svg%3E";

// 16:9 Landscape (blog covers, hero images)
export const BLUR_LANDSCAPE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='90'%3E%3Crect fill='%23e2e8f0' width='160' height='90'/%3E%3C/svg%3E";

// 4:3 Standard (cards, thumbnails)
export const BLUR_STANDARD =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='90'%3E%3Crect fill='%23e2e8f0' width='120' height='90'/%3E%3C/svg%3E";

// 3:4 Portrait (candidate photos)
export const BLUR_PORTRAIT =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='120'%3E%3Crect fill='%23e2e8f0' width='90' height='120'/%3E%3C/svg%3E";

// Default blur for any use
export const BLUR_DEFAULT = BLUR_LANDSCAPE;
