"use client";

import { useI18n } from "@/lib/i18n/provider";

/** The small "optional" note that sits beside every questionnaire field. */
export function OptionalTag() {
  const { t } = useI18n();

  return (
    <span className="font-sans text-[11px] uppercase tracking-[0.08em] text-cream/40">
      {t.entrepreneurs.optional}
    </span>
  );
}
