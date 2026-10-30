/** Only known public images may enter the shared Next.js optimizer cache. */
export function isOptimizablePublicImage(source: string): boolean {
  if (source.startsWith("//")) return false;
  try {
    const local = source.startsWith("/") && !source.startsWith("//");
    const url = new URL(source, "https://local-image.invalid");
    if (url.username || url.password || url.search || url.hash) return false;
    if (!/\.(?:png|jpe?g|webp|avif)$/i.test(url.pathname)) return false;
    if (local) return !/^\/(?:api|admin|portal)(?:\/|$)/i.test(url.pathname);
    return (
      url.protocol === "https:" &&
      !url.port &&
      url.hostname.endsWith(".supabase.co") &&
      url.pathname.startsWith("/storage/v1/object/public/")
    );
  } catch {
    return false;
  }
}
