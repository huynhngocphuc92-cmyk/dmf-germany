"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { currentRequestContext } from "@/lib/intake/context";

export function RequestContextCapture() {
  const pathname = usePathname();
  useEffect(() => {
    currentRequestContext(window.location.href);
  }, [pathname]);
  return null;
}
