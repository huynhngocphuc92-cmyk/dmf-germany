import { buildGlobalSchemas } from "@/lib/seo/geo-schemas";

export default function JsonLd() {
  const schemas = buildGlobalSchemas();
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas).replace(/</g, "\\u003c") }}
    />
  );
}
