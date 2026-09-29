import { acceptIntake } from "@/lib/intake/route";
import { NextRequest } from "next/server";
export async function POST(request: NextRequest) {
  return acceptIntake(request, "contact");
}
