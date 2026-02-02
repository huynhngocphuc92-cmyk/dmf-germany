"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { SiteConfigItem, SiteConfigGrouped, ThemeSection } from "@/types/theme";

// ============================================
// AUTH HELPER
// ============================================

/**
 * Verify user is authenticated before performing admin actions
 * Returns user object if authenticated, throws error if not
 */
async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized: Authentication required");
  }

  return user;
}

// ============================================
// GET SITE CONFIGS
// ============================================

/**
 * Fetches all site assets from database
 * Note: Uses table 'site_assets' (not 'site_config')
 * IMPORTANT: No cache - always fetch fresh data from database
 * This function is called directly without caching to ensure latest data
 */
async function fetchSiteConfigs(): Promise<SiteConfigItem[]> {
  const supabase = await createClient();

  // Fetch directly without any caching wrapper
  // Next.js will not cache this by default in Server Actions
  const { data, error } = await supabase
    .from("site_assets")
    .select("*")
    .order("section", { ascending: true })
    .order("label", { ascending: true });

  if (error) {
    console.error("Error fetching site assets:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return [];
  }

  console.log(`Fetched ${data?.length || 0} assets from site_assets table (no cache)`);

  // Normalize data for backward compatibility
  // Keep DB section names as-is (branding, home, contact, settings)
  // UI will map these to display tabs

  return (data || []).map((item: Record<string, unknown>) => {
    return {
      ...item,
      // Keep section from DB (branding, home, contact, settings)
      section: (item.section as string) || "settings",
      asset_type: (item.asset_type as string) || (item.value ? "image" : "text"),
      value: (item.value as string | null) ?? null,
      // image_url is deprecated, use value instead
      image_url: (item.value as string | null) ?? null,
    };
  }) as SiteConfigItem[];
}

/**
 * Get all site configs, grouped by section
 * Alias: getSiteAssets (uses site_assets table)
 */
export async function getSiteConfigs(): Promise<{
  data: SiteConfigGrouped | null;
  error: string | null;
}> {
  try {
    const configs = await fetchSiteConfigs();

    if (configs.length === 0) {
      console.warn("No assets found in site_assets table. Make sure seed data is inserted.");
      return { data: {}, error: null }; // Return empty object, not null
    }

    // Normalize data: use value (image_url is deprecated)
    const normalizedConfigs = configs.map((item) => ({
      ...item,
      value: item.value ?? null,
      image_url: item.value ?? null, // For backward compatibility in components
    }));

    // Group by DB section (branding, home, contact, settings)
    // Keep original DB section names for filtering
    const grouped = normalizedConfigs.reduce<SiteConfigGrouped>((acc, item) => {
      const section = item.section || "settings"; // Default to "settings" not "system"
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(item);
      return acc;
    }, {});

    console.log(`Grouped ${configs.length} assets into ${Object.keys(grouped).length} sections`);
    return { data: grouped, error: null };
  } catch (err) {
    console.error("Error in getSiteConfigs:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : "Failed to fetch site assets",
    };
  }
}

/**
 * Alias for getSiteConfigs - uses site_assets table
 */
export const getSiteAssets = getSiteConfigs;

/**
 * Get theme config as key-value pairs for injection into layout
 * Returns a flat object: { "primary_color": "#1e3a5f", "logo_url": "...", ... }
 */
export async function getThemeConfig(): Promise<{
  data: Record<string, string | null> | null;
  error: string | null;
}> {
  try {
    const configs = await fetchSiteConfigs();

    // Convert to key-value pairs
    const themeConfig = configs.reduce<Record<string, string | null>>((acc, item) => {
      // Use value (image_url is deprecated)
      acc[item.key] = item.value ?? null;
      return acc;
    }, {});

    return { data: themeConfig, error: null };
  } catch (err) {
    console.error("Error in getThemeConfig:", err);
    return { data: null, error: "Failed to fetch theme config" };
  }
}

/**
 * Get a single site config by key
 * IMPORTANT: No cache - always fetch fresh data from database
 * This function is called directly without caching to ensure latest data
 */
export async function getSiteConfigByKey(key: string): Promise<{
  data: SiteConfigItem | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    // Fetch directly without any caching wrapper
    // Next.js will not cache this by default in Server Actions
    const { data, error } = await supabase.from("site_assets").select("*").eq("key", key).single();

    if (error) {
      // Not found is not an error, just return null silently
      // PGRST116: "The result contains 0 rows" (single() with no match)
      // Also handle empty error objects or missing rows gracefully
      if (
        error.code === "PGRST116" ||
        error.message?.includes("0 rows") ||
        !error.code
      ) {
        return { data: null, error: null };
      }
      console.error(`Error fetching config for key ${key}:`, error);
      return { data: null, error: error.message };
    }

    return { data: data as SiteConfigItem, error: null };
  } catch (err) {
    console.error("Error in getSiteConfigByKey:", err);
    return { data: null, error: "Failed to fetch site config" };
  }
}

