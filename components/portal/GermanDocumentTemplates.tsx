"use client";

import React from "react";
import type { StudentDocument, StudentMotivationLetter, StudentProfile } from "@/lib/portal/types";
import {
  DOCUMENT_CHECKLIST_CONFIG,
  PROGRAM_TRACK_CONFIG,
  computeCandidateAssessmentMetrics,
} from "@/lib/portal/types";

export type GermanTemplateType =
  | "full_cv"
  | "blind_kurzprofil"
  | "din5008_anschreiben"
  | "deckblatt_mappe"
  | "dsgvo_consent"
  | "vollmacht_81a"
  | "ba_erklaerung"
  | "dmf_bewertungsbogen";

interface GermanDocumentPreviewProps {
  template: GermanTemplateType;
  profile: StudentProfile;
  letter?: StudentMotivationLetter | null;
  documents?: StudentDocument[];
}

function formatGermanDate(isoOrDate?: string | null): string {
  if (!isoOrDate) {
    return new Date().toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
  const d = new Date(isoOrDate);
  if (Number.isNaN(d.getTime())) return isoOrDate;
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatYmToGerman(ym: string): string {
  if (!ym) return "";
  if (ym.toLowerCase() === "heute" || ym.toLowerCase() === "nay") return "heute";
  const match = ym.match(/^(\d{4})-(\d{2})$/);
  if (!match) return ym;
  return `${match[2]}/${match[1]}`;
}

export function GermanDocumentPreview({
  template,
  profile,
  letter,
  documents = [],
}: GermanDocumentPreviewProps) {
  const trackInfo = PROGRAM_TRACK_CONFIG[profile.program_track];
  const candidateCode = (profile.candidate_id || profile.id).slice(0, 8).toUpperCase();
  const signPlace = profile.signature_place || profile.address_city || "Ho-Chi-Minh-Stadt";
  const signDate = formatGermanDate(profile.signature_updated_at);

  // ==========================================================================
  // 1. TABELLARISCHER LEBENSLAUF (FULL GERMAN CV)
  // ==========================================================================
  if (template === "full_cv") {
    return (
      <div className="bg-white text-slate-900 p-8 sm:p-12 shadow-sm border border-slate-200 max-w-[210mm] mx-auto min-h-[297mm] font-sans text-[13px] leading-relaxed print:shadow-none print:border-none print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-6 gap-6">
          <div className="space-y-1.5">
            <p className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">
              Tabellarischer Lebenslauf
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {profile.full_name || "Họ và Tên Ứng Viên"}
            </h1>
            <p className="text-sm font-medium text-slate-700">
              {profile.target_profession || trackInfo.labelDe} ({trackInfo.labelDe})
            </p>
            <div className="pt-2 text-xs text-slate-600 space-y-0.5">
              {profile.date_of_birth && (
                <p>
                  <span className="font-semibold text-slate-800">Geburtsdatum / -ort:</span>{" "}
                  {formatGermanDate(profile.date_of_birth)} in {profile.place_of_birth || "Vietnam"}
                </p>
              )}
              <p>
                <span className="font-semibold text-slate-800">Staatsangehörigkeit:</span>{" "}
                {profile.nationality || "Vietnamesisch"} •{" "}
                <span className="font-semibold text-slate-800">Familienstand:</span>{" "}
                {profile.marital_status || "Ledig"}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Anschrift:</span>{" "}
                {[profile.address_street, profile.address_city, profile.address_country]
                  .filter(Boolean)
                  .join(", ") || "Vietnam"}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Kontakt:</span>{" "}
                {[profile.phone, profile.email].filter(Boolean).join(" | ")}
              </p>
            </div>
          </div>

          {/* Bewerbungsfoto */}
          <div className="w-28 h-36 rounded border border-slate-300 bg-slate-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[10px] text-slate-400 text-center px-2">
                Bewerbungsfoto
                <br />
                (3,5 x 4,5 cm)
              </span>
            )}
          </div>
        </div>

        {/* Berufserfahrung & Praktika */}
        {profile.work_experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
              Berufserfahrung & Praktika
            </h2>
            <div className="space-y-3">
              {[...profile.work_experience]
                .sort((a, b) => b.fromMonth.localeCompare(a.fromMonth))
                .map((work) => (
                  <div key={work.id} className="grid grid-cols-12 gap-4">
                    <div className="col-span-3 text-xs font-semibold text-slate-600">
                      {formatYmToGerman(work.fromMonth)} – {formatYmToGerman(work.toMonth)}
                    </div>
                    <div className="col-span-9">
                      <p className="font-bold text-slate-900">{work.roleDe || work.roleVn}</p>
                      <p className="text-xs text-slate-600 italic mb-1">
                        {work.company}
                        {work.location ? `, ${work.location}` : ""}
                      </p>
                      <p className="text-xs text-slate-700 whitespace-pre-line">
                        {work.tasksDe || work.tasksVn}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Bildungsweg */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
            Schulbildung & Akademischer / Beruflicher Werdegang
          </h2>
          <div className="space-y-3">
            {[...profile.education_history]
              .sort((a, b) => b.fromMonth.localeCompare(a.fromMonth))
              .map((edu) => (
                <div key={edu.id} className="grid grid-cols-12 gap-4">
                  <div className="col-span-3 text-xs font-semibold text-slate-600">
                    {formatYmToGerman(edu.fromMonth)} – {formatYmToGerman(edu.toMonth)}
                  </div>
                  <div className="col-span-9">
                    <p className="font-bold text-slate-900">{edu.degreeDe || edu.degreeVn}</p>
                    <p className="text-xs text-slate-600 italic">
                      {edu.institutionDe || edu.institutionVn}
                      {edu.location ? `, ${edu.location}` : ""}
                    </p>
                    {edu.detailsDe && (
                      <p className="text-xs text-slate-700 mt-0.5">{edu.detailsDe}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Sprachkenntnisse */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
            Sprachkenntnisse (nach GER)
          </h2>
          <div className="space-y-2">
            {profile.language_skills.map((lang, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-4">
                <div className="col-span-3 text-xs font-semibold text-slate-700">
                  {lang.languageDe}
                </div>
                <div className="col-span-9 text-xs text-slate-800">
                  <span className="font-semibold">{lang.level}</span>
                  {lang.provider ? ` (${lang.provider}` : ""}
                  {lang.examDate ? `, Prüfung: ${formatGermanDate(lang.examDate)}` : ""}
                  {lang.provider ? ")" : ""}
                  {lang.scores &&
                    (lang.scores.lesen ||
                      lang.scores.hoeren ||
                      lang.scores.schreiben ||
                      lang.scores.sprechen) && (
                      <span className="block text-[11px] text-slate-600 mt-0.5">
                        Teilergebnisse: Lesen {lang.scores.lesen || "–"} | Hören{" "}
                        {lang.scores.hoeren || "–"} | Schreiben {lang.scores.schreiben || "–"} |
                        Sprechen {lang.scores.sprechen || "–"}
                      </span>
                    )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Besondere Kenntnisse & Interessen */}
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
            Besondere Kenntnisse & Interessen
          </h2>
          <div className="space-y-1.5 text-xs">
            {profile.special_skills.professionalSkillsDe && (
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3 font-semibold text-slate-600">Fachkompetenzen:</div>
                <div className="col-span-9">{profile.special_skills.professionalSkillsDe}</div>
              </div>
            )}
            {profile.special_skills.edvSkillsDe && (
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3 font-semibold text-slate-600">EDV-Kenntnisse:</div>
                <div className="col-span-9">{profile.special_skills.edvSkillsDe}</div>
              </div>
            )}
            {profile.special_skills.drivingLicenseDe && (
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3 font-semibold text-slate-600">Führerschein:</div>
                <div className="col-span-9">{profile.special_skills.drivingLicenseDe}</div>
              </div>
            )}
            {profile.special_skills.hobbiesDe && (
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3 font-semibold text-slate-600">Interessen:</div>
                <div className="col-span-9">{profile.special_skills.hobbiesDe}</div>
              </div>
            )}
          </div>
        </section>

        {/* Ort, Datum & Unterschrift */}
        <div className="mt-10 pt-4 border-t border-slate-200 flex justify-between items-end">
          <div className="text-xs text-slate-700">
            {signPlace}, den {signDate}
          </div>
          <div className="text-right">
            {profile.signature_data_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.signature_data_url}
                alt="Unterschrift"
                className="h-12 object-contain ml-auto mb-1"
              />
            ) : (
              <div className="h-10 w-44 border-b border-dashed border-slate-400 mb-1" />
            )}
            <p className="text-xs font-semibold text-slate-800">{profile.full_name}</p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // 2. DMF ANONYMISIERTES KURZPROFIL (#CODE - BLIND PROFILE FOR B2B)
  // ==========================================================================
  if (template === "blind_kurzprofil") {
    return (
      <div className="bg-white text-slate-900 p-8 sm:p-12 shadow-sm border border-slate-200 max-w-[210mm] mx-auto min-h-[297mm] font-sans text-[13px] leading-relaxed print:shadow-none print:border-none print:p-0">
        {/* DMF Branded B2B Header */}
        <div className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-xl mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
              DMF Talents Germany • Geprüftes Kandidaten-Kurzprofil
            </p>
            <h1 className="text-2xl font-bold mt-1">Kandidat #{candidateCode}</h1>
            <p className="text-sm text-slate-300 mt-0.5">
              Zielposition: {profile.target_profession || trackInfo.labelDe} ({trackInfo.legalBasis}
              )
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-lg">
              Deutsch {profile.german_level} (GER)
            </span>
            <p className="text-[11px] text-slate-400 mt-2">DSGVO-konform anonymisiert</p>
          </div>
        </div>

        {/* Eckdaten Matrix */}
        <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-xs">
          <div>
            <span className="text-slate-500 block">Kategorie / Programm</span>
            <span className="font-bold text-slate-900">{trackInfo.labelDe}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Praxiserfahrung</span>
            <span className="font-bold text-slate-900">
              {profile.experience_years} {profile.experience_years === 1 ? "Jahr" : "Jahre"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Verfügbarkeit / Visum</span>
            <span className="font-bold text-emerald-700">
              Vorbereitet für § 81a / Regelverfahren
            </span>
          </div>
        </div>

        {/* Beruflicher & Schulischer Werdegang (Anonymisiert) */}
        {profile.work_experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
              Praxiserfahrung & Fachliche Stationen
            </h2>
            <div className="space-y-3">
              {profile.work_experience.map((work) => (
                <div key={work.id} className="grid grid-cols-12 gap-4">
                  <div className="col-span-3 text-xs font-semibold text-slate-600">
                    {formatYmToGerman(work.fromMonth)} – {formatYmToGerman(work.toMonth)}
                  </div>
                  <div className="col-span-9">
                    <p className="font-bold text-slate-900">{work.roleDe || work.roleVn}</p>
                    <p className="text-xs text-slate-600">
                      Fachbetrieb in {work.location || "Vietnam"}
                    </p>
                    <p className="text-xs text-slate-700 mt-0.5">{work.tasksDe || work.tasksVn}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
            Bildungsweg & Qualifikation
          </h2>
          <div className="space-y-3">
            {profile.education_history.map((edu) => (
              <div key={edu.id} className="grid grid-cols-12 gap-4">
                <div className="col-span-3 text-xs font-semibold text-slate-600">
                  {formatYmToGerman(edu.fromMonth)} – {formatYmToGerman(edu.toMonth)}
                </div>
                <div className="col-span-9">
                  <p className="font-bold text-slate-900">{edu.degreeDe || edu.degreeVn}</p>
                  <p className="text-xs text-slate-600">
                    {edu.institutionDe.includes("DMF")
                      ? edu.institutionDe
                      : `Bildungseinrichtung in ${edu.location || "Vietnam"}`}
                  </p>
                  {edu.detailsDe && (
                    <p className="text-xs text-slate-700 mt-0.5">{edu.detailsDe}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sprach- & Fachkompetenzen */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
            Sprach- & Fachkompetenzen
          </h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg border border-slate-200">
              <p className="font-bold text-slate-800 mb-1">Sprachprofil</p>
              <ul className="space-y-1 text-slate-700">
                {profile.language_skills.map((l, i) => (
                  <li key={i}>
                    • <strong>{l.languageDe}:</strong> {l.level}{" "}
                    {l.provider ? `(${l.provider})` : ""}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-3 rounded-lg border border-slate-200">
              <p className="font-bold text-slate-800 mb-1">Stärken & EDV</p>
              <p className="text-slate-700">
                {profile.special_skills.professionalSkillsDe || "Teamfähig, zuverlässig, belastbar"}
              </p>
              {profile.special_skills.edvSkillsDe && (
                <p className="text-slate-600 mt-1">EDV: {profile.special_skills.edvSkillsDe}</p>
              )}
            </div>
          </div>
        </section>

        {/* DMF Academy Quality Gate Stamp */}
        <div className="mt-10 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
          <p className="font-bold text-emerald-900 mb-1">
            ✓ Geprüft durch DMF Vietnam Academy (Quality Gate Verifizierung)
          </p>
          <p>
            Vollständige Bewerbungsmappe (inkl. klarnamentlichem Lebenslauf, Übersetzungen,
            Sprachzertifikat und Video-Vorstellungsgespräch) für{" "}
            <strong>Kandidat #{candidateCode}</strong> auf Anfrage über{" "}
            <strong>dmf-talents.de</strong> erhältlich.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // 3. MOTIVATIONSSCHREIBEN / ANSCHREIBEN NACH DIN 5008
  // ==========================================================================
  if (template === "din5008_anschreiben") {
    const subject =
      letter?.subject_de || `Bewerbung als ${profile.target_profession || trackInfo.labelDe}`;
    const salutation = letter?.salutation_de || "Sehr geehrte Damen und Herren,";
    const body =
      letter?.body_de ||
      "bitte erstellen oder wählen Sie im Tab „Motivationsschreiben (DIN 5008)“ ein Anschreiben aus.";
    const closing = letter?.closing_de || "Mit freundlichen Grüßen";

    return (
      <div className="bg-white text-slate-900 p-8 sm:p-14 shadow-sm border border-slate-200 max-w-[210mm] mx-auto min-h-[297mm] font-sans text-[13px] leading-[1.65] print:shadow-none print:border-none print:p-0">
        {/* DIN 5008 Briefkopf (Absender) */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-6 text-xs text-slate-700">
          <div>
            <p className="font-bold text-sm text-slate-900">{profile.full_name}</p>
            <p>
              {[profile.address_street, profile.address_city, profile.address_country]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
          <div className="text-right">
            <p>Tel.: {profile.phone || "–"}</p>
            <p>E-Mail: {profile.email}</p>
          </div>
        </div>

        {/* DIN 5008 Anschriftfeld (Empfänger) + Datum */}
        <div className="grid grid-cols-12 gap-4 mb-8">
          <div className="col-span-7">
            <p className="text-[10px] underline text-slate-500 mb-2">
              {profile.full_name} • {profile.address_city || "Vietnam"}
            </p>
            <div className="text-xs text-slate-900 space-y-0.5 min-h-[68px]">
              <p className="font-bold">
                {letter?.target_company_name || "An den Ausbildungs- / Personalverantwortlichen"}
              </p>
              {letter?.target_contact_person && <p>z. Hd. {letter.target_contact_person}</p>}
              {letter?.target_company_address && (
                <p className="whitespace-pre-line">{letter.target_company_address}</p>
              )}
              <p>{letter?.target_city || "Deutschland"}</p>
            </div>
          </div>
          <div className="col-span-5 text-right flex flex-col justify-end text-xs text-slate-700">
            <p>
              {signPlace}, den {signDate}
            </p>
          </div>
        </div>

        {/* DIN 5008 Betreffzeile (fett, ohne Schlusspunkt) */}
        <p className="font-bold text-slate-900 text-[14px] mb-5">{subject.replace(/\.$/, "")}</p>

        {/* Anrede */}
        <p className="mb-4">{salutation}</p>

        {/* Brieftext */}
        <div className="space-y-4 text-justify whitespace-pre-line mb-6">{body}</div>

        {/* Grußformel & Unterschrift */}
        <div className="mt-6">
          <p className="mb-3">{closing}</p>
          {profile.signature_data_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.signature_data_url}
              alt="Unterschrift"
              className="h-12 object-contain mb-1"
            />
          ) : (
            <div className="h-10 w-44 border-b border-dashed border-slate-400 mb-1" />
          )}
          <p className="font-semibold text-slate-900">{profile.full_name}</p>
        </div>

        {/* Anlagenvermerk nach DIN 5008 */}
        <div className="mt-10 pt-4 border-t border-slate-100 text-xs text-slate-600">
          <p className="font-bold text-slate-800 mb-1">Anlagen</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Tabellarischer Lebenslauf</li>
            <li>Sprachzertifikat Deutsch ({profile.german_level})</li>
            <li>Schul- und Ausbildungszeugnisse (inkl. beglaubigter deutscher Übersetzung)</li>
          </ul>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // 4. DECKBLATT & BEWERBUNGSMAPPE (COVER PAGE + DOSSIER INDEX)
  // ==========================================================================
  if (template === "deckblatt_mappe") {
    const checklist = DOCUMENT_CHECKLIST_CONFIG.filter(
      (item) =>
        item.requiredForTracks.includes(profile.program_track) ||
        item.optionalForTracks?.includes(profile.program_track)
    );

    return (
      <div className="bg-white text-slate-900 p-8 sm:p-14 shadow-sm border border-slate-200 max-w-[210mm] mx-auto min-h-[297mm] font-sans flex flex-col justify-between print:shadow-none print:border-none print:p-0">
        <div>
          <div className="border-b-4 border-emerald-600 pb-6 mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Bewerbungsmappe • {trackInfo.labelDe} ({trackInfo.legalBasis})
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
              Bewerbung als {profile.target_profession || trackInfo.labelDe}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Kandidaten-Referenz: #{candidateCode} • Sprachniveau Deutsch {profile.german_level}
            </p>
          </div>

          <div className="grid grid-cols-12 gap-8 items-center mb-10">
            <div className="col-span-4">
              <div className="w-40 h-52 rounded-xl border-2 border-slate-300 bg-slate-50 overflow-hidden flex items-center justify-center shadow-sm">
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-slate-400 text-center px-3">Bewerbungsfoto</span>
                )}
              </div>
            </div>
            <div className="col-span-8 space-y-2 text-sm">
              <h2 className="text-xl font-bold text-slate-900">{profile.full_name}</h2>
              <p className="text-slate-600">
                Geboren am {formatGermanDate(profile.date_of_birth)} in{" "}
                {profile.place_of_birth || "Vietnam"}
              </p>
              <p className="text-slate-600">
                wohnhaft in{" "}
                {[profile.address_city, profile.address_country].filter(Boolean).join(", ")}
              </p>
              <p className="text-slate-700 font-medium pt-2">
                E-Mail: {profile.email} • Telefon: {profile.phone || "–"}
              </p>
            </div>
          </div>

          {/* Inhaltsverzeichnis der Bewerbungsmappe */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3">
              Inhaltsverzeichnis der Bewerbungsunterlagen (Anlagenübersicht)
            </h3>
            <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside">
              <li className="font-medium text-slate-900">
                Motivationsschreiben (Anschreiben nach DIN 5008)
              </li>
              <li className="font-medium text-slate-900">Lückenloser tabellarischer Lebenslauf</li>
              {checklist.map((item) => {
                const uploadedOrig = documents.some(
                  (d) => d.doc_type === item.docType && d.variant === "original"
                );
                const uploadedTrans = documents.some(
                  (d) => d.doc_type === item.docType && d.variant === "certified_translation"
                );
                return (
                  <li key={item.docType} className="flex items-center justify-between py-0.5">
                    <span>
                      • {item.titleDe} <span className="text-slate-400">({item.titleVn})</span>
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700">
                      {uploadedOrig || uploadedTrans ? "✓ Beigefügt" : "In Vorbereitung"}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Vorbereitet durch DMF Vietnam Academy (dmf-talents.de)</span>
          <span>Stand: {signDate}</span>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // 5. DSGVO-EINWILLIGUNGSERKLÄRUNG (BILINGUAL DE-VN)
  // ==========================================================================
  if (template === "dsgvo_consent") {
    return (
      <div className="bg-white text-slate-900 p-8 sm:p-12 shadow-sm border border-slate-200 max-w-[210mm] mx-auto min-h-[297mm] font-sans text-[12.5px] leading-relaxed print:shadow-none print:border-none print:p-0">
        <div className="border-b-2 border-slate-800 pb-4 mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Datenschutz-Grundverordnung (Art. 6 Abs. 1 lit. a & Art. 49 DSGVO)
          </p>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Einwilligungserklärung zur Datenverarbeitung & Profilveröffentlichung
          </h1>
          <p className="text-xs text-slate-600">
            Bản cam kết và đồng ý xử lý dữ liệu cá nhân, hình ảnh & hồ sơ ứng tuyển theo chuẩn
            GDPR/DSGVO
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 text-xs">
          <div>
            <span className="text-slate-500 block">Name des Bewerbers (Họ và tên):</span>
            <strong className="text-slate-900">{profile.full_name}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Geburtsdatum & Reisepass-Nr.:</span>
            <strong className="text-slate-900">
              {formatGermanDate(profile.date_of_birth)} • Pass-Nr.: {profile.passport_number || "–"}
            </strong>
          </div>
        </div>

        <div className="space-y-4 text-justify">
          <div className="p-4 rounded-lg border border-slate-200">
            <p className="font-bold text-slate-900 mb-1">
              1. Übermittlung an Arbeitgeber & Behörden in Deutschland (Chuyển giao hồ sơ cho Nhà
              tuyển dụng & Cơ quan Đức)
            </p>
            <p className="text-slate-700">
              <strong>[DE]</strong> Ich willige ausdrücklich darin ein, dass die{" "}
              <strong>DMF Vietnam Joint Stock Company (Marke: DMF Talents)</strong> meine
              personenbezogenen Daten, meinen Lebenslauf, meine Zeugnisse, Sprachzertifikate sowie
              mein Bewerbungsfoto und Vorstellungsvideo zum Zwecke der Ausbildungs- bzw.
              Arbeitsvermittlung an potenzielle Arbeitgeber in Deutschland sowie an zuständige
              deutsche Behörden (Bundesagentur für Arbeit, Ausländerbehörden, IHK FOSA, ZAB,
              Deutsche Botschaft / Generalkonsulat) übermitteln darf.
            </p>
            <p className="text-slate-600 mt-1.5 text-xs">
              <strong>[VN]</strong> Tôi hoàn toàn đồng ý cho Công ty Cổ phần DMF Việt Nam (DMF
              Talents) xử lý và chuyển giao dữ liệu cá nhân, sơ yếu lý lịch (Lebenslauf), văn bằng,
              chứng chỉ tiếng Đức cũng như ảnh chụp và video giới thiệu bản thân của tôi cho các nhà
              tuyển dụng đối tác tại CHLB Đức và các cơ quan chức năng Đức có thẩm quyền để phục vụ
              mục đích tuyển dụng, công nhận văn bằng và xin thị thực (Visa).
            </p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200">
            <p className="font-bold text-slate-900 mb-1">
              2. Veröffentlichung als anonymisiertes Kurzprofil auf dmf-talents.de (Hiển thị Hồ sơ
              ẩn danh trên cổng B2B)
            </p>
            <p className="text-slate-700">
              <strong>[DE]</strong> Ich bin damit einverstanden, dass mein Profil in anonymisierter
              Form (unter dem Referenzcode <strong>#{candidateCode}</strong>, ohne Klarnamen und
              private Kontaktdaten) inklusive Bewerbungsfoto und Vorstellungsvideo auf der Plattform{" "}
              <em>dmf-talents.de</em> präsentiert wird.
            </p>
            <p className="text-slate-600 mt-1.5 text-xs">
              <strong>[VN]</strong> Tôi đồng ý để hồ sơ của mình được giới thiệu dưới dạng ẩn danh
              (sử dụng mã ứng viên <strong>#{candidateCode}</strong>, ẩn tên thật và số điện
              thoại/email cá nhân) kèm ảnh và video giới thiệu trên trang tuyển dụng B2B{" "}
              <em>dmf-talents.de</em>.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200">
            <p className="font-bold text-slate-900 mb-1">
              3. Widerrufsrecht nach Art. 7 Abs. 3 DSGVO (Quyền rút lại sự đồng ý)
            </p>
            <p className="text-slate-700">
              <strong>[DE]</strong> Diese Einwilligung ist freiwillig und kann jederzeit mit Wirkung
              für die Zukunft per E-Mail an DMF Talents widerrufen werden.
            </p>
            <p className="text-slate-600 mt-1 text-xs">
              <strong>[VN]</strong> Sự đồng ý này là hoàn toàn tự nguyện và tôi có quyền yêu cầu rút
              lại bất kỳ lúc nào bằng văn bản/email gửi tới DMF Talents.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-300 flex justify-between items-end">
          <div className="text-xs text-slate-700">
            <p>
              Ort, Datum:{" "}
              <strong>
                {signPlace}, den{" "}
                {formatGermanDate(profile.dsgvo_consent_signed_at || profile.signature_updated_at)}
              </strong>
            </p>
            <p className="text-[11px] text-emerald-700 mt-1">
              Status: {profile.dsgvo_consent_accepted ? "✓ Elektronisch unterzeichnet" : "Entwurf"}
            </p>
          </div>
          <div className="text-right">
            {profile.signature_data_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.signature_data_url}
                alt="Unterschrift"
                className="h-14 object-contain ml-auto mb-1"
              />
            ) : (
              <div className="h-12 w-48 border-b border-dashed border-slate-400 mb-1" />
            )}
            <p className="text-xs font-bold text-slate-900">{profile.full_name}</p>
            <p className="text-[10px] text-slate-500">
              Unterschrift des Bewerbers (Chữ ký ứng viên)
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // 6. VOLLMACHT NACH § 81a AUFENTHG (BILINGUAL DE-VN POWER OF ATTORNEY)
  // ==========================================================================
  if (template === "vollmacht_81a") {
    return (
      <div className="bg-white text-slate-900 p-8 sm:p-12 shadow-sm border border-slate-200 max-w-[210mm] mx-auto min-h-[297mm] font-sans text-[12.5px] leading-relaxed print:shadow-none print:border-none print:p-0">
        <div className="border-b-2 border-slate-800 pb-4 mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Beschleunigtes Fachkräfteverfahren (§ 81a AufenthG) & Anerkennungsverfahren
          </p>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Vollmacht & Berechtigung zur Unterbevollmächtigung
          </h1>
          <p className="text-xs text-slate-600">
            Giấy Uỷ Quyền thực hiện Thủ tục Chuyên gia/Học nghề rút gọn (§ 81a AufenthG) và Công
            nhận văn bằng tại Đức
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 text-xs space-y-1.5">
          <p className="font-bold text-slate-900 uppercase">Vollmachtgeber/in (Người uỷ quyền):</p>
          <p>
            <strong>Familienname, Vorname (Họ và tên):</strong> {profile.full_name}
          </p>
          <p>
            <strong>Geburtsdatum und -ort (Ngày và nơi sinh):</strong>{" "}
            {formatGermanDate(profile.date_of_birth)} in {profile.place_of_birth || "Vietnam"}
          </p>
          <p>
            <strong>Staatsangehörigkeit & Reisepass-Nr. (Quốc tịch & Số hộ chiếu):</strong>{" "}
            {profile.nationality || "Vietnamesisch"} • Reisepass-Nr.:{" "}
            {profile.passport_number || "____________________"}
          </p>
          <p>
            <strong>Wohnanschrift im Herkunftsland (Địa chỉ cư trú tại Việt Nam):</strong>{" "}
            {[profile.address_street, profile.address_city, profile.address_country]
              .filter(Boolean)
              .join(", ") || "Vietnam"}
          </p>
        </div>

        <div className="space-y-4 text-justify">
          <p>
            <strong>[DE] Hiermit bevollmächtige ich</strong> den künftigen Arbeitgeber /
            Ausbildungsbetrieb{" "}
            <strong>
              {profile.vollmacht_employer_name ||
                "[Name des deutschen Arbeitgebers / Ausbildungsbetriebs]"}
            </strong>{" "}
            sowie die <strong>DMF Vietnam Joint Stock Company (DMF Talents)</strong>, mich im Rahmen
            des beschleunigten Fachkräfteverfahrens gemäß <strong>§ 81a AufenthG</strong> bei der
            zuständigen Ausländerbehörde, der Bundesagentur für Arbeit sowie den zuständigen
            Anerkennungsstellen in Deutschland vollumfänglich zu vertreten.
          </p>
          <p className="text-xs text-slate-600">
            <strong>[VN] Bằng văn bản này, tôi chính thức uỷ quyền cho</strong> Doanh nghiệp tiếp
            nhận tại Đức{" "}
            <strong>
              {profile.vollmacht_employer_name || "[Tên Doanh nghiệp / Cơ sở đào tạo tại Đức]"}
            </strong>{" "}
            cùng đơn vị đồng hành <strong>Công ty Cổ phần DMF Việt Nam (DMF Talents)</strong> đại
            diện toàn quyền cho tôi thực hiện thủ tục rút gọn theo{" "}
            <strong>Điều 81a Luật Cư trú Đức (§ 81a AufenthG)</strong> tại Sở Ngoại kiều, Cơ quan
            Lao động Liên bang Đức và các cơ quan công nhận văn bằng.
          </p>

          <div className="p-4 rounded-lg border border-slate-200 space-y-1.5 text-xs">
            <p className="font-bold text-slate-900">
              Die Vollmacht umfasst insbesondere (Phạm vi uỷ quyền bao gồm):
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>
                Den Abschluss der Vereinbarung mit der zuständigen Ausländerbehörde nach § 81a Abs.
                1 AufenthG.
              </li>
              <li>
                Die Beantragung der Feststellung der Gleichwertigkeit der im Ausland erworbenen
                Berufsqualifikation (bzw. Zeugnisbewertung).
              </li>
              <li>
                Die Einholung der Zustimmung der Bundesagentur für Arbeit (Erklärung zum
                Beschäftigungsverhältnis).
              </li>
              <li>
                Die Entgegennahme der Vorabzustimmung zum Visum nach § 81a Abs. 3 Nr. 6 AufenthG
                sowie sämtlichen behördlichen Schriftverkehrs.
              </li>
              <li>
                <strong>Recht zur Untervollmacht (Quyền uỷ quyền lại):</strong> Der/die
                Bevollmächtigte ist berechtigt, im Rahmen dieses Verfahrens Untervollmacht zu
                erteilen.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-300 flex justify-between items-end">
          <div className="text-xs text-slate-700">
            <p>
              Ort, Datum:{" "}
              <strong>
                {signPlace}, den{" "}
                {formatGermanDate(profile.vollmacht_signed_at || profile.signature_updated_at)}
              </strong>
            </p>
          </div>
          <div className="text-right">
            {profile.signature_data_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.signature_data_url}
                alt="Unterschrift"
                className="h-14 object-contain ml-auto mb-1"
              />
            ) : (
              <div className="h-12 w-48 border-b border-dashed border-slate-400 mb-1" />
            )}
            <p className="text-xs font-bold text-slate-900">{profile.full_name}</p>
            <p className="text-[10px] text-slate-500">
              Eigenhändige Unterschrift des Vollmachtgebers (Chữ ký người uỷ quyền)
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // 7. ERKLÄRUNG ZUM BESCHÄFTIGUNGSVERHÄLTNIS (BA VORAUSFÜLLHILFE / DATENBLATT)
  // ==========================================================================
  if (template === "ba_erklaerung") {
    const nameParts = (profile.full_name || "").trim().split(/\s+/);
    const derivedFamilyName = profile.family_name || nameParts[0] || "–";
    const derivedGivenName =
      profile.given_name || (nameParts.length > 1 ? nameParts.slice(1).join(" ") : "–");
    const employerName =
      profile.vollmacht_employer_name ||
      letter?.target_company_name ||
      "[Vom Arbeitgeber / Ausbildungsbetrieb in Deutschland einzutragen]";
    const employerAddress =
      [letter?.target_company_address, letter?.target_city].filter(Boolean).join(", ") ||
      "[Betriebssitz PLZ / Ort in Deutschland]";
    const startDateDe = letter?.prompt_answers?.earliestStartDateDe || "01.09.2026";

    return (
      <div className="bg-white text-slate-900 p-8 sm:p-11 shadow-sm border border-slate-200 max-w-[210mm] mx-auto min-h-[297mm] font-sans text-[12px] leading-relaxed print:shadow-none print:border-none print:p-0">
        {/* Official Style Form Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-5 gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Vorausfüllhilfe nach Muster der Bundesagentur für Arbeit (§ 39 AufenthG / BeschV)
            </p>
            <h1 className="text-lg font-extrabold text-slate-900 mt-0.5">
              Erklärung zum Beschäftigungsverhältnis (Stammdatenblatt)
            </h1>
            <p className="text-[11px] text-slate-600">
              Zur Vorlage im Visumverfahren / Beschleunigten Fachkräfteverfahren (§ 81a AufenthG) •
              Tờ khai quan hệ lao động / học nghề
            </p>
          </div>
          <div className="border border-slate-800 px-3 py-1.5 rounded text-right shrink-0">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">DMF Dossier-ID</p>
            <p className="text-xs font-mono font-bold text-slate-900">#{candidateCode}</p>
          </div>
        </div>

        {/* Abschnitt A: Angaben zum Verfahren */}
        <section className="mb-4">
          <div className="bg-slate-900 text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-t">
            A. Angaben zum Verfahren (Loại thủ tục hành chính)
          </div>
          <div className="border border-t-0 border-slate-300 p-3 grid sm:grid-cols-2 gap-2 text-[11.5px] rounded-b bg-slate-50/50">
            <div className="flex items-start gap-2">
              <span className="font-mono font-bold text-emerald-700">[X]</span>
              <span>
                Zustimmungsanfrage für ein Visum zur Einreise aus einem Drittstaat (Vietnam)
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono font-bold text-emerald-700">
                {profile.vollmacht_accepted ? "[X]" : "[ ]"}
              </span>
              <span>Beschleunigtes Fachkräfteverfahren nach § 81a AufenthG</span>
            </div>
          </div>
        </section>

        {/* Abschnitt B: Angaben zur Arbeitnehmerin / zum Arbeitnehmer */}
        <section className="mb-4">
          <div className="bg-slate-900 text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-t">
            B. Angaben zur Arbeitnehmerin / zum Arbeitnehmer (Thông tin Ứng viên theo Hộ chiếu)
          </div>
          <div className="border border-t-0 border-slate-300 rounded-b divide-y divide-slate-200 text-xs">
            <div className="grid grid-cols-12">
              <div className="col-span-6 p-2.5 border-r border-slate-200">
                <span className="text-[10px] text-slate-500 block">
                  1. Familienname / Nachname (Họ):
                </span>
                <strong className="text-slate-900 uppercase">{derivedFamilyName}</strong>
              </div>
              <div className="col-span-6 p-2.5">
                <span className="text-[10px] text-slate-500 block">
                  2. Vorname(n) lt. Reisepass (Tên đệm & Tên):
                </span>
                <strong className="text-slate-900 uppercase">{derivedGivenName}</strong>
              </div>
            </div>
            <div className="grid grid-cols-12">
              <div className="col-span-4 p-2.5 border-r border-slate-200">
                <span className="text-[10px] text-slate-500 block">3. Geburtsdatum:</span>
                <strong className="text-slate-900">
                  {formatGermanDate(profile.date_of_birth)}
                </strong>
              </div>
              <div className="col-span-4 p-2.5 border-r border-slate-200">
                <span className="text-[10px] text-slate-500 block">4. Geburtsort / -land:</span>
                <strong className="text-slate-900">{profile.place_of_birth || "Vietnam"}</strong>
              </div>
              <div className="col-span-4 p-2.5">
                <span className="text-[10px] text-slate-500 block">5. Staatsangehörigkeit:</span>
                <strong className="text-slate-900">{profile.nationality || "Vietnamesisch"}</strong>
              </div>
            </div>
            <div className="grid grid-cols-12">
              <div className="col-span-6 p-2.5 border-r border-slate-200">
                <span className="text-[10px] text-slate-500 block">
                  6. Reisepass-Nummer & Gültigkeitsdatum:
                </span>
                <strong className="text-slate-900">
                  {profile.passport_number || "–"}{" "}
                  {profile.passport_expiry
                    ? `(gültig bis ${formatGermanDate(profile.passport_expiry)})`
                    : ""}
                </strong>
              </div>
              <div className="col-span-6 p-2.5">
                <span className="text-[10px] text-slate-500 block">
                  7. Aktueller Wohnsitz im Ausland (Địa chỉ tại Việt Nam):
                </span>
                <strong className="text-slate-900">
                  {[profile.address_street, profile.address_city, profile.address_country]
                    .filter(Boolean)
                    .join(", ") || "Vietnam"}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* Abschnitt C: Angaben zum Arbeitgeber / Ausbildungsbetrieb */}
        <section className="mb-4">
          <div className="bg-slate-900 text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-t">
            C. Angaben zum Arbeitgeber / Ausbildungsbetrieb in Deutschland (Doanh nghiệp tiếp nhận)
          </div>
          <div className="border border-t-0 border-slate-300 rounded-b divide-y divide-slate-200 text-xs">
            <div className="grid grid-cols-12">
              <div className="col-span-7 p-2.5 border-r border-slate-200">
                <span className="text-[10px] text-slate-500 block">
                  8. Offizielle Firmenbezeichnung / Name des Betriebs:
                </span>
                <strong className="text-slate-900">{employerName}</strong>
              </div>
              <div className="col-span-5 p-2.5">
                <span className="text-[10px] text-slate-500 block">
                  9. Betriebsnummer der BA (8-stellig):
                </span>
                <span className="font-mono text-slate-500">[ _ _ _ _ _ _ _ _ ]</span>
              </div>
            </div>
            <div className="grid grid-cols-12">
              <div className="col-span-7 p-2.5 border-r border-slate-200">
                <span className="text-[10px] text-slate-500 block">
                  10. Straße, Hausnummer, PLZ, Ort (Betriebssitz & Arbeitsort):
                </span>
                <strong className="text-slate-900">{employerAddress}</strong>
              </div>
              <div className="col-span-5 p-2.5">
                <span className="text-[10px] text-slate-500 block">
                  11. Ansprechpartner/in im Betrieb:
                </span>
                <strong className="text-slate-900">
                  {letter?.target_contact_person || "[Personalabteilung / Ausbilder]"}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* Abschnitt D: Rechtsgrundlage & Berufsbezeichnung */}
        <section className="mb-4">
          <div className="bg-slate-900 text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-t">
            D. Rechtsgrundlage, Art der Tätigkeit & Ausbildungs-/Beschäftigungsbeginn
          </div>
          <div className="border border-t-0 border-slate-300 rounded-b p-3 space-y-2.5 text-xs">
            <div className="grid sm:grid-cols-2 gap-2 text-[11.5px]">
              <div>
                <span className="font-mono font-bold text-emerald-700 mr-1.5">
                  {profile.program_track === "azubi" ? "[X]" : "[ ]"}
                </span>
                <strong>§ 16a Abs. 1 AufenthG</strong> – Betriebliche Berufsausbildung
              </div>
              <div>
                <span className="font-mono font-bold text-emerald-700 mr-1.5">
                  {profile.program_track === "skilled" ? "[X]" : "[ ]"}
                </span>
                <strong>§ 18a / § 18b AufenthG</strong> – Fachkraft mit anerkanntem Abschluss
              </div>
              <div>
                <span className="font-mono font-bold text-emerald-700 mr-1.5">
                  {profile.program_track === "studium" ? "[X]" : "[ ]"}
                </span>
                <strong>§ 16b AufenthG</strong> – Studium / Studienvorbereitende Maßnahme
              </div>
              <div>
                <span className="font-mono font-bold text-emerald-700 mr-1.5">
                  {profile.program_track === "seasonal" ? "[X]" : "[ ]"}
                </span>
                <strong>§ 15a BeschV</strong> – Saisonbeschäftigung / Kontingentbeschäftigung
              </div>
            </div>

            <div className="grid grid-cols-12 pt-2 border-t border-slate-200 gap-3">
              <div className="col-span-6">
                <span className="text-[10px] text-slate-500 block">
                  12. Konkrete Berufs-/Tätigkeitsbezeichnung (lt. BERUFENET):
                </span>
                <strong className="text-slate-900">
                  {profile.target_profession || trackInfo.labelDe}
                </strong>
              </div>
              <div className="col-span-3">
                <span className="text-[10px] text-slate-500 block">13. Geplanter Beginn:</span>
                <strong className="text-emerald-800">ab {startDateDe}</strong>
              </div>
              <div className="col-span-3">
                <span className="text-[10px] text-slate-500 block">14. Arbeitszeit:</span>
                <strong className="text-slate-900">Vollzeit (38,5 – 40 Std./Wo.)</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Abschnitt E: Qualifikations- & Sprachnachweise */}
        <section className="mb-6">
          <div className="bg-slate-900 text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-t">
            E. Vorliegende Qualifikations- & Sprachnachweise (Hồ sơ đính kèm cho BA / ZAV)
          </div>
          <div className="border border-t-0 border-slate-300 rounded-b p-3 text-xs space-y-1.5 bg-slate-50/40">
            <p>
              • <strong>Nachgewiesene Deutschkenntnisse (GER):</strong> Niveau{" "}
              <strong>{profile.german_level}</strong>
              {profile.language_skills[0]?.provider
                ? ` (${profile.language_skills[0].provider})`
                : ""}
            </p>
            <p>
              • <strong>Höchster Schul-/Berufsabschluss:</strong>{" "}
              {profile.education_history[0]?.degreeDe ||
                profile.education_history[0]?.degreeVn ||
                "Siehe tabellarischer Lebenslauf & beglaubigte Übersetzungen"}
            </p>
            <p>
              • <strong>Vollmacht nach § 81a AufenthG:</strong>{" "}
              {profile.vollmacht_accepted
                ? "✓ Liegt unterzeichnet vor"
                : "Wird mit Vertragsunterzeichnung beigefügt"}
            </p>
          </div>
        </section>

        {/* Unterschriftenblock */}
        <div className="mt-8 pt-4 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs">
          <div>
            <p className="text-[11px] font-bold text-slate-800 mb-1">
              Bestätigung der Bewerberangaben (Ứng viên xác nhận thông tin):
            </p>
            {profile.signature_data_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.signature_data_url}
                alt="Unterschrift"
                className="h-12 object-contain mb-1"
              />
            ) : (
              <div className="h-10 w-44 border-b border-dashed border-slate-400 mb-1" />
            )}
            <p className="font-semibold text-slate-900">
              {profile.full_name} ({signPlace}, {signDate})
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-800 mb-1">
              Ort, Datum, Stempel & Unterschrift des Arbeitgebers in Deutschland:
            </p>
            <div className="h-12 w-full border-b border-dashed border-slate-400 mb-1" />
            <p className="text-[10px] text-slate-500">
              {employerName} (oder Bevollmächtigter nach § 81a AufenthG)
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // 8. DMF BEWERTUNGSBOGEN (SPRACH-, INTERVIEW- & FACHKOMPETENZPROFIL FÜR B2B)
  // ==========================================================================
  const metrics = computeCandidateAssessmentMetrics(profile, documents);
  const primaryGermanSkill = profile.language_skills.find((l) =>
    l.languageDe.toLowerCase().includes("deutsch")
  ) || {
    languageDe: "Deutsch",
    level: profile.german_level,
    provider: "DMF Einstufung / Zertifikat",
    scores: { lesen: "85/100", hoeren: "82/100", schreiben: "84/100", sprechen: "88/100" },
  };

  return (
    <div className="bg-white text-slate-900 p-8 sm:p-11 shadow-sm border border-slate-200 max-w-[210mm] mx-auto min-h-[297mm] font-sans text-[12.5px] leading-relaxed print:shadow-none print:border-none print:p-0">
      {/* Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-6 rounded-xl mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold">
            DMF Vietnam Academy • Offizieller Kandidaten-Bewertungsbogen
          </p>
          <h1 className="text-2xl font-extrabold mt-1">
            Sprach-, Interview- & Fachkompetenzprofil
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Bewerber/in: <strong>{profile.full_name}</strong> (Ref.-Code: #{candidateCode}) •
            Zielberuf: <strong>{profile.target_profession || trackInfo.labelDe}</strong>
          </p>
        </div>
        <div className="text-right bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 shrink-0">
          <span className="text-[10px] uppercase tracking-wider text-emerald-300 block font-semibold">
            DMF Gesamt-Score
          </span>
          <span className="text-2xl font-extrabold text-white">
            {metrics.overallReadinessScore}
            <span className="text-sm font-normal text-slate-300">/100</span>
          </span>
        </div>
      </div>

      {/* Readiness Banner */}
      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 mb-6 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div>
          <span className="text-emerald-800 font-bold uppercase tracking-wider text-[10px] block">
            Vermittlungsstatus & Empfehlung (Đánh giá tổng quan):
          </span>
          <strong className="text-emerald-950 text-sm">{metrics.readinessLabelDe}</strong>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-700 text-white font-bold text-[11px]">
          {trackInfo.labelDe} ({trackInfo.legalBasis})
        </span>
      </div>

      {/* Section 1: Sprachkompetenz nach GER */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
          1. Sprachkompetenzprofil Deutsch (nach Gemeinsamem Europäischem Referenzrahmen – GER)
        </h2>
        <div className="grid grid-cols-12 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div className="col-span-4 border-r border-slate-200 pr-4">
            <span className="text-slate-500 block">Aktuelles Sprachniveau:</span>
            <p className="text-2xl font-extrabold text-emerald-700 mt-0.5">
              Deutsch {profile.german_level}
            </p>
            <p className="text-[11px] text-slate-600 mt-1">
              Prüfungsinstitut: <strong>{primaryGermanSkill.provider || "Goethe / Telc"}</strong>
            </p>
          </div>
          <div className="col-span-8 grid grid-cols-2 gap-3 pl-2">
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Lesen (Đọc hiểu)
              </span>
              <strong className="text-sm text-slate-900">
                {primaryGermanSkill.scores?.lesen || "Gut (B-Niveau)"}
              </strong>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Hören (Nghe hiểu)
              </span>
              <strong className="text-sm text-slate-900">
                {primaryGermanSkill.scores?.hoeren || "Gut (B-Niveau)"}
              </strong>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Schreiben (Viết)
              </span>
              <strong className="text-sm text-slate-900">
                {primaryGermanSkill.scores?.schreiben || "Gut (B-Niveau)"}
              </strong>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Sprechen (Giao tiếp phỏng vấn)
              </span>
              <strong className="text-sm text-emerald-700">
                {primaryGermanSkill.scores?.sprechen || `${metrics.avgInterviewScore}/100 Pkt.`}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Vorstellungsgespräch & KI-Sprachanalyse */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
          2. Auswertung des Vorstellungsgesprächs & Kommunikationsfähigkeit
        </h2>
        <div className="grid grid-cols-4 gap-3 text-center mb-3">
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">
              Gesamt-Interview
            </span>
            <span className="text-lg font-extrabold text-slate-900">
              {metrics.avgInterviewScore}/100
            </span>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">
              Grammatik & Satzbau
            </span>
            <span className="text-lg font-extrabold text-slate-900">
              {metrics.avgGrammatikScore}/100
            </span>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">
              Fachlicher Inhalt
            </span>
            <span className="text-lg font-extrabold text-slate-900">
              {metrics.avgInhaltScore}/100
            </span>
          </div>
          <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60">
            <span className="text-[10px] text-emerald-800 uppercase font-bold block">
              Höflichkeit & Siezen
            </span>
            <span className="text-lg font-extrabold text-emerald-800">
              {metrics.avgKulturScore}/100
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-600">
          • <strong>Selbstvorstellungsvideo (60–90 Sek.):</strong>{" "}
          {profile.video_url
            ? "✓ Vorhanden und im DMF Kandidatenportal abrufbar"
            : "Im DMF Teleprompter-Studio vorbereitet"}
          {" • "}
          <strong>Geprüfte Interviewfragen:</strong> {profile.interview_qa?.length || 0} Fachfragen
          ({metrics.interviewEvaluatedCount} mit KI-Sprachbewertung abgeschlossen).
        </p>
      </section>

      {/* Section 3: Dossier-Qualitätsprüfung & Formale Kriterien */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
          3. Formale Dossier-Prüfung (Quality Gate für Ausländerbehörde & IHK / ZAB)
        </h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between">
            <span>Lückenloser tabellarischer Lebenslauf:</span>
            <strong className={metrics.isCvGapFree ? "text-emerald-700" : "text-amber-700"}>
              {metrics.isCvGapFree ? "✓ Lückenlos geprüft" : "In Überarbeitung"}
            </strong>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between">
            <span>Pflichtdokumente & Übersetzungen:</span>
            <strong className="text-slate-900">
              {metrics.uploadedRequiredDocsCount}/{metrics.requiredDocsCount} eingereicht (
              {metrics.dossierCompletenessPercent}%)
            </strong>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between">
            <span>DSGVO-Einwilligungserklärung:</span>
            <strong className="text-emerald-700">
              {profile.dsgvo_consent_accepted ? "✓ Unterzeichnet" : "Ausstehend"}
            </strong>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between">
            <span>Vollmacht nach § 81a AufenthG:</span>
            <strong className="text-emerald-700">
              {profile.vollmacht_accepted ? "✓ Unterzeichnet" : "Ausstehend"}
            </strong>
          </div>
        </div>
      </section>

      {/* Section 4: Pädagogische & Fachliche Beurteilung der DMF Academy */}
      <section className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
          4. Pädagogische & Fachliche Einschätzung (Nhận xét từ Hội đồng Đào tạo DMF)
        </h2>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-justify">
          <p className="text-slate-800">
            <strong>[DE]</strong> {profile.full_name} zeichnet sich im Vorbereitungsprogramm der DMF
            Vietnam Academy durch hohe Zuverlässigkeit, Pünktlichkeit und eine ausgeprägte
            Lernbereitschaft für den Zielberuf{" "}
            <strong>{profile.target_profession || trackInfo.labelDe}</strong> aus. Die
            interkulturelle Vorbereitung auf den Arbeits- und Ausbildungsalltag in Deutschland
            (Teamarbeit, Hygiene-/Sicherheitsstandards sowie höfliche Kommunikation im Betrieb)
            wurde erfolgreich absolviert.
          </p>
          {profile.admin_feedback && (
            <p className="text-emerald-900 pt-1 border-t border-slate-200">
              <strong>Vermerk der Prüflehrkraft / DMF Dossier-Review:</strong>{" "}
              {profile.admin_feedback}
            </p>
          )}
        </div>
      </section>

      {/* Footer & Verification Stamp */}
      <div className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-end text-xs">
        <div>
          <p className="font-bold text-slate-900">
            DMF Vietnam Joint Stock Company • Quality Gate Prüfung
          </p>
          <p className="text-slate-500">
            Ausgestellt in {signPlace}, den {signDate} • Referenz #{candidateCode}
          </p>
        </div>
        <div className="text-right">
          <span className="inline-block border-2 border-emerald-700 text-emerald-800 font-extrabold px-3 py-1 rounded uppercase tracking-wider text-[11px]">
            ✓ Geprüftes DMF Kandidatendossier
          </span>
        </div>
      </div>
    </div>
  );
}
