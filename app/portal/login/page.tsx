"use client";

import React, { useState } from "react";
import Link from "next/link";
import { portalLogin } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Loader2, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

export default function PortalLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await portalLogin(formData);
      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      }
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-emerald-400 font-bold text-sm uppercase tracking-wider"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
          </div>
          DMF Talents • Bewerber- & Azubi-Portal
        </Link>
        <h1 className="text-2xl font-extrabold text-white">Cổng Hồ Sơ Học Viên & Ứng Viên Đức</h1>
        <p className="text-xs text-slate-400">
          Đăng nhập để nộp giấy tờ, tạo Tabellarischer Lebenslauf, viết Motivationsschreiben (DIN
          5008) & luyện Vorstellungsgespräch
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900/90 border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-8 space-y-6">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-950/60 border border-red-800/70 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-200 text-xs">
                Email đăng nhập (E-Mail-Adresse) *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="hocvien@example.com"
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-slate-200 text-xs">
                Mật khẩu (Passwort) *
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang đăng nhập (Anmelden)...
                </>
              ) : (
                <>
                  Đăng nhập Cổng Học Viên
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center space-y-3">
            <p className="text-xs text-slate-400">
              Chưa có tài khoản hồ sơ DMF?{" "}
              <Link
                href="/portal/register"
                className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4"
              >
                Đăng ký tài khoản mới (Registrieren)
              </Link>
            </p>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Bảo mật dữ liệu theo tiêu chuẩn DSGVO (CHLB Đức)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
