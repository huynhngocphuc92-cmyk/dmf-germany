export const PUBLIC_MEDIA_BASE_URL = (
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL || "https://media.dmf-talents.de"
).replace(/\/+$/, "");

const HANDBUCH_PATHS = new Set(["/DMF Vietnam Handbuch.pdf", "/DMF%20Vietnam%20Handbuch.pdf"]);

export function getPublicMediaUrl(assetPath: string): string {
  const trimmed = assetPath.trim();
  if (!trimmed) return assetPath;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (HANDBUCH_PATHS.has(normalized)) {
    return `${PUBLIC_MEDIA_BASE_URL}/DMF-Vietnam-Handbuch.pdf`;
  }

  if (
    normalized.startsWith("/candidates/videos/") ||
    normalized.startsWith("/candidates/dossiers/")
  ) {
    return `${PUBLIC_MEDIA_BASE_URL}${normalized}`;
  }

  return assetPath;
}
