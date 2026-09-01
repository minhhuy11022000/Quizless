import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { supabaseEnv } from "./env";

/**
 * Supabase client for use in Server Components, Server Actions, and Route
 * Handlers. Reads/writes the auth session via Next.js's `cookies()` API so
 * requests carry the signed-in user's session (and RLS applies as them).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseEnv.url, supabaseEnv.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // `setAll` is called from a Server Component when the session is
          // refreshed. Server Components can't set cookies — that's fine as
          // long as `proxy.ts` also refreshes the session on every request.
        }
      },
    },
  });
}
