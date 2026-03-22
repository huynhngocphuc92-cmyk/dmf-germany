"use client";

import type { ReactNode } from "react";
import { LazyMotion } from "framer-motion";

const loadMotionFeatures = () =>
  import("@/lib/framer-motion-features").then((mod) => mod.default);

interface MotionProviderProps {
  children: ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  return <LazyMotion features={loadMotionFeatures}>{children}</LazyMotion>;
}
