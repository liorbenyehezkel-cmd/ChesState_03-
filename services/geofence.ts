import type { NextRequest } from "next/server";

/** Markets ChesState is building for. The United States is excluded on purpose. */
export const BLOCKED_COUNTRIES = ["US"] as const;

/**
 * Resolve a country code from the edge request.
 *
 * Production: set by the host (`x-vercel-ip-country`, `cf-ipcountry`).
 * Local testing: append `?country=US` or send `x-mock-country: US`.
 * Missing country (typical localhost) is treated as allowed so development works.
 */
export function countryFromRequest(request: NextRequest): string | null {
  const mock =
    request.nextUrl.searchParams.get("country") ??
    request.headers.get("x-mock-country");
  if (mock) return mock.trim().toUpperCase();

  const header =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-country-code");

  return header ? header.trim().toUpperCase() : null;
}

export function isBlockedCountry(country: string | null) {
  if (!country) return false;
  return (BLOCKED_COUNTRIES as readonly string[]).includes(country);
}
