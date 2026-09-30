"use server";
import { requireAdmin } from "@/lib/auth/admin";
import { revalidatePath } from "next/cache";
import { inboxFilterSchema, workflowSchema } from "@/lib/validations/request-workflow";
import type { InboxRequest, RequestOwner } from "./inbox-types";
import { z } from "zod";

export async function getRequestInbox(input: unknown) {
  const filters = inboxFilterSchema.parse(input);
  try {
    const { supabase, user } = await requireAdmin();
    let query = supabase.from("dmf_request_inbox").select("*", { count: "exact" });
    if (filters.q) query = query.ilike("search_text", `%${filters.q.replace(/[\\%_]/g, "\\$&")}%`);
    if (filters.stage !== "all") query = query.eq("stage", filters.stage);
    if (filters.kind !== "all") query = query.eq("kind", filters.kind);
    if (filters.owner === "mine") query = query.eq("assigned_to", user.id);
    if (filters.owner === "unassigned") query = query.is("assigned_to", null);
    if (filters.due === "overdue")
      query = query
        .lt(
          "follow_up_on",
          new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(new Date())
        )
        .neq("stage", "closed");
    const [rows, directory] = await Promise.all([
      query
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .order("source")
        .range((filters.page - 1) * 25, filters.page * 25 - 1),
      supabase.rpc("dmf_request_assignees"),
    ]);
    if (rows.error || directory.error) throw new Error("Inbox unavailable");
    return {
      rows: (rows.data ?? []) as InboxRequest[],
      total: rows.count ?? 0,
      owners: (directory.data ?? []) as RequestOwner[],
      error: null,
    };
  } catch {
    return {
      rows: [] as InboxRequest[],
      total: 0,
      owners: [] as RequestOwner[],
      error: "Anfragen konnten nicht geladen werden. Bitte erneut versuchen.",
    };
  }
}
export async function getRequestDetail(source: string, id: string) {
  const { supabase, user } = await requireAdmin();
  if (!z.enum(["inquiry", "lead"]).safeParse(source).success || !z.uuid().safeParse(id).success)
    return null;
  const [record, directory] = await Promise.all([
    supabase.from("dmf_request_inbox").select("*").eq("source", source).eq("id", id).maybeSingle(),
    supabase.rpc("dmf_request_assignees"),
  ]);
  if (record.error || directory.error) throw new Error("Anfrage konnte nicht geladen werden.");
  if (!record.data) return null;
  return {
    record: record.data as InboxRequest,
    owners: directory.data as RequestOwner[],
    userId: user.id,
  };
}
export async function saveRequestWorkflow(
  input: unknown
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { supabase } = await requireAdmin();
    const parsed = workflowSchema.safeParse(input);
    if (!parsed.success)
      return { success: false, error: "Bitte prüfen Sie Status, Zuständigkeit und Wiedervorlage." };
    const p = parsed.data;
    // The database checks the selected owner and advances the revision atomically.
    const { data, error } = await supabase
      .from(p.source === "lead" ? "leads" : "inquiries")
      .update({
        status: p.status,
        assigned_to: p.assignedTo || null,
        follow_up_on: p.followUpOn || null,
        next_action: p.nextAction || null,
        notes: p.notes || null,
      })
      .eq("id", p.id)
      .eq("workflow_version", p.version)
      .select("id")
      .maybeSingle();
    if (error)
      return {
        success: false,
        error:
          "Speichern fehlgeschlagen. Prüfen Sie, ob die zuständige Person weiterhin Admin ist.",
      };
    if (!data)
      return {
        success: false,
        error:
          "Die Anfrage wurde inzwischen geändert. Bitte laden Sie sie neu und prüfen Sie Ihre Eingaben.",
      };
    revalidatePath("/admin/requests", "layout");
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Speichern nicht möglich. Bitte prüfen Sie Ihre Anmeldung." };
  }
}
