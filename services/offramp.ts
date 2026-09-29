export type OffRampRequest = {
  projectId: string;
  amountUsd: number;
  accountName: string;
  ibanOrAccount: string;
};

export type OffRampResult = {
  reference: string;
  amountUsd: number;
  rail: "SWIFT" | "SEPA";
  status: "initiated";
};

/**
 * Entrepreneur off-ramp placeholder.
 *
 * Production: Circle / Bridge burns the locked stablecoin and pays USD or EUR
 * to the business account. The entrepreneur sees a bank transfer, not a burn.
 */
export async function payEntrepreneurBank(
  request: OffRampRequest,
): Promise<OffRampResult> {
  await delay(1600);

  const rail = request.ibanOrAccount.replace(/\s/g, "").startsWith("DE")
    ? "SEPA"
    : "SWIFT";

  return {
    reference: `payout_${cryptoRandom()}`,
    amountUsd: request.amountUsd,
    rail,
    status: "initiated",
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cryptoRandom() {
  return Math.random().toString(36).slice(2, 10);
}
