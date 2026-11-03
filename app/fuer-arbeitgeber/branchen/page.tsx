import { pageMetadata } from "@/lib/site";
import { BRANCHEN_CONFIGS } from "@/lib/content/branchen";
import { loadAssets } from "@/lib/theme-helpers";
import { BranchenHubClient } from "./branchen-hub-client";

export const metadata = pageMetadata(
  "/fuer-arbeitgeber/branchen",
  "Branchenlösungen: Fachkräfte & Azubis aus Vietnam nach Sektor",
  "Rekrutieren Sie qualifizierte Pflegefachkräfte, Handwerker, CNC-Techniker, Gastronomie-Azubis und Logistikpersonal aus Vietnam mit IHK/HWK-Anerkennung."
);

export default async function BranchenPage() {
  const assetKeys = BRANCHEN_CONFIGS.map((b) => b.assetKey);
  const customAssets = await loadAssets(assetKeys);

  return <BranchenHubClient customAssets={customAssets} />;
}
