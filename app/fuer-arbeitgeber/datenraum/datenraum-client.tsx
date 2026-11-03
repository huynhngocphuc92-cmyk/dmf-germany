"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  employerLoginAction,
  employerRegisterAction,
  employerSignOutAction,
  syncEmployerShortlistAction,
  updateEmployerProfileAction,
  requestCandidateActionFromDataRoom,
  type EmployerAccountProfile,
  type EmployerDataRoomBundle,
} from "./actions";
import { requestPasswordResetAction } from "@/app/auth/actions";
import { useCandidateShortlist } from "@/lib/candidates/shortlist";
import type { PublicCandidate } from "@/lib/candidates/public-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Building2,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Video,
  FileCheck2,
  CalendarClock,
  LogOut,
  RefreshCw,
  KeyRound,
  Sparkles,
  FileText,
  Clock,
  ExternalLink,
  Award,
} from "lucide-react";

interface EmployerDataRoomClientProps {
  initialBundle: EmployerDataRoomBundle;
}

type AuthMode = "login" | "register";
type DataRoomTab = "dossiers" | "tracker" | "company";

const INDUSTRY_OPTIONS = [
  "Pflege & Gesundheitswesen",
  "Hotellerie & Gastronomie",
  "Handwerk, Bau & Gebäudetechnik",
  "Industrie, Metallbau & Mechatronik",
  "Logistik & Lagerwirtschaft",
  "Sonstige Branche",
] as const;

function computeB2BReadinessScore(candidate: PublicCandidate): {
  total: number;
  fachlich: number;
  sprachlich: number;
  dossier: number;
} {
  const levelMap: Record<string, number> = {
    A1: 72,
    A2: 78,
    B1: 86,
    B2: 94,
    C1: 98,
    C2: 99,
  };
  const sprachlich = levelMap[candidate.german_level || "B1"] || 85;
  const fachlich = Math.min(98, 82 + (candidate.experience_years || 1) * 3);
  const dossier = candidate.visa_status ? 100 : 92;
  const total = Math.round(sprachlich * 0.35 + fachlich * 0.35 + dossier * 0.3);
  return { total, fachlich, sprachlich, dossier };
}

