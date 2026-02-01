"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Mail,
  Phone,
  Building2,
  Calendar,
  TrendingUp,
  Download,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Trash2,
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getLeads,
  getLeadStats,
  updateLeadStatus,
  updateLeadNotes,
  deleteLead,
  exportLeadsCSV,
  Lead,
  LeadStats,
} from "./actions";

// ============================================
// STATUS CONFIG
// ============================================

const statusConfig = {
  new: { label: "Neu", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock },
  contacted: {
    label: "Kontaktiert",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Mail,
  },
  qualified: {
    label: "Qualifiziert",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Target,
  },
  converted: {
    label: "Konvertiert",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
  },
  lost: { label: "Verloren", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
};

// ============================================
// COMPONENT
// ============================================

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [leadsData, statsData] = await Promise.all([getLeads(), getLeadStats()]);
      setLeads(leadsData);
      setStats(statsData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Fetch data for refresh
  const fetchData = async () => {
    setIsLoading(true);
    const [leadsData, statsData] = await Promise.all([getLeads(), getLeadStats()]);
    setLeads(leadsData);
    setStats(statsData);
    setIsLoading(false);
  };

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.interest?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle status update
  const handleStatusUpdate = async (id: string, status: Lead["status"]) => {
    await updateLeadStatus(id, status);
    fetchData();
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (confirm("Möchten Sie diesen Lead wirklich löschen?")) {
      await deleteLead(id);
      fetchData();
    }
  };

  // Handle export
  const handleExport = async () => {
    const csv = await exportLeadsCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  // View lead detail
  const handleViewDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads Dashboard</h1>
          <p className="text-gray-600 mt-1">Verwalten Sie Ihre Leads aus dem Chatbot</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            Aktualisieren
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <StatCard
            label="Gesamt"
            value={stats.total}
            icon={<Users className="w-5 h-5" />}
            color="bg-gray-100 text-gray-600"
          />
          <StatCard
            label="Neu"
            value={stats.new}
            icon={<Clock className="w-5 h-5" />}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            label="Diese Woche"
            value={stats.thisWeek}
            icon={<Calendar className="w-5 h-5" />}
            color="bg-purple-100 text-purple-600"
          />
          <StatCard
            label="Konvertiert"
            value={stats.converted}
            icon={<CheckCircle className="w-5 h-5" />}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            label="Conversion Rate"
            value={`${stats.conversionRate}%`}
            icon={<TrendingUp className="w-5 h-5" />}
            color="bg-amber-100 text-amber-600"
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Suchen nach Email, Firma, Interesse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Alle Status</option>
            <option value="new">Neu</option>
            <option value="contacted">Kontaktiert</option>
            <option value="qualified">Qualifiziert</option>
            <option value="converted">Konvertiert</option>
            <option value="lost">Verloren</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Lade Leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Keine Leads gefunden</h3>
            <p className="text-gray-500">
              {searchQuery || statusFilter !== "all"
                ? "Versuchen Sie andere Filter"
                : "Leads werden aus dem Chatbot gesammelt"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Kontakt
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Firma
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Interesse
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quelle
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Datum
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.map((lead) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    onStatusUpdate={handleStatusUpdate}
                    onDelete={handleDelete}
                    onView={handleViewDetail}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setShowDetailModal(false)}
          onStatusUpdate={handleStatusUpdate}
          onRefresh={fetchData}
        />
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
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg", color)}>{icon}</div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function LeadRow({
  lead,
  onStatusUpdate,
  onDelete,
  onView,
}: {
  lead: Lead;
  onStatusUpdate: (id: string, status: Lead["status"]) => void;
  onDelete: (id: string) => void;
  onView: (lead: Lead) => void;
}) {
  const status = statusConfig[lead.status] || statusConfig.new;
  const _StatusIcon = status.icon;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">{lead.email}</span>
          </div>
          {lead.phone && (
            <div className="flex items-center gap-2 mt-1">
              <Phone className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">{lead.phone}</span>
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        {lead.company ? (
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">{lead.company}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-gray-700 line-clamp-1">{lead.interest || "-"}</span>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
          <MessageSquare className="w-3 h-3" />
          {lead.source}
        </span>
      </td>
      <td className="px-4 py-3">
        <select
          value={lead.status}
          onChange={(e) => onStatusUpdate(lead.id, e.target.value as Lead["status"])}
          className={cn(
            "px-2 py-1 rounded-lg text-xs font-medium border cursor-pointer",
            status.color
          )}
        >
          <option value="new">Neu</option>
          <option value="contacted">Kontaktiert</option>
          <option value="qualified">Qualifiziert</option>
          <option value="converted">Konvertiert</option>
          <option value="lost">Verloren</option>
        </select>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-gray-500">
          {new Date(lead.created_at).toLocaleDateString("de-DE")}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onView(lead)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Details ansehen"
          >
            <Eye className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => onDelete(lead.id)}
            className="p-2 hover:bg-red-50 rounded-lg"
            title="Löschen"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function LeadDetailModal({
  lead,
  onClose,
  onStatusUpdate,
  onRefresh,
}: {
  lead: Lead;
  onClose: () => void;
  onStatusUpdate: (id: string, status: Lead["status"]) => void;
  onRefresh: () => void;
}) {
  const [notes, setNotes] = useState(lead.notes || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveNotes = async () => {
    setIsSaving(true);
    await updateLeadNotes(lead.id, notes);
    setIsSaving(false);
    onRefresh();
  };

  const status = statusConfig[lead.status] || statusConfig.new;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Lead Details</h2>
              <p className="text-sm text-gray-500">
                Erstellt am {new Date(lead.created_at).toLocaleString("de-DE")}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <XCircle className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Contact Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">E-Mail</p>
                <p className="text-sm font-medium text-gray-900">{lead.email}</p>
              </div>
            </div>

            {lead.company && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Building2 className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Unternehmen</p>
                  <p className="text-sm font-medium text-gray-900">{lead.company}</p>
                </div>
              </div>
            )}

            {lead.phone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Telefon</p>
                  <p className="text-sm font-medium text-gray-900">{lead.phone}</p>
                </div>
              </div>
            )}
          </div>

          {/* Interest */}
          {lead.interest && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Interesse</p>
              <p className="text-sm text-gray-700 p-3 bg-blue-50 rounded-lg">{lead.interest}</p>
            </div>
          )}

          {/* Status */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Status</p>
            <select
              value={lead.status}
              onChange={(e) => onStatusUpdate(lead.id, e.target.value as Lead["status"])}
              className={cn(
                "w-full px-3 py-2 rounded-lg text-sm font-medium border cursor-pointer",
                status.color
              )}
            >
              <option value="new">Neu</option>
              <option value="contacted">Kontaktiert</option>
              <option value="qualified">Qualifiziert</option>
              <option value="converted">Konvertiert</option>
              <option value="lost">Verloren</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Notizen</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Notizen hinzufügen..."
            />
            <button
              onClick={handleSaveNotes}
              disabled={isSaving}
              className="mt-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {isSaving ? "Speichern..." : "Notizen speichern"}
            </button>
          </div>

          {/* Session Link */}
          {lead.session_id && (
            <div className="pt-4 border-t border-gray-200">
              <a
                href={`/admin/chats?session=${lead.session_id}`}
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <MessageSquare className="w-4 h-4" />
                Chat-Verlauf ansehen
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
