"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Bell, LogOut, Loader2, UserIcon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/login/actions";
import { useLanguage } from "@/lib/language-context";
import type { User } from "@supabase/supabase-js";

// ============================================
// LOGOUT BUTTON
// ============================================

function LogoutButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="ghost"
      size="sm"
      className="text-slate-600 hover:text-red-600"
      disabled={pending}
    >
      {pending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      <span className="hidden sm:inline ml-2">{label}</span>
    </Button>
  );
}

// ============================================
// ADMIN HEADER COMPONENT
// ============================================

interface AdminHeaderProps {
  user: User | null;
  onMenuClick?: () => void;
}

export function AdminHeader({ user, onMenuClick }: AdminHeaderProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left - Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Language Toggle */}
          <div className="flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-slate-100 border border-slate-200">
            <button
              onClick={() => setLanguage("de")}
              className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                language === "de"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              DE
            </button>
            <button
              onClick={() => setLanguage("vn")}
              className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                language === "vn"
                  ? "bg-emerald-500 text-white"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              VN
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-sm text-slate-600 max-w-[150px] truncate">
                {user.email}
              </span>
            </div>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          {/* Logout */}
          <form action={signOut}>
            <LogoutButton label={language === "de" ? "Abmelden" : "Đăng xuất"} />
          </form>
        </div>
      </div>
    </header>
  );
}

