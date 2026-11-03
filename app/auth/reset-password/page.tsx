"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updatePasswordAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  KeyRound,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [successRedirect, setSuccessRedirect] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await updatePasswordAction(formData);
    setIsLoading(false);
    if (!res.success) {
      setError(res.error);
      return;
    }
    const target = res.redirectTo || "/portal";
    setSuccessRedirect(target);
    setTimeout(() => {
      router.push(target);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-emerald-400 font-bold text-sm uppercase tracking-wider"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-emerald-400" />
          </div>
          DMF Talents • Kontosicherheit
        </Link>
        <h1 className="text-2xl font-extrabold text-white">
          Neues Passwort festlegen / Đặt lại mật khẩu
        </h1>
        <p className="text-xs text-slate-400">
          Geben Sie Ihr neues Passwort ein (mind. 8 Zeichen) • Nhập mật khẩu mới tối thiểu 8 ký tự
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900/90 border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-8 space-y-6">
          {successRedirect ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-white">
                Passwort erfolgreich aktualisiert! / Đổi mật khẩu thành công!
              </h2>
              <p className="text-xs text-slate-300">
                Sie werden automatisch weitergeleitet... / Hệ thống đang chuyển hướng...
              </p>
              <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <Link href={successRedirect}>Weiter zum Portal</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-950/60 border border-red-800/70 text-red-200 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-200 text-xs">
                  Neues Passwort / Mật khẩu mới (mind. 8 Zeichen) *
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm_password" className="text-slate-200 text-xs">
                  Passwort bestätigen / Nhập lại mật khẩu mới *
                </Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  required
                  minLength={8}
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
                    Speichern...
                  </>
                ) : (
                  <>
                    Passwort speichern / Lưu mật khẩu mới
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-800 text-center space-y-2">
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
              <Link href="/portal/login" className="hover:text-emerald-400 underline">
                Bewerber-Login
              </Link>
              <span>•</span>
              <Link href="/fuer-arbeitgeber/datenraum" className="hover:text-emerald-400 underline">
                Arbeitgeber-Datenraum
              </Link>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Verschlüsselte Authentifizierung nach DSGVO-Standard
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
