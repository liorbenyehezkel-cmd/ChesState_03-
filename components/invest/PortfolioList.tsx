"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useI18n } from "@/lib/i18n/provider";
import { listingBySlug } from "@/lib/invest/listings";
import { readStakes, type LocalStake } from "@/lib/invest/stakes";

export function PortfolioList() {
  const { t, locale } = useI18n();
  const [stakes, setStakes] = useState<LocalStake[] | null>(null);

  useEffect(() => {
    setStakes(readStakes());
  }, []);

  if (stakes === null) {
    return <div className="min-h-[12rem]" />;
  }

  if (stakes.length === 0) {
    return (
      <div className="max-w-lg">
        <p className="font-sans text-[16px] leading-relaxed text-muted">
          {t.invest.portfolio.empty}
        </p>
        <ButtonLink href="/invest" variant="secondary" className="mt-6">
          {t.invest.portfolio.emptyCta}
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stakes.map((stake) => {
        const listing = listingBySlug(stake.slug);
        if (!listing) return null;

        return (
          <Card key={`${stake.slug}-${stake.recordedAt}`}>
            <Link href={`/invest/${listing.slug}`} className="block">
              <p className="eyebrow text-muted">{t.invest.portfolio.project}</p>
              <h2 className="mt-2 font-serif text-[22px] text-navy">
                {listing.name}
              </h2>
              <p className="mt-1 font-sans text-sm text-muted">
                {listing.neighborhood}, {listing.city}
              </p>
              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="font-sans text-[13px] text-muted">
                    {t.invest.portfolio.amount}
                  </dt>
                  <dd className="mt-1 font-sans text-[16px] text-navy">
                    ${stake.amountUsd.toFixed(2)}
                  </dd>
                </div>
                <div>
                  <dt className="font-sans text-[13px] text-muted">
                    {t.invest.portfolio.date}
                  </dt>
                  <dd className="mt-1 font-sans text-[16px] text-navy">
                    {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
                      new Date(stake.recordedAt),
                    )}
                  </dd>
                </div>
              </dl>
            </Link>
          </Card>
        );
      })}

      <p className="max-w-[60ch] pt-4 font-sans text-[13px] leading-relaxed text-muted">
        {t.invest.portfolio.sampleNote}
      </p>
    </div>
  );
}
