import { getSiteConfigByKey } from "@/actions/theme-actions";

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
 * Helper function to load multiple assets at once
 * Returns a map of key -> value for easy access
 * IMPORTANT: Only returns valid image URLs, filters out key strings
 */
export async function loadAssets(keys: string[]): Promise<Record<string, string | null>> {
  const assets: Record<string, string | null> = {};

  await Promise.all(
    keys.map(async (key) => {
      const { data: asset } = await getSiteConfigByKey(key);
      // site_assets table uses 'value' column
      const value = asset?.value || null;

      // DEBUG: Log raw data from database
      console.log(`[loadAssets] 🔍 Key: "${key}"`, {
        value: value,
        asset_type: asset?.asset_type,
        hasValue: !!value,
        valueType: typeof value,
        valueLength: value?.length,
      });

      // CRITICAL: If value is the key itself (invalid), return null instead
      // This prevents passing key strings like "home_prog_nursing_img" to Image components
      if (value === key) {
        console.warn(
          `[loadAssets] ⚠️ Asset key "${key}" has value equal to key itself. This is invalid. Returning null.`
        );
        assets[key] = null;
        return;
      }

      // For keys that end with "_img", they are definitely image assets
      // Validate that the value is a valid URL/path, regardless of asset_type in database
      const isImageKey = key.toLowerCase().endsWith("_img") || key.toLowerCase().includes("image");

      if (isImageKey && value) {
        if (!isValidImagePath(value)) {
          console.warn(
            `[loadAssets] ⚠️ Image asset "${key}" has invalid path: "${value}". Expected URL starting with /, http://, or https://. Returning null.`
          );
          assets[key] = null;
          return;
        } else {
          console.log(`[loadAssets] ✅ Image asset "${key}" has valid URL: "${value}"`);
        }
      }

      // Also validate if asset_type is explicitly IMAGE
      if (asset?.asset_type?.toUpperCase() === "IMAGE" && value) {
        if (!isValidImagePath(value)) {
          console.warn(
            `[loadAssets] ⚠️ Asset "${key}" (type: IMAGE) has invalid image path: "${value}". Expected URL starting with /, http://, or https://. Returning null.`
          );
          assets[key] = null;
          return;
        } else {
          console.log(`[loadAssets] ✅ Asset "${key}" (type: IMAGE) has valid URL: "${value}"`);
        }
      }

      assets[key] = value;
    })
  );

  console.log(`[loadAssets] 📦 Final assets object:`, assets);
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
