"use client";

import { useState } from "react";
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

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop: fixed position */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-[260px] z-40">
        <AdminSidebar />
      </aside>

      {/* Spacer for desktop sidebar */}
      <div className="hidden lg:block w-[260px] flex-shrink-0" />

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen flex flex-col">
        <AdminHeader user={user} onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
