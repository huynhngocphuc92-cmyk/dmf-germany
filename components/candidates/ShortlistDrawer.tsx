"use client";

import { useState } from "react";
import Link from "next/link";
import { BookmarkCheck, X, ArrowRight, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useCandidateShortlist } from "@/lib/candidates/shortlist";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";

export function ShortlistDrawer() {
  const { items, removeShortlisted, clearShortlist } = useCandidateShortlist();
  const { lang } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;

  const codesParam = items.map((c) => `${c.code} (${c.profession})`).join(", ");
  const primaryService = items[0]?.category || "unsure";
  const requestHref = `/fuer-arbeitgeber/personalbedarf?service=${encodeURIComponent(
    primaryService
  )}&candidates=${encodeURIComponent(codesParam)}`;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl print:hidden">
      <div className="rounded-2xl border border-slate-700/80 ring-1 ring-emerald-400/25 bg-slate-900/95 text-white shadow-2xl backdrop-blur-md overflow-hidden">
        {expanded && (
          <div className="p-4 border-b border-slate-800 max-h-60 overflow-y-auto space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span>
                {lang === "de"
                  ? "Ihre gemerkten Kandidaten-Profile (Merkliste)"
                  : lang === "en"
                    ? "Your Shortlisted Candidate Profiles"
                    : "Danh sách hồ sơ ứng viên đã lưu"}
              </span>
              <button
                type="button"
                onClick={clearShortlist}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {lang === "de" ? "Alle entfernen" : lang === "en" ? "Clear all" : "Xóa tất cả"}
              </button>
            </div>
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-slate-800/80 px-3.5 py-2.5 text-sm border border-slate-700/60"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    #{item.code}
                  </span>
                  <Link
                    href={`/fuer-arbeitgeber/kandidaten/${item.id}`}
                    className="font-medium text-white hover:text-emerald-300 truncate transition-colors"
                  >
                    {item.profession}
                  </Link>
                  {item.german_level && (
                    <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-slate-200">
                      Deutsch {item.german_level}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeShortlisted(item.id)}
                  aria-label={`Remove ${item.code}`}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="flex items-center justify-between sm:justify-start gap-2.5 text-left"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <BookmarkCheck className="w-4 h-4" />
            </span>
            <div>
              <span className="text-sm font-bold block">
                {lang === "de"
                  ? `${items.length} ${items.length === 1 ? "Kandidat" : "Kandidaten"} auf Ihrer Merkliste`
                  : lang === "en"
                    ? `${items.length} ${items.length === 1 ? "Candidate" : "Candidates"} Shortlisted`
                    : `Đã chọn ${items.length} hồ sơ ứng viên`}
              </span>
              <span className="text-xs text-slate-300">
                {lang === "de"
                  ? "Sammelanfrage für vollständige Bewerbungsmappen & Interviewtermine"
                  : lang === "en"
                    ? "Request full dossiers & interview slots in one click"
                    : "Gửi yêu cầu nhận trọn bộ hồ sơ & đặt lịch phỏng vấn cùng lúc"}
              </span>
            </div>
            <span className="ml-2 text-slate-400 hover:text-white">
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </span>
          </button>

          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="hidden sm:inline-flex border-slate-700 bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white text-xs rounded-xl"
            >
              <Link href="/fuer-arbeitgeber/datenraum">
                {lang === "de"
                  ? "Im Datenraum öffnen"
                  : lang === "en"
                    ? "Open in Data Room"
                    : "Mở trong Phòng dữ liệu"}
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-1.5 rounded-xl"
            >
              <Link href={requestHref}>
                {lang === "de"
                  ? `Dossiers anfordern (${items.length})`
                  : lang === "en"
                    ? `Request Dossiers (${items.length})`
                    : `Yêu cầu ${items.length} hồ sơ`}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
