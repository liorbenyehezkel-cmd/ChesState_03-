"use client";

import { useState } from "react";
import Link from "next/link";
import { RaisedArea } from "@/components/dashboard/Charts";
import {
  memberLevel,
  memberSeries,
  memberTotal,
  type CommunityPerson,
} from "@/lib/dashboard/community";
import { money } from "@/lib/dashboard/types";

const ranges = ["weekly", "monthly", "max"] as const;

export function MemberProfile({ person }: { person: CommunityPerson }) {
  const [range, setRange] = useState<(typeof ranges)[number]>("weekly");
  const total = memberTotal(person);
  const level = memberLevel(person);

  return (
    <div className="space-y-8">
      <Link href="/dashboard/community" className="font-sans text-[14px] text-cream/50 hover:text-cream">
        Community
      </Link>
      <header className="flex items-center gap-4">
        <img
          src={person.photo}
          alt={`Portrait of sample member ${person.name}`}
          className="h-[72px] w-[72px] rounded-full object-cover"
        />
        <div>
          <h1 className="font-serif text-[32px] text-cream">{person.name}</h1>
          <p className="font-sans text-[14px] text-cream/50">
            @{person.handle} · {person.city}
          </p>
        </div>
      </header>
      <p className="rounded-2xl border border-gold/25 bg-gold/[0.06] px-4 py-3 font-sans text-[13px] leading-relaxed text-cream/70">
        Sample member. Holdings and charts on this page are illustrative, not a
        real portfolio or a review of ChesState.
      </p>
      <p className="max-w-[48ch] font-sans text-[15px] leading-relaxed text-cream/65">{person.bio}</p>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Invested" value={money(total)} />
        <Stat label="Assets" value={String(person.investments.length)} />
        <Stat label="Level" value={String(level)} />
      </section>

      <section className="rounded-2xl border border-cream/10 p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-[22px] text-cream">Investments</h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Chart range">
            {ranges.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setRange(key)}
                className={`min-h-[40px] rounded-full px-4 font-sans text-[13px] capitalize ${
                  range === key ? "bg-cream text-navy" : "border border-cream/20 text-cream/70"
                }`}
              >
                {key === "max" ? "Max" : key}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <RaisedArea data={memberSeries(person, range)} />
        </div>
        <ul className="mt-4 divide-y divide-cream/10 rounded-2xl border border-cream/10">
          {person.investments.map((item) => (
            <li key={item.project} className="flex items-center justify-between gap-4 px-5 py-4">
              <p className="font-sans text-[15px] text-cream">{item.project}</p>
              <p className="font-sans text-[15px] tabular-nums text-cream">{money(item.amountUsd)}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-cream/10 bg-cream/[0.03] p-5">
      <p className="font-sans text-[13px] text-cream/45">{label}</p>
      <p className="mt-2 font-serif text-[28px] text-cream">{value}</p>
    </div>
  );
}
