"use client";

import { createBrowserClient } from "@supabase/ssr";
import { readPublicSupabaseEnv } from "./env";

export function createBrowserSupabase() {
  const env = readPublicSupabaseEnv();
  if (!env) return null;
  return createBrowserClient(env.url, env.anonKey);
}
