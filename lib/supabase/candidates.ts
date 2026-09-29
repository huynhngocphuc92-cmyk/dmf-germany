"use server";

import { createPublicClient } from "@/utils/supabase/public";
import type { CandidateCategory, GermanLevel } from "@/app/admin/candidates/types";
import {
  PUBLIC_CANDIDATE_FIELDS,
  toPublicCandidates,
  type PublicCandidate,
} from "@/lib/candidates/public-profile";

type CandidateResult = { data: PublicCandidate[] | null; error: string | null };

async function queryPublishedCandidates(
  options: {
    limit?: number;
    featuredOnly?: boolean;
    category?: CandidateCategory;
    germanLevel?: GermanLevel;
  } = {}
): Promise<CandidateResult> {
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from("candidates")
      .select(PUBLIC_CANDIDATE_FIELDS)
      .eq("publication_status", "published")
      .gte("publication_valid_until", new Date().toISOString().slice(0, 10))
      .order("created_at", { ascending: false });
    if (options.limit) query = query.limit(options.limit);
    if (options.featuredOnly) query = query.eq("is_featured", true);
    if (options.category) query = query.eq("category", options.category);
    if (options.germanLevel) query = query.eq("german_level", options.germanLevel);

    const { data, error } = await query;
    if (error) return { data: null, error: "Profile konnten nicht geladen werden." };
    return { data: toPublicCandidates(data ?? []), error: null };
  } catch {
    // Never broaden the query on errors or when no approved profiles exist.
    return { data: null, error: "Profile konnten nicht geladen werden." };
  }
}

export async function getFeaturedCandidates(): Promise<CandidateResult> {
  return queryPublishedCandidates();
}

export async function getHomepageFeaturedCandidates(): Promise<CandidateResult> {
  return queryPublishedCandidates({ limit: 20, featuredOnly: true });
}

export async function getPublicCandidates(filters?: {
  category?: CandidateCategory;
  germanLevel?: GermanLevel;
}): Promise<CandidateResult> {
  return queryPublishedCandidates(filters);
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
      .eq("publication_status", "published")
      .gte("publication_valid_until", new Date().toISOString().slice(0, 10));

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
      .eq("publication_status", "published")
      .gte("publication_valid_until", new Date().toISOString().slice(0, 10));

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
