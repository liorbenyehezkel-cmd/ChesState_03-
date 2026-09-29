"use client";

import { useState, type FormEvent } from "react";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { Button } from "@/components/ui/Button";
import { loadContact } from "@/lib/dashboard/contact";
import { captureAttribution, recordLocalEvent } from "@/lib/attribution";
import { indexIntro, indexNotice } from "@/lib/dashboard/indexCopy";
import { money, type PaymentMethod, type Project } from "@/lib/dashboard/types";

export function InvestFlow({ project }: { project: Project }) {
  const { invest } = useDashboard();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [phase, setPhase] = useState<"form" | "done">("form");
  const [error, setError] = useState("");
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  const numeric = Number(amount);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!amount.trim() || !Number.isFinite(numeric) || numeric < project.minStakeUsd) {
      setError(`Enter at least ${money(project.minStakeUsd)}.`);
      return;
    }

    invest({
      projectId: project.id,
      amountUsd: numeric,
      shareLabel: "Registered request",
      method,
    });

    const contact = loadContact();
    const attribution = captureAttribution();
    const detail = {
      projectId: project.id,
      projectTitle: project.title,
      amountUsd: numeric,
      method,
      phone: contact ? `${contact.dial}${contact.phone}` : null,
      country: contact?.iso ?? null,
      source: attribution.source,
    };

    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "investment_request",
        email: contact?.email ?? null,
        detail,
      }),
    });
    recordLocalEvent({
      type: "investment_request",
      email: contact?.email ?? null,
      detail,
    });
    setFeedback("");
    setFeedbackSent(false);
    setPhase("done");
  }

  function handleFeedback(event: FormEvent) {
    event.preventDefault();
    const message = feedback.trim();
    if (!message) return;
    const contact = loadContact();
    const payload = {
      type: "product_feedback",
      email: contact?.email ?? null,
      detail: {
        message,
        projectId: project.id,
        projectTitle: project.title,
        amountUsd: Number.isFinite(numeric) ? numeric : null,
      },
    };
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    recordLocalEvent({
      type: "product_feedback",
      email: contact?.email ?? null,
      detail: payload.detail,
    });
    setFeedbackSent(true);
  }

  return (
    <>
      {phase === "done" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pilot-thanks"
          className="fixed inset-0 z-[80] overflow-y-auto bg-[#081424]"
        >
          <div className="mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center px-6 py-8 text-center sm:py-12">
            <h2
              id="pilot-thanks"
              className="font-serif text-[34px] leading-[1.08] text-cream sm:text-[52px]"
            >
              Thank You for Choosing to Invest With Us!
            </h2>
            <p className="mx-auto mt-5 max-w-[40rem] font-sans text-[16px] leading-relaxed text-cream/80 sm:text-[18px]">
              Our platform is currently in a pilot phase. We are actively
              gathering our initial group of investors to complete the necessary
              requirements for official regulatory approval in the UAE.
            </p>
            <p className="mx-auto mt-4 max-w-[40rem] font-sans text-[16px] leading-relaxed text-cream sm:text-[18px]">
              Your investment request has been registered! As soon as final
              authorization is granted, we will fully execute your investment
              (100%). We will keep you updated every step of the way.
            </p>

            <form
              onSubmit={handleFeedback}
              className="mt-7 w-full max-w-[40rem] text-center"
            >
              <label
                htmlFor="product-feedback"
                className="block font-sans text-[15px] leading-relaxed text-cream/85"
              >
                Anything we should improve? Write it here.
              </label>
              <textarea
                id="product-feedback"
                rows={4}
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                placeholder="A missing feature, something that felt unclear, or any idea for the product or platform…"
                className="mt-3 w-full resize-y rounded-2xl border border-cream/40 bg-cream px-5 py-3.5 text-start font-sans text-[15px] leading-relaxed text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-cream/70"
              />
              {feedbackSent ? (
                <p className="mt-4 font-sans text-[15px] text-cream/80">
                  Thank you — we saved your note.
                </p>
              ) : (
                <Button
                  type="submit"
                  variant="cream"
                  className="mt-4"
                  disabled={!feedback.trim()}
                >
                  Send suggestion
                </Button>
              )}
            </form>

            <button
              type="button"
              onClick={() => {
                setPhase("form");
                setAmount("");
              }}
              className="mt-6 min-h-[48px] rounded-full bg-cream px-8 font-sans text-[15px] font-medium text-navy transition hover:bg-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="dash-card p-5">
        <p className="eyebrow text-gold/70">Add a stake</p>
        <p className="mt-2 font-sans text-[13px] text-cream/50">
          From {money(project.minStakeUsd)} · illustrated yield {project.expectedYield}%, not a forecast
        </p>
        <label className="mt-4 block font-sans text-sm text-cream/70">
          Amount
          <input
            type="number"
            min={project.minStakeUsd}
            step="0.01"
            dir="ltr"
            inputMode="decimal"
            value={amount}
            placeholder=" "
            onChange={(event) => setAmount(event.target.value)}
            className="dash-input mt-2 w-full"
          />
        </label>

        <fieldset className="mt-5 border-0 p-0">
          <legend className="font-sans text-sm text-cream/70">Pay with</legend>
          <div className="mt-2 grid gap-2">
            {(
              [
                ["card", "Credit card"],
                ["apple_pay", "Apple Pay"],
                ["bank", "Bank transfer"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-full border px-4 text-[14px] text-cream transition duration-200 ${
                  method === value
                    ? "border-cream/35 bg-cream/[0.06]"
                    : "border-cream/15 hover:border-cream/30"
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value={value}
                  checked={method === value}
                  onChange={() => setMethod(value)}
                  className="accent-cream"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="mt-3 font-sans text-[13px] text-[#F3B0A8]">
            {error}
          </p>
        )}

        <Button type="submit" variant="cream" className="mt-5 w-full">
          {amount.trim() && Number.isFinite(numeric) ? `Send ${money(numeric)}` : "Send"}
        </Button>
        <p className="mt-3 font-sans text-[12px] leading-relaxed text-cream/40">
          Confirming registers a request. Nothing is taken until ChesState is
          authorised to accept it.
        </p>

        <button
          type="button"
          aria-expanded={noticeOpen}
          onClick={() => setNoticeOpen((value) => !value)}
          className="mt-4 font-sans text-[12px] text-gold/70 transition hover:text-gold"
        >
          {noticeOpen ? "Hide important notice" : "Important notice"}
        </button>
        {noticeOpen ? (
          <div className="mt-3 rounded-2xl border border-gold/25 bg-gold/[0.06] p-4">
            <p className="font-sans text-[13px] leading-relaxed text-cream/75">{indexIntro}</p>
            <p className="mt-3 font-sans text-[13px] leading-relaxed text-cream/70">{indexNotice}</p>
          </div>
        ) : null}
      </form>
    </>
  );
}
