"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { releaseIfFunded } from "@/services/escrow";
import { releaseLots } from "@/services/ledger";
import { payEntrepreneurBank } from "@/services/offramp";
import { catalog } from "@/lib/dashboard/projects";
import { money } from "@/lib/dashboard/types";

export function PayoutFlow() {
  const campaign = catalog.find((item) => item.slug === "aljada-garden-walk")!;
  const { state, payout } = useDashboard();
  const alreadyPaid = state.payouts.length > 0;
  const ready = campaign.status === "funded" && !alreadyPaid;

  const [phase, setPhase] = useState<"idle" | "converting" | "sending" | "done">("idle");
  const [accountName, setAccountName] = useState("Aljada Holdings LLC");
  const [account, setAccount] = useState("AE07 ACCT 0000 1234 5678 901");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!ready) return;
    setPhase("converting");
    await releaseIfFunded(campaign.id);
    releaseLots(campaign.id);
    setPhase("sending");
    const result = await payEntrepreneurBank({
      projectId: campaign.id,
      amountUsd: campaign.currentAmount,
      accountName,
      ibanOrAccount: account,
    });
    payout(result.amountUsd, result.reference);
    setPhase("done");
  }

  if (!ready && !alreadyPaid && campaign.status !== "funded") {
    return (
      <p className="font-sans text-[15px] text-cream/55">
        Withdraw opens when this campaign reaches 100% of its target.
      </p>
    );
  }

  if (alreadyPaid || phase === "done") {
    const last = state.payouts[0];
    return (
      <div className="rounded-2xl border border-cream/15 p-6">
        <p className="font-serif text-[24px] text-cream">Transfer initiated.</p>
        <p className="mt-3 font-sans text-[15px] leading-relaxed text-cream/60">
          {last ? money(last.amountUsd) : money(campaign.currentAmount)} is on
          its way to the business account. You will see it as a bank credit,
          not as a wallet movement.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
      <p className="font-sans text-[15px] text-cream/60">
        {money(campaign.currentAmount)} is ready. We convert the held balance
        and send it by bank transfer.
      </p>
      <label className="block font-sans text-sm text-cream/70">
        Account name
        <input
          value={accountName}
          onChange={(event) => setAccountName(event.target.value)}
          className="mt-2 min-h-[44px] w-full rounded-full border border-cream/20 bg-cream/[0.06] px-4 text-cream"
        />
      </label>
      <label className="block font-sans text-sm text-cream/70">
        Business account
        <input
          value={account}
          onChange={(event) => setAccount(event.target.value)}
          dir="ltr"
          className="mt-2 min-h-[44px] w-full rounded-full border border-cream/20 bg-cream/[0.06] px-4 text-cream"
        />
      </label>
      <Button type="submit" variant="cream" disabled={phase !== "idle"}>
        {phase === "idle" && "Withdraw funds"}
        {phase === "converting" && "Converting held funds…"}
        {phase === "sending" && "Sending bank transfer…"}
      </Button>
    </form>
  );
}
