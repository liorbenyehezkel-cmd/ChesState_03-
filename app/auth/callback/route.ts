import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** Target of the confirmation link in the entrepreneur signup email. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
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
