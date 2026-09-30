import { redirect } from "next/navigation";
export default function LeadsPage() {
  redirect("/admin/requests?kind=lead");
}
