"use client";

import { useId } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { OptionalTag } from "./OptionalTag";

export const FUNDING_MIN = 50_000;
export const FUNDING_MAX = 50_000_000;
export const FUNDING_STEP = 50_000;

/**
 * The amount is held as a string so the field can be genuinely empty (the
 * question is optional). Typing updates the slider and dragging updates the
 * text — they are two views of one value, never two states.
 */
export function FundingField({
  value,
  onChange,
  showOptional = true,
}: {
  value: string;
  onChange: (next: string) => void;
  /** Off inside the platform, where the readiness checklist sets expectations. */
  showOptional?: boolean;
}) {
  const { t, locale } = useI18n();
  const inputId = useId();
  const sliderId = useId();

  const numeric = value === "" ? null : Number(value);
  const sliderValue =
    numeric === null
      ? FUNDING_MIN
      : Math.min(Math.max(numeric, FUNDING_MIN), FUNDING_MAX);

  const filledPercent =
    ((sliderValue - FUNDING_MIN) / (FUNDING_MAX - FUNDING_MIN)) * 100;

  const formatted =
    numeric === null || Number.isNaN(numeric)
      ? null
      : new Intl.NumberFormat(locale, {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(numeric);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor={inputId}
          className="font-sans text-sm font-medium text-cream"
        >
          {t.entrepreneurs.fundingLabel}
        </label>
        {showOptional && <OptionalTag />}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="font-sans text-[15px] text-cream/50"
        >
          $
        </span>
        <input
          id={inputId}
          type="number"
          inputMode="numeric"
          min={0}
          step={FUNDING_STEP}
          dir="ltr"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="1,000,000"
          className="min-h-[44px] w-full rounded-full border border-cream/20 bg-cream/[0.06] px-4 text-start font-sans text-[15px] text-cream placeholder:text-cream/35 focus:border-cream/50 focus:bg-cream/10"
        />
      </div>

      <label htmlFor={sliderId} className="sr-only">
        {t.entrepreneurs.fundingSliderLabel}
      </label>
      <input
        id={sliderId}
        type="range"
        min={FUNDING_MIN}
        max={FUNDING_MAX}
        step={FUNDING_STEP}
        value={sliderValue}
        onChange={(event) => onChange(event.target.value)}
        aria-valuetext={formatted ?? undefined}
        className="funding-slider mt-5 w-full"
        style={{ ["--filled" as string]: `${filledPercent}%` }}
      />

      <div className="mt-2 flex items-center justify-between font-sans text-[12px] text-cream/45">
        <span dir="ltr">$50K</span>
        <span className="text-[13px] font-medium text-cream/80" dir="ltr">
          {formatted ?? "—"}
        </span>
        <span dir="ltr">$50M</span>
      </div>

      <p className="mt-3 font-sans text-[13px] leading-relaxed text-cream/50">
        {t.entrepreneurs.fundingHelp}
      </p>
    </div>
  );
}
