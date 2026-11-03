import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

function sanitizeNextPath(rawNext: string | null, fallback = "/portal"): string {
  if (!rawNext) return fallback;
  const trimmed = rawNext.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("\\")) {
    return fallback;
  }
  return trimmed;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const requestedNext = searchParams.get("next");

  const supabase = await createClient();
  let authSucceeded = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    authSucceeded = !error;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    authSucceeded = !error;
  }

  if (!authSucceeded) {
    const fallbackLogin = requestedNext?.startsWith("/fuer-arbeitgeber/datenraum")
      ? "/fuer-arbeitgeber/datenraum?error=confirmation_failed"
      : "/portal/login?error=confirmation_failed";
    return NextResponse.redirect(new URL(fallbackLogin, origin));
  }

  if (type === "recovery") {
    return NextResponse.redirect(new URL("/auth/reset-password", origin));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isEmployer = user?.user_metadata?.account_type === "employer";
  const defaultDestination = isEmployer ? "/fuer-arbeitgeber/datenraum" : "/portal";
  const destination = sanitizeNextPath(requestedNext, defaultDestination);

  // If this is a student account, ensure student_profiles row and optional invite code are initialized
  if (user && !user.is_anonymous && !isEmployer) {
    try {
      const fullName =
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name.trim()
          : "";
      const phone =
        typeof user.user_metadata?.phone === "string" ? user.user_metadata.phone.trim() : "";
      const rawTrack =
        typeof user.user_metadata?.program_track === "string"
          ? user.user_metadata.program_track
          : "azubi";
      const programTrack = ["azubi", "skilled", "studium", "seasonal"].includes(rawTrack)
        ? rawTrack
        : "azubi";

      await supabase.from("student_profiles").upsert(
        {
          user_id: user.id,
          full_name: fullName,
          email: user.email || "",
          phone,
          program_track: programTrack,
        },
        { onConflict: "user_id" }
      );

      const pendingCode =
        typeof user.user_metadata?.pending_invite_code === "string"
          ? user.user_metadata.pending_invite_code.trim()
          : "";
      if (pendingCode) {
        await supabase.rpc("dmf_redeem_student_code", { p_code: pendingCode });
      }
    } catch {
      // Profile initialization fallback is handled inside getOrCreateStudentPortalBundle
    }
  }

  return NextResponse.redirect(new URL(destination, origin));
}
