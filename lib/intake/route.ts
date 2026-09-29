import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { createIntakeClient } from "@/lib/supabase/intake";
import {
  chatLeadIntakeSchema,
  contactIntakeSchema,
  profileIntakeSchema,
  type IntakeKind,
  type IntakePayload,
} from "@/lib/validations/intake";
import { after, NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import "server-only";
import { z } from "zod";
import { InvalidBody, readJsonBody } from "./body";
import { dispatchSubmission } from "./notifications";

const responseHeaders = { "Cache-Control": "no-store" };
export async function acceptIntake(request: NextRequest, route: "contact" | "profile" | "lead") {
  try {
    const body = await readJsonBody(request);
    const schema =
      route === "contact"
        ? contactIntakeSchema
        : route === "profile"
          ? profileIntakeSchema
          : chatLeadIntakeSchema;
    const parsed = schema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        {
          success: false,
          error: "Bitte überprüfen Sie Ihre Angaben und die Datenschutzzustimmung.",
        },
        { status: 400, headers: responseHeaders }
      );
    const key = request.headers.get("Idempotency-Key");
    if (key && !z.uuid().safeParse(key).success)
      return NextResponse.json(
        { success: false, error: "Ungültige Anfragekennung." },
        { status: 400, headers: responseHeaders }
      );
    const rate = await checkRateLimit(`intake:${getClientIp(request)}`, RATE_LIMITS.CONTACT);
    if (!rate.success)
      return NextResponse.json(
        { success: false, error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { ...responseHeaders, "Retry-After": String(rate.resetIn) } }
      );
    const payload: IntakePayload = parsed.data;
    const kind: IntakeKind = route === "contact" ? payload.type || "contact" : route;
    const id = key || randomUUID(); // Compatibility with already-open pre-release forms.
    const db = createIntakeClient();
    const { data, error } = await db.rpc("dmf_receive_intake", {
      p_id: id,
      p_kind: kind,
      p_payload: payload,
    });
    if (error) {
      const status = error.code === "23505" ? 409 : error.code === "P0002" ? 400 : 503;
      return NextResponse.json(
        {
          success: false,
          error:
            status === 409
              ? "Die Anfragekennung wurde bereits verwendet. Bitte laden Sie das Formular neu."
              : status === 400
                ? "Dieses Kandidatenprofil ist nicht mehr verfügbar."
                : "Anfrage konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.",
        },
        { status, headers: responseHeaders }
      );
    }
    if (!data || typeof data.duplicate !== "boolean") throw new Error("Invalid intake receipt");
    if (!data.duplicate)
      after(async () => {
        try {
          await dispatchSubmission(id);
        } catch {
          console.error("[Intake] Notification processing deferred; see admin delivery queue.");
        }
      });
    return NextResponse.json(
      {
        success: true,
        saved: true,
        accepted: true,
        duplicate: data.duplicate,
        message: "Ihre Anfrage wurde gespeichert. Unser Team meldet sich bei Ihnen.",
      },
      { headers: responseHeaders }
    );
  } catch (error) {
    if (error instanceof InvalidBody)
      return NextResponse.json(
        { success: false, error: "Ungültige oder zu große Anfrage." },
        { status: error.status, headers: responseHeaders }
      );
    return NextResponse.json(
      {
        success: false,
        error: "Anfrage konnte nicht gespeichert werden. Bitte versuchen Sie es später erneut.",
      },
      { status: 503, headers: responseHeaders }
    );
  }
}
