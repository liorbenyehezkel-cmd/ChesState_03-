export const INVESTOR_COOKIE = "chesstate_investor";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function investorCookieOptions() {
  return {
    name: INVESTOR_COOKIE,
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
    sameSite: "lax" as const,
  };
}
