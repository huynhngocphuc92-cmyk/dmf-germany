"use server";

import { createClient } from "@supabase/supabase-js";

// ============================================
// TYPES
// ============================================

export interface Lead {
  id: string;
  email: string;
  company: string | null;
  phone: string | null;
  interest: string | null;
  session_id: string | null;
  source: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
  thisWeek: number;
  thisMonth: number;
  conversionRate: number;
}

// ============================================
// SUPABASE CLIENT
// ============================================

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

// ============================================
// ACTIONS
// ============================================

export async function getLeads(): Promise<Lead[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Leads] Error fetching leads:", error.message);
    return [];
  }

  return data || [];
}

export async function getLeadStats(): Promise<LeadStats> {
  const supabase = getSupabaseClient();

  const defaultStats: LeadStats = {
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    lost: 0,
    thisWeek: 0,
    thisMonth: 0,
    conversionRate: 0,
  };

  if (!supabase) return defaultStats;

  const { data, error } = await supabase.from("leads").select("*");

  if (error || !data) {
    console.error("[Leads] Error fetching stats:", error?.message);
    return defaultStats;
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const stats: LeadStats = {
    total: data.length,
    new: data.filter((l) => l.status === "new").length,
    contacted: data.filter((l) => l.status === "contacted").length,
    qualified: data.filter((l) => l.status === "qualified").length,
    converted: data.filter((l) => l.status === "converted").length,
    lost: data.filter((l) => l.status === "lost").length,
    thisWeek: data.filter((l) => new Date(l.created_at) >= weekAgo).length,
    thisMonth: data.filter((l) => new Date(l.created_at) >= monthAgo).length,
    conversionRate:
      data.length > 0
        ? Math.round((data.filter((l) => l.status === "converted").length / data.length) * 100)
        : 0,
  };

  return stats;
}

export async function updateLeadStatus(id: string, status: Lead["status"]): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("[Leads] Error updating status:", error.message);
    return false;
  }

  return true;
}

export async function updateLeadNotes(id: string, notes: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("leads")
    .update({ notes, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("[Leads] Error updating notes:", error.message);
    return false;
  }

  return true;
}

export async function deleteLead(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const { error } = await supabase.from("leads").delete().eq("id", id);

  if (error) {
    console.error("[Leads] Error deleting lead:", error.message);
    return false;
  }

  return true;
}

export async function exportLeadsCSV(): Promise<string> {
  const leads = await getLeads();

  const headers = ["Email", "Company", "Phone", "Interest", "Source", "Status", "Created At"];
  const rows = leads.map((l) => [
    l.email,
    l.company || "",
    l.phone || "",
    l.interest || "",
    l.source,
    l.status,
    new Date(l.created_at).toLocaleString("de-DE"),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
  return csv;
}
