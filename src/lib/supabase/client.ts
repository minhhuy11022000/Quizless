import { createBrowserClient } from "@supabase/ssr";

import { supabaseEnv } from "./env";

/**
 * Supabase client for use in Client Components (browser only).
 */
export function createClient() {
  return createBrowserClient(supabaseEnv.url, supabaseEnv.anonKey);
}
