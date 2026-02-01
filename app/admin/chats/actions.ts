"use server";

import { createClient } from "@supabase/supabase-js";

// ============================================
// TYPES
// ============================================

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  session_id: string;
  messages: ChatMessage[];
  message_count: number;
  lead_email: string | null;
  lead_company: string | null;
  lead_phone: string | null;
  lead_interest: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatStats {
  totalSessions: number;
  totalMessages: number;
  avgMessagesPerSession: number;
  sessionsToday: number;
  sessionsThisWeek: number;
  sessionsWithLeads: number;
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

export async function getChatSessions(): Promise<ChatSession[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[Chats] Error fetching sessions:", error.message);
    return [];
  }

  return data || [];
}

export async function getChatSession(sessionId: string): Promise<ChatSession | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("session_id", sessionId)
    .single();

  if (error) {
    console.error("[Chats] Error fetching session:", error.message);
    return null;
  }

  return data;
}

export async function getChatStats(): Promise<ChatStats> {
  const supabase = getSupabaseClient();

  const defaultStats: ChatStats = {
    totalSessions: 0,
    totalMessages: 0,
    avgMessagesPerSession: 0,
    sessionsToday: 0,
    sessionsThisWeek: 0,
    sessionsWithLeads: 0,
  };

  if (!supabase) return defaultStats;

  const { data, error } = await supabase.from("chat_sessions").select("*");

  if (error || !data) {
    console.error("[Chats] Error fetching stats:", error?.message);
    return defaultStats;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const totalMessages = data.reduce((sum, s) => sum + (s.message_count || 0), 0);

  const stats: ChatStats = {
    totalSessions: data.length,
    totalMessages,
    avgMessagesPerSession: data.length > 0 ? Math.round(totalMessages / data.length) : 0,
    sessionsToday: data.filter((s) => new Date(s.created_at) >= today).length,
    sessionsThisWeek: data.filter((s) => new Date(s.created_at) >= weekAgo).length,
    sessionsWithLeads: data.filter((s) => s.lead_email).length,
  };

  return stats;
}

export async function deleteChatSession(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const { error } = await supabase.from("chat_sessions").delete().eq("id", id);

  if (error) {
    console.error("[Chats] Error deleting session:", error.message);
    return false;
  }

  return true;
}
