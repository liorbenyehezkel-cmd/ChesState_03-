"use client";

import type { ReactNode } from "react";

export const fieldClass =
  "min-h-[44px] w-full rounded-full border border-cream/20 bg-cream/[0.06] px-4 text-start font-sans text-[15px] text-cream placeholder:text-cream/35 focus:border-cream/50 focus:bg-cream/10";

export const selectClass = `${fieldClass} cursor-pointer appearance-none pe-10`;

export function FieldShell({
  label,
  htmlFor,
  help,
  children,
}: {
  label: string;
  htmlFor: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-3 block font-sans text-sm font-medium text-cream"
      >
        {label}
      </label>
      {children}
      {help && (
        <p className="mt-2 font-sans text-[13px] leading-relaxed text-cream/50">
          {help}
        </p>
      )}
    </div>
  );
}

export function SelectChevron() {
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
