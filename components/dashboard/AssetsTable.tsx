"use client";

import Link from "next/link";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { money, type InvestmentStatus } from "@/lib/dashboard/types";

function StatusBadge({ status }: { status: InvestmentStatus }) {
  const styles: Record<InvestmentStatus, string> = {
    pending: "bg-gold/15 text-gold border-gold/20",
    locked: "bg-gold/15 text-gold border-gold/20",
    confirmed: "bg-[#3EA88C]/15 text-[#3EA88C] border-[#3EA88C]/20",
    refunded: "bg-cream/8 text-cream/55 border-cream/15",
  };
  const labels: Record<InvestmentStatus, string> = {
    pending: "Pending · Smart Contract",
    locked: "Locked in Contract",
    confirmed: "Active",
    refunded: "Refunded",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-[12px] font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export function AssetsTable() {
  const { state } = useDashboard();

  if (state.investments.length === 0) {
    return (
      <div className="rounded-2xl border border-cream/10 p-8">
        <p className="font-sans text-[15px] text-cream/60">No stakes recorded yet.</p>
        <Link
          href="/dashboard/explore"
          className="mt-4 inline-flex min-h-[44px] items-center font-sans text-[15px] text-cream underline underline-offset-4"
        >
          Explore projects
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-cream/10">
      <table className="w-full min-w-[640px] text-start font-sans text-[14px]">
        <thead className="border-b border-cream/10 text-cream/45">
          <tr>
            <th className="px-4 py-3 font-medium">Project</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Share</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Contract</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cream/10">
          {state.investments.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-4">
                <Link href={`/dashboard/projects/${row.projectSlug}`} className="text-cream hover:underline">
                  {row.projectTitle}
                </Link>
              </td>
              <td className="px-4 py-4 tabular-nums text-cream">{money(row.amountUsd)}</td>
              <td className="px-4 py-4 tabular-nums text-cream/70">{row.shareLabel}</td>
              <td className="px-4 py-4">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="text-cream/80 underline underline-offset-4"
                    onClick={() => downloadContract(row.projectTitle, row.amountUsd, row.shareLabel, row.projectSlug)}
                  >
                    Download
                  </button>
                  <a
                    className="text-cream/80 underline underline-offset-4"
                    href={`mailto:?subject=${encodeURIComponent(`Ownership record — ${row.projectTitle}`)}&body=${encodeURIComponent(
                      contractBody(row.projectTitle, row.amountUsd, row.shareLabel, row.projectSlug),
                    )}`}
                  >
                    Email
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function tokenTicker(slug: string) {
  return `CHS-${slug.split("-").slice(0, 2).join("").slice(0, 8).toUpperCase()}-01`;
}

function contractBody(title: string, amount: number, share: string, slug: string) {
  const ticker = tokenTicker(slug);
  return [
    "ChesState — Digital Ownership Contract",
    "",
    `Project: ${title}`,
    `Token: ${ticker} (ERC-20 fraction)`,
    `Recorded amount: ${money(amount)}`,
    `Recorded share: ${share}`,
    "",
    "This document is a digitally signed record of your fractional ownership interest, represented as an ERC-20 token on the ChesState smart contract.",
    "It is not a security certificate and is not transferable until ChesState receives regulatory approval. Funds are held in smart contract escrow until the raise closes.",
    "",
    "ChesState · Pilot phase · Subject to VARA regulatory approval",
  ].join("\n");
}

function downloadContract(title: string, amount: number, share: string, slug: string) {
  const ticker = tokenTicker(slug);
  const issued = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${ticker} · ChesState</title>
  <style>
    body{font-family:Georgia,serif;max-width:680px;margin:56px auto;color:#0B1D33;line-height:1.6;padding:0 24px}
    h1{font-size:26px;margin-bottom:4px} .sub{color:#6E6B63;font-size:14px;margin-bottom:32px}
    table{width:100%;border-collapse:collapse;margin:24px 0}
    td{padding:10px 0;border-bottom:1px solid #E8E4DC;font-size:15px}
    td:first-child{color:#6E6B63;width:40%} .ticker{font-family:monospace;background:#F4F1EA;padding:2px 8px;border-radius:4px}
    .disclaimer{font-size:12px;color:#9E9A93;margin-top:32px;line-height:1.7}
  </style></head><body>
  <h1>Digital Ownership Contract</h1>
  <p class="sub">ChesState · Issued ${issued}</p>
  <table>
    <tr><td>Project</td><td>${title}</td></tr>
    <tr><td>Token</td><td><span class="ticker">${ticker}</span> · ERC-20 fraction</td></tr>
    <tr><td>Recorded amount</td><td>${money(amount)}</td></tr>
    <tr><td>Recorded share</td><td>${share}</td></tr>
    <tr><td>Contract status</td><td>Held in smart contract escrow</td></tr>
    <tr><td>Settlement</td><td>USDC · On-chain</td></tr>
  </table>
  <p class="disclaimer">This document is a digitally signed record of your fractional ownership interest. Funds are held in a property-specific smart contract escrow and auto-released or auto-refunded based on whether the raise target is met. This is not a security certificate and is not transferable until ChesState receives full regulatory approval from VARA. Pilot phase — sample listing only.</p>
  <p class="disclaimer">Print this page to save a PDF copy.</p>
  </body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${ticker.toLowerCase()}-ownership-contract.html`;
  a.click();
  URL.revokeObjectURL(url);
}
