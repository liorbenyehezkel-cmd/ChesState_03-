import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { countryFromRequest, isBlockedCountry } from "@/services/geofence";

const gatedPrefixes = ["/dashboard", "/invest", "/platform"];

export async function middleware(request: NextRequest) {
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

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
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

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|webp)$).*)"],
};
