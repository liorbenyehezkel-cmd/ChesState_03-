"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n/provider";

export function ExplainerVideo() {
  const { t } = useI18n();

  return (
    <section id="explainer" className="section-shell pt-20 sm:pt-24 lg:pt-28">
      <Reveal className="mx-auto max-w-[46rem] text-center">
        <span className="eyebrow text-mint-ink">{t.explainer.eyebrow}</span>

        <h2 className="mt-5 font-serif text-[30px] leading-[1.12] tracking-[-0.01em] sm:text-[40px] lg:text-[46px]">
          {t.explainer.title}
        </h2>

        <p className="mx-auto mt-4 max-w-[54ch] text-[16px] leading-relaxed text-muted sm:text-[17px]">
          {t.explainer.subtitle}
        </p>
      </Reveal>

      <Reveal delay={0.05} className="mx-auto mt-10 max-w-[60rem] sm:mt-12">
        <div className="overflow-hidden rounded-2xl border border-gold/40 bg-navy shadow-lg">
          <video
            className="aspect-video h-auto w-full"
            src="/video/chesstate-explainer.mp4"
            poster="/video/chesstate-explainer-poster.jpg"
            aria-label={t.explainer.videoLabel}
            controls
            playsInline
            preload="metadata"
          />
        </div>
      </Reveal>
    </section>
  );
}
