/**
 * Project lock (smart-contract escrow) placeholder.
 *
 * Production: a contract on Base or Polygon holds stablecoin until the raise
 * succeeds or the window closes.
 *
 *   Success → release to the entrepreneur off-ramp.
 *   Failure → refund() returns each investor's share automatically.
 *
 * MVP: the same outcomes are recorded on a central FBO ledger (`ledger.ts`)
 * and batched. The UI never mentions contracts, networks, or tokens.
 */

export type LockRequest = {
  projectId: string;
  investorId: string;
  amountUsd: number;
  onRampReference: string;
};

export type LockResult = {
  lockId: string;
  status: "locked";
  shareLabel: string;
};

export async function lockFunds(request: LockRequest): Promise<LockResult> {
  await delay(600);

  const share = request.amountUsd / 1_000_000;
  return {
    lockId: `lock_${request.projectId.slice(0, 6)}_${cryptoRandom()}`,
    status: "locked",
    shareLabel: `${share.toFixed(5)}%`,
  };
}

export async function refundIfFailed(projectId: string) {
  await delay(400);
  return { projectId, status: "refunding" as const };
}

export async function releaseIfFunded(projectId: string) {
  await delay(400);
  return { projectId, status: "releasable" as const };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cryptoRandom() {
  return Math.random().toString(36).slice(2, 8);
}
