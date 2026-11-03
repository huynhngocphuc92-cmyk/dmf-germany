"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getPublicCandidates } from "@/lib/supabase/candidates";
import type { PublicCandidate } from "@/lib/candidates/public-profile";
import { createIntakeClient } from "@/lib/supabase/intake";
import { getMailTransporter } from "@/lib/email/transporter";
import { escapeHtml } from "@/lib/sanitize";
import { SITE_URL } from "@/lib/site";

export interface EmployerInterviewRequestItem {
  id: string;
  candidateId: string;
  candidateCode: string;
  profession: string;
  actionType: "interview" | "reservation" | "dossier";
  preferredSlotDe: string;
  noteDe: string;
  stage: "requested" | "scheduled" | "contract_prep" | "visa_81a";
  createdAt: string;
}

export interface EmployerAccountProfile {
  userId: string;
  email: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  city: string;
  industry: string;
  dsgvoAccepted: boolean;
  dsgvoAcceptedAt: string | null;
  shortlistIds: string[];
  interviewRequests: EmployerInterviewRequestItem[];
}

export interface EmployerInquiryRecord {
  id: string;
  name: string;
  company: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

export interface EmployerDataRoomBundle {
  authenticated: boolean;
  profile: EmployerAccountProfile | null;
  candidates: PublicCandidate[];
  inquiries: EmployerInquiryRecord[];
}

function extractEmployerProfile(user: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  created_at?: string;
}): EmployerAccountProfile {
  const meta = user.user_metadata || {};
  const shortlistIds = Array.isArray(meta.employer_shortlist_ids)
    ? meta.employer_shortlist_ids.filter((id): id is string => typeof id === "string").slice(0, 24)
    : [];
  const interviewRequests = Array.isArray(meta.employer_interview_requests)
    ? (meta.employer_interview_requests as EmployerInterviewRequestItem[]).slice(0, 30)
    : [];

  return {
    userId: user.id,
    email: user.email || "",
    companyName:
      typeof meta.company_name === "string" && meta.company_name.trim()
        ? meta.company_name.trim()
        : "Deutscher Ausbildungs- & Fachkräftebetrieb",
    contactPerson:
      typeof meta.contact_person === "string" && meta.contact_person.trim()
        ? meta.contact_person.trim()
        : typeof meta.full_name === "string"
          ? meta.full_name.trim()
          : "",
    phone: typeof meta.phone === "string" ? meta.phone.trim() : "",
    city: typeof meta.city === "string" ? meta.city.trim() : "",
    industry: typeof meta.industry === "string" ? meta.industry.trim() : "Pflege & Gesundheit",
    dsgvoAccepted: Boolean(meta.dsgvo_b2b_accepted ?? true),
    dsgvoAcceptedAt:
      typeof meta.dsgvo_b2b_accepted_at === "string"
        ? meta.dsgvo_b2b_accepted_at
        : user.created_at || new Date().toISOString(),
    shortlistIds,
    interviewRequests,
  };
}

export async function getEmployerDataRoomBundle(): Promise<EmployerDataRoomBundle> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.is_anonymous) {
      return {
        authenticated: false,
        profile: null,
        candidates: [],
        inquiries: [],
      };
    }

    const profile = extractEmployerProfile(user);
    const { data: candidates } = await getPublicCandidates();

    let inquiries: EmployerInquiryRecord[] = [];
    if (user.email) {
      try {
        const intakeDb = createIntakeClient();
        const { data: rows } = await intakeDb
          .from("inquiries")
          .select("id, name, company, message, status, created_at")
          .ilike("email", user.email)
          .order("created_at", { ascending: false })
          .limit(20);

        if (Array.isArray(rows)) {
          inquiries = rows.map((r) => ({
            id: String(r.id),
            name: String(r.name || ""),
            company: r.company ? String(r.company) : null,
            message: r.message ? String(r.message) : null,
            status: String(r.status || "new"),
            createdAt: String(r.created_at || new Date().toISOString()),
          }));
        }
      } catch {
        // Fallback when service role key is not present in local dev environment
      }
    }

    return {
      authenticated: true,
      profile,
      candidates: candidates || [],
      inquiries,
    };
  } catch {
    return {
      authenticated: false,
      profile: null,
      candidates: [],
      inquiries: [],
    };
  }
}

export async function employerLoginAction(formData: FormData): Promise<{
  success: boolean;
  error: string | null;
}> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return {
      success: false,
      error: "Bitte geben Sie Ihre geschäftliche E-Mail-Adresse und Ihr Passwort ein.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message === "Invalid login credentials") {
      return {
        success: false,
        error: "E-Mail-Adresse oder Passwort ist nicht korrekt.",
      };
    }
    if (error.message.includes("Email not confirmed")) {
      return {
        success: false,
        error:
          "Ihre E-Mail-Adresse wurde noch nicht bestätigt. Bitte prüfen Sie Ihr E-Mail-Postfach.",
      };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/fuer-arbeitgeber/datenraum");
  return { success: true, error: null };
}

