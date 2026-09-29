import { createAdminSupabase, createPublicSupabase } from "@/lib/supabase/server";

export const REGISTRATIONS_TABLE = "registrations";

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

export async function saveRegistration(input: RegistrationInput) {
  const supabase = createPublicSupabase();
  if (!supabase) return { stored: false as const, error: "not_configured" };

  let result = await supabase.from(REGISTRATIONS_TABLE).insert(fullRow(input));
  if (result.error && missingColumn(result.error.message)) {
    result = await supabase.from(REGISTRATIONS_TABLE).insert(coreRow(input));
  }

  if (result.error) {
    const reason = rlsBlocked(result.error.message, result.error.code)
      ? "rls"
      : result.error.message;
    console.warn("[registrations] save skipped:", result.error.message);
    return { stored: false as const, error: reason };
  }

  return { stored: true as const, error: null };
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
