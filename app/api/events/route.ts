import { NextResponse } from "next/server";
import { logPlatformEvent, type PlatformEventType } from "@/lib/legal/logEvent";

const allowed: PlatformEventType[] = [
  "waitlist_join",
  "entrepreneur_signup",
  "investment_request",
  "payout_request",
  "product_feedback",
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

  await logPlatformEvent({
    type: payload.type as PlatformEventType,
    email: typeof payload.email === "string" ? payload.email : null,
    detail:
      payload.detail && typeof payload.detail === "object"
        ? (payload.detail as Record<string, unknown>)
        : {},
  });

  return NextResponse.json({ ok: true });
}
