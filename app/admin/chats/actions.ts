"use server";

import { createPrivilegedAdminClient } from "@/lib/auth/admin";
import { runWithOpenRouterFallback } from "@/lib/ai/openrouter";

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

export interface ChatLeadAnalysis {
  leadTemperature: "hot" | "warm" | "cold";
  segment: "b2b_employer" | "b2c_applicant" | "general";
  summary: string;
  keyNeeds: string[];
  followUpSubject: string;
  followUpEmailDraft: string;
}

// ============================================
// SUPABASE CLIENT
// ============================================

// ============================================
// ACTIONS
// ============================================

export async function getChatSessions(): Promise<ChatSession[]> {
  const supabase = await createPrivilegedAdminClient();
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
  const supabase = await createPrivilegedAdminClient();
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
  const supabase = await createPrivilegedAdminClient();

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
  const supabase = await createPrivilegedAdminClient();
  if (!supabase) return false;

  const { error } = await supabase.from("chat_sessions").delete().eq("id", id);

  if (error) {
    console.error("[Chats] Error deleting session:", error.message);
    return false;
  }

  return true;
}

function buildFallbackChatAnalysis(session: ChatSession): ChatLeadAnalysis {
  const userMessages = (session.messages || [])
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join(" ");
  const lower = userMessages.toLowerCase();

  const isVietnamese =
    /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(userMessages) ||
    /\b(em|anh|chị|tư vấn|du học nghề|chi phí|học tiếng đức)\b/i.test(lower);

  const isB2B =
    Boolean(session.lead_company) ||
    /\b(arbeitgeber|unternehmen|klinik|betrieb|fachkräfte|azubi|personalbedarf|vermittlung|kosten|roi)\b/i.test(
      lower
    );

  const segment: ChatLeadAnalysis["segment"] = isB2B
    ? "b2b_employer"
    : isVietnamese
      ? "b2c_applicant"
      : "general";

  const hasContact = Boolean(session.lead_email || session.lead_phone);
  const msgCount = session.message_count || session.messages?.length || 0;
  const leadTemperature: ChatLeadAnalysis["leadTemperature"] =
    hasContact || msgCount >= 6 ? "hot" : msgCount >= 3 ? "warm" : "cold";

  if (segment === "b2c_applicant") {
    return {
      leadTemperature,
      segment,
      summary: `Ứng viên Việt Nam quan tâm chương trình sang Đức (${msgCount} tin nhắn). ${hasContact ? `Đã để lại liên hệ (${session.lead_email || session.lead_phone}).` : "Chưa để lại email/SĐT trực tiếp."}`,
      keyNeeds: [
        "Tư vấn điều kiện & lộ trình du học nghề (§16a) hoặc lao động tay nghề (§18a/b)",
        "Thông tin lộ trình học tiếng Đức B1/B2 tại DMF Vietnam Academy",
      ],
      followUpSubject: "DMF Talents – Lộ trình Du học nghề & Làm việc tại Đức dành cho bạn",
      followUpEmailDraft: `Chào bạn,\n\nCảm ơn bạn đã trò chuyện cùng tư vấn viên trực tuyến của DMF Talents. Qua nội dung trao đổi, mình thấy bạn đang quan tâm đến lộ trình sang Đức học tập và làm việc.\n\nĐể mình gửi bảng chi tiết điều kiện, mức lương và lịch khai giảng lớp tiếng Đức gần nhất, bạn cho mình xin Số điện thoại/Zalo hoặc khung giờ thuận tiện để chuyên viên DMF gọi hỗ trợ trực tiếp nhé!\n\nTrân trọng,\nĐội ngũ Tuyển sinh DMF Vietnam Academy`,
    };
  }

  return {
    leadTemperature,
    segment,
    summary: `Interessent (${session.lead_company || "Unbekanntes Unternehmen"}) mit ${msgCount} Nachrichten im Chat-Verlauf. ${hasContact ? `Kontaktdaten vorhanden (${session.lead_email}).` : "Noch keine E-Mail-Adresse hinterlegt."}`,
    keyNeeds: [
      "Informationen zur Rekrutierung vietnamesischer Fachkräfte (§18a/b) bzw. Auszubildender (§16a)",
      "Klärung von Vorlaufzeiten, Sprachniveau (B1/B2) und Vermittlungsablauf",
    ],
    followUpSubject: `Ihre Anfrage bei DMF Talents – Passende Kandidatenprofile ${session.lead_company ? `für ${session.lead_company}` : ""}`,
    followUpEmailDraft: `Sehr geehrte Damen und Herren,\n\nvielen Dank für den Austausch über unseren Online-Berater auf dmf-talents.de. Gerne unterstützen wir Sie bei der Gewinnung qualifizierter Fachkräfte und Auszubildender aus Vietnam.\n\nAuf Wunsch senden wir Ihnen unverbindlich 2–3 passende Bewerberdossiers (inkl. DIN-5008-Lebenslauf und Kurzvideo) sowie unseren aktuellen FEG-Zeitplan zu. Wann passt Ihnen ein kurzes 15-minütiges Telefonat in dieser Woche?\n\nMit freundlichen Grüßen\nIhr DMF Talents B2B-Team`,
  };
}

