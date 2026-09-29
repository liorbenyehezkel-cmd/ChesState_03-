"use client";

import { useId } from "react";
import {
  isLocale,
  locales,
  localeNames,
  localeShortNames,
} from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/cn";

export function LanguageSwitcher({
  tone = "navy",
  compact = false,
  className,
}: {
  tone?: "navy" | "light";
  /** Shows EN/AR/ES/FR instead of full names, for tight mobile bars. */
  compact?: boolean;
  className?: string;
}) {
  const { locale, setLocale, t, isSwitching } = useI18n();
  const selectId = useId();

  return (
    <div className={cn("relative", className)}>
      <label htmlFor={selectId} className="sr-only">
        {t.language.label}
      </label>

      <GlobeIcon
        className={cn(
          "pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2",
          tone === "navy" ? "text-muted" : "text-white/70",
        )}
      />

      <select
        id={selectId}
        value={locale}
        onChange={(event) => {
          const next = event.target.value;
          if (isLocale(next) && next !== locale) setLocale(next);
        }}
        className={cn(
          "min-h-[44px] cursor-pointer appearance-none rounded-full border bg-transparent ps-9 pe-8 font-sans text-[15px] transition",
          tone === "navy"
            ? "border-border text-navy hover:border-navy/40"
            : "border-white/25 text-white hover:border-white/50",
          isSwitching && "pointer-events-none opacity-60",
        )}
      >
        {locales.map((option) => (
          <option key={option} value={option} className="text-navy">
            {compact ? localeShortNames[option] : localeNames[option]}
          </option>
        ))}
      </select>

      <ChevronIcon
        className={cn(
          "pointer-events-none absolute end-3 top-1/2 h-3 w-3 -translate-y-1/2",
          tone === "navy" ? "text-muted" : "text-white/70",
        )}
      />
    </div>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <circle cx="10" cy="10" r="7.2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M2.8 10h14.4M10 2.8c1.9 2 2.9 4.5 2.9 7.2s-1 5.2-2.9 7.2c-1.9-2-2.9-4.5-2.9-7.2s1-5.2 2.9-7.2z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
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
