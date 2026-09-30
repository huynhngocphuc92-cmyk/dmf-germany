"use client";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CONSENT_KEY, decodeConsent, type Consent } from "@/lib/consent";
const EVENT = "cookieConsentChange";
let memory: string | null = null;
function read() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return memory;
  }
}
function subscribe(change: () => void) {
  window.addEventListener(EVENT, change);
  window.addEventListener("storage", change);
  return () => {
    window.removeEventListener(EVENT, change);
    window.removeEventListener("storage", change);
  };
}
export function saveConsent(analytics: boolean, externalMedia: boolean) {
  memory = JSON.stringify({ version: 2, analytics, externalMedia, decided: true });
  try {
    localStorage.setItem(CONSENT_KEY, memory);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}
export function useConsent() {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  return useMemo(() => decodeConsent(raw), [raw]);
}
export function hasAnalyticsConsent() {
  return typeof window !== "undefined" && decodeConsent(read()).analytics;
}
export function openConsentSettings() {
  window.dispatchEvent(new Event("dmf-open-consent"));
}
const copy = {
  de: {
    title: "Ihre Datenschutzeinstellungen",
    description:
      "Notwendige Funktionen bleiben aktiv. Sie entscheiden getrennt über Statistik und externe Videos. Ihre Auswahl können Sie jederzeit im Seitenende ändern.",
    analytics: "Statistik (Google Analytics)",
    media: "Externe Videos (YouTube)",
    accept: "Alle erlauben",
    reject: "Nur notwendige",
    save: "Auswahl speichern",
    privacy: "Datenschutzerklärung",
  },
  en: {
    title: "Your privacy choices",
    description:
      "Essential functions remain active. Choose separately for analytics and external videos. You can change your choice in the footer at any time.",
    analytics: "Analytics (Google Analytics)",
    media: "External videos (YouTube)",
    accept: "Allow all",
    reject: "Necessary only",
    save: "Save choices",
    privacy: "Privacy policy",
  },
  vn: {
    title: "Lựa chọn quyền riêng tư",
    description:
      "Chức năng cần thiết luôn hoạt động. Anh chị chọn riêng cho thống kê và video bên ngoài. Có thể thay đổi lựa chọn tại cuối trang bất cứ lúc nào.",
    analytics: "Thống kê (Google Analytics)",
    media: "Video bên ngoài (YouTube)",
    accept: "Cho phép tất cả",
    reject: "Chỉ cần thiết",
    save: "Lưu lựa chọn",
    privacy: "Chính sách bảo mật",
  },
};
function ConsentPanel({ value, onClose }: { value: Consent; onClose: () => void }) {
  const { lang } = useLanguage();
  const t = copy[lang];
  const [analytics, setAnalytics] = useState(value.analytics);
  const [media, setMedia] = useState(value.externalMedia);
  function save(a: boolean, m: boolean) {
    saveConsent(a, m);
    onClose();
  }
  const button =
    "min-h-11 rounded-lg border border-primary px-4 py-3 font-semibold text-sm text-primary bg-background hover:bg-secondary";
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-xl max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription className="leading-relaxed">{t.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-3">
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="h-5 w-5 accent-primary"
            />
            {t.analytics}
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={media}
              onChange={(e) => setMedia(e.target.checked)}
              className="h-5 w-5 accent-primary"
            />
            {t.media}
          </label>
        </div>
        <Link href="/datenschutz" onClick={onClose} className="text-sm text-primary underline">
          {t.privacy}
        </Link>
        <div className="grid sm:grid-cols-2 gap-3 mt-2">
          <button className={button} onClick={() => save(false, false)}>
            {t.reject}
          </button>
          <button className={button} onClick={() => save(true, true)}>
            {t.accept}
          </button>
          <button
            className="sm:col-span-2 min-h-11 rounded-lg bg-primary text-primary-foreground px-4 py-3 font-semibold text-sm"
            onClick={() => save(analytics, media)}
          >
            {t.save}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export function CookieConsent() {
  const value = useConsent();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  const [opened, setOpened] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    const open = () => setOpened(true);
    window.addEventListener("dmf-open-consent", open);
    return () => window.removeEventListener("dmf-open-consent", open);
  }, []);
  if (!hydrated || (!opened && (value.decided || dismissed))) return null;
  return (
    <ConsentPanel
      key={`${value.analytics}:${value.externalMedia}`}
      value={value}
      onClose={() => {
        setOpened(false);
        setDismissed(true);
      }}
    />
  );
}
