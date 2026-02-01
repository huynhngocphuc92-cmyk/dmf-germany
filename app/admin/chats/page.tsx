"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  MessageSquare,
  Users,
  Calendar,
  TrendingUp,
  RefreshCw,
  Search,
  Eye,
  Trash2,
  Bot,
  User,
  Mail,
  Building2,
  Clock,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getChatSessions,
  getChatStats,
  deleteChatSession,
  ChatSession,
  ChatStats,
} from "./actions";

// ============================================
// COMPONENT
// ============================================

export default function ChatsPage() {
  const searchParams = useSearchParams();
  const sessionParam = searchParams.get("session");

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [sessionsData, statsData] = await Promise.all([getChatSessions(), getChatStats()]);
      setSessions(sessionsData);
      setStats(statsData);
      setIsLoading(false);

      // Auto-open session if param provided
      if (sessionParam) {
        const session = sessionsData.find((s) => s.session_id === sessionParam);
        if (session) {
          setSelectedSession(session);
          setShowChatModal(true);
        }
      }
    };
    loadData();
  }, [sessionParam]);

  // Fetch data for refresh
  const fetchData = async () => {
    setIsLoading(true);
    const [sessionsData, statsData] = await Promise.all([getChatSessions(), getChatStats()]);
    setSessions(sessionsData);
    setStats(statsData);
    setIsLoading(false);
  };

  // Filter sessions
  const filteredSessions = sessions.filter((session) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      session.session_id.toLowerCase().includes(searchLower) ||
      session.lead_email?.toLowerCase().includes(searchLower) ||
      session.lead_company?.toLowerCase().includes(searchLower) ||
      session.messages?.some((m) => m.content.toLowerCase().includes(searchLower))
    );
  });

  // Handle delete
  const handleDelete = async (id: string) => {
    if (confirm("Möchten Sie diese Chat-Sitzung wirklich löschen?")) {
      await deleteChatSession(id);
      fetchData();
    }
  };

  // View session
  const handleViewSession = (session: ChatSession) => {
    setSelectedSession(session);
    setShowChatModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chat-Verlauf</h1>
          <p className="text-gray-600 mt-1">Alle Chatbot-Konversationen einsehen</p>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
        >
          <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          Aktualisieren
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            label="Gesamt Chats"
            value={stats.totalSessions}
            icon={<MessageSquare className="w-5 h-5" />}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            label="Nachrichten"
            value={stats.totalMessages}
            icon={<TrendingUp className="w-5 h-5" />}
            color="bg-purple-100 text-purple-600"
          />
          <StatCard
            label="Ø pro Chat"
            value={stats.avgMessagesPerSession}
            icon={<MessageSquare className="w-5 h-5" />}
            color="bg-gray-100 text-gray-600"
          />
          <StatCard
            label="Heute"
            value={stats.sessionsToday}
            icon={<Clock className="w-5 h-5" />}
            color="bg-amber-100 text-amber-600"
          />
          <StatCard
            label="Diese Woche"
            value={stats.sessionsThisWeek}
            icon={<Calendar className="w-5 h-5" />}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            label="Mit Leads"
            value={stats.sessionsWithLeads}
            icon={<Users className="w-5 h-5" />}
            color="bg-red-100 text-red-600"
          />
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Suchen in Chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Sessions List */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Lade Chat-Sitzungen...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Keine Chats gefunden</h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Versuchen Sie andere Suchbegriffe"
                : "Chats werden aus dem Chatbot gesammelt"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredSessions.map((session) => (
              <SessionRow
                key={session.id}
                session={session}
                onView={handleViewSession}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {showChatModal && selectedSession && (
        <ChatModal session={selectedSession} onClose={() => setShowChatModal(false)} />
      )}
    </div>
  );
}

// ============================================
// SUB COMPONENTS
// ============================================

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg", color)}>{icon}</div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function SessionRow({
  session,
  onView,
  onDelete,
}: {
  session: ChatSession;
  onView: (session: ChatSession) => void;
  onDelete: (id: string) => void;
}) {
  const firstUserMessage = session.messages?.find((m) => m.role === "user");

  return (
    <div
      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onView(session)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900">
              {session.lead_email || `Session ${session.session_id.slice(-8)}`}
            </span>
            {session.lead_email && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                <Mail className="w-3 h-3" />
                Lead
              </span>
            )}
          </div>

          {/* Company */}
          {session.lead_company && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <Building2 className="w-3 h-3" />
              {session.lead_company}
            </div>
          )}

          {/* Preview */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {firstUserMessage?.content || "Keine Nachrichten"}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {session.message_count} Nachrichten
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(session.updated_at || session.created_at).toLocaleString("de-DE")}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onView(session)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Chat ansehen"
          >
            <Eye className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => onDelete(session.id)}
            className="p-2 hover:bg-red-50 rounded-lg"
            title="Löschen"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </div>
      </div>
    </div>
  );
}

function ChatModal({ session, onClose }: { session: ChatSession; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Chat-Verlauf</h2>
            <p className="text-sm text-gray-500">Session: {session.session_id.slice(-12)}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Lead Info */}
        {(session.lead_email || session.lead_company) && (
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center gap-4 text-sm">
              {session.lead_email && (
                <div className="flex items-center gap-1 text-blue-700">
                  <Mail className="w-4 h-4" />
                  {session.lead_email}
                </div>
              )}
              {session.lead_company && (
                <div className="flex items-center gap-1 text-blue-700">
                  <Building2 className="w-4 h-4" />
                  {session.lead_company}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {session.messages?.map((message, index) => (
            <div
              key={index}
              className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "flex items-start gap-2 max-w-[80%]",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.role === "user" ? "bg-primary/10" : "bg-white border border-gray-200"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="w-4 h-4 text-primary" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5",
                    message.role === "user"
                      ? "bg-primary text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      message.role === "user" ? "text-white/60" : "text-gray-400"
                    )}
                  >
                    {new Date(message.timestamp).toLocaleTimeString("de-DE")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{session.message_count} Nachrichten</span>
            <span>Erstellt: {new Date(session.created_at).toLocaleString("de-DE")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
