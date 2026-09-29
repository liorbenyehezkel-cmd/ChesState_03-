"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import { allocatedPercent, readinessOf, type PlatformData } from "@/lib/platform/types";
import { StatusBadge } from "./StatusBadge";

export function OverviewContent({ project, milestones }: PlatformData) {
  const { t, locale } = useI18n();

  const money = (value: number | null) =>
    value === null
      ? t.platform.overview.notSet
      : new Intl.NumberFormat(locale, {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(value);

  const location = [project.neighborhood, project.city]
    .filter(Boolean)
    .join(", ");

  const facts = [
    { label: t.platform.overview.fundingTarget, value: money(project.fundingTargetUsd) },
    { label: t.platform.overview.totalValue, value: money(project.totalValueUsd) },
    {
      label: t.platform.overview.propertyType,
      value: project.propertyType
        ? t.entrepreneurs.propertyTypes[project.propertyType]
        : t.platform.overview.notSet,
    },
    { label: t.platform.overview.location, value: location || t.platform.overview.notSet },
    {
      label: t.platform.overview.timeline,
      value:
        project.timelineMonths === null
          ? t.platform.overview.notSet
          : `${project.timelineMonths} ${t.platform.overview.timelineUnit}`,
    },
  ];

  const readiness = readinessOf(project, milestones);
  const checklist = [
    { done: readiness.name, label: t.platform.overview.checklist.name, href: "/platform/project" },
    { done: readiness.propertyType, label: t.platform.overview.checklist.propertyType, href: "/platform/project" },
    { done: readiness.funding, label: t.platform.overview.checklist.funding, href: "/platform/project" },
    { done: readiness.location, label: t.platform.overview.checklist.location, href: "/platform/project" },
    { done: readiness.description, label: t.platform.overview.checklist.description, href: "/platform/project" },
    { done: readiness.milestones, label: t.platform.overview.checklist.milestones, href: "/platform/milestones" },
  ];

  const completed = checklist.filter((item) => item.done).length;
  const completionPercent = Math.round((completed / checklist.length) * 100);
  const allocated = allocatedPercent(milestones);

  return (
    <div className="space-y-10">
      <header>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-[30px] leading-tight sm:text-[36px]">
            {project.projectName || t.platform.overview.title}
          </h1>
          <StatusBadge status={project.status} />
        </div>
        <p className="mt-3 max-w-[60ch] font-sans text-[15px] leading-relaxed text-cream/60">
          {t.platform.statusHint[project.status]}
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="rounded-2xl border border-cream/12 bg-cream/[0.05] p-5"
          >
            <p className="font-sans text-[13px] text-cream/50">{fact.label}</p>
            <p className="mt-2 font-sans text-[18px] text-cream">{fact.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-cream/12 bg-cream/[0.05] p-6 sm:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-serif text-[22px] text-cream">
            {t.platform.overview.readiness}
          </h2>
          <span className="font-sans text-[15px] text-cream/70 tabular-nums">
            {completed}/{checklist.length}
          </span>
        </div>

        <div
          className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-cream/15"
          role="progressbar"
          aria-valuenow={completionPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t.platform.overview.readiness}
        >
          <div
            className="h-full rounded-full bg-cream transition-all duration-700"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        <p className="mt-4 font-sans text-[14px] text-cream/55">
          {t.platform.overview.readinessHelp}
        </p>

        <ul className="mt-5 space-y-1">
          {checklist.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex min-h-[44px] items-center gap-3 rounded-xl px-2 font-sans text-[15px] transition hover:bg-cream/[0.06]"
              >
                <CheckCircle done={item.done} />
                <span className={item.done ? "text-cream/45 line-through" : "text-cream"}>
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-cream/12 bg-cream/[0.05] p-6 sm:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-serif text-[22px] text-cream">
            {t.platform.overview.allocated}
          </h2>
          <span className="font-sans text-[15px] text-cream/70 tabular-nums">
            {allocated}%
          </span>
        </div>

        <div className="mt-4 flex h-2 w-full gap-1 overflow-hidden rounded-full bg-cream/15">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="h-full rounded-full bg-cream/80"
              style={{ width: `${Math.min(milestone.releasePercent, 100)}%` }}
              title={`${milestone.title} — ${milestone.releasePercent}%`}
            />
          ))}
        </div>

        <p className="mt-4 max-w-[64ch] font-sans text-[14px] leading-relaxed text-cream/55">
          {t.platform.overview.allocatedHelp}
        </p>

        {allocated < 100 && (
          <p className="mt-2 font-sans text-[14px] text-cream/45">
            {100 - allocated}% {t.platform.milestones.unallocated}
          </p>
        )}
      </section>

      <p className="max-w-[70ch] font-sans text-[13px] leading-relaxed text-cream/40">
        {t.platform.overview.reviewNote}
      </p>
    </div>
  );
}

function CheckCircle({ done }: { done: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={
        done
          ? "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cream text-navy"
          : "flex h-5 w-5 shrink-0 rounded-full border border-cream/30"
      }
    >
      {done && (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 6.2l2.4 2.4L9.5 3.8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}
