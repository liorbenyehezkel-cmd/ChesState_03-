"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/provider";
import { createBrowserSupabase } from "@/lib/supabase/browser";

const fieldClass =
  "min-h-[44px] w-full rounded-full border border-cream/20 bg-cream/[0.06] px-4 text-start font-sans text-[15px] text-cream placeholder:text-cream/35 focus:border-cream/50 focus:bg-cream/10";

export function LoginForm() {
  const { t } = useI18n();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const emailId = useId();
  const passwordId = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const supabase = createBrowserSupabase();
    if (!supabase) {
      setErrorMessage(t.auth.notConfigured);
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setErrorMessage(
        /email not confirmed/i.test(error.message)
          ? t.auth.emailUnconfirmed
          : t.auth.invalidCredentials,
      );
      setIsSubmitting(false);
      return;
    }

    router.replace("/dashboard/studio");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor={emailId}
          className="block font-sans text-sm font-medium text-cream"
        >
          {t.auth.emailLabel}
        </label>
        <input
          id={emailId}
          type="email"
          required
          autoComplete="email"
          dir="ltr"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={`${fieldClass} mt-3`}
        />
      </div>

      <div>
        <label
          htmlFor={passwordId}
          className="block font-sans text-sm font-medium text-cream"
        >
          {t.auth.passwordLabel}
        </label>
        <input
          id={passwordId}
          type="password"
          required
          autoComplete="current-password"
          dir="ltr"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={`${fieldClass} mt-3`}
        />
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="rounded-2xl border border-[#F3B0A8]/30 bg-[#F3B0A8]/10 px-4 py-3 font-sans text-[14px] text-[#F3B0A8]"
        >
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        variant="cream"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? t.auth.signingIn : t.auth.signIn}
      </Button>

      <p className="text-center font-sans text-[14px] text-cream/60">
        {t.auth.noAccount}{" "}
        <Link
          href="/entrepreneurs"
          className="font-medium text-cream underline underline-offset-4 hover:text-white"
        >
          {t.auth.applyHere}
        </Link>
      </p>
    </form>
  );
}
