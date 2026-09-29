import { NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n/config";
import { propertyTypeKeys } from "@/lib/i18n/types";
import { logPlatformEvent } from "@/lib/legal/logEvent";
import { SITE_URL } from "@/lib/site";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function fail(reason: string, status: number) {
  return NextResponse.json({ reason }, { status });
}

/**
 * Entrepreneur signup. Creates an auth account and stores the questionnaire in
 * `entrepreneur_applications` — a table with no relationship to the investor
 * waiting list, so the two audiences never share a record.
 */
export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return fail("invalid_body", 400);
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!emailPattern.test(email)) return fail("invalid_email", 400);
  if (password.length < MIN_PASSWORD_LENGTH) return fail("weak_password", 400);

  const supabase = createServerSupabase();
  const admin = createAdminSupabase();
  if (!supabase || !admin) return fail("not_configured", 503);

  // Every questionnaire answer is optional, so anything unrecognised simply
  // becomes null rather than rejecting the signup.
  const propertyType =
    typeof payload.propertyType === "string" &&
    (propertyTypeKeys as readonly string[]).includes(payload.propertyType)
      ? payload.propertyType
      : null;

  const rawFunding = payload.fundingTarget;
  const fundingTarget =
    typeof rawFunding === "number" && Number.isFinite(rawFunding) && rawFunding >= 0
      ? Math.round(rawFunding)
      : null;

  const city = typeof payload.city === "string" && payload.city ? payload.city : null;
  const neighborhood =
    typeof payload.neighborhood === "string" && payload.neighborhood
      ? payload.neighborhood
      : null;
  const locale =
    typeof payload.locale === "string" && isLocale(payload.locale)
      ? payload.locale
      : "en";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${siteUrl}/auth/callback` },
  });

  if (error) {
    if (/already registered|already exists/i.test(error.message)) {
      return fail("email_taken", 409);
    }
    console.error("[entrepreneurs] signUp failed:", error.message);
    return fail("signup_failed", 500);
  }

  // Supabase returns a user with no identities when the address is already
  // taken, rather than erroring, so that signup cannot be used to enumerate
  // accounts.
  if (!data.user || data.user.identities?.length === 0) {
    return fail("email_taken", 409);
  }

  const { error: insertError } = await admin
    .from("entrepreneur_applications")
    .upsert(
      {
        user_id: data.user.id,
        email,
        property_type: propertyType,
        funding_target_usd: fundingTarget,
        city,
        neighborhood,
        locale,
      },
      { onConflict: "user_id" },
    );

  if (insertError) {
    console.error("[entrepreneurs] insert failed:", insertError.message);
    return fail("save_failed", 500);
  }

  await logPlatformEvent({
    type: "entrepreneur_signup",
    email,
    detail: { city, neighborhood, propertyType },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
