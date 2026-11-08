import type { AeoPageConfig } from "@/lib/seo/aeo-schemas";

interface AeoSnippetSectionProps {
  config: AeoPageConfig;
  schemas?: ReadonlyArray<Record<string, unknown>>;
  accentColor?: "emerald" | "blue" | "amber" | "primary";
}

export function AeoSnippetSection({
  config,
  schemas = [],
  accentColor = "emerald",
}: AeoSnippetSectionProps) {
  const themeMap = {
    emerald: {
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      cardBorder: "border-emerald-200/80",
      accentBar: "bg-emerald-600",
      tableHead: "bg-emerald-950 text-white",
    },
    blue: {
      badge: "bg-blue-50 text-blue-800 border-blue-200",
      cardBorder: "border-blue-200/80",
      accentBar: "bg-blue-600",
      tableHead: "bg-blue-950 text-white",
    },
    amber: {
      badge: "bg-amber-50 text-amber-900 border-amber-200",
      cardBorder: "border-amber-200/80",
      accentBar: "bg-amber-600",
      tableHead: "bg-amber-950 text-white",
    },
    primary: {
      badge: "bg-slate-100 text-slate-800 border-slate-300",
      cardBorder: "border-slate-200",
      accentBar: "bg-primary",
      tableHead: "bg-slate-900 text-white",
    },
  };

  const styles = themeMap[accentColor];

  return (
    <section
      aria-label="Kurzantwort und Strukturdaten für Arbeitgeber"
      className="py-14 bg-white border-y border-slate-200/80"
    >
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      ))}

      <div className="container mx-auto px-4 max-w-5xl">
        {/* AEO Direct Answer Card (Position Zero & Speakable Target) */}
        <div
          className={`aeo-direct-answer relative rounded-2xl border ${styles.cardBorder} bg-slate-50/70 p-6 md:p-8 shadow-sm mb-10 overflow-hidden`}
        >
          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${styles.accentBar}`} />

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles.badge}`}
            >
              Rechtsgrundlage: {config.legalBasis}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
            {config.directAnswerTitle}
          </h2>

          <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-6">
            <strong>Das Wichtigste in Kürze:</strong> {config.directAnswerText}
          </p>

          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-200/80">
            {config.keyFacts.map((fact) => (
              <div
                key={fact.label}
                className="bg-white rounded-xl p-3.5 border border-slate-200/70"
              >
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  {fact.label}
                </dt>
                <dd className="text-sm font-bold text-slate-900">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Structured Comparison / Reference Table for Featured Table Snippets */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
          <table className="w-full text-left border-collapse text-sm">
            <caption className="p-4 text-left font-bold text-slate-900 bg-slate-50 border-b border-slate-200 text-base">
              {config.tableCaption}
            </caption>
            <thead className={styles.tableHead}>
              <tr>
                {config.tableHeaders.map((header) => (
                  <th key={header} scope="col" className="p-3.5 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {config.tableRows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-50/80 transition-colors">
                  {row.cells.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className={`p-3.5 ${cellIdx === 0 ? "font-semibold text-slate-900" : ""}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
