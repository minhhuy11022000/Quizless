import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/updateSession";

// Next.js 16 renamed Middleware to Proxy (same behavior, new name/file).
export function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on every route except static assets and image optimization
     * files, so the session cookie stays fresh app-wide.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
