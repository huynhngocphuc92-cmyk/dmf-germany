import Link from "next/link";
export default function ReferencesPage() {
  return (
    <div className="min-h-[65vh] bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <p className="text-primary font-semibold">DMF Talents</p>
        <h1 className="text-4xl font-bold">Zusammenarbeit auf einer klaren Grundlage</h1>
        <p className="text-lg text-slate-600">
          Sie möchten mehr über die Zusammenarbeit mit DMF erfahren? Beschreiben Sie uns Ihre
          Branche und Ihren Personalbedarf. Wir besprechen mit Ihnen, welche Informationen und
          Referenzen wir im jeweiligen Fall bereitstellen können.
        </p>
        <p className="text-slate-600">
          Aktuell sind auf dieser Seite keine freigegebenen Referenzberichte veröffentlicht.
        </p>
        <Link className="inline-block bg-primary text-white rounded-lg px-6 py-3" href="/#contact">
          Zusammenarbeit besprechen
        </Link>
      </div>
    </div>
  );
}
