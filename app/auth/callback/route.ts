import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** Target of the confirmation link in the entrepreneur signup email. */
export async function GET(request: Request) {
  let parsed: URL;
  try {
    parsed = new URL(request.url);
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const { searchParams, origin } = parsed;
  const code = searchParams.get("code");

  if (code) {
    const supabase = createServerSupabase();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}/dashboard/studio`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/entrepreneurs/login`);
}
