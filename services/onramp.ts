import type { PaymentMethod } from "@/lib/dashboard/types";

export type OnRampRequest = {
  amountUsd: number;
  method: PaymentMethod;
  projectId: string;
};

export type OnRampResult = {
  /** Fiat collected from the investor. */
  amountUsd: number;
  /**
   * Stable-value units that would be minted/purchased via Circle and sent
   * into the project lock. Never shown in the UI.
   */
  stableUnits: number;
  reference: string;
  method: PaymentMethod;
};

/**
 * Fiat on-ramp placeholder.
 *
 * Production: MoonPay / Circle / Bridge collects card, Apple Pay or bank
 * transfer, converts to USDC, and the result is passed to `escrow.lock`.
 * The investor never sees a wallet, a network fee, or a seed phrase.
 */
export async function convertFiatToProjectLock(
  request: OnRampRequest,
): Promise<OnRampResult> {
  await delay(1400);

  return {
    amountUsd: request.amountUsd,
    stableUnits: request.amountUsd,
    reference: `onramp_${cryptoRandom()}`,
    method: request.method,
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cryptoRandom() {
  return Math.random().toString(36).slice(2, 10);
}
