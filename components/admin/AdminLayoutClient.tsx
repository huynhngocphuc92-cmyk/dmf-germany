"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

// ============================================
// ADMIN LAYOUT CLIENT COMPONENT
// ============================================

interface AdminLayoutClientProps {
  user: User | null;
  children: React.ReactNode;
}

export function AdminLayoutClient({ user, children }: AdminLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if we're on desktop (lg breakpoint = 1024px)
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar - Desktop (AdminSidebar already has fixed positioning) */}
      {isDesktop && <AdminSidebar />}

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && !isDesktop && (
        <div
          className="fixed inset-0 z-[45] bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {!isDesktop && (
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-[50] transition-transform duration-300",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <AdminSidebar />
        </div>
      )}

      {/* Main Content - pushed right on desktop */}
      <div
        className="min-h-screen transition-all duration-300 flex flex-col"
        style={{ marginLeft: isDesktop ? "260px" : "0" }}
      >
        <AdminHeader user={user} onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
