/**
 * MVP For-Benefit-Of ledger.
 *
 * Investor funds are recorded as frozen against a project. On success they are
 * batched to the entrepreneur. On failure they return to the investor balance.
 * Replace this module with the on-chain escrow once each project is deployed.
 */

export type FrozenLot = {
  id: string;
  projectId: string;
  investorId: string;
  amountUsd: number;
  frozenAt: string;
};

const memory: FrozenLot[] = [];

export function freezeLot(lot: Omit<FrozenLot, "id" | "frozenAt">): FrozenLot {
  const row: FrozenLot = {
    ...lot,
    id: `fbo_${Date.now().toString(36)}`,
    frozenAt: new Date().toISOString(),
  };
  memory.push(row);
  return row;
}

export function lotsForProject(projectId: string) {
  return memory.filter((lot) => lot.projectId === projectId);
}

export function releaseLots(projectId: string) {
  const lots = lotsForProject(projectId);
  return {
    projectId,
    totalUsd: lots.reduce((sum, lot) => sum + lot.amountUsd, 0),
    count: lots.length,
  };
}
