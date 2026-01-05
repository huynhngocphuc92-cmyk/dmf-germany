"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ArrowLeft,
  Plus,
  Search,
  Edit2,
  Trash2,
  User,
  Users,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { CandidateForm } from "@/components/admin/CandidateForm";
import { deleteCandidate, getCandidates } from "./actions";
import type { Candidate, CandidateCategory, CandidateStatus } from "./types";
import { categoryLabels, categoryColors, statusLabels, statusColors } from "./types";

// ============================================
// COMPONENT PROPS
// ============================================

interface CandidatesClientProps {
  initialCandidates: Candidate[] | null;
  error: string | null;
}

// ============================================
// CANDIDATES CLIENT COMPONENT
// ============================================

export function CandidatesClient({
  initialCandidates,
  error: initialError,
}: CandidatesClientProps) {
  const router = useRouter();

  // Data state
  const [candidates, setCandidates] = useState<Candidate[]>(
    initialCandidates || []
  );
  const [error, setError] = useState<string | null>(initialError);
  const [isLoading, setIsLoading] = useState(false);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );

  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Refresh data
  const handleRefresh = async () => {
    setIsLoading(true);
    const { data, error: fetchError } = await getCandidates();
    if (data) {
      setCandidates(data);
      setError(null);
    } else {
      setError(fetchError);
    }
    setIsLoading(false);
  };

  // Filter candidates
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.profession?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || candidate.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all" || candidate.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle edit
  const handleEdit = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsFormOpen(true);
  };

  // Handle delete
  const handleDeleteClick = (candidate: Candidate) => {
    setCandidateToDelete(candidate);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!candidateToDelete) return;

    setIsDeleting(true);
    const { success, error: deleteError } = await deleteCandidate(
      candidateToDelete.id
    );

    if (success) {
      setCandidates((prev) =>
        prev.filter((c) => c.id !== candidateToDelete.id)
      );
      setIsDeleteDialogOpen(false);
      setCandidateToDelete(null);
    } else {
      setError(deleteError);
    }
    setIsDeleting(false);
  };

  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedCandidate(null);
  };

  // Handle form success
  const handleFormSuccess = () => {
    handleRefresh();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Kandidaten</h1>
                <p className="text-xs text-slate-500">
                  {candidates.length} Kandidaten insgesamt
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Aktualisieren
              </Button>
              <Button
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600"
                onClick={() => {
                  setSelectedCandidate(null);
                  setIsFormOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Neuer Kandidat
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Nach Name, E-Mail oder Beruf suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Kategorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                {(Object.keys(categoryLabels) as CandidateCategory[]).map(
                  (key) => (
                    <SelectItem key={key} value={key}>
                      {categoryLabels[key]}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                {(Object.keys(statusLabels) as CandidateStatus[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {statusLabels[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {isLoading ? (
            // Loading State
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : filteredCandidates.length === 0 ? (
            // Empty State
            <div className="p-12 text-center">
              <Users className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                {candidates.length === 0
                  ? "Keine Kandidaten vorhanden"
                  : "Keine Treffer"}
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                {candidates.length === 0
                  ? "Fügen Sie Ihren ersten Kandidaten hinzu."
                  : "Versuchen Sie andere Suchbegriffe oder Filter."}
              </p>
              {candidates.length === 0 && (
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => {
                    setSelectedCandidate(null);
                    setIsFormOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Kandidat hinzufügen
                </Button>
              )}
            </div>
          ) : (
            // Table Content
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Kandidat</TableHead>
                  <TableHead>Kategorie</TableHead>
                  <TableHead>Beruf</TableHead>
                  <TableHead>Deutsch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    {/* Candidate Info */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                          {candidate.avatar_url ? (
                            <img
                              src={candidate.avatar_url}
                              alt={candidate.full_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {candidate.full_name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {candidate.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={categoryColors[candidate.category]}
                      >
                        {categoryLabels[candidate.category]}
                      </Badge>
                    </TableCell>

                    {/* Profession */}
                    <TableCell>
                      <span className="text-slate-700">
                        {candidate.profession || "-"}
                      </span>
                      {candidate.experience_years > 0 && (
                        <span className="text-slate-400 text-sm ml-1">
                          ({candidate.experience_years} J.)
                        </span>
                      )}
                    </TableCell>

                    {/* German Level */}
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-50">
                        {candidate.german_level}
                      </Badge>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColors[candidate.status]}
                      >
                        {statusLabels[candidate.status]}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(candidate)}
                        >
                          <Edit2 className="w-4 h-4 text-slate-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(candidate)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Results Count */}
        {!isLoading && filteredCandidates.length > 0 && (
          <p className="text-sm text-slate-500 mt-4 text-center">
            {filteredCandidates.length} von {candidates.length} Kandidaten
            angezeigt
          </p>
        )}
      </main>

      {/* Candidate Form Sheet */}
      <CandidateForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        candidate={selectedCandidate}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kandidat löschen?</DialogTitle>
            <DialogDescription>
              Sind Sie sicher, dass Sie{" "}
              <strong>{candidateToDelete?.full_name}</strong> löschen möchten?
              Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Löschen...
                </>
              ) : (
                "Löschen"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

