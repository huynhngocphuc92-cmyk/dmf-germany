import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getDashboardStats, getMockDashboardStats } from "./dashboard-actions";
import { AdminDashboardClient } from "./dashboard-client";

// ============================================
// ADMIN DASHBOARD (Server Component)
// ============================================

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Get current user (server-side)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Double-check authentication
  if (error || !user) {
    redirect("/login");
  }

  // Fetch dashboard stats
  const { data: stats, error: statsError } = await getDashboardStats();

  // Use mock data if no real data available or error occurred
  const dashboardStats = stats && stats.totalCandidates > 0 
    ? stats 
    : await getMockDashboardStats();

  return (
    <AdminDashboardClient 
      user={user} 
      stats={dashboardStats}
      isUsingMockData={!stats || stats.totalCandidates === 0}
    />
  );
}
