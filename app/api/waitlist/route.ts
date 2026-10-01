import { NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n/config";
import { investorCookieOptions } from "@/lib/invest/session";
import { logPlatformEvent } from "@/lib/legal/logEvent";
import { saveRegistration } from "@/lib/supabase/registrations";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function withInvestorCookie(body: unknown, status: number, email: string) {
  const response = NextResponse.json(body, { status });
  const options = investorCookieOptions();
  response.cookies.set({
    ...options,
    value: email,
  });
  return response;
}

/**
 * Investor waiting list. Writes to `public.registrations` with the
 * publishable key. Entrepreneurs stay on a separate table / account.
 *
 * A successful signup also sets a cookie so the visitor can open /invest
 * without creating a password. That cookie is not an investment.
 */
export async function POST(request: Request) {
  let payload: {
    email?: unknown;
    locale?: unknown;
    phone?: unknown;
    country?: unknown;
    source?: unknown;
  };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, locale, phone, country, source } = payload;

  const normalised = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!emailPattern.test(normalised)) {
    return NextResponse.json(
      { error: "A valid email address is required" },
      { status: 400 },
    );
  }
  const arrivalSource =
    typeof source === "string" && source.trim() ? source.trim().slice(0, 80) : "Direct";
  const localeValue =
    typeof locale === "string" && isLocale(locale) ? locale : "en";

  const saved = await saveRegistration({
    email: normalised,
    phone: typeof phone === "string" ? phone.trim() : null,
    country: typeof country === "string" ? country : null,
    source: arrivalSource,
    locale: localeValue,
    tryToPurchase: false,
  });

  if (saved.error === "not_configured") {
    console.warn("[waitlist] Supabase not configured; signup was not stored.");
    return withInvestorCookie({ ok: true, stored: false }, 202, normalised);
  }

  if (saved.error === "rls") {
    console.error(
      "[waitlist] RLS blocked insert. Run supabase/registrations.sql in the SQL editor.",
    );
    return withInvestorCookie({ ok: true, stored: false, reason: "rls" }, 202, normalised);
  }

  if (!saved.stored) {
    console.error("[waitlist] insert failed:", saved.detail ?? saved.error);
    return NextResponse.json(
      { error: "Could not save signup", detail: saved.detail ?? saved.error },
      { status: 500 },
    );
  }

  await logPlatformEvent({
    type: "waitlist_join",
    email: normalised,
    detail: {
      locale: localeValue,
      country: typeof country === "string" ? country : null,
      source: arrivalSource,
    },
  });

  return withInvestorCookie({ ok: true, stored: true }, 202, normalised);
}
