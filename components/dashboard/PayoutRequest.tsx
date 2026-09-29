"use client";

import { useState, type FormEvent } from "react";
import { useDashboard } from "@/components/dashboard/DashboardProvider";

export function PayoutRequest() {
  const { state } = useDashboard();
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    const tickets = JSON.parse(localStorage.getItem("chesstate_support") ?? "[]") as unknown[];
    tickets.unshift({
      topic: "project-upload",
      message,
      at: new Date().toISOString(),
      email: state.profile.email,
    });
    localStorage.setItem("chesstate_support", JSON.stringify(tickets.slice(0, 20)));
    setSent(true);
    setMessage("");
  }

  return (
    <div className="space-y-10">
      <header className="max-w-[40rem]">
        <p className="eyebrow text-gold/70">Entrepreneur desk</p>
        <h1 className="mt-3 font-serif text-[32px] leading-tight tracking-[-0.01em] text-cream sm:text-[40px]">
          Real estate entrepreneur? Submit a request to upload a project
        </h1>
      </header>

      <section className="dash-card max-w-xl p-5 sm:p-6">
        <h2 className="font-serif text-[22px] text-cream">Customer service</h2>
        <p className="mt-2 font-sans text-[14px] leading-relaxed text-cream/55">
          Tell us about the project you want on ChesState. We reply to{" "}
          {state.profile.email} within two working days, Sunday to Thursday, Gulf time.
        </p>
        {sent ? (
          <p className="mt-4 font-sans text-[15px] text-cream">
            Received. Customer service will write back to {state.profile.email}.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-4 space-y-3">
            <label className="block font-sans text-sm text-cream/70">
              Message
              <textarea
                required
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={5}
                placeholder="Property, city, and the amount you hope to raise"
                className="mt-2 w-full rounded-2xl border border-cream/20 bg-cream/[0.04] px-4 py-3 text-cream"
              />
            </label>
            <button
              type="submit"
              className="min-h-[44px] rounded-full bg-cream px-6 font-sans text-[15px] font-medium text-navy"
            >
              Write to customer service
            </button>
          </form>
        )}
      </section>

      <p className="max-w-[62ch] font-sans text-[13px] italic leading-relaxed text-cream/45">
        * We recommend setting a goal lower than expected, as ChesState serves
        merely as a boost to your fundraising efforts. If you have any questions,
        please do not hesitate to contact customer support via the settings menu.
        Thank you. *
      </p>
    </div>
  );
}
