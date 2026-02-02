import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export const metadata: Metadata = {
  title: "Admin Portal | DMF Vietnam",
  description: "DMF Vietnam Verwaltungsportal",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login");
  }

  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>;
}
