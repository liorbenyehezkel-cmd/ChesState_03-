"use client";

import type { ProjectStatus } from "@/lib/i18n/types";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/cn";

const toneFor: Record<ProjectStatus, string> = {
  draft: "border-cream/25 bg-cream/10 text-cream/80",
  in_review: "border-[#E8C97A]/40 bg-[#E8C97A]/12 text-[#E8C97A]",
  approved: "border-cream/40 bg-cream/12 text-cream",
  live: "border-cream/55 bg-cream/18 text-cream",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const { t } = useI18n();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-sans text-[13px] font-medium",
        toneFor[status],
      )}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {t.platform.status[status]}
    </span>
  );
}
