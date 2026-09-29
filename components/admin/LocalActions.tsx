"use client";

import { useEffect, useState } from "react";
import { readLocalEvents } from "@/lib/attribution";
import { loadContact } from "@/lib/dashboard/contact";
import { formatShortDate, money } from "@/lib/dashboard/types";

export function LocalActions() {
  const [events, setEvents] = useState(readLocalEvents());
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEvents(readLocalEvents());
    setEmail(loadContact()?.email ?? null);
  }, []);

  const signups = events.filter((item) => item.type === "waitlist_join");
  const purchases = events.filter((item) => item.type === "investment_request");
  const feedback = events.filter((item) => item.type === "product_feedback");
  const uniqueBuyers = new Set(
    purchases.map((item) => (item.email ?? "").toLowerCase()).filter(Boolean),
  );

  return (
    <section className="dash-card p-5">
      <h2 className="font-serif text-[22px] text-cream">This browser</h2>
      <p className="mt-1 font-sans text-[13px] text-cream/50">
        Local copy when Supabase is not connected.
        {email ? ` Signed as ${email}.` : ""}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <p className="font-sans text-[14px] text-cream/80">
          Signups: <span className="text-cream">{signups.length}</span>
        </p>
        <p className="font-sans text-[14px] text-cream/80">
          Came to purchase: <span className="text-cream">{uniqueBuyers.size}</span>
        </p>
        <p className="font-sans text-[14px] text-cream/80">
          Feedback notes: <span className="text-cream">{feedback.length}</span>
        </p>
      </div>
      {events.length === 0 ? (
        <p className="mt-4 font-sans text-[14px] text-cream/45">No local actions.</p>
      ) : (
        <ul className="mt-4 divide-y divide-cream/10">
          {events.map((row, index) => (
            <li key={`${row.at}-${index}`} className="py-3">
              <p className="font-sans text-[15px] text-cream">
                {row.type.replaceAll("_", " ")}
                {row.email ? ` · ${row.email}` : ""}
              </p>
              <p className="font-sans text-[12px] text-cream/45">
                {formatShortDate(row.at)}
                {row.detail?.source ? ` · ${String(row.detail.source)}` : ""}
                {row.detail?.country ? ` · ${String(row.detail.country)}` : ""}
                {row.detail?.phone ? ` · ${String(row.detail.phone)}` : ""}
                {row.detail?.amountUsd != null
                  ? ` · ${money(Number(row.detail.amountUsd))}`
                  : ""}
                {row.detail?.message ? ` · ${String(row.detail.message)}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
