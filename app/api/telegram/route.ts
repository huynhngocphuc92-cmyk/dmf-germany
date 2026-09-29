import { NextResponse } from "next/server";
// Legacy clients must submit an enquiry; arbitrary browser messages are no longer sent.
export async function POST() {
  return NextResponse.json(
    { error: "Use the enquiry form to contact DMF." },
    { status: 410, headers: { "Cache-Control": "no-store" } }
  );
}
