"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export function SignOutButton() {
  const { t } = useI18n();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function signOut() {
    setIsSigningOut(true);
    await createBrowserSupabase()?.auth.signOut();
    router.replace("/entrepreneurs/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={isSigningOut}
      className="inline-flex min-h-[44px] items-center rounded-full border border-cream/25 px-5 font-sans text-[15px] text-cream transition hover:border-cream/50 disabled:opacity-60"
    >
      {t.auth.signOut}
    </button>
  );
}
