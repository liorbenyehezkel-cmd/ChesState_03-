import { NextResponse } from "next/server";
import { propertyTypeKeys } from "@/lib/i18n/types";
import { createServerSupabase } from "@/lib/supabase/server";

function optionalText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed.slice(0, maxLength);
}

function optionalInteger(value: unknown, min: number, max: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const rounded = Math.round(value);
  if (rounded < min || rounded > max) return null;
  return rounded;
}

export async function PATCH(request: Request) {
  const supabase = createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ reason: "not_configured" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ reason: "unauthorized" }, { status: 401 });

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ reason: "invalid_body" }, { status: 400 });
  }

  const propertyType =
    typeof payload.propertyType === "string" &&
    (propertyTypeKeys as readonly string[]).includes(payload.propertyType)
      ? payload.propertyType
      : null;

  const patch = {
    project_name: optionalText(payload.projectName, 160),
    description: optionalText(payload.description, 4000),
    property_type: propertyType,
    funding_target_usd: optionalInteger(payload.fundingTargetUsd, 0, 1_000_000_000_000),
    total_value_usd: optionalInteger(payload.totalValueUsd, 0, 1_000_000_000_000),
    timeline_months: optionalInteger(payload.timelineMonths, 1, 600),
    city: optionalText(payload.city, 120),
    neighborhood: optionalText(payload.neighborhood, 120),
  };

  // RLS restricts this to the caller's own row, so the user_id filter is the
  // scope rather than the security boundary.
  const { error } = await supabase
    .from("entrepreneur_applications")
    .update(patch)
    .eq("user_id", user.id);

  if (error) {
    console.error("[platform/project] update failed:", error.message);
    return NextResponse.json({ reason: "save_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