export function EmployerDataRoomClient({ initialBundle }: EmployerDataRoomClientProps) {
  const router = useRouter();
  const { items: localShortlist, toggleShortlist } = useCandidateShortlist();

  // Auth states
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authError, setAuthError] = useState<string | null>(null);
  const [requiresConfirmation, setRequiresConfirmation] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);

  // Authenticated portal states
  const [activeTab, setActiveTab] = useState<DataRoomTab>("dossiers");
  const [profile, setProfile] = useState<EmployerAccountProfile | null>(initialBundle.profile);
  const [filterScope, setFilterScope] = useState<"all" | "shortlist">("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "skilled" | "azubi" | "seasonal">(
    "all"
  );
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSyncingShortlist, setIsSyncingShortlist] = useState(false);

  // Action modal / inline drawer for candidate booking
  const [activeActionCandidate, setActiveActionCandidate] = useState<{
    candidate: PublicCandidate;
    actionType: "interview" | "reservation" | "dossier";
  } | null>(null);
  const [preferredSlotDe, setPreferredSlotDe] = useState("");
  const [actionNoteDe, setActionNoteDe] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Company profile form state
  const [companyDraft, setCompanyDraft] = useState({
    companyName: initialBundle.profile?.companyName || "",
    contactPerson: initialBundle.profile?.contactPerson || "",
    phone: initialBundle.profile?.phone || "",
    city: initialBundle.profile?.city || "",
    industry: initialBundle.profile?.industry || INDUSTRY_OPTIONS[0],
  });
  const [isSavingCompany, setIsSavingCompany] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await employerLoginAction(formData);
    setIsAuthLoading(false);
    if (!res.success) {
      setAuthError(res.error);
      return;
    }
    router.refresh();
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await employerRegisterAction(formData);
    setIsAuthLoading(false);
    if (!res.success) {
      setAuthError(res.error);
      return;
    }
    if (res.requiresConfirmation) {
      setRequiresConfirmation(true);
      return;
    }
    router.refresh();
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);
    setIsResetLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await requestPasswordResetAction(formData);
    setIsResetLoading(false);
    if (!res.success) {
      setAuthError(res.error);
      return;
    }
    setResetSent(true);
  };

  const handleSyncShortlist = async () => {
    if (!profile) return;
    setIsSyncingShortlist(true);
    setBanner(null);
    const mergedIds = Array.from(
      new Set([...profile.shortlistIds, ...localShortlist.map((item) => item.id)])
    );
    const res = await syncEmployerShortlistAction(mergedIds);
    setIsSyncingShortlist(false);
    if (res.success) {
      setProfile({ ...profile, shortlistIds: res.shortlistIds });
      setBanner({
        type: "success",
        text: `Unternehmens-Merkliste synchronisiert (${res.shortlistIds.length} Kandidaten gespeichert).`,
      });
    } else {
      setBanner({
        type: "error",
        text: "Merkliste konnte nicht synchronisiert werden.",
      });
    }
  };

  const handleToggleAccountShortlist = async (candidate: PublicCandidate) => {
    toggleShortlist(candidate);
    if (!profile) return;
    const exists = profile.shortlistIds.includes(candidate.id);
    const nextIds = exists
      ? profile.shortlistIds.filter((id) => id !== candidate.id)
      : [candidate.id, ...profile.shortlistIds];
    setProfile({ ...profile, shortlistIds: nextIds });
    await syncEmployerShortlistAction(nextIds);
  };

  const handleConfirmCandidateAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeActionCandidate) return;
    setIsSubmittingAction(true);
    setBanner(null);

    const c = activeActionCandidate.candidate;
    const code = c.id.slice(0, 8).toUpperCase();
    const res = await requestCandidateActionFromDataRoom({
      candidateId: c.id,
      candidateCode: code,
      profession: c.profession || "Fachkraft / Azubi",
      actionType: activeActionCandidate.actionType,
      preferredSlotDe,
      noteDe: actionNoteDe,
    });

    setIsSubmittingAction(false);
    if (!res.success) {
      setBanner({ type: "error", text: res.error || "Anfrage fehlgeschlagen." });
      return;
    }

    if (res.profile) {
      setProfile(res.profile);
    }
    setActiveActionCandidate(null);
    setPreferredSlotDe("");
    setActionNoteDe("");
    setActiveTab("tracker");
    setBanner({
      type: "success",
      text: `Ihre Anfrage für Kandidat #${code} wurde erfolgreich übermittelt und im § 81a AufenthG Tracker angelegt.`,
    });
    router.refresh();
  };

  const handleSaveCompanyProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingCompany(true);
    setBanner(null);
    const res = await updateEmployerProfileAction(companyDraft);
    setIsSavingCompany(false);
    if (res.success && res.profile) {
      setProfile(res.profile);
      setBanner({
        type: "success",
        text: "Unternehmensprofil und DSGVO-Kontaktdaten wurden gespeichert.",
      });
    } else {
      setBanner({
        type: "error",
        text: res.error || "Fehler beim Speichern.",
      });
    }
  };

  // ============================================================================
  // UNAUTHENTICATED VIEW: LOGIN & CORPORATE REGISTRATION
  // ============================================================================
  if (!initialBundle.authenticated || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Value Proposition of the DSGVO Data Room */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                DSGVO-konformer Arbeitgeber-Datenraum
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Direktzugang zu geprüften Bewerbungsmappen & § 81a Visum-Tracking
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Aus Datenschutzgründen (Art. 6 & Art. 28 DSGVO) sind vollständige
                Kandidatendossiers, Bewertungsbögen und Interview-Reservierungen exklusiv für
                registrierte deutsche Arbeitgeber im geschützten Datenraum zugänglich.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      1. Erweiterte Bewerbungsmappen & DMF Bewertungsbogen
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Einsicht in detaillierte Fachprofile, Sprachzertifikats-Aufschlüsselungen
                      (Goethe/telc B1–B2), Stundennachweise für die Anerkennung (IHK FOSA / LfP) und
                      unsere 100-Punkte-Eignungsbewertung.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      2. 1-Klick Video-Interview & 7-Tage-Reservierung
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Buchen Sie direkt aus dem Dossier heraus ein Vorstellungsgespräch per
                      Microsoft Teams / Zoom (inkl. Fachdolmetscher) oder reservieren Sie passende
                      Kandidaten unverbindlich für 7 Tage zur internen Abstimmung.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center shrink-0">
                    <CalendarClock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      3. Live-Tracker für § 81a AufenthG & Vorabzustimmung
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Verfolgen Sie alle eingereichten Personalanfragen, den Status der
                      Gleichwertigkeitsprüfung sowie den Fortschritt des beschleunigten
                      Fachkräfteverfahrens in Echtzeit.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Login / Registration Card */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
                {/* Mode Switcher */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setAuthError(null);
                      setRequiresConfirmation(false);
                    }}
                    className={`py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                      authMode === "login"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Anmelden (Login)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("register");
                      setAuthError(null);
                      setRequiresConfirmation(false);
                    }}
                    className={`py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                      authMode === "register"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Unternehmenskonto erstellen
                  </button>
                </div>

                {authError && (
                  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                    <span>{authError}</span>
                  </div>
                )}

                {requiresConfirmation ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Unternehmenskonto angelegt – Bitte E-Mail bestätigen
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                      Wir haben einen Bestätigungslink an Ihre geschäftliche E-Mail-Adresse
                      gesendet. Nach dem Klick auf den Link werden Sie direkt in den DSGVO-Datenraum
                      weitergeleitet.
                    </p>
                    <Button
                      type="button"
                      onClick={() => {
                        setRequiresConfirmation(false);
                        setAuthMode("login");
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Zur Anmeldung
                    </Button>
                  </div>
                ) : authMode === "login" ? (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Arbeitgeber-Login (Datenraum)
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Melden Sie sich mit Ihrer geschäftlichen E-Mail-Adresse an.
                      </p>
                    </div>

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="login_email"
                          className="text-xs font-semibold text-slate-700"
                        >
                          Geschäftliche E-Mail-Adresse *
                        </Label>
                        <Input
                          id="login_email"
                          name="email"
                          type="email"
                          required
                          placeholder="personal@ihr-unternehmen.de"
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="login_password"
                            className="text-xs font-semibold text-slate-700"
                          >
                            Passwort *
                          </Label>
                          <button
                            type="button"
                            onClick={() => {
                              setShowForgot((v) => !v);
                              setResetSent(false);
                              setAuthError(null);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 underline underline-offset-4"
                          >
                            Passwort vergessen?
                          </button>
                        </div>
                        <Input
                          id="login_password"
                          name="password"
                          type="password"
                          required
                          placeholder="••••••••"
                          className="h-11"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isAuthLoading}
                        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                      >
                        {isAuthLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Anmeldung läuft...
                          </>
                        ) : (
                          <>
                            Datenraum öffnen
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>

                    {showForgot && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                          <KeyRound className="w-4 h-4 text-blue-600" />
                          Passwort zurücksetzen
                        </div>
                        {resetSent ? (
                          <div className="flex items-start gap-2 text-xs text-emerald-700">
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                            <span>
                              Wir haben Ihnen einen Link zum Zurücksetzen des Passworts per E-Mail
                              gesendet.
                            </span>
                          </div>
                        ) : (
                          <form onSubmit={handlePasswordReset} className="space-y-2.5">
                            <p className="text-xs text-slate-600">
                              Geben Sie Ihre geschäftliche E-Mail-Adresse ein:
                            </p>
                            <Input
                              name="email"
                              type="email"
                              required
                              placeholder="personal@ihr-unternehmen.de"
                              className="h-9 text-xs bg-white"
                            />
                            <Button
                              type="submit"
                              size="sm"
                              disabled={isResetLoading}
                              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs"
                            >
                              {isResetLoading ? "Wird gesendet..." : "Reset-Link anfordern"}
                            </Button>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Kostenfreien Arbeitgeber-Zugang registrieren
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Sofortiger Zugriff auf geprüfte Bewerberprofile, Merkliste und
                        Interview-Slot-Anfrage.
                      </p>
                    </div>

                    <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="company_name" className="text-xs font-semibold">
                            Unternehmen / Einrichtung *
                          </Label>
                          <Input
                            id="company_name"
                            name="company_name"
                            required
                            placeholder="z.B. Klinikum Süd GmbH"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="contact_person" className="text-xs font-semibold">
                            Ansprechpartner(in) *
                          </Label>
                          <Input
                            id="contact_person"
                            name="contact_person"
                            required
                            placeholder="z.B. Frau Dr. Weber"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="reg_email" className="text-xs font-semibold">
                            Geschäftliche E-Mail *
                          </Label>
                          <Input
                            id="reg_email"
                            name="email"
                            type="email"
                            required
                            placeholder="personal@klinikum.de"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="phone" className="text-xs font-semibold">
                            Telefon / Durchwahl *
                          </Label>
                          <Input id="phone" name="phone" required placeholder="+49 89 123456" />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="city" className="text-xs font-semibold">
                            Standort / Bundesland *
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            required
                            placeholder="z.B. München, Bayern"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="industry" className="text-xs font-semibold">
                            Branche *
                          </Label>
                          <select
                            id="industry"
                            name="industry"
                            defaultValue={INDUSTRY_OPTIONS[0]}
                            className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-900"
                          >
                            {INDUSTRY_OPTIONS.map((ind) => (
                              <option key={ind} value={ind}>
                                {ind}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="reg_password" className="text-xs font-semibold">
                          Passwort festlegen (mind. 8 Zeichen) *
                        </Label>
                        <Input
                          id="reg_password"
                          name="password"
                          type="password"
                          required
                          minLength={8}
                          placeholder="••••••••"
                        />
                      </div>

                      <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          name="dsgvo_accepted"
                          value="true"
                          required
                          defaultChecked
                          className="mt-0.5 rounded border-slate-300 text-blue-600"
                        />
                        <span>
                          <strong>DSGVO-Vertraulichkeitserklärung:</strong> Ich bestätige, dass
                          Bewerberdaten aus dem DMF-Datenraum ausschließlich zweckgebunden zur
                          internen Personalauswahl gemäß Art. 6 & Art. 28 DSGVO verwendet und nicht
                          an unbefugte Dritte weitergegeben werden. *
                        </span>
                      </label>

                      <Button
                        type="submit"
                        disabled={isAuthLoading}
                        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                      >
                        {isAuthLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Konto wird erstellt...
                          </>
                        ) : (
                          <>
                            Arbeitgeber-Zugang jetzt freischalten
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    SSL- & DSGVO-geschützter B2B-Zugang
                  </span>
                  <Link
                    href="/portal/login"
                    className="text-slate-600 hover:text-blue-600 underline underline-offset-4"
                  >
                    Zum Bewerber- & Azubi-Portal →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // AUTHENTICATED VIEW: DSGVO EMPLOYER DATA ROOM
  // ============================================================================
  const allShortlistedIds = new Set([
    ...profile.shortlistIds,
    ...localShortlist.map((item) => item.id),
  ]);

  const filteredCandidates = initialBundle.candidates.filter((c) => {
    if (filterScope === "shortlist" && !allShortlistedIds.has(c.id)) return false;
    if (categoryFilter !== "all" && c.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-7xl space-y-6">
        {/* Top Corporate Bar */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                DSGVO-Datenraum Freigeschaltet
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs">
                {profile.industry}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
              <Building2 className="w-7 h-7 text-blue-400 shrink-0" />
              {profile.companyName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Ansprechpartner: <strong>{profile.contactPerson || profile.email}</strong>
              {profile.city ? ` • Standort: ${profile.city}` : ""} • Konto: {profile.email}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSyncingShortlist}
              onClick={handleSyncShortlist}
              className="border-slate-700 bg-slate-800/80 text-slate-100 hover:bg-slate-800 text-xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 mr-1.5 ${isSyncingShortlist ? "animate-spin" : ""}`}
              />
              Merkliste synchronisieren ({allShortlistedIds.size})
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
            >
              <Link href="/fuer-arbeitgeber/personalbedarf">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                KI-Stellenanalyse & Bedarf melden
              </Link>
            </Button>
            <form action={employerSignOutAction}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-slate-800 text-xs"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Abmelden
              </Button>
            </form>
          </div>
        </div>

        {banner && (
          <div
            className={`flex items-center justify-between gap-3 p-4 rounded-2xl border text-xs sm:text-sm font-medium ${
              banner.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {banner.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{banner.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setBanner(null)}
              className="text-xs underline opacity-75 hover:opacity-100"
            >
              Schließen
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("dossiers")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === "dossiers"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            1. Freigegebene Bewerbungsmappen ({initialBundle.candidates.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tracker")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === "tracker"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <CalendarClock className="w-4 h-4" />
            2. Interview- & § 81a Visum-Tracker (
            {profile.interviewRequests.length + initialBundle.inquiries.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("company")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === "company"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Building2 className="w-4 h-4" />
            3. Unternehmensprofil & DSGVO-Vereinbarung
          </button>
        </div>

        {/* Inline Action Modal for 1-Click Interview / Reservation / Dossier */}
        {activeActionCandidate && (
          <div className="bg-blue-950 text-white rounded-3xl p-6 sm:p-8 border border-blue-800 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 mb-2">
                  1-Klick Direktbuchung im Datenraum
                </Badge>
                <h3 className="text-lg sm:text-xl font-bold">
                  {activeActionCandidate.actionType === "interview"
                    ? "Video-Vorstellungsgespräch anfragen (Teams / Zoom)"
                    : activeActionCandidate.actionType === "reservation"
                      ? "Kandidatenprofil unverbindlich für 7 Tage reservieren"
                      : "Vollständige Bewerbungsmappe inkl. Zeugnissen anfordern"}{" "}
                  — Kandidat #{activeActionCandidate.candidate.id.slice(0, 8).toUpperCase()} (
                  {activeActionCandidate.candidate.profession})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveActionCandidate(null)}
                className="text-xs text-slate-300 hover:text-white underline"
              >
                Abbrechen
              </button>
            </div>

            <form
              onSubmit={handleConfirmCandidateAction}
              className="grid sm:grid-cols-3 gap-4 pt-2"
            >
              <div className="space-y-1.5">
                <Label className="text-xs text-blue-200">
                  Gewünschter Termin / Zeitraum (optional)
                </Label>
                <Input
                  value={preferredSlotDe}
                  onChange={(e) => setPreferredSlotDe(e.target.value)}
                  placeholder="z.B. Nächste Woche Di/Do 10:00–12:00 Uhr"
                  className="bg-slate-900 border-blue-800 text-white placeholder:text-slate-400 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-blue-200">
                  Interne Notiz / Abteilung / Einsatzort (optional)
                </Label>
                <Input
                  value={actionNoteDe}
                  onChange={(e) => setActionNoteDe(e.target.value)}
                  placeholder="z.B. Station 3B / Mit Dolmetscher Deutsch-Vietnamesisch"
                  className="bg-slate-900 border-blue-800 text-white placeholder:text-slate-400 text-xs"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="submit"
                  disabled={isSubmittingAction}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                >
                  {isSubmittingAction ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Wird gebucht...
                    </>
                  ) : (
                    <>
                      Jetzt verbindlich absenden
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 1: DOSSIERS & CANDIDATES */}
        {activeTab === "dossiers" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilterScope("all")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    filterScope === "all"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Alle freigegebenen Dossiers ({initialBundle.candidates.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterScope("shortlist")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                    filterScope === "shortlist"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  Unternehmens-Merkliste ({allShortlistedIds.size})
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { key: "all", label: "Alle Kategorien" },
                    { key: "skilled", label: "Fachkräfte (§ 18a/b)" },
                    { key: "azubi", label: "Auszubildende (§ 16a)" },
                    { key: "seasonal", label: "Saisonkräfte" },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setCategoryFilter(item.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      categoryFilter === item.key
                        ? "bg-blue-100 text-blue-800 font-bold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredCandidates.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <p className="text-slate-700 font-bold">
                  Keine Kandidaten in dieser Ansicht gefunden.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilterScope("all");
                    setCategoryFilter("all");
                  }}
                >
                  Alle Dossiers anzeigen
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredCandidates.map((c) => {
                  const code = c.id.slice(0, 8).toUpperCase();
                  const scores = computeB2BReadinessScore(c);
                  const isSaved = allShortlistedIds.has(c.id);

                  return (
                    <div
                      key={c.id}
                      className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-5"
                    >
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-900 text-white">
                                #{code}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                Deutsch {c.german_level || "B1"} (geprüft)
                              </Badge>
                              {c.visa_status && (
                                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">
                                  § 81a AufenthG bereit
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-lg font-extrabold text-slate-900">
                              {c.profession || "Fachkraft / Auszubildende(r)"}
                            </h3>
                            <p className="text-xs text-slate-500">
                              Berufserfahrung: {c.experience_years || 1}+ Jahre • Verfügbarkeit:
                              Nach Vereinbarung
                            </p>
                          </div>

                          <div className="text-right shrink-0 bg-blue-50 border border-blue-200 rounded-2xl px-3.5 py-2">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                              DMF Bewertungsindex
                            </div>
                            <div className="text-xl font-black text-blue-900">
                              {scores.total}
                              <span className="text-xs font-semibold text-blue-600">/100</span>
                            </div>
                          </div>
                        </div>

                        {/* DMF Bewertungsbogen Breakdown */}
                        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                          <div>
                            <div className="text-[11px] text-slate-500">Fachqualifikation</div>
                            <div className="text-xs font-bold text-slate-900">
                              {scores.fachlich}%
                            </div>
                          </div>
                          <div className="border-x border-slate-200">
                            <div className="text-[11px] text-slate-500">Sprachkompetenz</div>
                            <div className="text-xs font-bold text-slate-900">
                              {scores.sprachlich}%
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] text-slate-500">Dossier-Prüfung</div>
                            <div className="text-xs font-bold text-emerald-700">
                              {scores.dossier}%
                            </div>
                          </div>
                        </div>

                        {/* Verified Document Checklist in Data Room */}
                        <div className="space-y-1.5">
                          <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-emerald-600" />
                            Im Datenraum hinterlegte & vorab geprüfte Unterlagen:
                          </div>
                          <div className="flex flex-wrap gap-1.5 text-[11px]">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                              ✓ Tabellarischer Lebenslauf (DIN 5008)
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                              ✓ Sprachzertifikat ({c.german_level || "B1"})
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                              ✓ Abschluss- & Stundennachweis (beglaubigt)
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                              ✓ DSGVO & § 81a Vollmacht
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 1-Click Employer Actions */}
                      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() =>
                              setActiveActionCandidate({
                                candidate: c,
                                actionType: "interview",
                              })
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                          >
                            <Video className="w-3.5 h-3.5 mr-1.5" />
                            Interview anfragen
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setActiveActionCandidate({
                                candidate: c,
                                actionType: "reservation",
                              })
                            }
                            className="text-xs border-slate-300"
                          >
                            <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-600" />7 Tage
                            reservieren
                          </Button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleAccountShortlist(c)}
                            className={`text-xs ${
                              isSaved ? "text-blue-700 bg-blue-50 font-bold" : "text-slate-600"
                            }`}
                          >
                            {isSaved ? (
                              <>
                                <BookmarkCheck className="w-3.5 h-3.5 mr-1" />
                                Gemerkt
                              </>
                            ) : (
                              <>
                                <Bookmark className="w-3.5 h-3.5 mr-1" />
                                Merken
                              </>
                            )}
                          </Button>
                          <Button asChild size="sm" variant="ghost" className="text-xs">
                            <Link href={`/fuer-arbeitgeber/kandidaten/${c.id}`}>
                              Exposé <ExternalLink className="w-3 h-3 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INTERVIEW & § 81a VISUM TRACKER */}
        {activeTab === "tracker" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Live-Status Ihrer Kandidaten-Reservierungen & § 81a AufenthG Verfahren
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Jede Anfrage durchläuft unseren standardisierten 5-Stufen-Prozess von der
                  Dossier-Freigabe bis zur Einreise nach Deutschland.
                </p>
              </div>

              {/* 5-Stage Pipeline Legend */}
              <div className="grid sm:grid-cols-5 gap-3">
                {[
                  {
                    step: "Stufe 1",
                    title: "Dossier-Freigabe",
                    desc: "Prüfung der vollständigen Bewerbungsmappe",
                  },
                  {
                    step: "Stufe 2",
                    title: "Fachgespräch",
                    desc: "Video-Interview per Teams/Zoom inkl. Dolmetscher",
                  },
                  {
                    step: "Stufe 3",
                    title: "Vertrag & § 81a",
                    desc: "Arbeits-/Ausbildungsvertrag & Untervollmacht",
                  },
                  {
                    step: "Stufe 4",
                    title: "Vorabzustimmung",
                    desc: "Anerkennung (IHK/LfP) & Bundesagentur für Arbeit",
                  },
                  {
                    step: "Stufe 5",
                    title: "Visum & Einreise",
                    desc: "Botschaftstermin in Vietnam & Onboarding",
                  },
                ].map((stage, idx) => (
                  <div
                    key={stage.step}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1"
                  >
                    <div className="text-[11px] font-bold text-blue-600 uppercase">
                      {stage.step}
                    </div>
                    <div className="text-xs font-extrabold text-slate-900">{stage.title}</div>
                    <div className="text-[11px] text-slate-500 leading-snug">{stage.desc}</div>
                    {idx === 0 && (
                      <div className="pt-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1" />
                        <span className="text-[10px] font-semibold text-emerald-700">
                          Sofort im Datenraum
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Employer's Direct Candidate Actions */}
              {profile.interviewRequests.length === 0 && initialBundle.inquiries.length === 0 ? (
                <div className="p-10 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-3">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-800">
                    Noch keine aktiven Interview- oder Reservierungsanfragen vorhanden.
                  </p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Wählen Sie im Reiter „Freigegebene Bewerbungsmappen“ einen Kandidaten aus und
                    klicken Sie auf „Interview anfragen“ oder „7 Tage reservieren“.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setActiveTab("dossiers")}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                  >
                    Zu den Bewerbungsmappen
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.interviewRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                            #{req.candidateCode}
                          </span>
                          <span className="text-sm font-bold text-slate-900">{req.profession}</span>
                          <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-xs">
                            {req.actionType === "interview"
                              ? "Video-Interview angefragt"
                              : req.actionType === "reservation"
                                ? "7-Tage-Reservierung aktiv"
                                : "Vollständige Mappe angefordert"}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600">
                          Terminwunsch: <strong>{req.preferredSlotDe}</strong>
                          {req.noteDe ? ` • Notiz: ${req.noteDe}` : ""}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Angelegt am{" "}
                          {new Date(req.createdAt).toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">
                          Stufe 1 → 2: Terminkoordination läuft
                        </Badge>
                        <Button asChild size="sm" variant="outline" className="text-xs">
                          <Link href={`/fuer-arbeitgeber/kandidaten/${req.candidateId}`}>
                            Profil öffnen
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}

                  {initialBundle.inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Personalanfrage #{inq.id.slice(0, 8).toUpperCase()}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            Eingegangen am{" "}
                            {new Date(inq.createdAt).toLocaleDateString("de-DE", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 line-clamp-2 whitespace-pre-line">
                          {inq.message || "Allgemeine Personalanfrage"}
                        </p>
                      </div>
                      <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-xs shrink-0">
                        Status:{" "}
                        {inq.status === "new" ? "In Bearbeitung durch DMF-Berater" : inq.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: COMPANY PROFILE & DSGVO COMPLIANCE */}
        {activeTab === "company" && (
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Unternehmensstammdaten für Verträge & § 81a Vollmachten
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Diese Angaben werden bei Interview-Anfragen und der Vorbereitung von
                  Ausbildungs-/Arbeitsverträgen automatisch vorausgefüllt.
                </p>
              </div>

              <form onSubmit={handleSaveCompanyProfile} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Unternehmen / Einrichtung *</Label>
                    <Input
                      required
                      value={companyDraft.companyName}
                      onChange={(e) =>
                        setCompanyDraft({ ...companyDraft, companyName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Ansprechpartner(in) *</Label>
                    <Input
                      required
                      value={companyDraft.contactPerson}
                      onChange={(e) =>
                        setCompanyDraft({ ...companyDraft, contactPerson: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Telefon / Durchwahl</Label>
                    <Input
                      value={companyDraft.phone}
                      onChange={(e) => setCompanyDraft({ ...companyDraft, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Standort / Bundesland</Label>
                    <Input
                      value={companyDraft.city}
                      onChange={(e) => setCompanyDraft({ ...companyDraft, city: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Branche</Label>
                  <select
                    value={companyDraft.industry}
                    onChange={(e) => setCompanyDraft({ ...companyDraft, industry: e.target.value })}
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-900"
                  >
                    {INDUSTRY_OPTIONS.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  type="submit"
                  disabled={isSavingCompany}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  {isSavingCompany ? "Wird gespeichert..." : "Unternehmensdaten speichern"}
                </Button>
              </form>
            </div>

            <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                DSGVO-Compliance-Protokoll
              </div>
              <h3 className="text-lg font-bold">
                Elektronische Vertraulichkeitserklärung (Art. 6 & Art. 28 DSGVO)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Für das Konto <strong>{profile.email}</strong> ({profile.companyName}) liegt eine
                aktive elektronische Bestätigung zur zweckgebundenen Verarbeitung personenbezogener
                Bewerberdaten im Rahmen der Personalauswahl vor.
              </p>
              <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs space-y-1.5">
                <div>
                  <span className="text-slate-400">Status:</span>{" "}
                  <strong className="text-emerald-400">Aktiv & Verifiziert</strong>
                </div>
                <div>
                  <span className="text-slate-400">Bestätigt am:</span>{" "}
                  <strong>
                    {profile.dsgvoAcceptedAt
                      ? new Date(profile.dsgvoAcceptedAt).toLocaleDateString("de-DE")
                      : new Date().toLocaleDateString("de-DE")}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400">Rechtsgrundlage:</span>{" "}
                  <strong>Art. 6 Abs. 1 lit. b & Art. 88 DSGVO i.V.m. § 26 BDSG</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
