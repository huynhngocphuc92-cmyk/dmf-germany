import { notFound } from "next/navigation";
import Link from "next/link";
import { getRequestDetail } from "../../workflow-actions";
import { getRequestDossierBundle } from "../../dossier-actions";
import { RequestEditor } from "./request-editor";
import { RequestBewerbungsmappePanel } from "@/components/admin/RequestBewerbungsmappePanel";

export default async function RequestDetail({
  params,
}: {
  params: Promise<{ source: string; id: string }>;
}) {
  const { source, id } = await params;
  const [data, dossierBundle] = await Promise.all([
    getRequestDetail(source, id),
    getRequestDossierBundle(),
  ]);
  if (!data) notFound();
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <Link href="/admin/requests" className="text-primary underline print:hidden">
        ← Alle Anfragen
      </Link>
      <div className="print:hidden">
        <RequestEditor key={`${source}:${id}`} {...data} />
      </div>
      <div id="bewerbungsmappe">
        <RequestBewerbungsmappePanel
          key={`dossier:${source}:${id}`}
          record={data.record}
          profiles={dossierBundle.profiles}
          documents={dossierBundle.documents}
          letters={dossierBundle.letters}
        />
      </div>
    </div>
  );
}
