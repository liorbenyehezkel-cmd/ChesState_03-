"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useI18n } from "@/lib/i18n/provider";
import type { Listing } from "@/lib/invest/listings";

export function ListingCard({ listing }: { listing: Listing }) {
  const { t } = useI18n();
  const copy = t.invest.listings[listing.slug as keyof typeof t.invest.listings];

  return (
    <Link href={`/invest/${listing.slug}`} className="block h-full">
      <Card className="flex h-full flex-col transition hover:shadow-card">
        <div className="flex items-start justify-between gap-3">
          <span className="eyebrow text-muted">{listing.city}</span>
          <Badge tone="neutral" className="px-3 py-1 text-xs">
            {t.entrepreneurs.propertyTypes[listing.propertyType]}
          </Badge>
        </div>

        <h2 className="mt-4 font-serif text-[22px] leading-tight text-navy">
          {listing.name}
        </h2>
        <p className="mt-1 font-sans text-sm text-muted">
          {listing.neighborhood}, {listing.city}
        </p>
        <p className="mt-4 flex-1 font-sans text-[15px] leading-relaxed text-muted">
          {copy.summary}
        </p>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <span className="font-sans text-sm text-muted">
              {t.example.projectFunding}
            </span>
            <span className="font-sans text-sm font-medium tabular-nums text-navy">
              {listing.fundingPercent}% {t.invest.browse.funded}
            </span>
          </div>
          <ProgressBar
            value={listing.fundingPercent}
            label={`${listing.name} ${t.example.progressLabel}`}
            className="mt-3"
          />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="font-sans text-sm text-muted">
            {t.invest.browse.minStake} ${listing.minStakeUsd.toFixed(2)}
          </span>
          <span className="font-sans text-sm font-medium text-navy">
            {t.invest.browse.view}
          </span>
        </div>
      </Card>
    </Link>
  );
}
