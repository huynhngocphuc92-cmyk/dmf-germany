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
    <div className="min-h-screen bg-slate-50 print:bg-white">
      {/* Sidebar - Desktop (AdminSidebar already has fixed positioning) */}
      {isDesktop && (
        <div className="print:hidden">
          <AdminSidebar />
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && !isDesktop && (
        <div
          className="fixed inset-0 z-[45] bg-black/50 print:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {!isDesktop && (
        <div
          aria-hidden={!isMobileMenuOpen}
          inert={!isMobileMenuOpen}
          onClick={(event) => {
            if (event.target instanceof Element && event.target.closest("a")) {
              setIsMobileMenuOpen(false);
            }
          }}
          className={cn(
            "fixed inset-y-0 left-0 z-[50] w-[260px] transition-transform duration-300 print:hidden",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <AdminSidebar />
        </div>
      )}

      {/* Main Content - pushed right on desktop, full width on print */}
      <div
        className={cn(
          "min-h-screen transition-all duration-300 print:ml-0",
          isDesktop ? "ml-[260px]" : "ml-0"
        )}
      >
        <div className="print:hidden">
          <AdminHeader user={user} onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        </div>
        <main className="p-4 lg:p-6 mt-10 print:p-0 print:mt-0">{children}</main>
      </div>
    </div>
  );
}
