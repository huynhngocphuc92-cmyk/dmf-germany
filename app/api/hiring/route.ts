import { NextRequest } from "next/server";
import { acceptIntake } from "@/lib/intake/route";

export async function POST(request: NextRequest) {
  return acceptIntake(request, "hiring");
}
