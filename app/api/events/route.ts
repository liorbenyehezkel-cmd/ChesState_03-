import { NextResponse } from "next/server";
import { logPlatformEvent, type PlatformEventType } from "@/lib/legal/logEvent";

const allowed: PlatformEventType[] = [
  "waitlist_join",
  "entrepreneur_signup",
  "investment_request",
  "payout_request",
  "product_feedback",
  "customer_service",
];

export async function POST(request: Request) {
  let payload: { type?: unknown; email?: unknown; detail?: unknown };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof payload.type !== "string" || !allowed.includes(payload.type as PlatformEventType)) {
    return NextResponse.json({ error: "Unknown event" }, { status: 400 });
  }

  console.log("[events] incoming:", JSON.stringify(payload));

  let result;
  try {
    result = await logPlatformEvent({
    type: payload.type as PlatformEventType,
    email: typeof payload.email === "string" ? payload.email : null,
    detail:
      payload.detail && typeof payload.detail === "object"
        ? (payload.detail as Record<string, unknown>)
        : {},
    });
  } catch (error) {
    console.error("[events] logPlatformEvent threw:", error);
    return NextResponse.json({ error: "Could not record event" }, { status: 500 });
  }

  if (!result.stored) {
    const status = result.error === "missing_email" ? 400 : 502;
    return NextResponse.json({ ok: false, error: result.error }, { status });
  }

  return NextResponse.json({ ok: true });
}
