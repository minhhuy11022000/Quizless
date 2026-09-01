import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

/**
 * Data Access Layer: the single place request-scoped auth is read. Cached
 * per-render via React's `cache()` so calling it repeatedly in one request
 * (layout + page + nested components) only hits Supabase once.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/** Same as `getCurrentUser`, but redirects to /login instead of returning null. */
export const requireUser = cache(async (): Promise<User> => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
});
