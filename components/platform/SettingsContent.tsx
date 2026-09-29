"use client";

import { useState } from "react";
import { SignOutButton } from "@/components/entrepreneurs/SignOutButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/provider";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export function SettingsContent({
  email,
  isPreview,
}: {
  email: string;
  isPreview: boolean;
}) {
  const { t } = useI18n();
  const [resetState, setResetState] = useState<"idle" | "sending" | "sent">("idle");

  async function sendReset() {
    const supabase = createBrowserSupabase();
    if (!supabase) return;

    setResetState("sending");
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `https://chesstate.com/auth/callback`,
    });
    setResetState("sent");
  }

  return (
    <div className="max-w-[36rem] space-y-6">
      <section className="rounded-2xl border border-cream/12 bg-cream/[0.05] p-6">
        <h2 className="font-sans text-sm font-medium text-cream">
          {t.platform.settings.emailLabel}
        </h2>
        <p dir="ltr" className="mt-2 font-sans text-[16px] text-cream">
          {email}
        </p>
        <p className="mt-2 font-sans text-[13px] leading-relaxed text-cream/50">
          {t.platform.settings.emailHelp}
        </p>
      </section>

      <section className="rounded-2xl border border-cream/12 bg-cream/[0.05] p-6">
        <h2 className="font-sans text-sm font-medium text-cream">
          {t.platform.settings.languageLabel}
        </h2>
        <div className="mt-3">
          <LanguageSwitcher tone="light" />
        </div>
        <p className="mt-2 font-sans text-[13px] leading-relaxed text-cream/50">
          {t.platform.settings.languageHelp}
        </p>
      </section>

      <section className="rounded-2xl border border-cream/12 bg-cream/[0.05] p-6">
        <h2 className="font-sans text-sm font-medium text-cream">
          {t.platform.settings.passwordTitle}
        </h2>
        <p className="mt-2 font-sans text-[14px] leading-relaxed text-cream/60">
          {t.platform.settings.passwordBody}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={sendReset}
            disabled={isPreview || resetState !== "idle"}
            className="border-cream/25 text-cream hover:border-cream/50 hover:bg-cream/[0.06]"
          >
            {resetState === "sending"
              ? t.platform.settings.sendingReset
              : t.platform.settings.sendReset}
          </Button>
          {resetState === "sent" && (
            <p role="status" className="font-sans text-[14px] text-[#8FD8C2]">
              {t.platform.settings.resetSent}
            </p>
          )}
          {isPreview && (
            <p className="font-sans text-[14px] text-cream/50">
              {t.platform.readOnlyInPreview}
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-cream/12 bg-cream/[0.05] p-6">
        <h2 className="font-sans text-sm font-medium text-cream">
          {t.platform.settings.signOutTitle}
        </h2>
        <p className="mt-2 font-sans text-[14px] leading-relaxed text-cream/60">
          {t.platform.settings.signOutBody}
        </p>
        <div className="mt-4">
          <SignOutButton />
        </div>
      </section>
    </div>
  );
}
