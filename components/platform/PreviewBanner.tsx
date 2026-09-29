"use client";

import { useI18n } from "@/lib/i18n/provider";

export function PreviewBanner() {
  const { t } = useI18n();

  return (
    <div
      role="status"
      className="mb-8 rounded-2xl border border-[#E8C97A]/30 bg-[#E8C97A]/[0.08] px-5 py-4"
    >
      <p className="font-sans text-[14px] font-medium text-[#E8C97A]">
        {t.platform.preview.title}
      </p>
      <p className="mt-1 max-w-[68ch] font-sans text-[14px] leading-relaxed text-cream/65">
        {t.platform.preview.body}
      </p>
    </div>
  );
}
