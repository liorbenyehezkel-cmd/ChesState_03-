"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/provider";
import { recordStake } from "@/lib/invest/stakes";

export function RegisterStakeButton({
  slug,
  amountUsd,
}: {
  slug: string;
  amountUsd: number;
}) {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "recorded">("idle");

  if (status === "recorded") {
    return (
      <div className="rounded-2xl border border-border bg-cream p-5">
        <p className="font-serif text-[20px] leading-snug text-navy">
          {t.invest.detail.recordedTitle}
        </p>
        <p className="mt-2 font-sans text-[14px] leading-relaxed text-muted">
          {t.invest.detail.recordedBody}
        </p>
      </div>
    );
  }

  return (
    <div>
      <Button
        className="w-full"
        onClick={() => {
          recordStake(slug, amountUsd);
          setStatus("recorded");
        }}
      >
        {t.invest.detail.registerStake}
      </Button>
      <p className="mt-3 text-center font-sans text-[13px] leading-relaxed text-muted">
        {t.invest.detail.cannotInvest}
      </p>
    </div>
  );
}
