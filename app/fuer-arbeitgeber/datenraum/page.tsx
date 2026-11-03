import type { Metadata } from "next";
import { PRIVATE_ROBOTS, pageMetadata } from "@/lib/site";
import { getEmployerDataRoomBundle } from "./actions";
import { EmployerDataRoomClient } from "./datenraum-client";

export const metadata: Metadata = {
  ...pageMetadata(
    "/fuer-arbeitgeber/datenraum",
    "Arbeitgeber-Datenraum & Dossier-Zugang (DSGVO)",
    "Geschützter B2B-Datenraum für deutsche Arbeitgeber: Geprüfte Bewerbungsmappen einsehen, Video-Interviews anfragen und § 81a AufenthG Verfahren verfolgen."
  ),
  robots: PRIVATE_ROBOTS,
};

export default async function EmployerDataRoomPage() {
  const bundle = await getEmployerDataRoomBundle();

  return <EmployerDataRoomClient initialBundle={bundle} />;
}
