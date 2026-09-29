"use client";

import { useEffect, useMemo, useState } from "react";
import { PortfolioArea } from "@/components/dashboard/Charts";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import {
  allocationRows,
  ledgerRows,
  performanceSeries,
  portfolioMetrics,
} from "@/lib/dashboard/portfolio";
import { projectBySlug } from "@/lib/dashboard/projects";
import {
  formatShortDate,
  investmentStatusLabel,
  money,
} from "@/lib/dashboard/types";

export default function PortfolioPage() {
  const { state } = useDashboard();
  const [openSlug, setOpenSlug] = useState(state.investments[0]?.projectSlug ?? "");

  useEffect(() => {
    if (!openSlug && state.investments[0]) {
      setOpenSlug(state.investments[0].projectSlug);
    }
  }, [openSlug, state.investments]);

  const project = openSlug ? projectBySlug(openSlug) : null;
  const metrics = useMemo(
    () => portfolioMetrics(state.investments),
    [state.investments],
  );
  const chart = useMemo(
    () => performanceSeries(state.investments),
    [state.investments],
  );
  const holdings = useMemo(
    () => allocationRows(state.investments),
    [state.investments],
  );
  const ledger = useMemo(
    () => ledgerRows(state.investments, state.activity).slice(0, 10),
    [state.activity, state.investments],
  );
  const isEmpty = state.investments.length === 0;

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Investor desk" title="My Portfolio">
        A private view of requests you have registered. Figures are illustrated
        estimates, not a forecast or a guarantee.
      </PageHeader>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Stat
          label="Total portfolio value"
          value={money(metrics.portfolioValue)}
          hint="Invested plus illustrated return"
          featured
        />
        <Stat label="Total invested" value={money(metrics.totalInvested)} />
        <Stat
          label="Unrealized / estimated return"
          value={money(metrics.illustratedReturn)}
          hint="Illustrated, not guaranteed"
        />
        <Stat label="Properties" value={String(metrics.propertyCount)} />
        <Stat
          label="Average return"
          value={`${metrics.averageReturn.toFixed(1)}%`}
          hint="Weighted illustrated yield"
        />
        <Stat
          label="Available"
          value={money(state.profile.virtualBalanceUsd)}
        />
      </section>

      <section className="dash-card p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-[22px] tracking-[-0.01em] text-cream">
              Performance
            </h2>
            <p className="mt-1 font-sans text-[13px] text-cream/50">
              Illustrated portfolio value over the last six months.
            </p>
          </div>
        </div>
        <div className="relative mt-5">
          <PortfolioArea data={chart} />
          {isEmpty ? (
            <div className="pointer-events-none absolute inset-0 flex items-end justify-start pb-8 pe-4 ps-12 sm:ps-14">
              <div className="pointer-events-auto max-w-[36ch] dash-card px-4 py-3">
                <p className="font-serif text-[18px] text-cream">No holdings yet</p>
                <p className="mt-1 font-sans text-[13px] leading-relaxed text-cream/60">
                  Register a first request on Explore and this line will begin
                  to move.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="dash-card p-5 sm:p-6">
        <h2 className="font-serif text-[22px] tracking-[-0.01em] text-cream">
          Allocation
        </h2>
        <p className="mt-1 font-sans text-[13px] text-cream/50">
          How registered capital is distributed across properties.
        </p>
        {holdings.length === 0 ? (
          <EmptyBlock
            title="Nothing allocated"
            body="Once you register a request, each property will appear here as a quiet share of the book."
          />
        ) : (
          <ul className="mt-5 space-y-4">
            {holdings.map((row) => (
              <li key={row.projectId}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="min-w-0 truncate font-sans text-[15px] text-cream">
                    {row.title}
                  </p>
                  <p className="shrink-0 font-sans text-[14px] tabular-nums text-cream/70">
                    {money(row.amount)} · {Math.round(row.pct)}%
                  </p>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream/10">
                  <div
                    className="h-full rounded-full bg-cream"
                    style={{ width: `${Math.max(4, row.pct)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {isEmpty ? (
        <section className="dash-card flex flex-col items-start px-5 py-7 sm:px-8 sm:py-8">
          <p className="eyebrow text-gold/70">Get started</p>
          <h2 className="mt-3 font-serif text-[24px] tracking-[-0.01em] text-cream">
            Your desk is ready
          </h2>
          <p className="mt-3 max-w-[48ch] font-sans text-[15px] leading-relaxed text-cream/65">
            Explore the sample book, register a request from $9.99, and this
            page becomes a live picture of what you have asked to hold.
          </p>
          <ButtonLink href="/dashboard/explore" variant="cream" className="mt-6">
            Explore projects
          </ButtonLink>
        </section>
      ) : (
        <section>
          <h2 className="font-serif text-[22px] tracking-[-0.01em] text-cream">
            Updates
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {state.investments.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => setOpenSlug(row.projectSlug)}
                className={`min-h-[40px] rounded-full px-4 font-sans text-[13px] transition duration-200 ${
                  openSlug === row.projectSlug
                    ? "bg-cream text-navy"
                    : "border border-cream/15 text-cream/70 hover:border-cream/30 hover:text-cream"
                }`}
              >
                {row.projectTitle}
              </button>
            ))}
          </div>
          {project && (
            <ol className="mt-5 space-y-3">
              {project.updates.map((update) => (
                <li key={update.id} className="dash-card p-4">
                  <p className="font-sans text-[12px] text-cream/40">
                    {update.createdAt}
                  </p>
                  <p className="mt-1 font-sans text-[16px] text-cream">{update.title}</p>
                  <p className="mt-2 font-sans text-[14px] text-cream/55">{update.body}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-[22px] tracking-[-0.01em] text-cream">
            Activity
          </h2>
          <p className="font-sans text-[12px] text-cream/40">
            Requests stay pending until the platform is authorised.
          </p>
        </div>
        {ledger.length === 0 ? (
          <EmptyBlock
            title="No activity yet"
            body="Investment dates, amounts, and status will land here after your first request."
          />
        ) : (
          <>
            <ul className="mt-4 space-y-3 md:hidden">
              {ledger.map((row) => (
                <li key={row.id} className="dash-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-sans text-[15px] text-cream">{row.property}</p>
                      <p className="mt-1 font-sans text-[12px] text-cream/45">
                        {formatShortDate(row.at)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-cream/15 px-2.5 py-0.5 font-sans text-[12px] text-cream/70">
                      {investmentStatusLabel(row.status)}
                    </span>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="font-sans text-[16px] tabular-nums text-cream">
                      {money(row.amountUsd)}
                    </p>
                    <p className="font-sans text-[12px] tabular-nums text-cream/50">
                      {row.illustratedReturn == null
                        ? "—"
                        : `${money(row.illustratedReturn)} · ${row.yieldPct}%`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-cream/10 md:block">
              <table className="min-w-[640px] w-full text-start">
                <thead>
                  <tr className="border-b border-cream/10 font-sans text-[11px] uppercase tracking-[0.12em] text-cream/40">
                    <th className="px-4 py-3 font-medium sm:px-5">Date</th>
                    <th className="px-4 py-3 font-medium sm:px-5">Property</th>
                    <th className="px-4 py-3 font-medium sm:px-5">Amount</th>
                    <th className="px-4 py-3 font-medium sm:px-5">Status</th>
                    <th className="px-4 py-3 font-medium sm:px-5">Illustrated return</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream/10">
                  {ledger.map((row) => (
                    <tr key={row.id}>
                      <td className="whitespace-nowrap px-4 py-4 font-sans text-[13px] text-cream/55 sm:px-5">
                        {formatShortDate(row.at)}
                      </td>
                      <td className="px-4 py-4 font-sans text-[15px] text-cream sm:px-5">
                        {row.property}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 font-sans text-[15px] tabular-nums text-cream sm:px-5">
                        {money(row.amountUsd)}
                      </td>
                      <td className="px-4 py-4 sm:px-5">
                        <span className="inline-flex rounded-full border border-cream/15 px-2.5 py-0.5 font-sans text-[12px] text-cream/70">
                          {investmentStatusLabel(row.status)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 font-sans text-[14px] tabular-nums text-cream/70 sm:px-5">
                        {row.illustratedReturn == null
                          ? "—"
                          : `${money(row.illustratedReturn)} · ${row.yieldPct}%`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  featured = false,
}: {
  label: string;
  value: string;
  hint?: string;
  featured?: boolean;
}) {
  return (
    <div className="dash-card p-5">
      {featured ? <div className="mb-3 h-px w-8 bg-gold/70" /> : null}
      <p className="font-sans text-[12px] uppercase tracking-[0.08em] text-cream/45">
        {label}
      </p>
      <p className="mt-2 font-serif text-[28px] tabular-nums leading-none text-cream">
        {value}
      </p>
      {hint ? (
        <p className="mt-2 font-sans text-[12px] leading-relaxed text-cream/40">{hint}</p>
      ) : null}
    </div>
  );
}

function EmptyBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-5 rounded-2xl border border-cream/10 bg-cream/[0.02] px-5 py-6">
      <p className="font-serif text-[18px] text-cream">{title}</p>
      <p className="mt-2 max-w-[46ch] font-sans text-[14px] leading-relaxed text-cream/55">
        {body}
      </p>
    </div>
  );
}
