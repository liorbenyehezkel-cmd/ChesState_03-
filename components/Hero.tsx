"use client";

import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Reveal } from "@/components/ui/Reveal";
import { useWaitlist } from "@/components/WaitlistProvider";
import { useI18n } from "@/lib/i18n/provider";

export function Hero() {
  const { open } = useWaitlist();
  const { t } = useI18n();

  return (
    <section className="section-shell pb-16 pt-12 sm:pt-16 lg:pb-24 lg:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <Reveal>
          <Badge dot>{t.hero.badge}</Badge>

          <h1 className="mt-6 max-w-[15ch] font-serif text-[32px] leading-[1.08] tracking-[-0.01em] sm:text-[44px] lg:text-[56px]">
            {t.hero.title}
          </h1>

          <p className="mt-6 max-w-[54ch] text-[16px] leading-relaxed text-muted sm:text-[17px]">
            {t.hero.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button onClick={open}>{t.hero.ctaPrimary}</Button>
            <ButtonLink href="#how-it-works" variant="secondary">
              {t.hero.ctaSecondary}
            </ButtonLink>
          </div>

          <p className="mt-5 text-[13px] leading-relaxed text-muted">
            {t.hero.microcopy}
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <IllustrativeExampleCard />
        </Reveal>
      </div>
    </section>
  );
}

function IllustrativeExampleCard() {
  const { t } = useI18n();

  return (
    <div>
      <Card>
        <div className="flex items-start justify-between gap-4">
          <span className="eyebrow text-muted">{t.example.eyebrow}</span>
          <Badge tone="mint" className="px-3 py-1 text-xs">
            {t.example.tag}
          </Badge>
        </div>

        <h2 className="mt-4 font-serif text-[24px] leading-tight sm:text-[26px]">
          {t.example.title}
        </h2>
        <p className="mt-1 font-sans text-sm text-muted">{t.example.location}</p>

        <div className="mt-6 rounded-2xl bg-navy p-5 text-white sm:p-6">
          <div className="mb-4 h-px w-9 bg-gold/70" />
          <span className="eyebrow text-white/55">{t.example.yourStake}</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-[34px] leading-none sm:text-[38px]">
              $9.99
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
              0.00042%
            </span>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <span className="font-sans text-sm text-muted">
              {t.example.projectFunding}
            </span>
            <span className="font-sans text-sm font-medium text-navy tabular-nums">
              62%
            </span>
          </div>
          <ProgressBar
            value={62}
            label={t.example.progressLabel}
            className="mt-3"
          />
        </div>
      </Card>

      <p className="mt-4 px-1 text-center font-sans text-[13px] italic leading-relaxed text-muted">
        {t.example.caption}
      </p>
    </div>
  );
}
