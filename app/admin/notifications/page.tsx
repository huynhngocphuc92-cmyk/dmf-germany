import { createAdminClient } from "@/lib/auth/admin";
import Link from "next/link";
import { z } from "zod";
import { RetryButton } from "./retry-button";

const rowSchema = z.object({
  id: z.uuid(),
  submission_id: z.uuid(),
  channel: z.enum(["email", "telegram", "auto_reply"]),
  status: z.enum(["pending", "sending", "sent", "failed", "skipped"]),
  attempts: z.number(),
  last_error: z.string().nullable(),
  updated_at: z.string(),
});
const statuses = {
  pending: "Ausstehend",
  sending: "In Bearbeitung",
  sent: "Gesendet",
  failed: "Fehlgeschlagen",
  skipped: "Nicht versendet",
};
const channels = {
  email: "E-Mail an DMF",
  telegram: "Telegram",
  auto_reply: "Eingangsbestätigung",
};
const reasons: Record<string, string> = {
  non_production: "Testumgebung: Versand deaktiviert",
  smtp_not_configured: "E-Mail ist noch nicht konfiguriert",
  telegram_not_configured: "Telegram ist noch nicht konfiguriert",
  provider_unavailable: "Dienst vorübergehend nicht erreichbar",
  smtp_rejected: "E-Mail nicht angenommen",
  telegram_rejected: "Telegram nicht angenommen",
};

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; page?: string }>;
}) {
  const params = await searchParams;
  const all = params.view === "all";
  const page = Math.max(1, Math.min(10000, Number.parseInt(params.page || "1", 10) || 1));
  const pageSize = 50;
  const db = await createAdminClient();
  let query = db
    .from("notification_deliveries")
    .select("id,submission_id,channel,status,attempts,last_error,updated_at", { count: "exact" });
  if (!all) query = query.neq("status", "sent");
  const { data, error, count } = await query
    .order("updated_at", { ascending: false })
    .order("id")
    .range((page - 1) * pageSize, page * pageSize - 1);
  const pageUrl = (number: number) =>
    `/admin/notifications?view=${all ? "all" : "open"}&page=${number}`;
  const parsed = z.array(rowSchema).safeParse(data);
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Benachrichtigungen</h1>
      <p className="max-w-3xl text-slate-600">
        Anfragen bleiben gespeichert, auch wenn eine Benachrichtigung nicht zugestellt wird. Prüfen
        Sie ausstehende Meldungen und senden Sie sie bei Bedarf erneut.
      </p>
      <nav aria-label="Benachrichtigungen filtern" className="flex gap-4">
        <Link
          className={!all ? "font-semibold underline" : "underline"}
          href="/admin/notifications"
        >
          Offene Zustellungen
        </Link>
        <Link
          className={all ? "font-semibold underline" : "underline"}
          href="/admin/notifications?view=all"
        >
          Alle Zustellungen
        </Link>
      </nav>
      {error || !parsed.success ? (
        <p role="alert" className="text-red-700">
          Benachrichtigungen konnten nicht geladen werden.
        </p>
      ) : parsed.data.length === 0 ? (
        <p>Noch keine Benachrichtigungen.</p>
      ) : parsed.data.length === 0 ? (
        <p role="status">Keine Zustellungen in dieser Ansicht.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                {["Anfrage", "Kanal", "Status", "Versuche", "Aktualisiert", "Aktion"].map(
                  (label) => (
                    <th key={label} className="p-4">
                      {label}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {parsed.data.map((row) => (
                <tr key={row.id} className="border-t align-top">
                  <td className="p-4 font-mono" title={row.submission_id}>
                    {row.submission_id.slice(0, 8)}
                  </td>
                  <td className="p-4">{channels[row.channel]}</td>
                  <td className="p-4">
                    <span
                      className={
                        row.status === "failed" ? "font-medium text-red-700" : "font-medium"
                      }
                    >
                      {statuses[row.status]}
                    </span>
                    {row.last_error && (
                      <p className="mt-1 text-slate-600">
                        {reasons[row.last_error] || "Bitte Konfiguration prüfen."}
                      </p>
                    )}
                  </td>
                  <td className="p-4">{row.attempts}</td>
                  <td className="p-4">
                    {new Date(row.updated_at).toLocaleString("de-DE", {
                      timeZone: "Europe/Berlin",
                    })}
                  </td>
                  <td className="p-4">{row.status !== "sent" && <RetryButton id={row.id} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <nav aria-label="Seiten" className="flex gap-4">
        {page > 1 && (
          <Link className="underline" href={pageUrl(page - 1)}>
            Zurück
          </Link>
        )}
        {(count || 0) > page * pageSize && (
          <Link className="underline" href={pageUrl(page + 1)}>
            Weiter
          </Link>
        )}
      </nav>
    </div>
  );
}
