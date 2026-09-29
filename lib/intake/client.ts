"use client";
import { useRef } from "react";

// Retain an ID across network retries; changed content starts a new request.
export function useSubmissionKey() {
  const current = useRef<{ body: string; id: string } | null>(null);
  const forPayload = (body: unknown) => {
    const serialized = JSON.stringify(body);
    if (current.current?.body !== serialized)
      current.current = { body: serialized, id: crypto.randomUUID() };
    return current.current.id;
  };
  return {
    forPayload,
    reset: () => {
      current.current = null;
    },
  };
}
