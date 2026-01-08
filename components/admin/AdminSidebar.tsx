"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Newspaper,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

// ============================================
// SIDEBAR NAVIGATION ITEMS
// ============================================

interface NavItem {
  labelDe: string;
  labelVn: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    labelDe: "Dashboard",
    labelVn: "Tổng quan",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    labelDe: "Kandidaten",
    labelVn: "Ứng viên",
    href: "/admin/candidates",
    icon: Users,
  },
  {
    labelDe: "Blog & News",
    labelVn: "Blog & Tin tức",
    href: "/admin/posts",
    icon: Newspaper,
  },
  {
    labelDe: "Anfragen",
    labelVn: "Yêu cầu",
    href: "/admin/inquiries",
    icon: MessageSquare,
  },
  {
    labelDe: "Statistiken",
    labelVn: "Thống kê",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    labelDe: "Giao diện",
    labelVn: "Giao diện",
    href: "/admin/theme",
    icon: Palette,
  },
  {
    labelDe: "Einstellungen",
    labelVn: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
];

// ============================================
// ADMIN SIDEBAR COMPONENT
// ============================================

export function AdminSidebar() {
  const pathname = usePathname();
  const { lang } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-slate-900 text-white transition-all duration-300 flex flex-col",
        isCollapsed ? "w-[70px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h1 className="text-lg font-bold text-white truncate">DMF Admin</h1>
            <p className="text-xs text-slate-400 truncate">Verwaltungsportal</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    active
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white",
                    isCollapsed && "justify-center px-2"
                  )}
                  title={isCollapsed ? (lang === "de" ? item.labelDe : item.labelVn) : undefined}
                >
                  <Icon className={cn("w-5 h-5 flex-shrink-0", active && "text-emerald-400")} />
                  {!isCollapsed && (
                    <span className="truncate">
                      {lang === "de" ? item.labelDe : item.labelVn}
                    </span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span className="ml-auto bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-slate-800 p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "w-full text-slate-400 hover:text-white hover:bg-slate-800",
            isCollapsed && "px-2"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 mr-2" />
              <span>{lang === "de" ? "Einklappen" : "Thu gọn"}</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}