// ============================================
// UPDATE SITE CONFIG
// ============================================

/**
 * Update config value for a specific config key
 * Supports: image, color, text, boolean (all use 'value' column)
 * PROTECTED: Requires authentication
 */
export async function updateSiteConfig(
  key: string,
  newValue: string | null,
  assetType?: "image" | "color" | "text" | "boolean"
): Promise<{ error: string | null }> {
  try {
    // Verify authentication before any mutation
    await requireAuth();

    const supabase = await createClient();

    // All asset types use 'value' column in site_assets table
    const updateData: Record<string, any> = {
      value: newValue,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("site_assets").update(updateData).eq("key", key);

    if (error) {
      console.error(`Error updating asset for key ${key}:`, error);
      console.error("Update data:", updateData);
      return { error: error.message };
    }

    // CRITICAL: Revalidate all pages and layouts to ensure fresh data
    // This forces Next.js to refetch data on next request
    revalidatePath("/", "layout"); // Revalidate root layout (affects all pages)
    revalidatePath("/", "page"); // Revalidate homepage
    revalidatePath("/admin/theme", "page"); // Revalidate admin theme page
    revalidatePath("/admin/theme", "layout"); // Revalidate admin layout

    // Also revalidate common paths that might use assets
    revalidatePath("/blog", "layout");
    revalidatePath("/services", "layout");

    console.log(`Successfully updated asset ${key} and revalidated all paths`);

    return { error: null };
  } catch (err) {
    console.error("Error in updateSiteConfig:", err);
    return { error: "Failed to update site config" };
  }
}

// ============================================
// UPLOAD IMAGE TO STORAGE
// ============================================

/**
 * Upload image to Supabase Storage and return public URL
 * PROTECTED: Requires authentication
 */
export async function uploadThemeImage(
  formData: FormData
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Verify authentication before any mutation
    await requireAuth();

    const supabase = await createClient();

    const file = formData.get("file") as File;
    if (!file) {
      return { url: null, error: "No file provided" };
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return { url: null, error: "File too large. Maximum 5MB allowed." };
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return { url: null, error: "Invalid file type. Only JPG, PNG, WebP, GIF allowed." };
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `theme/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("images").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      console.error("Error uploading theme image:", uploadError);
      return { url: null, error: uploadError.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("images").getPublicUrl(fileName);

    return { url: urlData.publicUrl, error: null };
  } catch (err) {
    console.error("Error in uploadThemeImage:", err);
    return { url: null, error: "Failed to upload image" };
  }
}

/**
 * Delete old image from storage
 * PROTECTED: Requires authentication
 */
export async function deleteThemeImage(url: string): Promise<{ error: string | null }> {
  try {
    // Verify authentication before any mutation
    await requireAuth();

    const supabase = await createClient();

    // Extract path from URL (after /images/)
    const urlParts = url.split("/images/");
    if (urlParts.length < 2) {
      return { error: "Invalid image URL" };
    }

    const filePath = urlParts[1];

    const { error } = await supabase.storage.from("images").remove([filePath]);

    if (error) {
      console.error("Error deleting theme image:", error);
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    console.error("Error in deleteThemeImage:", err);
    return { error: "Failed to delete image" };
  }
}

// ============================================
// CREATE/SEED SITE CONFIG (Admin utility)
// ============================================

/**
 * Create a new site config entry
 * PROTECTED: Requires authentication
 */
export async function createSiteConfig(
  config: Omit<SiteConfigItem, "created_at" | "updated_at">
): Promise<{ error: string | null }> {
  try {
    // Verify authentication before any mutation
    await requireAuth();

    const supabase = await createClient();

    const { error } = await supabase.from("site_assets").insert({
      ...config,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error creating site config:", error);
      return { error: error.message };
    }

    revalidatePath("/admin/theme");
    return { error: null };
  } catch (err) {
    console.error("Error in createSiteConfig:", err);
    return { error: "Failed to create site config" };
  }
}
