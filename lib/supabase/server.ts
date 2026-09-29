import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { readPublicSupabaseEnv } from "./env";

/** Server-only: never re-export this from a module a client component imports. */
function readServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}

/**
 * Session-aware client for server components and route handlers. Returns null
 * when Supabase has not been configured yet, so callers can degrade gracefully
 * instead of crashing the render.
 */
export function createServerSupabase() {
  const env = readPublicSupabaseEnv();
  if (!env) return null;

  const cookieStore = cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        // Server components cannot mutate cookies; the middleware refreshes
        // the session instead, so swallowing this is safe.
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          /* no-op */
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          /* no-op */
        }
      },
    },
  });
}

/**
 * Publishable-key client for server routes (waitlist, events, operator reads).
 * This is not a secret: it is the same public key the browser may use.
 * Never pass a secret / service-role key here.
 */
export function createPublicSupabase() {
  const env = readPublicSupabaseEnv();
  if (!env) return null;

  return createClient(env.url, env.anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Service-role client. Bypasses RLS, so it must never be imported into
 * client components — only route handlers and server actions.
 * Optional: data collection does not require this key.
 */
export function createAdminSupabase() {
  const env = readPublicSupabaseEnv();
  const serviceRoleKey = readServiceRoleKey();
  if (!env || !serviceRoleKey) return null;
  if (serviceRoleKey.startsWith("sb_publishable_")) return null;

  return createClient(env.url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
