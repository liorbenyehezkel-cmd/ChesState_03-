"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n/provider";

const FUTURE_PARAGRAPHS = [
  "ChesState is building a next-generation Web3 infrastructure layer for real estate, combining the simplicity of a modern Web2 experience with the capabilities of decentralized financial technology.",
  "Our architecture is designed around Pure Crypto & Layer 2 infrastructure, smart contracts replacing traditional escrow mechanisms, Decentralized Escrow, hard fund locking, automated milestone-based releases and refunds, and USDC-based settlement infrastructure.",
  "ChesState also integrates Embedded Wallets, automated On-Ramp and Off-Ramp flows, and programmable financial automation to streamline the movement and settlement of capital.",
  "Looking ahead, the infrastructure is designed to support Real Estate Tokenization, including ERC-20 token standards, digital ownership structures, and potentially more liquid secondary markets powered by Automated Market Makers (AMMs).",
  "Our vision is to create a modern infrastructure layer for real-estate investment connecting investors, developers, capital, and blockchain technology through a seamless and accessible experience.",
];

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

      <Reveal delay={0.05} className="mx-auto mt-14 max-w-[52rem] sm:mt-16">
        <div className="rounded-2xl border border-gold/40 bg-navy px-6 py-10 shadow-lg sm:px-12 sm:py-14">
          <span className="eyebrow text-gold">Infrastructure</span>
          <h3 className="mt-4 font-serif text-[26px] leading-[1.15] tracking-[-0.01em] text-cream sm:text-[34px]">
            The Future of Real Estate Investment Infrastructure
          </h3>
          <div className="mt-3 h-px w-16 bg-gold/60" />
          <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-cream/75 sm:text-[16.5px]">
            {FUTURE_PARAGRAPHS.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
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
