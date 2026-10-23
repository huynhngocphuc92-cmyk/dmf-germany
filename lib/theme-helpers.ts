import { getSiteConfigByKey } from "@/actions/theme-actions";
import { createPublicClient } from "@/utils/supabase/public";

/**
 * Helper function to validate if a string is a valid image URL/path
 * Supports:
 * - Relative paths: "/uploads/image.jpg"
 * - Absolute URLs: "http://..." or "https://..."
 * - Supabase Storage URLs: "https://*.supabase.co/storage/v1/object/public/..."
 */
function isValidImagePath(value: string | null | undefined): boolean {
  if (!value || typeof value !== "string") return false;

  // Check if it starts with "/" (relative path)
  if (value.startsWith("/")) return true;

  // Check if it starts with "http://" or "https://" (absolute URL)
  if (value.startsWith("http://") || value.startsWith("https://")) return true;

  // Additional check: Supabase Storage URLs (should already be https://, but double-check)
  if (value.includes("supabase.co") && value.includes("storage")) return true;

  return false;
}

/**
 * Helper function to load multiple assets at once in a single batched query
 * Returns a map of key -> value for easy access
 * IMPORTANT: Only returns valid image URLs, filters out key strings
 */
export async function loadAssets(keys: string[]): Promise<Record<string, string | null>> {
  const assets: Record<string, string | null> = {};
  for (const key of keys) {
    assets[key] = null;
  }

  if (keys.length === 0) {
    return assets;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_assets")
      .select("key, value, asset_type")
      .in("key", keys);

    if (error || !data) {
      if (error) {
        console.error("[loadAssets] Error fetching site assets:", error);
      }
      return assets;
    }

    for (const asset of data) {
      const key = asset.key as string;
      const value = (asset.value as string | null) || null;
      const assetType = (asset.asset_type as string | null) || null;

      // CRITICAL: If value is the key itself (invalid), return null instead
      if (value === key) {
        console.warn(
          `[loadAssets] ⚠️ Asset key "${key}" has value equal to key itself. This is invalid. Returning null.`
        );
        assets[key] = null;
        continue;
      }

      // For keys that end with "_img", they are definitely image assets
      const isImageKey =
        key.toLowerCase().endsWith("_img") ||
        key.toLowerCase().includes("image") ||
        key.toLowerCase().includes("logo");

      if (isImageKey && value) {
        if (!isValidImagePath(value)) {
          console.warn(
            `[loadAssets] ⚠️ Image asset "${key}" has invalid path: "${value}". Expected URL starting with /, http://, or https://. Returning null.`
          );
          assets[key] = null;
          continue;
        }
      }

      // Also validate if asset_type is explicitly IMAGE
      if (assetType?.toUpperCase() === "IMAGE" && value) {
        if (!isValidImagePath(value)) {
          console.warn(
            `[loadAssets] ⚠️ Asset "${key}" (type: IMAGE) has invalid image path: "${value}". Expected URL starting with /, http://, or https://. Returning null.`
          );
          assets[key] = null;
          continue;
        }
      }

      assets[key] = value;
    }
  } catch (err) {
    console.error("[loadAssets] Unexpected error:", err);
  }

  return assets;
}

/**
 * Get a single asset value
 * IMPORTANT: Only returns valid image URLs, filters out key strings
 */
export async function getAssetValue(key: string): Promise<string | null> {
  const { data: asset } = await getSiteConfigByKey(key);
  // site_assets table uses 'value' column
  const value = asset?.value || null;

  // CRITICAL: If value is the key itself (invalid), return null instead
  if (value === key) {
    console.warn(
      `[getAssetValue] Asset key "${key}" has value equal to key itself. This is invalid. Returning null.`
    );
    return null;
  }

  // For keys that end with "_img", they are definitely image assets
  // Validate that the value is a valid URL/path, regardless of asset_type in database
  const isImageKey = key.toLowerCase().endsWith("_img") || key.toLowerCase().includes("image");

  if (isImageKey && value) {
    if (!isValidImagePath(value)) {
      console.warn(
        `[getAssetValue] Image asset "${key}" has invalid path: "${value}". Expected URL starting with /, http://, or https://. Returning null.`
      );
      return null;
    }
  }

  // Also validate if asset_type is explicitly IMAGE
  if (asset?.asset_type?.toUpperCase() === "IMAGE" && value) {
    if (!isValidImagePath(value)) {
      console.warn(
        `[getAssetValue] Asset "${key}" (type: IMAGE) has invalid image path: "${value}". Expected URL starting with /, http://, or https://. Returning null.`
      );
      return null;
    }
  }

  return value;
}
