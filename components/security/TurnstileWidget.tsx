"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { TurnstileAction } from "@/lib/cloudflare/turnstile-types";

export const TURNSTILE_SITE_KEY = (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "").trim();
export const isTurnstileEnabled = Boolean(TURNSTILE_SITE_KEY);

export interface TurnstileWidgetHandle {
  reset: () => void;
}

interface TurnstileRenderOptions {
  sitekey: string;
  action: TurnstileAction;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact" | "flexible";
  language?: "de" | "en" | "vi";
  callback: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise: Promise<TurnstileApi | null> | null = null;

function ensureTurnstileScript(): Promise<TurnstileApi | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<TurnstileApi | null>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${TURNSTILE_SCRIPT_SRC}"]`
    );
    if (existing) {
      if (window.turnstile) {
        resolve(window.turnstile);
        return;
      }
      existing.addEventListener("load", () => resolve(window.turnstile ?? null), { once: true });
      existing.addEventListener("error", () => reject(new Error("Turnstile script failed")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve(window.turnstile ?? null), { once: true });
    script.addEventListener(
      "error",
      () => {
        scriptPromise = null;
        reject(new Error("Turnstile script failed"));
      },
      { once: true }
    );
    document.head.appendChild(script);
  });

  return scriptPromise;
}

interface TurnstileWidgetProps {
  action: TurnstileAction;
  onToken: (token: string) => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact" | "flexible";
  language?: "de" | "en" | "vi" | "vn";
  className?: string;
}

export const TurnstileWidget = forwardRef<TurnstileWidgetHandle, TurnstileWidgetProps>(
  function TurnstileWidget(
    { action, onToken, theme = "light", size = "normal", language = "de", className },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const onTokenRef = useRef(onToken);

    useEffect(() => {
      onTokenRef.current = onToken;
    }, [onToken]);

    useImperativeHandle(ref, () => ({
      reset() {
        const id = widgetIdRef.current;
        if (id && typeof window !== "undefined" && window.turnstile) {
          try {
            window.turnstile.reset(id);
          } catch {
            // Ignore stale widget resets.
          }
        }
        onTokenRef.current("");
      },
    }));

    const widgetLang: "de" | "en" | "vi" =
      language === "vn" || language === "vi" ? "vi" : language === "en" ? "en" : "de";

    useEffect(() => {
      if (!TURNSTILE_SITE_KEY) return;
      let cancelled = false;

      void ensureTurnstileScript()
        .then((api) => {
          if (cancelled || !containerRef.current || !api) return;
          if (widgetIdRef.current) {
            try {
              api.remove(widgetIdRef.current);
            } catch {
              // Ignore stale widget removals.
            }
            widgetIdRef.current = null;
          }
          widgetIdRef.current = api.render(containerRef.current, {
            sitekey: TURNSTILE_SITE_KEY,
            action,
            theme,
            size,
            language: widgetLang,
            callback: (token) => onTokenRef.current(token),
            "expired-callback": () => onTokenRef.current(""),
            "error-callback": () => onTokenRef.current(""),
          });
        })
        .catch(() => {
          if (!cancelled) onTokenRef.current("");
        });

      return () => {
        cancelled = true;
        onTokenRef.current("");
        const id = widgetIdRef.current;
        widgetIdRef.current = null;
        if (id && typeof window !== "undefined" && window.turnstile) {
          try {
            window.turnstile.remove(id);
          } catch {
            // Ignore cleanup errors if element already unmounted.
          }
        }
      };
    }, [action, theme, size, widgetLang]);

    if (!TURNSTILE_SITE_KEY) {
      return null;
    }

    return <div ref={containerRef} className={className} data-turnstile-action={action} />;
  }
);