export async function analyzeChatSessionWithAI(
  sessionId: string
): Promise<ChatLeadAnalysis | null> {
  const supabase = await createPrivilegedAdminClient();
  if (!supabase) return null;

  const { data: session, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("session_id", sessionId)
    .single();

  if (error || !session) {
    return null;
  }

  const typedSession = session as ChatSession;
  const fallback = buildFallbackChatAnalysis(typedSession);
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();

  if (!apiKey || !typedSession.messages || typedSession.messages.length === 0) {
    return fallback;
  }

  const transcript = typedSession.messages
    .slice(-16)
    .map((m) => `${m.role === "user" ? "Besucher" : "Berater"}: ${m.content}`)
    .join("\n");

  const systemPrompt = `Du bist der KI-Sales-Analyst für das Admin-Team von DMF Talents.
Analysiere den folgenden Chat-Verlauf zwischen einem Website-Besucher und dem DMF-Berater.
Klassifiziere den Lead und erstelle eine kompakte Zusammenfassung sowie einen sofort versandfertigen Follow-up-E-Mail-Entwurf (auf Deutsch, falls es ein deutscher Arbeitgeber/B2B ist; auf Vietnamesisch, falls es ein vietnamesischer Schüler/Bewerber/B2C ist).
Antworte AUSSCHLIESSLICH als valides JSON-Objekt:
{
  "leadTemperature": "hot" | "warm" | "cold",
  "segment": "b2b_employer" | "b2c_applicant" | "general",
  "summary": "2 präzise Sätze Zusammenfassung für den Admin",
  "keyNeeds": ["Kernbedarf 1", "Kernbedarf 2"],
  "followUpSubject": "Betreffzeile der Follow-up-E-Mail",
  "followUpEmailDraft": "Vollständiger Text der Follow-up-E-Mail"
}`;

  try {
    const { text } = await runWithOpenRouterFallback(
      apiKey,
      [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: JSON.stringify({
            leadEmail: typedSession.lead_email,
            leadCompany: typedSession.lead_company,
            leadPhone: typedSession.lead_phone,
            transcript,
          }),
        },
      ],
      { maxTokens: 650, temperature: 0.2, timeoutMs: 14000 }
    );

    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    const jsonStr =
      firstBrace !== -1 && lastBrace > firstBrace
        ? cleaned.slice(firstBrace, lastBrace + 1)
        : cleaned;
    const parsed = JSON.parse(jsonStr);

    const validTemps = ["hot", "warm", "cold"] as const;
    const validSegments = ["b2b_employer", "b2c_applicant", "general"] as const;

    return {
      leadTemperature: validTemps.includes(parsed?.leadTemperature)
        ? parsed.leadTemperature
        : fallback.leadTemperature,
      segment: validSegments.includes(parsed?.segment) ? parsed.segment : fallback.segment,
      summary:
        typeof parsed?.summary === "string" && parsed.summary.trim()
          ? parsed.summary.trim()
          : fallback.summary,
      keyNeeds:
        Array.isArray(parsed?.keyNeeds) && parsed.keyNeeds.length > 0
          ? parsed.keyNeeds.map((k: unknown) => String(k))
          : fallback.keyNeeds,
      followUpSubject:
        typeof parsed?.followUpSubject === "string" && parsed.followUpSubject.trim()
          ? parsed.followUpSubject.trim()
          : fallback.followUpSubject,
      followUpEmailDraft:
        typeof parsed?.followUpEmailDraft === "string" && parsed.followUpEmailDraft.trim()
          ? parsed.followUpEmailDraft.trim()
          : fallback.followUpEmailDraft,
    };
  } catch {
    return fallback;
  }
}
