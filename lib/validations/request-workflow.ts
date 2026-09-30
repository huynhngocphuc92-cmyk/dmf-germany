import { z } from "zod";

export const inquiryStatuses = ["new", "in_progress", "completed"] as const;
export const leadStatuses = ["new", "contacted", "qualified", "converted", "lost"] as const;
export const workflowSchema = z
  .object({
    id: z.uuid(),
    source: z.enum(["inquiry", "lead"]),
    version: z.number().int().nonnegative(),
    status: z.string(),
    assignedTo: z.union([z.uuid(), z.literal("")]),
    followUpOn: z.union([z.iso.date(), z.literal("")]),
    nextAction: z.string().trim().max(500),
    notes: z.string().max(10000),
  })
  .superRefine((data, ctx) => {
    const allowed: readonly string[] = data.source === "lead" ? leadStatuses : inquiryStatuses;
    if (!allowed.includes(data.status))
      ctx.addIssue({
        code: "custom",
        path: ["status"],
        message: "Ungültiger Status für diese Anfrage.",
      });
  });
export type WorkflowValues = z.infer<typeof workflowSchema>;
export const inboxFilterSchema = z.object({
  q: z.string().trim().max(100).catch(""),
  stage: z.enum(["all", "new", "active", "closed"]).catch("all"),
  kind: z.enum(["all", "hiring", "contact", "profile", "lead"]).catch("all"),
  owner: z.enum(["all", "mine", "unassigned"]).catch("all"),
  due: z.enum(["all", "overdue"]).catch("all"),
  page: z.coerce.number().int().min(1).max(10000).catch(1),
});
export type InboxFilters = z.infer<typeof inboxFilterSchema>;
