/**
 * Local-only record of stakes an investor asked to place. Nothing is charged
 * and nothing is written to the database — licensing is still in progress.
 */
export type LocalStake = {
  slug: string;
  amountUsd: number;
  recordedAt: string;
};

const STORAGE_KEY = "chesstate_stakes";

export function readStakes(): LocalStake[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalStake[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordStake(slug: string, amountUsd: number): LocalStake {
  const next: LocalStake = {
    slug,
    amountUsd,
    recordedAt: new Date().toISOString(),
  };
  const stakes = readStakes().filter((stake) => stake.slug !== slug);
  stakes.unshift(next);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stakes));
  return next;
}
