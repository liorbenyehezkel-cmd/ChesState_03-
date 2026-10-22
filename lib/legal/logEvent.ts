import { saveRegistration } from "@/lib/supabase/registrations";

export type PlatformEventType =
  | "waitlist_join"
  | "entrepreneur_signup"
  | "investment_request"
  | "payout_request"
  | "product_feedback"
  | "customer_service";

export async function logPlatformEvent(input: {
  type: PlatformEventType;
  email?: string | null;
  detail?: Record<string, unknown>;
}) {
  const email = typeof input.email === "string" ? input.email : null;
  if (input.type === "waitlist_join") return { stored: false as const, error: "skipped" };
  if (!email) {
    console.warn("[events] dropped: no email for", input.type);
    return { stored: false as const, error: "missing_email" };
  }

  const detail = input.detail ?? {};
  const amount = detail.amountUsd;
  const purchaseAmount =
    typeof amount === "number"
      ? amount
      : typeof amount === "string" && amount.trim()
        ? Number(amount)
        : null;

  const saved = await saveRegistration({
    email,
    phone: typeof detail.phone === "string" ? detail.phone : null,
    country: typeof detail.country === "string" ? detail.country : null,
    source: typeof detail.source === "string" ? detail.source : null,
    tryToPurchase: input.type === "investment_request",
    purchaseAmount: Number.isFinite(purchaseAmount) ? purchaseAmount : null,
    projectTitle: typeof detail.projectTitle === "string" ? detail.projectTitle : null,
    message: typeof detail.message === "string" ? detail.message : null,
  });

  if (!saved.stored) {
    console.error("[events] save failed:", input.type, saved.error, saved.detail);
  } else {
    console.log("[events] saved:", input.type, email);
  }
  return saved;
}
