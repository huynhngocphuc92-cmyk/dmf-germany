"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { PublicCandidate } from "@/lib/candidates/public-profile";

const STORAGE_KEY = "dmf_candidate_shortlist_v1";
const SYNC_EVENT = "dmf-shortlist-updated";
const EMPTY_SHORTLIST: ShortlistedCandidate[] = [];

export interface ShortlistedCandidate {
  id: string;
  code: string;
  profession: string;
  category: PublicCandidate["category"];
  german_level?: PublicCandidate["german_level"];
}

export function toShortlistedCandidate(candidate: PublicCandidate): ShortlistedCandidate {
  return {
    id: candidate.id,
    code: candidate.id.slice(0, 8).toUpperCase(),
    profession: candidate.profession || "Fachkraft / Azubi",
    category: candidate.category,
    german_level: candidate.german_level,
  };
}

let cachedRaw: string | null = null;
let cachedList: ShortlistedCandidate[] = EMPTY_SHORTLIST;

function readShortlistFromStorage(): ShortlistedCandidate[] {
  if (typeof window === "undefined") return EMPTY_SHORTLIST;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) {
      return cachedList;
    }
    cachedRaw = raw;
    if (!raw) {
      cachedList = EMPTY_SHORTLIST;
      return cachedList;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      cachedList = EMPTY_SHORTLIST;
      return cachedList;
    }
    cachedList = parsed.filter((item): item is ShortlistedCandidate =>
      Boolean(item && typeof item.id === "string" && typeof item.code === "string")
    );
    return cachedList;
  } catch {
    return EMPTY_SHORTLIST;
  }
}

function getServerSnapshot(): ShortlistedCandidate[] {
  return EMPTY_SHORTLIST;
}

function subscribeShortlist(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(SYNC_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(SYNC_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function writeShortlistToStorage(list: ShortlistedCandidate[]) {
  if (typeof window === "undefined") return;
  try {
    const nextRaw = JSON.stringify(list.slice(0, 12));
    window.localStorage.setItem(STORAGE_KEY, nextRaw);
    cachedRaw = nextRaw;
    cachedList = list.slice(0, 12);
    window.dispatchEvent(new CustomEvent(SYNC_EVENT));
  } catch {
    // Ignore storage quota errors
  }
}

export function useCandidateShortlist() {
  const items = useSyncExternalStore(
    subscribeShortlist,
    readShortlistFromStorage,
    getServerSnapshot
  );

  const isShortlisted = useCallback((id: string) => items.some((item) => item.id === id), [items]);

  const toggleShortlist = useCallback((candidate: PublicCandidate) => {
    const current = readShortlistFromStorage();
    const exists = current.some((item) => item.id === candidate.id);
    const next = exists
      ? current.filter((item) => item.id !== candidate.id)
      : [...current, toShortlistedCandidate(candidate)];
    writeShortlistToStorage(next);
  }, []);

  const removeShortlisted = useCallback((id: string) => {
    const current = readShortlistFromStorage();
    writeShortlistToStorage(current.filter((item) => item.id !== id));
  }, []);

  const clearShortlist = useCallback(() => {
    writeShortlistToStorage([]);
  }, []);

  return {
    items,
    isShortlisted,
    toggleShortlist,
    removeShortlisted,
    clearShortlist,
  };
}
