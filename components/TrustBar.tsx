"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n/provider";

export function TrustBar() {
  const { t } = useI18n();

  const items = [
    { label: t.trust.minimum, icon: CoinIcon },
    { label: t.trust.noWallet, icon: CardIcon },
    { label: t.trust.vara, icon: ShieldIcon },
  ];

  return (
    <section aria-label={t.trust.sectionLabel} className="section-shell">
      <div className="border-t border-border pt-8 sm:pt-10">
        <ul className="grid gap-6 sm:grid-cols-3 sm:gap-8">
          {items.map(({ label, icon: Icon }, index) => (
            <Reveal as="li" key={label} delay={index * 0.08}>
              <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-3">
                <Icon />
                <p className="font-sans text-[15px] leading-snug text-navy">
                  {label}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function IconShell({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-white text-mint-ink"
    >
      {children}
    </span>
  );
}

function CoinIcon() {
  return (
    <IconShell>
      <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M10 6.5v7M12 8.4c0-.9-.9-1.5-2-1.5s-2 .6-2 1.4c0 2 4 1.1 4 3.1 0 .9-.9 1.5-2 1.5s-2-.6-2-1.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </IconShell>
  );
}

function CardIcon() {
  return (
    <IconShell>
      <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
        <rect
          x="2.5"
          y="5"
          width="15"
          height="10"
          rx="2.2"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path d="M2.5 8.6h15" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </IconShell>
  );
}

function ShieldIcon() {
  return (
    <IconShell>
      <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2.8l5.5 2.1v4.4c0 3.3-2.2 6.2-5.5 7.3-3.3-1.1-5.5-4-5.5-7.3V4.9L10 2.8z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M7.6 9.9l1.7 1.7 3.2-3.4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconShell>
  );
}
