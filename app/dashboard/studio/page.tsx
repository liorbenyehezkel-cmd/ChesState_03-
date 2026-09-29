"use client";

import { useState } from "react";
import { RaisedArea } from "@/components/dashboard/Charts";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { money } from "@/lib/dashboard/types";

const ranges = {
  daily: {
    label: "Daily",
    hint: "Hours",
    data: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"].map((label) => ({
      label,
      value: 0,
    })),
  },
  weekly: {
    label: "Weekly",
    hint: "Days",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => ({
      label,
      value: 0,
    })),
  },
  monthly: {
    label: "Monthly",
    hint: "Weeks",
    data: ["Week 1", "Week 2", "Week 3", "Week 4"].map((label) => ({
      label,
      value: 0,
    })),
  },
  max: {
    label: "Max",
    hint: "Months",
    data: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"].map((label) => ({
      label,
      value: 0,
    })),
  },
} as const;

type RangeKey = keyof typeof ranges;

export default function StudioOverviewPage() {
  const { role } = useDashboard();
  const [range, setRange] = useState<RangeKey>("weekly");
  const active = ranges[range];
  const raisedUsd = 0;
  const isEmpty = raisedUsd <= 0;

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Entrepreneur desk" title="Studio">
        Your project desk. Nothing is live here until a project is accepted
        and uploaded.
      </PageHeader>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Raised" value={money(raisedUsd)} featured />
        <Stat label="Investors" value="0" />
        <Stat label="Project status" value="Not listed" />
        <Stat label="Open requests" value="0" />
      </section>

      <section className="dash-card p-5 sm:p-6">
        <h2 className="font-serif text-[22px] tracking-[-0.01em] text-cream">
          My first project
        </h2>
        <p className="mt-1 font-sans text-[14px] text-cream/50">Let&apos;s get started.</p>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-cream/10">
          <div className="h-full w-0 rounded-full bg-cream" />
        </div>

        {isEmpty ? (
          <div className="mt-8">
            <div className="relative">
              <RaisedArea
                data={[...active.data]}
                color={role === "entrepreneur" ? "#0B1D33" : "#F8F6F0"}
              />
              <div className="pointer-events-none absolute inset-0 flex items-end justify-start pb-8 pe-4 ps-12 sm:ps-14">
                <div className="pointer-events-auto max-w-[38ch] dash-card px-4 py-3">
                  <p className="font-serif text-[18px] text-cream">No project on the desk</p>
                  <p className="mt-1 font-sans text-[13px] leading-relaxed text-cream/60">
                    Raised stays at $0 until a file is uploaded. The chart is
                    ready for the first request.
                  </p>
                </div>
              </div>
            </div>
            <ButtonLink href="/entrepreneurs" variant="cream" className="mt-6">
              Upload your first project
            </ButtonLink>
          </div>
        ) : (
          <>
            <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="font-serif text-[20px] text-cream">Money invested</h3>
                <p className="mt-1 font-sans text-[13px] text-cream/65">
                  {active.hint} on the horizontal axis. Raised so far: {money(raisedUsd)}.
                </p>
              </div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Chart range">
                {(Object.keys(ranges) as RangeKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRange(key)}
                    className={`min-h-[40px] rounded-full px-4 font-sans text-[13px] transition duration-200 ${
                      range === key
                        ? "bg-cream text-navy"
                        : "border border-cream/20 text-cream/70 hover:border-cream/35 hover:text-cream"
                    }`}
                  >
                    {ranges[key].label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <RaisedArea
                data={[...active.data]}
                color={role === "entrepreneur" ? "#0B1D33" : "#F8F6F0"}
              />
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
  featured = false,
}: {
  label: string;
  value: string;
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
    </div>
  );
}
