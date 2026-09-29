import { PRIVATE_ROBOTS } from "@/lib/site";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { isAdminUser } from "@/lib/auth/admin-policy";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export const metadata: Metadata = {
  title: "Admin Portal",
  description: "DMF Talents Verwaltungsportal",
  robots: PRIVATE_ROBOTS,
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (error || !isAdminUser(user)) {
    redirect("/login");
  }

  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>;
}
