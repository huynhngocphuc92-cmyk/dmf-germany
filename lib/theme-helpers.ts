import { getSiteConfigByKey } from "@/actions/theme-actions";

/**
 * Helper function to load multiple assets at once
 * Returns a map of key -> value for easy access
 */
export async function loadAssets(keys: string[]): Promise<Record<string, string | null>> {
  const assets: Record<string, string | null> = {};
  
  await Promise.all(
    keys.map(async (key) => {
      const { data: asset } = await getSiteConfigByKey(key);
      // site_assets table uses 'value' column
      assets[key] = asset?.value || null;
    })
  );
  
  return assets;
}

/**
 * Get a single asset value
 */
export async function getAssetValue(key: string): Promise<string | null> {
  const { data: asset } = await getSiteConfigByKey(key);
  // site_assets table uses 'value' column
  return asset?.value || null;
}

