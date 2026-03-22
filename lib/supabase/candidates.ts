"use server";

import { createPublicClient } from "@/utils/supabase/public";
import type { Candidate, CandidateCategory, GermanLevel } from "@/app/admin/candidates/types";

/**
 * Get featured candidates for Kandidaten-Pool page
 * Only returns candidates that are:
 * - is_featured = true (Featured candidates)
 *
 * Fields returned: id, profession, experience_years, german_level, video_url, avatar_url, category, created_at
 * Sorted by created_at descending (newest first)
 *
 * Uses the public anon client so marketing pages can stay static/ISR-friendly.
 */
export async function getFeaturedCandidates(): Promise<{
  data: Candidate[] | null;
  error: string | null;
}> {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("candidates")
      .select(
        "id, profession, experience_years, german_level, video_url, avatar_url, category, created_at"
      )
      .eq("is_featured", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getFeaturedCandidates] Error fetching candidates:", error);
      return { data: null, error: error.message };
    }

    return { data: (data || []) as Candidate[], error: null };
  } catch (err) {
    console.error("[getFeaturedCandidates] Unexpected error:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : "Ein unerwarteter Fehler ist aufgetreten.",
    };
  }
}

/**
 * Get homepage showcase candidates.
 * Prefer featured or visa-ready profiles, then fall back to the newest entries.
 */
export async function getHomepageFeaturedCandidates(): Promise<{
  data: Candidate[] | null;
  error: string | null;
}> {
  try {
    const supabase = createPublicClient();

    let { data, error } = await supabase
      .from("candidates")
      .select("*")
      .or("is_featured.eq.true,visa_status.eq.true")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error || !data || data.length === 0) {
      const { data: allData, error: allError } = await supabase
        .from("candidates")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (allError) {
        console.error("[getHomepageFeaturedCandidates] Error fetching candidates:", allError);
        return { data: null, error: allError.message };
      }

      data = allData;
    }

    if (error && data && data.length === 0) {
      console.warn("[getHomepageFeaturedCandidates] No candidates found, returning empty array");
      return { data: [], error: null };
    }

    return { data: (data || []) as Candidate[], error: null };
  } catch (err) {
    console.error("[getHomepageFeaturedCandidates] Unexpected error:", err);
    return { data: [], error: null };
  }
}

/**
 * Get public candidates for Kandidaten-Pool page (with filters)
 * Only returns candidates that are:
 * - is_featured = true (Featured candidates)
 * - visa_status = true (Ready to work)
 *
 * Fields returned: id, profession, experience_years, german_level, video_url, avatar_url, category
 */
export async function getPublicCandidates(filters?: {
  category?: CandidateCategory;
  germanLevel?: GermanLevel;
}): Promise<{
  data: Candidate[] | null;
  error: string | null;
}> {
  try {
    const supabase = createPublicClient();

    // Build query - Start with base conditions
    let query = supabase
      .from("candidates")
      .select(
        "id, profession, experience_years, german_level, video_url, avatar_url, category, created_at"
      )
      .eq("is_featured", true)
      .eq("visa_status", true)
      .order("created_at", { ascending: false });

    // Apply optional filters
    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.germanLevel) {
      query = query.eq("german_level", filters.germanLevel);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[getPublicCandidates] Error fetching candidates:", error);
      return { data: null, error: error.message };
    }

    return { data: (data || []) as Candidate[], error: null };
  } catch (err) {
    console.error("[getPublicCandidates] Unexpected error:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : "Ein unerwarteter Fehler ist aufgetreten.",
    };
  }
}

/**
 * Get unique categories from public candidates
 */
export async function getAvailableCategories(): Promise<CandidateCategory[]> {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("candidates")
      .select("category")
      .eq("is_featured", true)
      .eq("visa_status", true);

    if (error || !data) {
      return [];
    }

    // Get unique categories
    const uniqueCategories = [...new Set(data.map((c) => c.category))] as CandidateCategory[];
    return uniqueCategories;
  } catch {
    return [];
  }
}

/**
 * Get unique German levels from public candidates
 */
export async function getAvailableGermanLevels(): Promise<GermanLevel[]> {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("candidates")
      .select("german_level")
      .eq("is_featured", true)
      .eq("visa_status", true);

    if (error || !data) {
      return [];
    }

    // Get unique German levels
    const uniqueLevels = [...new Set(data.map((c) => c.german_level))] as GermanLevel[];
    return uniqueLevels.sort((a, b) => {
      // Sort by level: A1 < A2 < B1 < B2 < C1 < C2
      const order = ["A1", "A2", "B1", "B2", "C1", "C2"];
      return order.indexOf(a) - order.indexOf(b);
    });
  } catch {
    return [];
  }
}
