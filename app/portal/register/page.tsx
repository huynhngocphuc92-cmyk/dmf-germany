"use client";

import React, { useState } from "react";
import Link from "next/link";
import { portalRegister } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PROGRAM_TRACK_CONFIG, type ProgramTrack } from "@/lib/portal/types";
import {
  GraduationCap,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function PortalRegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [requiresConfirmation, setRequiresConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<ProgramTrack>("azubi");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("program_track", selectedTrack);
    try {
      const res = await portalRegister(formData);
      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else if (res?.requiresConfirmation) {
        setRequiresConfirmation(true);
        setIsLoading(false);
      }
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
          </div>
          DMF Talents • Bewerber-Registrierung
        </Link>
        <h1 className="text-2xl font-extrabold text-white">
          Tạo Tài Khoản Hồ Sơ Chuẩn Đức (Bewerberkonto)
        </h1>
        <p className="text-xs text-slate-400">
          Quản lý hồ sơ du học nghề (Ausbildung), lao động chuyên môn (§18a/b), tự động tạo
          Lebenslauf & Motivationsschreiben chuẩn DIN 5008
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-slate-900/90 border border-slate-800 py-7 px-6 shadow-2xl rounded-2xl sm:px-8 space-y-5">
          {requiresConfirmation ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-white">
                Đăng ký thành công! Vui lòng xác nhận Email
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hệ thống đã gửi đường dẫn kích hoạt tới hộp thư của bạn. Sau khi xác nhận, bạn có
                thể đăng nhập ngay vào Cổng Học Viên DMF.
              </p>
              <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <Link href="/portal/login">Tới trang Đăng nhập</Link>
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

              {/* Program Track Selector */}
              <div className="space-y-2">
                <Label className="text-slate-200 text-xs">
                  Chọn diện hồ sơ mục tiêu (Programm / Visumkategorie) *
                </Label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(Object.keys(PROGRAM_TRACK_CONFIG) as ProgramTrack[]).map((trackKey) => {
                    const cfg = PROGRAM_TRACK_CONFIG[trackKey];
                    const active = selectedTrack === trackKey;
                    return (
                      <button
                        key={trackKey}
                        type="button"
                        onClick={() => setSelectedTrack(trackKey)}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          active
                            ? "bg-emerald-500/15 border-emerald-500 text-white"
                            : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <p className="text-xs font-bold text-white">{cfg.labelVn}</p>
                        <p className="text-[11px] text-emerald-400 font-medium">{cfg.labelDe}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{cfg.legalBasis}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="full_name" className="text-slate-200 text-xs">
                  Họ và Tên đầy đủ theo Hộ chiếu (Vollständiger Name laut Reisepass) *
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  required
                  placeholder="NGUYEN VAN A"
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-slate-200 text-xs">
                    Email cá nhân (E-Mail) *
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
                  <Label htmlFor="phone" className="text-slate-200 text-xs">
                    Số điện thoại / Zalo (Telefon) *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    required
                    placeholder="+84 912 345 678"
                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-200 text-xs">
                  Mật khẩu (Passwort – tối thiểu 8 ký tự) *
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

              {/* Optional Invite Code for AI Unlock */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/50 space-y-1.5">
                <Label
                  htmlFor="invite_code"
                  className="text-emerald-300 text-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Mã Học Viên DMF để mở khoá AI (DMF-Freischaltcode – Không bắt buộc)
                </Label>
                <Input
                  id="invite_code"
                  name="invite_code"
                  placeholder="VD: DMF-2026-AZUBI (Có thể nhập bổ sung sau khi đăng nhập)"
                  className="bg-slate-950 border-emerald-800/60 text-white placeholder:text-slate-500 text-xs"
                />
                <p className="text-[11px] text-slate-400">
                  Bạn vẫn có thể tạo tài khoản, điền CV và tải giấy tờ miễn phí. Nhập mã học viên
                  hoặc chờ Admin duyệt để bật tính năng AI dịch CV & viết Motivationsschreiben.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang khởi tạo hồ sơ...
                  </>
                ) : (
                  <>
                    Tạo Hồ Sơ Ứng Viên Ngay
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Đã có tài khoản?{" "}
              <Link
                href="/portal/login"
                className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4"
              >
                Đăng nhập tại đây (Anmelden)
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
