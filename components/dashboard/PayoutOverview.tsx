"use client";

import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { money } from "@/lib/dashboard/types";
import { catalog } from "@/lib/dashboard/projects";

const steps = [
  {
    n: "01",
    title: "Raise closes",
    body: "When a project reaches 100% of its funding target, the smart contract locks in the final investor roster and signals a successful raise.",
  },
  {
    n: "02",
    title: "USDC auto-released from escrow",
    body: "The property's smart contract releases the full USDC balance held in escrow to ChesState's off-ramp bridge — no manual intervention required.",
  },
  {
    n: "03",
    title: "Automated fiat conversion",
    body: "Our off-ramp partners convert the USDC to your chosen fiat currency (USD or EUR) at the prevailing mid-market rate, with fees disclosed upfront.",
  },
  {
    n: "04",
    title: "Wire to your corporate account",
    body: "The converted fiat is wired directly to your registered corporate bank account via SWIFT or SEPA. Funds typically arrive within a few business hours.",
  },
];

const faqs = [
  {
    q: "How long does the transfer take?",
    a: "From raise close to bank credit: typically 2–6 hours on a business day. Cross-border SWIFT wires may take up to one additional business day.",
  },
  {
    q: "Which currencies are supported?",
    a: "USD and EUR at launch. AED and GBP are on the roadmap for Q2.",
  },
  {
    q: "Are there conversion fees?",
    a: "ChesState charges a 1.5% off-ramp fee on the converted amount, deducted automatically before the wire is sent.",
  },
  {
    q: "What if the raise target is not met?",
    a: "If the project misses its target by the deadline, the smart contract automatically refunds every investor's USDC to their embedded wallet — no action needed from you.",
  },
];

export function PayoutOverview() {
  const { state } = useDashboard();
  const campaign = catalog.find((p) => p.slug === "aljada-garden-walk");
  const raised = campaign?.currentAmount ?? 0;
  const target = campaign?.targetAmount ?? 0;
  const pct = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;

  return (
    <div className="space-y-10">
      <header className="max-w-[44rem]">
        <p className="eyebrow text-gold/70">Entrepreneur desk</p>
        <h1 className="mt-3 font-serif text-[32px] leading-tight tracking-[-0.01em] text-cream sm:text-[40px]">
          Automated Off-Ramp Payout
        </h1>
        <p className="mt-4 font-sans text-[16px] leading-relaxed text-cream/60">
          When your raise closes successfully, ChesState handles the full
          conversion pipeline — from on-chain USDC escrow to a fiat wire
          directly into your corporate bank account, automatically.
        </p>
      </header>

      {/* Live raise status */}
      {campaign && (
        <section className="dash-card p-5 sm:p-6">
          <p className="eyebrow text-gold/70">Current raise</p>
          <h2 className="mt-2 font-serif text-[24px] text-cream">{campaign.title}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-cream/40">Raised</p>
              <p className="mt-1 font-serif text-[26px] tabular-nums text-cream">{money(raised)}</p>
            </div>
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-cream/40">Target</p>
              <p className="mt-1 font-serif text-[26px] tabular-nums text-cream">{money(target)}</p>
            </div>
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-cream/40">Progress</p>
              <p className="mt-1 font-serif text-[26px] tabular-nums text-cream">{pct}%</p>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-cream/10">
            <div
              className="h-full rounded-full bg-cream transition-all duration-700"
              style={{ width: `${Math.max(2, pct)}%` }}
            />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-gold/70" />
            <p className="font-sans text-[13px] text-cream/55">
              {pct < 100
                ? "Payout releases automatically when the raise reaches 100%."
                : "Target reached — payout pipeline initiating."}
            </p>
          </div>
        </section>
      )}

      {/* How it works */}
      <section>
        <h2 className="font-serif text-[22px] tracking-[-0.01em] text-cream">
          How the payout works
        </h2>
        <ol className="mt-5 space-y-4">
          {steps.map((step) => (
            <li key={step.n} className="flex gap-4 rounded-2xl border border-cream/10 p-5">
              <span className="shrink-0 font-mono text-[13px] tabular-nums text-gold/60 mt-0.5">
                {step.n}
              </span>
              <div>
                <p className="font-sans text-[15px] font-medium text-cream">{step.title}</p>
                <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-cream/55">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Architecture callout */}
      <section className="flex gap-3 rounded-2xl border border-[#3EA88C]/25 bg-[#3EA88C]/[0.06] p-5 sm:p-6">
        <span aria-hidden="true" className="mt-0.5 shrink-0 text-[#3EA88C]">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        <div className="space-y-1">
          <p className="font-sans text-[13px] font-medium text-[#3EA88C]">
            Fully automated · No manual steps required
          </p>
          <p className="font-sans text-[13px] leading-relaxed text-cream/65">
            The entire pipeline — smart contract release, USDC→fiat conversion,
            and bank wire — is triggered automatically by the raise outcome. You
            do not need to log in, approve a transaction, or contact support.
            ChesState&apos;s off-ramp bridge handles the full settlement on your behalf.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="font-serif text-[22px] tracking-[-0.01em] text-cream">
          Common questions
        </h2>
        <dl className="mt-5 space-y-4">
          {faqs.map((item) => (
            <div key={item.q} className="rounded-2xl border border-cream/10 p-5">
              <dt className="font-sans text-[15px] font-medium text-cream">{item.q}</dt>
              <dd className="mt-2 font-sans text-[13px] leading-relaxed text-cream/55">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="max-w-[62ch] font-sans text-[12px] italic leading-relaxed text-cream/35">
        * Payout details, fees, and timelines are indicative for the pilot phase and
        subject to change. Final terms will be confirmed in your entrepreneur agreement
        upon regulatory approval.
      </p>
    </div>
  );
}
