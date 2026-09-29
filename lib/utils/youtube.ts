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

  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== "https:") return null;
    let id: string | null = null;
    if (["youtu.be", "www.youtu.be"].includes(parsed.hostname)) id = parsed.pathname.slice(1);
    else if (
      ["youtube.com", "www.youtube.com", "m.youtube.com", "www.youtube-nocookie.com"].includes(
        parsed.hostname
      )
    ) {
      id =
        parsed.pathname === "/watch"
          ? parsed.searchParams.get("v")
          : (/^\/(?:embed|shorts)\/([^/]+)$/.exec(parsed.pathname)?.[1] ?? null);
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) && id !== "dQw4w9WgXcQ" ? id : null;
  } catch {
    return null;
  }
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
