"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n/provider";

export function HowItWorks() {
  const { t } = useI18n();

  return (
    <section id="how-it-works" className="section-shell py-20 sm:py-24 lg:py-28">
      <Reveal className="mx-auto max-w-[46rem] text-center">
        <span className="eyebrow text-mint-ink">{t.howItWorks.eyebrow}</span>

        <h2 className="mt-5 font-serif text-[30px] leading-[1.12] tracking-[-0.01em] sm:text-[40px] lg:text-[46px]">
          {t.howItWorks.title}
        </h2>

        <p className="mx-auto mt-4 max-w-[38ch] font-serif text-[20px] leading-snug text-navy/70 sm:text-[24px]">
          {t.howItWorks.subtitle}
        </p>

        <p className="mx-auto mt-8 max-w-[60ch] text-[16px] leading-relaxed text-muted sm:text-[17px]">
          {t.howItWorks.body}
        </p>

        <p className="mt-8 font-sans text-[20px] font-semibold text-navy sm:text-[22px]">
          {t.howItWorks.highlight}
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mx-auto mt-14 max-w-[46rem] sm:mt-16">
        <hr className="border-gold/35" />
        <p className="mt-12 text-center font-serif text-[22px] leading-snug text-navy sm:mt-14 sm:text-[28px]">
          {t.howItWorks.statement}
        </p>
      </Reveal>
    </section>
  );
}
