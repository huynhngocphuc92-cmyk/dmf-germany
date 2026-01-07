"use client";

import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  FileText,
  BarChart3,
  Settings,
  TrendingUp,
  UserPlus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Newspaper,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { DashboardStats } from "./dashboard-actions";
import { 
  categoryColors, 
  categoryLabelsI18n,
  adminTranslations,
  type AdminLanguage,
} from "./candidates/types";
import { useLanguage } from "@/components/providers/LanguageProvider";

// ============================================
// CHART COLORS
// ============================================

const CHART_COLORS = {
  azubi: "#3B82F6", // Blue
  skilled: "#10B981", // Emerald
  seasonal: "#F59E0B", // Amber
};

const PIE_COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

// ============================================
// ADMIN DASHBOARD CLIENT COMPONENT
// ============================================

interface AdminDashboardClientProps {
  user: User;
  stats: DashboardStats;
  isUsingMockData?: boolean;
}

export function AdminDashboardClient({
  user,
  stats,
  isUsingMockData = false,
}: AdminDashboardClientProps) {
  // Get language from context
  const { language } = useLanguage();
  const lang = language as AdminLanguage;
  const t = adminTranslations[lang];

  // Key metrics cards data
  const keyMetrics = [
    {
      title: t.totalCandidates,
      value: stats.totalCandidates,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: t.newApplications,
      value: stats.newApplications,
      icon: UserPlus,
      color: "bg-emerald-100 text-emerald-600",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: lang === "de" ? "Visa Bereit" : "Có Visa",
      value: stats.visaReady,
      icon: CheckCircle2,
      color: "bg-emerald-100 text-emerald-600",
      trend: "+5%",
      trendUp: true,
    },
    {
      title: t.successRate,
      value: `${stats.successRate}%`,
      icon: CheckCircle2,
      color: "bg-purple-100 text-purple-600",
      trend: "+3%",
      trendUp: true,
    },
  ];

  // Quick actions
  const quickActions = [
    { title: t.candidates, icon: Users, href: "/admin/candidates" },
    { title: t.blog, icon: Newspaper, href: "/admin/posts" },
    { title: t.statistics, icon: BarChart3, href: "/admin/analytics" },
    { title: t.settings, icon: Settings, href: "/admin/settings" },
  ];

  // Pie chart data - with translated labels
  const pieData = stats.categoryDistribution.map((item) => ({
    name: categoryLabelsI18n[item.category]?.[lang] || item.category,
    value: item.count,
    category: item.category,
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {t.dashboardTitle} 📊
        </h1>
        <p className="text-slate-500">
          {t.dashboardDesc}
        </p>
        {isUsingMockData && (
          <div className="mt-3 flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg w-fit">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{t.demoDataWarning}</span>
          </div>
        )}
      </div>

      {/* Key Metrics Row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${metric.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      metric.trendUp
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : "bg-red-50 text-red-600 border-red-200"
                    }`}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {metric.trend}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-slate-900 mb-1">
                  {metric.value}
                </p>
                <p className="text-sm text-slate-500">{metric.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Bar Chart - Monthly Candidates */}
        <Card className="lg:col-span-3 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t.candidatesPerMonth}</CardTitle>
            <CardDescription>
              {t.monthlyOverview}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.monthlyData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    axisLine={{ stroke: "#E2E8F0" }}
                  />
                  <YAxis
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    axisLine={{ stroke: "#E2E8F0" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="azubi"
                    name={categoryLabelsI18n.azubi[lang]}
                    fill={CHART_COLORS.azubi}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="skilled"
                    name={categoryLabelsI18n.skilled[lang]}
                    fill={CHART_COLORS.skilled}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="seasonal"
                    name={categoryLabelsI18n.seasonal[lang]}
                    fill={CHART_COLORS.seasonal}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - Category Distribution */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t.categoryDistribution}</CardTitle>
            <CardDescription>
              {t.categoryDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {pieData.map((item, index) => {
                const total = pieData.reduce((sum, i) => sum + i.value, 0);
                const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
                return (
                  <div key={item.category} className="flex items-center gap-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[index] }}
                    />
                    <span className="text-xs text-slate-600">
                      {item.name} ({percent}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t.quickAccess}</CardTitle>
            <CardDescription>{t.quickAccessDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto py-3 flex flex-col items-center gap-1.5 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all"
                    asChild
                  >
                    <Link href={action.href}>
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{action.title}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Candidates */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">{t.recentCandidates}</CardTitle>
                <CardDescription>
                  {t.recentDesc}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/candidates">
                  {lang === "vn" ? "Xem tất cả" : "Alle ansehen"}
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {stats.recentCandidates.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.name}</TableHead>
                    <TableHead>{t.category}</TableHead>
                    <TableHead>{lang === "de" ? "Visa Status" : "Trạng thái Visa"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">
                            {candidate.full_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {candidate.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={categoryColors[candidate.category]}
                        >
                          {categoryLabelsI18n[candidate.category]?.[lang] || candidate.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            candidate.visa_status
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-amber-100 text-amber-700 border-amber-200"
                          }
                        >
                          {candidate.visa_status
                            ? lang === "de"
                              ? "Visa Vorhanden"
                              : "Có Visa"
                            : lang === "de"
                            ? "In Bearbeitung"
                            : "Đang xử lý"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-slate-500">
                <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">
                  {lang === "vn" ? "Chưa có ứng viên nào." : "Noch keine Kandidaten vorhanden."}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  asChild
                >
                  <Link href="/admin/candidates">
                    <UserPlus className="w-4 h-4 mr-2" />
                    {lang === "vn" ? "Thêm ứng viên" : "Kandidat hinzufügen"}
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
