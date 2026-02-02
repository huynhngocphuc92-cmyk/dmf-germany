/**
 * YouTube URL Utilities
 * Converts various YouTube URL formats to embed URLs
 * Uses youtube-nocookie.com for better privacy compliance (DSGVO/GDPR)
 */

/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  // Remove whitespace
  const cleanUrl = url.trim();

  // Pattern 1: youtube.com/watch?v=VIDEO_ID or youtube.com/embed/VIDEO_ID
  const watchPattern =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = cleanUrl.match(watchPattern);

  if (match && match[1]) {
    return match[1];
  }

  return null;
}

/**
 * Convert YouTube URL to embed URL using youtube-nocookie.com
 * Returns null if URL is not a valid YouTube URL
 *
 * @param url - YouTube URL in any format
 * @returns Embed URL or null if invalid
 *
 * @example
 * getEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
 * // Returns: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'
 */
export function getEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);

  if (!videoId) {
    return null;
  }

  // Use youtube-nocookie.com for better privacy compliance (DSGVO/GDPR)
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

/**
 * Get YouTube thumbnail URL from video ID or URL
 * Returns one of YouTube's thumbnail URLs (maxresdefault, hqdefault, etc.)
 */
export function getYouTubeThumbnail(
  url: string,
  quality: "maxresdefault" | "hqdefault" | "mqdefault" | "sddefault" = "hqdefault"
): string | null {
  const videoId = typeof url === "string" && url.length === 11 ? url : extractYouTubeVideoId(url);

  if (!videoId) {
    return null;
  }

  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}
