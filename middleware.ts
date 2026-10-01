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

async function handle(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