export async function employerRegisterAction(formData: FormData): Promise<{
  success: boolean;
  requiresConfirmation?: boolean;
  error: string | null;
}> {
  const companyName = String(formData.get("company_name") || "").trim();
  const contactPerson = String(formData.get("contact_person") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const industry = String(formData.get("industry") || "Pflege & Gesundheit").trim();
  const password = String(formData.get("password") || "");
  const dsgvoAccepted = formData.get("dsgvo_accepted") === "true";

  if (companyName.length < 2) {
    return {
      success: false,
      error: "Bitte geben Sie den vollständigen Namen Ihres Unternehmens / Ihrer Einrichtung an.",
    };
  }
  if (contactPerson.length < 2) {
    return {
      success: false,
      error: "Bitte geben Sie eine(n) Ansprechpartner(in) an.",
    };
  }
  if (!email.includes("@")) {
    return {
      success: false,
      error: "Bitte geben Sie eine gültige geschäftliche E-Mail-Adresse ein.",
    };
  }
  if (password.length < 8) {
    return {
      success: false,
      error: "Das Passwort muss mindestens 8 Zeichen lang sein.",
    };
  }
  if (!dsgvoAccepted) {
    return {
      success: false,
      error:
        "Bitte bestätigen Sie die DSGVO-Vertraulichkeitserklärung für den Zugriff auf Kandidaten-Dossiers.",
    };
  }

  const nowIso = new Date().toISOString();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${SITE_URL}/auth/callback?next=/fuer-arbeitgeber/datenraum`,
      data: {
        account_type: "employer",
        company_name: companyName,
        contact_person: contactPerson,
        phone,
        city,
        industry,
        dsgvo_b2b_accepted: true,
        dsgvo_b2b_accepted_at: nowIso,
        employer_shortlist_ids: [],
        employer_interview_requests: [],
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/fuer-arbeitgeber/datenraum");

  if (data.session) {
    return { success: true, requiresConfirmation: false, error: null };
  }

  return { success: true, requiresConfirmation: true, error: null };
}

export async function employerSignOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/fuer-arbeitgeber/datenraum");
}

export async function syncEmployerShortlistAction(candidateIds: string[]): Promise<{
  success: boolean;
  shortlistIds: string[];
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.is_anonymous) {
    return { success: false, shortlistIds: [] };
  }

  const cleanIds = Array.from(
    new Set(candidateIds.filter((id) => typeof id === "string" && id.trim().length > 0))
  ).slice(0, 24);

  const { error } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      employer_shortlist_ids: cleanIds,
    },
  });

  if (error) {
    return { success: false, shortlistIds: [] };
  }

  revalidatePath("/fuer-arbeitgeber/datenraum");
  return { success: true, shortlistIds: cleanIds };
}

export async function updateEmployerProfileAction(input: {
  companyName: string;
  contactPerson: string;
  phone: string;
  city: string;
  industry: string;
}): Promise<{
  success: boolean;
  error: string | null;
  profile?: EmployerAccountProfile;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.is_anonymous) {
    return { success: false, error: "Sitzung abgelaufen. Bitte melden Sie sich erneut an." };
  }

  const { data, error } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      account_type: "employer",
      company_name: input.companyName.trim(),
      contact_person: input.contactPerson.trim(),
      phone: input.phone.trim(),
      city: input.city.trim(),
      industry: input.industry.trim(),
      dsgvo_b2b_accepted: true,
    },
  });

  if (error || !data.user) {
    return {
      success: false,
      error: "Unternehmensprofil konnte nicht aktualisiert werden.",
    };
  }

  revalidatePath("/fuer-arbeitgeber/datenraum");
  return {
    success: true,
    error: null,
    profile: extractEmployerProfile(data.user),
  };
}

export async function requestCandidateActionFromDataRoom(input: {
  candidateId: string;
  candidateCode: string;
  profession: string;
  actionType: "interview" | "reservation" | "dossier";
  preferredSlotDe: string;
  noteDe: string;
}): Promise<{
  success: boolean;
  error: string | null;
  profile?: EmployerAccountProfile;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.is_anonymous) {
    return {
      success: false,
      error: "Bitte melden Sie sich an, um diese Aktion auszuführen.",
    };
  }

  const currentProfile = extractEmployerProfile(user);
  const newItem: EmployerInterviewRequestItem = {
    id: `${Date.now()}-${input.candidateCode}`,
    candidateId: input.candidateId,
    candidateCode: input.candidateCode,
    profession: input.profession,
    actionType: input.actionType,
    preferredSlotDe: input.preferredSlotDe.trim() || "Nach Vereinbarung (Teams / Zoom)",
    noteDe: input.noteDe.trim(),
    stage: "requested",
    createdAt: new Date().toISOString(),
  };

  const nextRequests = [newItem, ...currentProfile.interviewRequests].slice(0, 30);
  const nextShortlist = Array.from(
    new Set([input.candidateId, ...currentProfile.shortlistIds])
  ).slice(0, 24);

  const { data: updatedUserRes, error: updateErr } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      employer_interview_requests: nextRequests,
      employer_shortlist_ids: nextShortlist,
    },
  });

  if (updateErr || !updatedUserRes.user) {
    return {
      success: false,
      error: "Anfrage konnte nicht im Datenraum gespeichert werden.",
    };
  }

  const actionLabelDe =
    input.actionType === "interview"
      ? "Video-Vorstellungsgespräch (Teams/Zoom)"
      : input.actionType === "reservation"
        ? "Unverbindliche 7-Tage-Profilreservierung"
        : "Freigabe der vollständigen Bewerbungsmappe";

  const composedMessage = `[Arbeitgeber-Datenraum • ${actionLabelDe}]\nKandidat: #${input.candidateCode} (${input.profession})\nTerminwunsch: ${newItem.preferredSlotDe}${newItem.noteDe ? `\nNotiz: ${newItem.noteDe}` : ""}`;

  // Also persist into public.inquiries for the Admin CRM (/admin/requests)
  try {
    const intakeDb = createIntakeClient();
    await intakeDb.from("inquiries").insert({
      name: currentProfile.contactPerson || currentProfile.companyName,
      email: currentProfile.email,
      phone: currentProfile.phone || null,
      company: currentProfile.companyName,
      message: composedMessage,
      status: "new",
    });
  } catch {
    // Non-fatal in local dev if service key is absent
  }

  // Optional Admin notification
  await notifyAdminEmployerDataRoomAction(currentProfile, newItem, actionLabelDe).catch(() => null);

  revalidatePath("/fuer-arbeitgeber/datenraum");
  revalidatePath("/admin/requests");

  return {
    success: true,
    error: null,
    profile: extractEmployerProfile(updatedUserRes.user),
  };
}

async function notifyAdminEmployerDataRoomAction(
  employer: EmployerAccountProfile,
  item: EmployerInterviewRequestItem,
  actionLabelDe: string
): Promise<void> {
  if (
    process.env.VERCEL_ENV === "preview" ||
    (process.env.VERCEL_ENV !== "production" && process.env.NOTIFICATION_DELIVERY !== "enabled")
  ) {
    return;
  }

  const title = `Arbeitgeber-Datenraum: ${actionLabelDe} (#${item.candidateCode})`;
  const adminUrl = `${SITE_URL}/admin/requests`;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        chat_id: chatId,
        text: `${title}\nFirma: ${employer.companyName} (${employer.contactPerson})\nE-Mail: ${employer.email}\nKandidat: #${item.candidateCode} (${item.profession})\nTerminwunsch: ${item.preferredSlotDe}\n${adminUrl}`,
      }),
    }).catch(() => null);
  }

  const transporter = getMailTransporter();
  const smtpUser = process.env.SMTP_USER?.trim();
  const from =
    process.env.SMTP_FROM?.trim() ||
    (smtpUser?.includes("@") ? smtpUser : process.env.CONTACT_EMAIL?.trim()) ||
    smtpUser;
  const recipient = process.env.CONTACT_EMAIL?.trim();

  if (transporter && from && recipient) {
    const html = `
      <h2>${escapeHtml(title)}</h2>
      <p><strong>Unternehmen:</strong> ${escapeHtml(employer.companyName)}</p>
      <p><strong>Ansprechpartner:</strong> ${escapeHtml(employer.contactPerson || "–")}</p>
      <p><strong>E-Mail:</strong> ${escapeHtml(employer.email)}</p>
      <p><strong>Telefon:</strong> ${escapeHtml(employer.phone || "–")} · <strong>Standort:</strong> ${escapeHtml(employer.city || "–")}</p>
      <p><strong>Kandidat:</strong> #${escapeHtml(item.candidateCode)} (${escapeHtml(item.profession)})</p>
      <p><strong>Aktion:</strong> ${escapeHtml(actionLabelDe)}</p>
      <p><strong>Terminwunsch:</strong> ${escapeHtml(item.preferredSlotDe)}</p>
      <p><strong>Notiz:</strong> ${escapeHtml(item.noteDe || "–")}</p>
      <p><a href="${adminUrl}">Im DMF Admin-Posteingang öffnen</a></p>
    `;
    await transporter
      .sendMail({
        from: { name: "DMF Arbeitgeber-Datenraum", address: from },
        to: { address: recipient, name: "DMF B2B Team" },
        replyTo: { address: employer.email, name: employer.contactPerson },
        subject: title,
        html,
      })
      .catch(() => null);
  }
}
