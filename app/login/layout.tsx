import { PRIVATE_ROBOTS } from "@/lib/site";
export const metadata = { title: "Anmelden", robots: PRIVATE_ROBOTS };
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
