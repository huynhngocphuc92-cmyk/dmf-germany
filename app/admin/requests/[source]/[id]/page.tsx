import { notFound } from "next/navigation";
import Link from "next/link";
import { getRequestDetail } from "../../workflow-actions";
import { RequestEditor } from "./request-editor";
export default async function RequestDetail({
  params,
}: {
  params: Promise<{ source: string; id: string }>;
}) {
  const { source, id } = await params;
  const data = await getRequestDetail(source, id);
  if (!data) notFound();
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <Link href="/admin/requests" className="text-primary underline">
        ← Alle Anfragen
      </Link>
      <RequestEditor key={`${source}:${id}`} {...data} />
    </div>
  );
}
