import { NextResponse, type NextRequest } from "next/server";
import {
  appendVaryAccept,
  prefersMarkdown,
  resolveMarkdownDocument,
} from "@/lib/geo/markdown-negotiation";
import { updateSession } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  if (
    (request.method === "GET" || request.method === "HEAD") &&
    prefersMarkdown(request.headers.get("accept"))
  ) {
    const doc = resolveMarkdownDocument(request.nextUrl.pathname);
    if (doc) {
      return new NextResponse(request.method === "HEAD" ? null : doc.markdown, {
        status: doc.status,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          Vary: "Accept, accept-encoding",
          "Cache-Control": "public, max-age=0, must-revalidate",
          "X-Robots-Tag": doc.status === 404 ? "noindex" : "index, follow",
        },
      });
    }
  }

  const response = await updateSession(request);
  response.headers.set("Vary", appendVaryAccept(response.headers.get("Vary")));
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static image assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
