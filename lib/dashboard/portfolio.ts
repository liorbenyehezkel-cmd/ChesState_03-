import { catalog } from "./projects";
import type { ActivityItem, Investment } from "./types";

export type HoldingRow = {
  projectId: string;
  title: string;
  amount: number;
  yieldPct: number;
  illustratedReturn: number;
  pct: number;
};

export function portfolioMetrics(investments: Investment[]) {
  const rows = investments.map((investment) => {
    const project = catalog.find((item) => item.id === investment.projectId);
    const yieldPct = project?.expectedYield ?? 0;
    return {
      investment,
      project,
      yieldPct,
      illustratedReturn: (investment.amountUsd * yieldPct) / 100,
    };
  });

  const totalInvested = investments.reduce((sum, item) => sum + item.amountUsd, 0);
  const illustratedReturn = rows.reduce((sum, row) => sum + row.illustratedReturn, 0);
  const averageReturn =
    totalInvested > 0
      ? rows.reduce((sum, row) => sum + row.yieldPct * row.investment.amountUsd, 0) /
        totalInvested
      : 0;

  return {
    totalInvested,
    illustratedReturn,
    portfolioValue: totalInvested + illustratedReturn,
    propertyCount: new Set(investments.map((item) => item.projectId)).size,
    averageReturn,
    rows,
  };
}

export function performanceSeries(investments: Investment[]) {
  const now = new Date();
  const points: Array<{ month: string; value: number }> = [];

  for (let offset = 5; offset >= 0; offset -= 1) {
    const start = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);
    const value = investments
      .filter((item) => new Date(item.createdAt).getTime() <= end.getTime())
      .reduce((sum, item) => {
        const project = catalog.find((entry) => entry.id === item.projectId);
        const illustrated = item.amountUsd * ((project?.expectedYield ?? 0) / 100);
        return sum + item.amountUsd + illustrated;
      }, 0);

    points.push({
      month: start.toLocaleString("en", { month: "short" }),
      value: Math.round(value * 100) / 100,
    });
  }

  return points;
}

export function allocationRows(investments: Investment[]): HoldingRow[] {
  const grouped = new Map<string, HoldingRow>();

  for (const investment of investments) {
    const project = catalog.find((item) => item.id === investment.projectId);
    const yieldPct = project?.expectedYield ?? 0;
    const existing = grouped.get(investment.projectId);
    if (existing) {
      existing.amount += investment.amountUsd;
      existing.illustratedReturn += (investment.amountUsd * yieldPct) / 100;
    } else {
      grouped.set(investment.projectId, {
        projectId: investment.projectId,
        title: investment.projectTitle,
        amount: investment.amountUsd,
        yieldPct,
        illustratedReturn: (investment.amountUsd * yieldPct) / 100,
        pct: 0,
      });
    }
  }

  const total = [...grouped.values()].reduce((sum, row) => sum + row.amount, 0);
  return [...grouped.values()]
    .map((row) => ({
      ...row,
      pct: total > 0 ? (row.amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function ledgerRows(investments: Investment[], activity: ActivityItem[]) {
  const fromInvestments = investments.map((investment) => {
    const project = catalog.find((item) => item.id === investment.projectId);
    const yieldPct = project?.expectedYield ?? 0;
    return {
      id: investment.id,
      at: investment.createdAt,
      property: investment.projectTitle,
      amountUsd: investment.amountUsd,
      status: investment.status,
      kind: "investment" as const,
      illustratedReturn: (investment.amountUsd * yieldPct) / 100,
      yieldPct,
    };
  });

  const fromWallet = activity
    .filter((item) => item.label === "Added funds")
    .map((item) => ({
      id: item.id,
      at: item.at,
      property: "Available balance",
      amountUsd: item.amountUsd ?? 0,
      status: "confirmed" as const,
      kind: "funds" as const,
      illustratedReturn: null as number | null,
      yieldPct: null as number | null,
    }));

  return [...fromInvestments, ...fromWallet].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  );
}
