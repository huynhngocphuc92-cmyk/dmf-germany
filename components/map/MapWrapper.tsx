"use client";

import dynamic from "next/dynamic";

/**
 * MapWrapper Component
 * Client Component wrapper for SuccessMap to enable SSR: false
 * This allows the page.tsx to remain a Server Component for SEO
 */
const SuccessMap = dynamic(() => import("./SuccessMap").then((mod) => ({ default: mod.SuccessMap })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] md:h-[80vh] bg-gray-100 animate-pulse flex items-center justify-center rounded-lg border border-gray-200">
      <p className="text-gray-500">Karte wird geladen...</p>
    </div>
  ),
});

export default function MapWrapper() {
  return <SuccessMap />;
}
