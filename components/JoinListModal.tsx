"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { saveContact } from "@/lib/dashboard/contact";
import { captureAttribution, recordLocalEvent } from "@/lib/attribution";
import { useI18n } from "@/lib/i18n/provider";
import { countries, nationalDigits } from "@/lib/phone";

type Status = "idle" | "submitting" | "success" | "error";

export function JoinListModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [iso, setIso] = useState("ae");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const emailId = useId();
  const { t, locale } = useI18n();

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) return;
    // Reset after the exit animation so the form doesn't flicker on close.
    const timeout = window.setTimeout(() => {
      setEmail("");
      setPhone("");
      setIso("ae");
      setAgreed(false);
      setStatus("idle");
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const country = countries.find((item) => item.iso === iso) ?? countries[0];
    const cleanEmail = email.trim().toLowerCase();
    const digits = nationalDigits(phone, country.dial);
    if (!cleanEmail || digits.length < 5 || !agreed) {
      console.error("[join-list] validation failed:", {
        emailPresent: Boolean(cleanEmail),
        phoneDigits: digits.length,
        agreed,
      });
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorDetail(null);

    try {
      const attribution = captureAttribution();
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          locale,
          phone: `${country.dial}${digits}`,
          country: country.iso,
          source: attribution.source,
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        console.error("[join-list] /api/waitlist failed:", {
          status: response.status,
          statusText: response.statusText,
          body: result,
        });
        // TEMPORARY DIAGNOSTIC: show the real reason on screen.
        setErrorDetail(
          `${response.status}: ${result?.error ?? response.statusText ?? "no response body"}`,
        );
        throw new Error(`Request failed (${response.status})`);
      }
      if (result?.stored === false) {
        console.warn("[join-list] signup was accepted but NOT stored:", result);
      }
      saveContact({
        email: cleanEmail,
        iso: country.iso,
        dial: country.dial,
        phone: digits,
      });
      recordLocalEvent({
        type: "waitlist_join",
        email: cleanEmail,
        detail: {
          phone: `${country.dial}${digits}`,
          country: country.iso,
          source: attribution.source,
        },
      });
      window.location.assign("/dashboard/explore");
    } catch (error) {
      console.error("[join-list] submit error:", error);
      setErrorDetail((current) => current ?? String(error));
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-navy/40 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={t.modal.close}
              className="absolute end-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-cream hover:text-navy"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {status === "success" ? (
              <div className="pt-2">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-mint/10">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4.5 10.5l3.5 3.5 7.5-8"
                      stroke="#1F6E5A"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2
                  id={titleId}
                  className="font-serif text-2xl leading-tight text-navy"
                >
                  {t.modal.successTitle}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  {t.modal.successBody}
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <ButtonLink href="/dashboard/explore" className="w-full">
                    {t.modal.enterPlatform}
                  </ButtonLink>
                  <Button variant="secondary" className="w-full" onClick={onClose}>
                    {t.modal.done}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h2
                  id={titleId}
                  className="pe-10 font-serif text-2xl leading-tight text-navy"
                >
                  {t.modal.title}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  {t.modal.description}
                </p>

                <form onSubmit={handleSubmit} className="mt-6">
                  <label
                    htmlFor={emailId}
                    className="mb-2 block font-sans text-sm font-medium text-navy"
                  >
                    {t.modal.emailLabel}
                  </label>
                  <input
                    ref={inputRef}
                    id={emailId}
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    dir="ltr"
                    placeholder={t.modal.emailPlaceholder}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="min-h-[44px] w-full rounded-full border border-border bg-cream/60 px-4 text-start text-[15px] text-navy placeholder:text-muted/70 focus:border-navy/40 focus:bg-white"
                  />

                  <label className="mb-2 mt-4 block font-sans text-sm font-medium text-navy">
                    {t.modal.phoneLabel}
                  </label>
                  <div className="flex gap-2">
                    <select
                      aria-label={t.modal.countryLabel}
                      value={iso}
                      onChange={(event) => setIso(event.target.value)}
                      dir="ltr"
                      className="min-h-[44px] max-w-[48%] rounded-full border border-border bg-cream/60 px-3 text-[13px] text-navy"
                    >
                      {countries.map((country) => (
                        <option key={country.iso} value={country.iso}>
                          {country.dial} {country.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      name="tel"
                      required
                      autoComplete="tel-national"
                      inputMode="tel"
                      dir="ltr"
                      placeholder={t.modal.phonePlaceholder}
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="min-h-[44px] min-w-0 flex-1 rounded-full border border-border bg-cream/60 px-4 text-[15px] text-navy placeholder:text-muted/70 focus:border-navy/40 focus:bg-white"
                    />
                  </div>

                  <label className="mt-4 flex items-start gap-3 font-sans text-[13px] leading-relaxed text-navy">
                    <input
                      type="checkbox"
                      required
                      checked={agreed}
                      onChange={(event) => setAgreed(event.target.checked)}
                      className="mt-1 accent-navy"
                    />
                    <span>
                      {t.modal.consent}{" "}
                      <a href="/legal/terms" className="underline underline-offset-2">
                        {t.footer.terms}
                      </a>
                      {" · "}
                      <a href="/legal/privacy" className="underline underline-offset-2">
                        {t.footer.privacy}
                      </a>
                    </span>
                  </label>

                  {status === "error" && (
                    <p role="alert" className="mt-3 text-sm text-[#B3261E]">
                      {t.modal.error}
                      {errorDetail && (
                        <span className="mt-1 block break-words font-mono text-[12px]">
                          {errorDetail}
                        </span>
                      )}
                    </p>
                  )}

        <Button
          type="submit"
          className="mt-4 w-full"
          disabled={status === "submitting" || !agreed}
        >
                    {status === "submitting"
                      ? t.modal.submitting
                      : t.modal.submit}
                  </Button>
                </form>

                <p className="mt-4 text-center text-[13px] leading-relaxed text-muted">
                  {t.modal.reassurance}
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
