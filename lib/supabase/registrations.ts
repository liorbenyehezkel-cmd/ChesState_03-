import { createAdminSupabase, createPublicSupabase } from "@/lib/supabase/server";
import { REGISTRATIONS_TABLE } from "@/lib/supabase/tables";

export { REGISTRATIONS_TABLE };

export type RegistrationInput = {
  email: string;
  phone?: string | null;
  country?: string | null;
  source?: string | null;
  locale?: string | null;
  tryToPurchase?: boolean | null;
  purchaseAmount?: number | null;
  projectTitle?: string | null;
  message?: string | null;
};

function compact(row: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(row).filter(([, value]) => value != null && value !== ""),
  );
}

function coreRow(input: RegistrationInput) {
  return compact({
    email: input.email.toLowerCase().trim(),
    phone: input.phone ?? null,
    country: input.country ?? null,
    try_to_make_a_purchase: input.tryToPurchase ?? false,
    purchase_amount: input.purchaseAmount ?? null,
  });
}

function fullRow(input: RegistrationInput) {
  return compact({
    ...coreRow(input),
    source: input.source ?? null,
    locale: input.locale ?? null,
    project_title: input.projectTitle ?? null,
    message: input.message ?? null,
  });
}

function missingColumn(message: string) {
  return /column|schema cache|PGRST204/i.test(message);
}

function rlsBlocked(message: string, code?: string) {
  return code === "42501" || /row-level security/i.test(message);
}

/**
 * The anon key is insert-only, so an existing row is updated with the server
 * key. Messages are appended (newest last) so earlier ones are not lost;
 * purchase intent is only ever switched on, never off.
 */
async function mergeIntoExisting(input: RegistrationInput) {
  const admin = createAdminSupabase();
  if (!admin) return { ok: false as const, error: "duplicate_admin_key_missing" };

  const email = input.email.toLowerCase().trim();
  const { data: existing, error: findError } = await admin
    .from(REGISTRATIONS_TABLE)
    .select("*")
    .ilike("email", email)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (findError || !existing) {
    return { ok: false as const, error: findError?.message ?? "duplicate_not_found" };
  }

  const patch: Record<string, unknown> = {};
  const fill = (column: string, value: unknown) => {
    if (value != null && value !== "" && existing[column] == null) patch[column] = value;
  };
  fill("phone", input.phone);
  fill("country", input.country);
  fill("source", input.source);
  fill("locale", input.locale);
  if (input.tryToPurchase) {
    patch.try_to_make_a_purchase = true;
    if (input.purchaseAmount != null) patch.purchase_amount = input.purchaseAmount;
    if (input.projectTitle) patch.project_title = input.projectTitle;
  } else {
    fill("project_title", input.projectTitle);
  }
  if (input.message) {
    patch.message = existing.message
      ? `${existing.message}
${input.message}`
      : input.message;
  }
  if (Object.keys(patch).length === 0) return { ok: true as const, error: null };

  const { error } = await admin
    .from(REGISTRATIONS_TABLE)
    .update(patch)
    .eq("id", existing.id);
  if (error) {
    console.error("[registrations] merge failed:", error.message);
    return { ok: false as const, error: error.message };
  }
  return { ok: true as const, error: null };
}

export async function saveRegistration(input: RegistrationInput) {
  const supabase = createPublicSupabase();
  if (!supabase) return { stored: false as const, error: "not_configured", detail: null };

  let result = await supabase.from(REGISTRATIONS_TABLE).insert(fullRow(input));
  if (result.error && missingColumn(result.error.message)) {
    result = await supabase.from(REGISTRATIONS_TABLE).insert(coreRow(input));
  }

  if (result.error?.code === "23505") {
    // Email already registered: fold the new data into the existing row.
    const merged = await mergeIntoExisting(input);
    if (merged.ok) return { stored: true as const, error: null, detail: null };
    return { stored: false as const, error: merged.error, detail: null };
  }

  if (result.error) {
    const { message, code, details, hint } = result.error;
    const reason = rlsBlocked(message, code) ? "rls" : message;
    console.error("[registrations] insert failed:", { code, message, details, hint });
    return {
      stored: false as const,
      error: reason,
      detail: { code, message, details, hint },
    };
  }

  return { stored: true as const, error: null, detail: null };
}

export async function listRegistrations(limit = 500) {
  const supabase = createAdminSupabase();
  if (!supabase) {
    return { rows: [] as Record<string, unknown>[], error: "admin_key_missing" };
  }

  const { data, error } = await supabase
    .from(REGISTRATIONS_TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  return {
    rows: (data ?? []) as Record<string, unknown>[],
    error: error?.message ?? null,
  };
}

export async function deleteRegistration(id: string) {
  const supabase = createAdminSupabase();
  if (!supabase) return { ok: false as const, error: "admin_key_missing" };

  const { data, error } = await supabase
    .from(REGISTRATIONS_TABLE)
    .delete()
    .eq("id", id)
    .select("id");
  if (error) {
    console.error("[registrations] delete failed:", error.message);
    return { ok: false as const, error: error.message };
  }
  // Supabase reports success even when nothing matched, so check the result.
  if (!data || data.length === 0) {
    return { ok: false as const, error: "Registrant not found (already removed?)" };
  }
  return { ok: true as const, error: null };
}
