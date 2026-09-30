import Link from "next/link";
import { getRequestInbox } from "./workflow-actions";
import { inboxFilterSchema } from "@/lib/validations/request-workflow";
import { requestKindLabels, requestStatusLabels } from "./inbox-types";
export const dynamic = "force-dynamic";
export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = inboxFilterSchema.parse(await searchParams);
  const { rows, total, owners, error } = await getRequestInbox(filters);
  const ownerNames = new Map(owners.map((o) => [o.id, o.label]));
  const inputClass = "h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm min-w-0 w-full";
  function pageLink(page: number) {
    return `/admin/requests?${new URLSearchParams({ ...filters, page: String(page) })}`;
  }
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Anfragen & Personalbedarf</h1>
        <p className="text-slate-600 mt-2">
          Website, Profile und Chat in einem Posteingang. Zuständigkeit und nächsten Schritt
          festhalten.
        </p>
      </div>
      <form
        method="get"
        className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 rounded-xl border bg-white p-5"
      >
        <label className="text-sm font-medium">
          Suche nach Firma, Kontakt, Profil oder Referenz
          <input name="q" defaultValue={filters.q} maxLength={100} className={inputClass} />
        </label>
        <label className="text-sm font-medium">
          Bearbeitung
          <select name="stage" defaultValue={filters.stage} className={inputClass}>
            <option value="all">Alle</option>
            <option value="new">Neu</option>
            <option value="active">In Bearbeitung</option>
            <option value="closed">Abgeschlossen</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Quelle
          <select name="kind" defaultValue={filters.kind} className={inputClass}>
            <option value="all">Alle Quellen</option>
            {Object.entries(requestKindLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Zuständigkeit
          <select name="owner" defaultValue={filters.owner} className={inputClass}>
            <option value="all">Alle</option>
            <option value="mine">Mir zugewiesen</option>
            <option value="unassigned">Nicht zugewiesen</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Wiedervorlage
          <select name="due" defaultValue={filters.due} className={inputClass}>
            <option value="all">Alle Termine</option>
            <option value="overdue">Überfällig, noch offen</option>
          </select>
        </label>
        <div className="flex gap-3 items-end">
          <button className="h-11 px-5 rounded-lg bg-primary text-primary-foreground font-medium">
            Filtern
          </button>
          <Link href="/admin/requests" className="text-sm underline py-3">
            Zurücksetzen
          </Link>
        </div>
      </form>
      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 text-red-800 p-5">
          {error}
        </p>
      ) : (
        <>
          <p role="status" className="text-sm text-slate-600">
            {total} Anfragen · Seite {filters.page} von {Math.max(1, Math.ceil(total / 25))}
          </p>
          {rows.length ? (
            <ul className="space-y-3">
              {rows.map((row) => (
                <li
                  key={`${row.source}:${row.id}`}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex flex-wrap justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                        {requestKindLabels[row.kind] ?? row.kind}
                      </span>
                      <h2 className="text-lg font-semibold break-words mt-1">
                        <Link
                          className="underline decoration-slate-300 underline-offset-4"
                          href={`/admin/requests/${row.source}/${row.id}`}
                        >
                          {row.company || row.contact_name || row.email}
                        </Link>
                      </h2>
                      <p className="text-sm text-slate-600 break-all">
                        {row.contact_name ? `${row.contact_name} · ` : ""}
                        {row.email}
                      </p>
                    </div>
                    <span className="self-start rounded-full bg-slate-100 px-3 py-1 text-sm">
                      {requestStatusLabels[row.status] ?? row.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
                    <span>
                      Zuständig:{" "}
                      {row.assigned_to
                        ? ownerNames.get(row.assigned_to) || "Ehemaliger Admin"
                        : "Nicht zugewiesen"}
                    </span>
                    <span>Wiedervorlage: {row.follow_up_on || "Noch kein Termin"}</span>
                    {row.candidate_code && <span>Profil #{row.candidate_code}</span>}
                    <time dateTime={row.created_at}>
                      {new Date(row.created_at).toLocaleDateString("de-DE", {
                        timeZone: "Europe/Berlin",
                      })}
                    </time>
                  </div>
                  {row.next_action && (
                    <p className="mt-3 text-sm break-words">
                      <strong>Nächster Schritt:</strong> {row.next_action}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-10 rounded-xl border text-center text-slate-600">
              Keine Anfragen für diese Auswahl.
            </div>
          )}
          <nav aria-label="Ergebnisseiten" className="flex justify-between">
            {filters.page > 1 ? (
              <Link className="underline p-2" href={pageLink(filters.page - 1)}>
                Zurück
              </Link>
            ) : (
              <span />
            )}
            {filters.page * 25 < total && (
              <Link className="underline p-2" href={pageLink(filters.page + 1)}>
                Weiter
              </Link>
            )}
          </nav>
        </>
      )}
    </div>
  );
}
