/**
 * Supabase credentials are read lazily so the app still builds and renders
 * before anyone has filled in `.env.local`.
 *
 * The publishable key is the public credential (safe in the browser).
 * A secret / service-role key must never be read here.
 */

function normalizeSupabaseUrl(url: string) {
  return url
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/rest\/v1$/i, "");
}

function readPublishableKey() {
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ""
  ).trim();

  if (!key) return null;
  if (key.startsWith("sb_secret_") || key.includes("service_role")) {
    console.error(
      "[supabase] Refusing to use a secret/service-role key as a public credential.",
    );
    return null;
  }
  return key;
}

export function readPublicSupabaseEnv() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = readPublishableKey();
  if (!rawUrl || !anonKey) return null;
  return { url: normalizeSupabaseUrl(rawUrl), anonKey };
}

export function isSupabaseConfigured() {
  return readPublicSupabaseEnv() !== null;
}
