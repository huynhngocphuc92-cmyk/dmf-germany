"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Trash2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Mail,
  User,
  Building2,
  Phone,
  MessageSquare,
  Calendar,
  X,
} from "lucide-react";
import { deleteInquiry, updateInquiryStatus, getInquiries } from "./actions";
import type { Inquiry, InquiryStatus } from "./types";
import { statusLabels, statusColors, typeLabels, typeColors } from "./types";
import { useLanguage } from "@/components/providers/LanguageProvider";

// ============================================
// COMPONENT PROPS
// ============================================

interface RequestsClientProps {
  initialInquiries: Inquiry[] | null;
  error: string | null;
}

// ============================================
// REQUESTS CLIENT COMPONENT
// ============================================

export function RequestsClient({ initialInquiries, error: initialError }: RequestsClientProps) {
  const { lang } = useLanguage();

  // Data state
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries || []);
  const [error, setError] = useState<string | null>(initialError);
  const [isLoading, setIsLoading] = useState(false);

  // Dialog state
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState<Inquiry | null>(null);

  // Loading states
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ============================================
  // REFRESH DATA
  // ============================================

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await getInquiries();
      if (fetchError) {
        setError(fetchError);
      } else {
        setInquiries(data || []);
      }
    } catch (err) {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // VIEW DETAILS
  // ============================================

  const handleViewDetails = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsDetailDialogOpen(true);
  };

  // ============================================
  // UPDATE STATUS
  // ============================================

  const handleStatusChange = async (inquiryId: string, newStatus: InquiryStatus) => {
    setUpdatingStatus(inquiryId);
    try {
      const { success, error: updateError } = await updateInquiryStatus(inquiryId, newStatus);
      if (success) {
        // Update local state
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === inquiryId ? { ...inq, status: newStatus } : inq))
        );
        // If detail dialog is open, update it too
        if (selectedInquiry?.id === inquiryId) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
      } else {
        setError(updateError || "Fehler beim Aktualisieren des Status.");
      }
    } catch (err) {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  // ============================================
  // DELETE INQUIRY
  // ============================================

  const handleDeleteClick = (inquiry: Inquiry) => {
    setInquiryToDelete(inquiry);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!inquiryToDelete) return;

    setDeletingId(inquiryToDelete.id);
    try {
      const { success, error: deleteError } = await deleteInquiry(inquiryToDelete.id);
      if (success) {
        // Remove from local state
        setInquiries((prev) => prev.filter((inq) => inq.id !== inquiryToDelete.id));
        setIsDeleteDialogOpen(false);
        setInquiryToDelete(null);
        // Close detail dialog if it was open for this inquiry
        if (selectedInquiry?.id === inquiryToDelete.id) {
          setIsDetailDialogOpen(false);
          setSelectedInquiry(null);
        }
      } else {
        setError(deleteError || "Fehler beim Löschen der Anfrage.");
      }
    } catch (err) {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================
  // FORMAT DATE
  // ============================================

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // ============================================
  // RENDER
  // ============================================

  if (error && !inquiries.length) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Erneut versuchen
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {lang === "de" ? "Anfragen" : "Yêu cầu"}
          </h1>
          <p className="text-slate-500 mt-1">
            {lang === "de"
              ? "Verwalten Sie alle eingehenden Anfragen"
              : "Quản lý tất cả các yêu cầu đến"}
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          {lang === "de" ? "Aktualisieren" : "Làm mới"}
        </Button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={() => setError(null)} className="ml-auto">
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {isLoading && !inquiries.length ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">
              {lang === "de" ? "Noch keine Anfragen vorhanden" : "Chưa có yêu cầu nào"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">{lang === "de" ? "Datum" : "Ngày"}</TableHead>
                <TableHead>{lang === "de" ? "Name" : "Tên"}</TableHead>
                <TableHead>{lang === "de" ? "Typ" : "Loại"}</TableHead>
                <TableHead>{lang === "de" ? "Status" : "Trạng thái"}</TableHead>
                <TableHead className="text-right">
                  {lang === "de" ? "Aktionen" : "Hành động"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-mono text-sm">
                    {formatDate(inquiry.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{inquiry.client_name}</div>
                    <div className="text-sm text-slate-500">{inquiry.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${typeColors[inquiry.type]} border`} variant="outline">
                      {inquiry.type === "profile" && inquiry.candidate_code
                        ? `${lang === "de" ? typeLabels[inquiry.type].de : typeLabels[inquiry.type].vn} #${inquiry.candidate_code}`
                        : lang === "de"
                          ? typeLabels[inquiry.type].de
                          : typeLabels[inquiry.type].vn}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={inquiry.status}
                      onValueChange={(value: InquiryStatus) =>
                        handleStatusChange(inquiry.id, value)
                      }
                      disabled={updatingStatus === inquiry.id}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">
                          {lang === "de" ? statusLabels.new.de : statusLabels.new.vn}
                        </SelectItem>
                        <SelectItem value="in_progress">
                          {lang === "de"
                            ? statusLabels.in_progress.de
                            : statusLabels.in_progress.vn}
                        </SelectItem>
                        <SelectItem value="completed">
                          {lang === "de" ? statusLabels.completed.de : statusLabels.completed.vn}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(inquiry)}>
                        <Eye className="w-4 h-4 mr-1" />
                        {lang === "de" ? "Details" : "Chi tiết"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(inquiry)}
                        disabled={deletingId === inquiry.id}
                      >
                        {deletingId === inquiry.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-red-500" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedInquiry && (
            <>
              <DialogHeader>
                <DialogTitle>{lang === "de" ? "Anfrage-Details" : "Chi tiết yêu cầu"}</DialogTitle>
                <DialogDescription>
                  {lang === "de"
                    ? "Vollständige Informationen zur Anfrage"
                    : "Thông tin đầy đủ về yêu cầu"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Status & Type */}
                <div className="flex items-center gap-3">
                  <Badge className={`${statusColors[selectedInquiry.status]} border`}>
                    {lang === "de"
                      ? statusLabels[selectedInquiry.status].de
                      : statusLabels[selectedInquiry.status].vn}
                  </Badge>
                  <Badge className={`${typeColors[selectedInquiry.type]} border`}>
                    {lang === "de"
                      ? typeLabels[selectedInquiry.type].de
                      : typeLabels[selectedInquiry.type].vn}
                  </Badge>
                  {selectedInquiry.candidate_code && (
                    <Badge variant="outline">#{selectedInquiry.candidate_code}</Badge>
                  )}
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {lang === "de" ? "Erstellt am" : "Tạo lúc"}:{" "}
                    {formatDate(selectedInquiry.created_at)}{" "}
                    {new Date(selectedInquiry.created_at).toLocaleTimeString("de-DE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Client Info */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="font-semibold">{selectedInquiry.client_name}</div>
                      <div className="text-sm text-slate-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {selectedInquiry.email}
                      </div>
                    </div>
                  </div>

                  {selectedInquiry.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <span>{selectedInquiry.phone}</span>
                    </div>
                  )}

                  {selectedInquiry.company && (
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-slate-400" />
                      <span>{selectedInquiry.company}</span>
                    </div>
                  )}
                </div>

                {/* Message */}
                {selectedInquiry.message && (
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-700">
                        {lang === "de" ? "Nachricht" : "Tin nhắn"}
                      </span>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 whitespace-pre-wrap">
                      {selectedInquiry.message}
                    </div>
                  </div>
                )}

                {/* Status Change */}
                <div className="pt-4 border-t border-slate-200">
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    {lang === "de" ? "Status ändern" : "Thay đổi trạng thái"}
                  </label>
                  <Select
                    value={selectedInquiry.status}
                    onValueChange={(value: InquiryStatus) => {
                      handleStatusChange(selectedInquiry.id, value);
                    }}
                    disabled={updatingStatus === selectedInquiry.id}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">
                        {lang === "de" ? statusLabels.new.de : statusLabels.new.vn}
                      </SelectItem>
                      <SelectItem value="in_progress">
                        {lang === "de" ? statusLabels.in_progress.de : statusLabels.in_progress.vn}
                      </SelectItem>
                      <SelectItem value="completed">
                        {lang === "de" ? statusLabels.completed.de : statusLabels.completed.vn}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  {lang === "de" ? "Schließen" : "Đóng"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang === "de" ? "Anfrage löschen?" : "Xóa yêu cầu?"}</DialogTitle>
            <DialogDescription>
              {lang === "de"
                ? "Sind Sie sicher, dass Sie diese Anfrage löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
                : "Bạn có chắc chắn muốn xóa yêu cầu này? Hành động này không thể hoàn tác."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setInquiryToDelete(null);
              }}
              disabled={deletingId !== null}
            >
              {lang === "de" ? "Abbrechen" : "Hủy"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deletingId !== null}
            >
              {deletingId ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {lang === "de" ? "Wird gelöscht..." : "Đang xóa..."}
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {lang === "de" ? "Löschen" : "Xóa"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
