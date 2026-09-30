"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  workflowSchema,
  inquiryStatuses,
  leadStatuses,
  type WorkflowValues,
} from "@/lib/validations/request-workflow";
import { saveRequestWorkflow } from "../../workflow-actions";
import {
  requestKindLabels,
  requestStatusLabels,
  type InboxRequest,
  type RequestOwner,
} from "../../inbox-types";

export function RequestEditor({
  record,
  owners,
  userId,
}: {
  record: InboxRequest;
  owners: RequestOwner[];
  userId: string;
}) {
  const router = useRouter();
  const [result, setResult] = useState<{ success: boolean; error: string | null } | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<WorkflowValues>({
    resolver: zodResolver(workflowSchema),
    values: {
      id: record.id,
      source: record.source,
      version: record.workflow_version,
      status: record.status,
      assignedTo: record.assigned_to || "",
      followUpOn: record.follow_up_on || "",
      nextAction: record.next_action || "",
      notes: record.notes || "",
    },
  });
  const field =
    "mt-1 w-full min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";
  return (
    <div className="mt-6 space-y-6">
      <div>
        <p className="text-sm text-primary font-semibold">{requestKindLabels[record.kind]}</p>
        <h1 className="text-2xl md:text-3xl font-bold break-words mt-2">
          {record.company || record.contact_name || "Anfrage"}
        </h1>
        <p className="mt-2 text-sm text-slate-500 break-all">Referenz: {record.reference}</p>
      </div>
      <section aria-label="Anfrage" className="rounded-xl border bg-white p-5 md:p-7 space-y-5">
        <dl className="grid sm:grid-cols-2 gap-4 text-sm">
          {[
            ["Kontakt", record.contact_name],
            ["E-Mail", record.email],
            ["Telefon", record.phone],
            ["Dienstleistung", record.service],
            ["Anzahl", record.headcount],
            ["Einsatzort", record.work_location],
            ["Gewünschter Start", record.start_window],
            ["Profil", record.candidate_code ? `#${record.candidate_code}` : null],
            ["Ausgangsseite", record.source_path],
            [
              "Kampagne",
              Object.entries(record.campaign || {})
                .map(([k, v]) => `${k}: ${v}`)
                .join(" · "),
            ],
          ].map(([label, value]) => (
            <div key={String(label)} className="min-w-0">
              <dt className="text-slate-500">{label}</dt>
              <dd className="font-medium break-words">{value || "–"}</dd>
            </div>
          ))}
        </dl>
        <div>
          <h2 className="font-semibold">Nachricht</h2>
          <p className="whitespace-pre-wrap break-words mt-2 text-slate-700">
            {record.message || "Keine Nachricht hinterlegt."}
          </p>
        </div>
      </section>
      <form
        onSubmit={handleSubmit(async (values) => {
          setResult(null);
          const saved = await saveRequestWorkflow(values);
          setResult(saved);
          if (saved.success) router.refresh();
        })}
        className="rounded-xl border bg-white p-5 md:p-7 space-y-5"
      >
        <h2 className="text-xl font-semibold">Bearbeitung</h2>
        <p className="text-sm text-slate-600">
          „Abgeschlossen“ bezeichnet den Bearbeitungsstand, keinen Vertragsabschluss. Interne
          Angaben werden nicht an den Absender gesendet.
        </p>
        {result && (
          <p
            role={result.success ? "status" : "alert"}
            className={`p-4 rounded-lg ${result.success ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}
          >
            {result.success ? "Bearbeitung gespeichert." : result.error}
          </p>
        )}
        <div className="grid sm:grid-cols-2 gap-5">
          <label className="text-sm font-medium">
            Status
            <select {...register("status")} className={field}>
              {(record.source === "lead" ? leadStatuses : inquiryStatuses).map((s) => (
                <option value={s} key={s}>
                  {requestStatusLabels[s]}
                </option>
              ))}
            </select>
            {errors.status && <span role="alert">{errors.status.message}</span>}
          </label>
          <div>
            <label className="text-sm font-medium" htmlFor="request-owner">
              Zuständig
            </label>
            <select id="request-owner" {...register("assignedTo")} className={field}>
              <option value="">Nicht zugewiesen</option>
              {record.assigned_to && !owners.some((o) => o.id === record.assigned_to) && (
                <option value={record.assigned_to}>Ehemaliger Admin (bitte neu zuweisen)</option>
              )}
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setValue("assignedTo", userId, { shouldDirty: true })}
              className="text-sm text-primary underline mt-2"
            >
              Mir zuweisen
            </button>
          </div>
          <label className="text-sm font-medium">
            Wiedervorlage (Datum in Deutschland)
            <input type="date" {...register("followUpOn")} className={field} />
            {errors.followUpOn && <span role="alert">Gültiges Datum erforderlich.</span>}
          </label>
          <label className="text-sm font-medium">
            Nächster Schritt
            <input
              {...register("nextAction")}
              maxLength={500}
              className={field}
              placeholder="z. B. Rückruf zum Anforderungsprofil"
            />
          </label>
        </div>
        <label className="block text-sm font-medium">
          Interne Notizen
          <textarea {...register("notes")} maxLength={10000} rows={5} className={field} />
          {errors.notes && <span role="alert">{errors.notes.message}</span>}
        </label>
        <div className="flex flex-wrap gap-4">
          <button
            disabled={isSubmitting}
            className="min-h-11 rounded-lg bg-primary text-primary-foreground px-6 font-medium disabled:opacity-60"
          >
            {isSubmitting ? "Wird gespeichert…" : "Bearbeitung speichern"}
          </button>
          <button type="button" onClick={() => router.refresh()} className="underline text-sm">
            Aktuellen Stand laden
          </button>
        </div>
      </form>
    </div>
  );
}
