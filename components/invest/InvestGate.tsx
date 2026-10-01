"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/provider";

export function InvestGate() {
  const { t, locale } = useI18n();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const emailId = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), locale }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        console.error("[invest-gate] /api/waitlist failed:", {
          status: response.status,
          body,
        });
        throw new Error(`failed (${response.status})`);
      }
      window.location.assign("/invest");
    } catch (error) {
      console.error("[invest-gate] submit error:", error);
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-md py-16 sm:py-24">
      <span className="eyebrow text-navy/50">{t.invest.gate.eyebrow}</span>
      <h1 className="mt-4 font-serif text-[30px] leading-tight sm:text-[36px]">
        {t.invest.gate.title}
      </h1>
      <p className="mt-4 font-sans text-[15px] leading-relaxed text-muted">
        {t.invest.gate.body}
      </p>

      <form onSubmit={handleSubmit} className="mt-8">
        <label
          htmlFor={emailId}
          className="mb-2 block font-sans text-sm font-medium text-navy"
        >
          {t.modal.emailLabel}
        </label>
        <input
          id={emailId}
          type="email"
          required
          autoComplete="email"
          dir="ltr"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t.modal.emailPlaceholder}
          className="min-h-[44px] w-full rounded-full border border-border bg-white px-4 text-[15px] text-navy placeholder:text-muted/70 focus:border-navy/40"
        />

        {status === "error" && (
          <p role="alert" className="mt-3 text-sm text-[#B3261E]">
            {t.modal.error}
          </p>
        )}

        <Button
          type="submit"
          className="mt-4 w-full"
          disabled={status === "submitting"}
        >
          {status === "submitting"
            ? t.invest.gate.submitting
            : t.invest.gate.submit}
        </Button>
      </form>

      <p className="mt-4 text-center font-sans text-[13px] leading-relaxed text-muted">
        {t.modal.reassurance}
      </p>
    </div>
  );
}
