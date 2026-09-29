"use client";

import Link from "next/link";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { money } from "@/lib/dashboard/types";

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
              <td className="px-4 py-4 capitalize text-cream/70">{row.status}</td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="text-cream/80 underline underline-offset-4"
                    onClick={() => downloadContract(row.projectTitle, row.amountUsd, row.shareLabel)}
                  >
                    Download
                  </button>
                  <a
                    className="text-cream/80 underline underline-offset-4"
                    href={`mailto:?subject=${encodeURIComponent(`Ownership record — ${row.projectTitle}`)}&body=${encodeURIComponent(
                      contractBody(row.projectTitle, row.amountUsd, row.shareLabel),
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

function contractBody(title: string, amount: number, share: string) {
  return [
    "ChesState — Digital ownership record",
    "",
    `Project: ${title}`,
    `Recorded amount: ${money(amount)}`,
    `Recorded share: ${share}`,
    "",
    "This document records interest in a sample raise. It is not a security certificate and not an ERC or wallet instrument. ChesState will not accept investment until required approvals are in place.",
  ].join("\n");
}

function downloadContract(title: string, amount: number, share: string) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
  <style>body{font-family:Georgia,serif;max-width:640px;margin:48px auto;color:#0B1D33;line-height:1.5}
  h1{font-size:28px} p{color:#6E6B63}</style></head><body>
  <h1>Digital ownership record</h1>
  <p>ChesState</p>
  <h2>${title}</h2>
  <p>Recorded amount: ${money(amount)}<br>Recorded share: ${share}</p>
  <p>This document records interest in a sample raise. It is not a security certificate. Print this page to save a PDF.</p>
  </body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "-").toLowerCase()}-record.html`;
  a.click();
  URL.revokeObjectURL(url);
}
