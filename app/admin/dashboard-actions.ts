"use server";

import { createClient } from "@/utils/supabase/server";
import type { Candidate, CandidateCategory, CandidateStatus } from "./candidates/types";

// ============================================
// DASHBOARD STATS TYPES
// ============================================

export interface DashboardStats {
  totalCandidates: number;
  newApplications: number;
  visaProcessing: number;
  approvedCount: number;
  successRate: number;
  categoryDistribution: CategoryCount[];
  statusDistribution: StatusCount[];
  monthlyData: MonthlyCount[];
  recentCandidates: Candidate[];
}

export interface CategoryCount {
  category: CandidateCategory;
  count: number;
  label: string;
}

export interface StatusCount {
  status: CandidateStatus;
  count: number;
  label: string;
}

export interface MonthlyCount {
  month: string;
  azubi: number;
  skilled: number;
  seasonal: number;
  total: number;
}

// ============================================
// GET DASHBOARD STATS
// ============================================

export async function getDashboardStats(): Promise<{
  data: DashboardStats | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    // Fetch all candidates
    const { data: candidates, error } = await supabase
      .from("candidates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching candidates:", error);
      return { data: null, error: error.message };
    }

    const allCandidates = (candidates || []) as Candidate[];

    // Calculate basic stats
    const totalCandidates = allCandidates.length;
    const newApplications = allCandidates.filter((c) => c.status === "new").length;
    const visaProcessing = allCandidates.filter((c) => c.status === "visa").length;
    const approvedCount = allCandidates.filter((c) => c.status === "approved").length;
    const successRate = totalCandidates > 0 
      ? Math.round((approvedCount / totalCandidates) * 100) 
      : 0;

    // Category distribution
    const categoryDistribution: CategoryCount[] = [
      {
        category: "azubi",
        count: allCandidates.filter((c) => c.category === "azubi").length,
        label: "Auszubildende",
      },
      {
        category: "skilled",
        count: allCandidates.filter((c) => c.category === "skilled").length,
        label: "Fachkräfte",
      },
      {
        category: "seasonal",
        count: allCandidates.filter((c) => c.category === "seasonal").length,
        label: "Saisonkräfte",
      },
    ];

    // Status distribution
    const statusDistribution: StatusCount[] = [
      { status: "new", count: newApplications, label: "Neu" },
      { status: "screening", count: allCandidates.filter((c) => c.status === "screening").length, label: "Vorauswahl" },
      { status: "interview", count: allCandidates.filter((c) => c.status === "interview").length, label: "Interview" },
      { status: "documents", count: allCandidates.filter((c) => c.status === "documents").length, label: "Dokumente" },
      { status: "visa", count: visaProcessing, label: "Visum" },
      { status: "approved", count: approvedCount, label: "Genehmigt" },
      { status: "rejected", count: allCandidates.filter((c) => c.status === "rejected").length, label: "Abgelehnt" },
    ];

    // Monthly data (last 6 months)
    const monthlyData = getMonthlyData(allCandidates);

    // Recent candidates (last 5)
    const recentCandidates = allCandidates.slice(0, 5);

    return {
      data: {
        totalCandidates,
        newApplications,
        visaProcessing,
        approvedCount,
        successRate,
        categoryDistribution,
        statusDistribution,
        monthlyData,
        recentCandidates,
      },
      error: null,
    };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { data: null, error: "Ein unerwarteter Fehler ist aufgetreten." };
  }
}

// ============================================
// HELPER: Get Monthly Data
// ============================================

function getMonthlyData(candidates: Candidate[]): MonthlyCount[] {
  const months: MonthlyCount[] = [];
  const now = new Date();

  // Generate last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
    const monthLabel = date.toLocaleDateString("de-DE", { month: "short" });

    const monthCandidates = candidates.filter((c) => {
      const candidateMonth = c.created_at?.slice(0, 7);
      return candidateMonth === monthKey;
    });

    months.push({
      month: monthLabel,
      azubi: monthCandidates.filter((c) => c.category === "azubi").length,
      skilled: monthCandidates.filter((c) => c.category === "skilled").length,
      seasonal: monthCandidates.filter((c) => c.category === "seasonal").length,
      total: monthCandidates.length,
    });
  }

  return months;
}

// ============================================
// MOCK DATA (for demo when no real data)
// ============================================

export async function getMockDashboardStats(): Promise<DashboardStats> {
  return {
    totalCandidates: 156,
    newApplications: 23,
    visaProcessing: 18,
    approvedCount: 48,
    successRate: 31,
    categoryDistribution: [
      { category: "azubi", count: 45, label: "Auszubildende" },
      { category: "skilled", count: 78, label: "Fachkräfte" },
      { category: "seasonal", count: 33, label: "Saisonkräfte" },
    ],
    statusDistribution: [
      { status: "new", count: 23, label: "Neu" },
      { status: "screening", count: 15, label: "Vorauswahl" },
      { status: "interview", count: 28, label: "Interview" },
      { status: "documents", count: 12, label: "Dokumente" },
      { status: "visa", count: 18, label: "Visum" },
      { status: "approved", count: 48, label: "Genehmigt" },
      { status: "rejected", count: 12, label: "Abgelehnt" },
    ],
    monthlyData: [
      { month: "Aug", azubi: 5, skilled: 12, seasonal: 8, total: 25 },
      { month: "Sep", azubi: 8, skilled: 15, seasonal: 6, total: 29 },
      { month: "Okt", azubi: 12, skilled: 18, seasonal: 10, total: 40 },
      { month: "Nov", azubi: 7, skilled: 14, seasonal: 5, total: 26 },
      { month: "Dez", azubi: 10, skilled: 20, seasonal: 8, total: 38 },
      { month: "Jan", azubi: 6, skilled: 16, seasonal: 4, total: 26 },
    ],
    recentCandidates: [],
  };
}

