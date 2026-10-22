import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { readPublicSupabaseEnv } from "@/lib/supabase/env";
import { countryFromRequest, isBlockedCountry } from "@/services/geofence";

const gatedPrefixes = ["/dashboard", "/invest", "/platform"];

export async function middleware(request: NextRequest) {
  // A crash here turns into a site-wide 500 (MIDDLEWARE_INVOCATION_FAILED),
  // so any unexpected failure must fall through to the plain request.
  try {
    return await handle(request);
  } catch (error) {
    console.error("[middleware] falling back to passthrough:", error);
    return NextResponse.next();
  }
}

/**
 * The operator pages show registrants' contact details, so they sit behind
 * HTTP Basic Auth (any username, password = ADMIN_PASSWORD). With no password
 * configured they stay locked rather than open.
 */
function adminAuthorized(request: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const header = request.headers.get("authorization") ?? "";
  if (!header.startsWith("Basic ")) return false;
  let decoded = "";
  try {
    decoded = atob(header.slice(6));
  } catch {
    return false;
  }
  const given = decoded.slice(decoded.indexOf(":") + 1);
  // Constant-time comparison so response timing does not leak the password.
  let diff = given.length ^ expected.length;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ (given.charCodeAt(i) || 0);
  }
  return diff === 0;
}

async function handle(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!adminAuthorized(request)) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="ChesState admin", charset="UTF-8"' },
      });
    }
  }

  if (
    gatedPrefixes.some((prefix) => pathname.startsWith(prefix)) &&
    pathname !== "/unavailable"
  ) {
    const country = countryFromRequest(request);
    if (isBlockedCountry(country)) {
      const dest = request.nextUrl.clone();
      dest.pathname = "/unavailable";
      dest.search = "";
      return NextResponse.redirect(dest);
    }
  }

  let response = NextResponse.next({ request: { headers: request.headers } });

  const env = readPublicSupabaseEnv();
  if (!env) return response;

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({ request: { headers: request.headers } });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({ request: { headers: request.headers } });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  // Session refresh is best-effort: an unreachable or misconfigured Supabase
  // must not take the whole site down.
  try {
    await supabase.auth.getUser();
  } catch (error) {
    console.error("[middleware] session refresh failed:", error);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|webp)$).*)"],
};
