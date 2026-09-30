export interface RequestOwner {
  id: string;
  label: string;
}
export interface InboxRequest {
  id: string;
  source: "inquiry" | "lead";
  reference: string;
  kind: "hiring" | "contact" | "profile" | "lead";
  contact_name: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  message: string | null;
  status: string;
  stage: "new" | "active" | "closed";
  candidate_id: string | null;
  candidate_code: string | null;
  service: string | null;
  headcount: number | null;
  work_location: string | null;
  start_window: string | null;
  source_path: string | null;
  campaign: { source?: string; medium?: string; campaign?: string };
  assigned_to: string | null;
  follow_up_on: string | null;
  next_action: string | null;
  notes: string | null;
  workflow_version: number;
  created_at: string;
  updated_at: string | null;
}
export const requestStatusLabels: Record<string, string> = {
  new: "Neu",
  in_progress: "In Bearbeitung",
  completed: "Bearbeitung abgeschlossen",
  contacted: "Kontaktiert",
  qualified: "Qualifiziert",
  converted: "Konvertiert (Altstatus)",
  lost: "Nicht weiterverfolgt",
};
export const requestKindLabels: Record<string, string> = {
  hiring: "Personalbedarf",
  contact: "Kontakt",
  profile: "Profil-Anfrage",
  lead: "Chat-Lead",
};
