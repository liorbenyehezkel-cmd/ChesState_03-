"use client";

import Link from "next/link";
import { useId, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/provider";
import { propertyTypeKeys } from "@/lib/i18n/types";
import { neighborhoodsFor, uaeCities } from "@/lib/uae-locations";
import { FundingField } from "./FundingField";
import { OptionalTag } from "./OptionalTag";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "min-h-[44px] w-full rounded-full border border-cream/20 bg-cream/[0.06] px-4 text-start font-sans text-[15px] text-cream placeholder:text-cream/35 focus:border-cream/50 focus:bg-cream/10";

const selectClass = `${fieldClass} cursor-pointer appearance-none pe-10`;

export function EntrepreneurForm() {
  const { t, locale } = useI18n();

  const [propertyType, setPropertyType] = useState("");
  const [funding, setFunding] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const propertyTypeId = useId();
  const cityId = useId();
  const neighborhoodId = useId();
  const emailId = useId();
  const passwordId = useId();

  const neighborhoods = useMemo(() => neighborhoodsFor(city), [city]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!agreed) {
      setStatus("error");
      setErrorMessage(t.entrepreneurs.consent);
      return;
    }
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/entrepreneurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          locale,
          propertyType: propertyType || null,
          fundingTarget: funding === "" ? null : Number(funding),
          city: city || null,
          neighborhood: neighborhood || null,
        }),
      });

      const body = (await response.json().catch(() => ({}))) as {
        reason?: string;
      };

      if (!response.ok) {
        const reasons: Record<string, string> = {
          invalid_email: t.entrepreneurs.errorEmail,
          weak_password: t.entrepreneurs.errorPassword,
          email_taken: t.entrepreneurs.errorTaken,
          not_configured: t.entrepreneurs.errorNotConfigured,
        };
        setErrorMessage(
          reasons[body.reason ?? ""] ?? t.entrepreneurs.errorGeneric,
        );
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMessage(t.entrepreneurs.errorGeneric);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-cream/15 bg-cream/[0.06] p-8">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-cream/15">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M4.5 10.5l3.5 3.5 7.5-8"
              stroke="#F8F6F0"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="font-serif text-[26px] leading-tight text-cream">
          {t.entrepreneurs.successTitle}
        </h2>
        <p className="mt-3 max-w-[48ch] font-sans text-[15px] leading-relaxed text-cream/70">
          {t.entrepreneurs.successBody}
        </p>
        <Link
          href="/entrepreneurs/login"
          className="mt-6 inline-flex min-h-[44px] items-center rounded-full bg-cream px-6 font-sans text-[15px] font-medium text-navy transition hover:bg-white"
        >
          {t.entrepreneurs.signIn}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <fieldset className="space-y-7 border-0 p-0">
        <legend className="eyebrow text-cream">
          {t.entrepreneurs.projectSectionTitle}
        </legend>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor={propertyTypeId}
              className="font-sans text-sm font-medium text-cream"
            >
              {t.entrepreneurs.propertyTypeLabel}
            </label>
            <OptionalTag />
          </div>
          <div className="relative mt-3">
            <select
              id={propertyTypeId}
              value={propertyType}
              onChange={(event) => setPropertyType(event.target.value)}
              className={selectClass}
            >
              <option value="" className="text-navy">
                {t.entrepreneurs.propertyTypePlaceholder}
              </option>
              {propertyTypeKeys.map((key) => (
                <option key={key} value={key} className="text-navy">
                  {t.entrepreneurs.propertyTypes[key]}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </div>

        <FundingField value={funding} onChange={setFunding} />
      </fieldset>

      <fieldset className="space-y-7 border-0 p-0">
        <legend className="eyebrow text-cream">
          {t.entrepreneurs.locationSectionTitle}
        </legend>

        <div className="grid gap-7 sm:grid-cols-2">
          <div>
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor={cityId}
                className="font-sans text-sm font-medium text-cream"
              >
                {t.entrepreneurs.cityLabel}
              </label>
              <OptionalTag />
            </div>
            <div className="relative mt-3">
              <select
                id={cityId}
                value={city}
                onChange={(event) => {
                  setCity(event.target.value);
                  setNeighborhood("");
                }}
                className={selectClass}
              >
                <option value="" className="text-navy">
                  {t.entrepreneurs.cityPlaceholder}
                </option>
                {uaeCities.map((entry) => (
                  <option key={entry.city} value={entry.city} className="text-navy">
                    {entry.city}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor={neighborhoodId}
                className="font-sans text-sm font-medium text-cream"
              >
                {t.entrepreneurs.neighborhoodLabel}
              </label>
              <OptionalTag />
            </div>
            <div className="relative mt-3">
              <select
                id={neighborhoodId}
                value={neighborhood}
                disabled={city === ""}
                onChange={(event) => setNeighborhood(event.target.value)}
                className={`${selectClass} disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <option value="" className="text-navy">
                  {city === ""
                    ? t.entrepreneurs.neighborhoodPickCityFirst
                    : t.entrepreneurs.neighborhoodPlaceholder}
                </option>
                {neighborhoods.map((name) => (
                  <option key={name} value={name} className="text-navy">
                    {name}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-7 border-0 p-0">
        <legend className="eyebrow text-cream">
          {t.entrepreneurs.accountSectionTitle}
        </legend>

        <p className="max-w-[54ch] font-sans text-[14px] leading-relaxed text-cream/55">
          {t.entrepreneurs.accountHelp}
        </p>

        <div>
          <label
            htmlFor={emailId}
            className="block font-sans text-sm font-medium text-cream"
          >
            {t.entrepreneurs.emailLabel}
          </label>
          <input
            id={emailId}
            type="email"
            required
            autoComplete="email"
            dir="ltr"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t.entrepreneurs.emailPlaceholder}
            className={`${fieldClass} mt-3`}
          />
        </div>

        <div>
          <label
            htmlFor={passwordId}
            className="block font-sans text-sm font-medium text-cream"
          >
            {t.entrepreneurs.passwordLabel}
          </label>
          <div className="relative mt-3">
            <input
              id={passwordId}
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              dir="ltr"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t.entrepreneurs.passwordPlaceholder}
              className={`${fieldClass} pe-14`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={
                showPassword
                  ? t.entrepreneurs.hidePassword
                  : t.entrepreneurs.showPassword
              }
              className="absolute end-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-cream/60 transition hover:bg-cream/10 hover:text-cream"
            >
              <EyeIcon crossed={showPassword} />
            </button>
          </div>
          <p className="mt-2 font-sans text-[13px] text-cream/50">
            {t.entrepreneurs.passwordHelp}
          </p>
        </div>
      </fieldset>

      {status === "error" && errorMessage && (
        <p
          role="alert"
          className="rounded-2xl border border-[#F3B0A8]/30 bg-[#F3B0A8]/10 px-4 py-3 font-sans text-[14px] text-[#F3B0A8]"
        >
          {errorMessage}
        </p>
      )}

      <label className="flex items-start gap-3 font-sans text-[13px] leading-relaxed text-cream/70">
        <input
          type="checkbox"
          required
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          className="mt-1 accent-cream"
        />
        <span>
          {t.entrepreneurs.consent}{" "}
          <Link href="/legal/terms" className="underline underline-offset-2">
            {t.footer.terms}
          </Link>
          {" · "}
          <Link href="/legal/privacy" className="underline underline-offset-2">
            {t.footer.privacy}
          </Link>
        </span>
      </label>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button
          type="submit"
          variant="cream"
          disabled={status === "submitting" || !agreed}
          className="sm:w-auto"
        >
          {status === "submitting"
            ? t.entrepreneurs.submitting
            : t.entrepreneurs.submit}
        </Button>

        <p className="font-sans text-[14px] text-cream/60">
          {t.entrepreneurs.haveAccount}{" "}
          <Link
            href="/entrepreneurs/login"
            className="font-medium text-cream underline underline-offset-4 hover:text-white"
          >
            {t.entrepreneurs.signIn}
          </Link>
        </p>
      </div>
    </form>
  );
}

function SelectChevron() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute end-4 top-1/2 h-3 w-3 -translate-y-1/2 text-cream/50"
    >
      <path
        d="M2.5 4.5L6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeIcon({ crossed }: { crossed: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M1.8 10S4.9 4.8 10 4.8 18.2 10 18.2 10 15.1 15.2 10 15.2 1.8 10 1.8 10z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.4" />
      {crossed && (
        <path
          d="M3.5 3.5l13 13"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
