"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { withDeadline } from "@/lib/requests/deadline";
import { useEffect, useRef, useState } from "react";
import type { SmartChatBotProps } from "./SmartChatBot";
import type { ComponentType } from "react";

const labels = {
  de: {
    open: "Chat öffnen",
    loading: "Chat wird geladen…",
    retry: "Chat konnte nicht geladen werden. Erneut versuchen",
    close: "Schließen",
  },
  en: {
    open: "Open chat",
    loading: "Loading chat…",
    retry: "Chat could not load. Retry",
    close: "Close",
  },
  vn: {
    open: "Mở chat",
    loading: "Đang tải chat…",
    retry: "Không thể tải chat. Thử lại",
    close: "Đóng",
  },
};

/** Import on intent; mount only on click. Keep the mounted widget's draft/session on close. */
export function ChatBotLauncher() {
  const { lang } = useLanguage();
  const t = labels[lang] || labels.de;
  const [Widget, setWidget] = useState<ComponentType<SmartChatBotProps> | null>(null);
  const [activated, setActivated] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const pending = useRef<Promise<void> | null>(null);
  const wantsOpen = useRef(false);
  const mounted = useRef(true);
  const controller = useRef<AbortController | null>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      controller.current?.abort();
    };
  }, []);

  const load = () => {
    if (Widget || pending.current) return;
    controller.current = new AbortController();
    pending.current = withDeadline(() => import("./SmartChatBot"), 15000, controller.current)
      .then((module) => {
        if (!mounted.current) return;
        setWidget(() => module.SmartChatBot);
        setFailed(false);
        if (wantsOpen.current) {
          setActivated(true);
          setOpen(true);
        }
      })
      .catch(() => {
        if (mounted.current) setFailed(true);
      })
      .finally(() => {
        pending.current = null;
        if (mounted.current) setLoading(false);
      });
  };
  const launch = () => {
    wantsOpen.current = true;
    if (Widget) {
      setActivated(true);
      setOpen(true);
    } else {
      setLoading(true);
      setFailed(false);
      load();
    }
  };

  return (
    <>
      {!open && (
        <div className="fixed z-[100] bottom-18 right-4 md:bottom-8 md:right-8 flex flex-col items-end gap-2">
          {(loading || failed) && (
            <div
              role="status"
              className="max-w-64 rounded-lg bg-white p-3 text-sm text-gray-800 shadow-lg"
            >
              {loading ? t.loading : t.retry}
              {loading && (
                <button
                  type="button"
                  className="ml-2 underline"
                  onClick={() => {
                    wantsOpen.current = false;
                    setLoading(false);
                  }}
                >
                  {t.close}
                </button>
              )}
            </div>
          )}
          <button
            ref={button}
            type="button"
            aria-label={failed ? t.retry : t.open}
            aria-expanded={false}
            aria-busy={loading}
            onMouseEnter={load}
            onFocus={load}
            onClick={launch}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-primary via-blue-500 to-indigo-500 text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:h-16 md:w-16"
          >
            <svg
              aria-hidden="true"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
            </svg>
          </button>
        </div>
      )}
      {activated && Widget && (
        <Widget
          open={open}
          onClose={() => {
            wantsOpen.current = false;
            setOpen(false);
            requestAnimationFrame(() => button.current?.focus());
          }}
        />
      )}
    </>
  );
}
