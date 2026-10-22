import { loadContact } from "@/lib/dashboard/contact";

/**
 * Sends a customer-service message to /api/events. Prefers the email the
 * visitor gave when joining the list; the dashboard profile email is only a
 * seeded placeholder in preview mode.
 */
export async function sendCustomerService(input: {
  message: string;
  topic: string;
  profileEmail?: string | null;
}) {
  const email = loadContact()?.email || input.profileEmail || null;
  if (!email) {
    console.warn("[support] no email available; message was not sent to Supabase");
    return { ok: false as const, error: "missing_email" };
  }

  try {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "customer_service",
        email,
        detail: { message: input.message, topic: input.topic },
      }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      console.error("[support] /api/events failed:", response.status, body);
      return { ok: false as const, error: body?.error ?? String(response.status) };
    }
    return { ok: true as const, error: null };
  } catch (error) {
    console.error("[support] network error:", error);
    return { ok: false as const, error: "network" };
  }
}
