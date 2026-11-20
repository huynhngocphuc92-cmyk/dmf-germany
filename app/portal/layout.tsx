import type { Metadata } from "next";
import { PRIVATE_ROBOTS } from "@/lib/site";

export const metadata: Metadata = {
  robots: PRIVATE_ROBOTS,
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
