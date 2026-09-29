"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { RegisterStakeButton } from "@/components/invest/RegisterStakeButton";
import { useI18n } from "@/lib/i18n/provider";
import type { Listing } from "@/lib/invest/listings";

export function ProjectDetail({ listing }: { listing: Listing }) {
  const { t } = useI18n();
  const copy = t.invest.listings[listing.slug as keyof typeof t.invest.listings];

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
      <div>
        <Badge>{t.entrepreneurs.propertyTypes[listing.propertyType]}</Badge>
        <h1 className="mt-5 font-serif text-[32px] leading-[1.1] sm:text-[42px]">
          {listing.name}
        </h1>
        <p className="mt-2 font-sans text-[15px] text-muted">
          {listing.neighborhood}, {listing.city}
        </p>
        <p className="mt-6 max-w-[54ch] font-sans text-[16px] leading-relaxed text-muted">
          {copy.about}
        </p>

        <h2 className="mt-10 font-serif text-[22px] text-navy">
          {t.invest.detail.milestones}
        </h2>
        <ol className="mt-4 space-y-3">
          {[copy.milestoneOne, copy.milestoneTwo].map((item, index) => (
            <li
              key={item}
              className="flex gap-3 rounded-2xl border border-border bg-white p-4"
            >
              <span className="font-sans text-sm tabular-nums text-muted">
                {index + 1}
              </span>
              <p className="font-sans text-[15px] leading-relaxed text-navy">
                {item}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <Card>
          <span className="eyebrow text-muted">{t.example.yourStake}</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-[38px] leading-none text-navy">
              ${listing.minStakeUsd.toFixed(2)}
            </span>
            <span className="font-sans text-sm text-muted">
              {t.invest.detail.minLabel}
            </span>
          </div>

          <div className="mt-6 rounded-2xl bg-navy p-5 text-white sm:p-6">
            <span className="eyebrow text-white/55">{t.example.yourStake}</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-[34px] leading-none">
                ${listing.minStakeUsd.toFixed(2)}
              </span>
              <span className="font-sans text-sm text-white/60">
                {t.example.invested}
              </span>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="font-sans text-sm text-white/60">
                {t.example.stakeRecorded}
              </span>
              <span className="font-sans text-sm font-medium tabular-nums">
                {listing.stakePercent}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <span className="font-sans text-sm text-muted">
                {t.example.projectFunding}
              </span>
              <span className="font-sans text-sm font-medium tabular-nums text-navy">
                {listing.fundingPercent}%
              </span>
            </div>
            <ProgressBar
              value={listing.fundingPercent}
              label={t.example.progressLabel}
              className="mt-3"
            />
          </div>

          <div className="mt-6">
            <RegisterStakeButton
              slug={listing.slug}
              amountUsd={listing.minStakeUsd}
            />
          </div>
        </Card>
        <p className="mt-4 text-center font-sans text-[13px] italic leading-relaxed text-muted">
          {t.invest.detail.sampleCaption}
        </p>
      </div>
    </div>
  );
}
