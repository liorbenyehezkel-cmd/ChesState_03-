import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

const MAX_MILESTONES = 20;

type IncomingMilestone = {
  title: string;
  description: string | null;
  targetDate: string | null;
  releasePercent: number;
};

function parseMilestones(value: unknown): IncomingMilestone[] | null {
  if (!Array.isArray(value) || value.length > MAX_MILESTONES) return null;

  const parsed: IncomingMilestone[] = [];

  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) return null;
    const { title, description, targetDate, releasePercent } = entry as Record<
      string,
      unknown
    >;

    if (typeof title !== "string" || title.trim() === "") return null;

    const percent = Number(releasePercent);
    if (!Number.isFinite(percent) || percent < 0 || percent > 100) return null;

    parsed.push({
      title: title.trim().slice(0, 160),
      description:
        typeof description === "string" && description.trim() !== ""
          ? description.trim().slice(0, 1000)
          : null,
      targetDate:
        typeof targetDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(targetDate)
          ? targetDate
          : null,
      releasePercent: Math.round(percent * 100) / 100,
    });
  }

  const total = parsed.reduce((sum, m) => sum + m.releasePercent, 0);
  if (total > 100) return null;

  return parsed;
}

/** Replaces the whole milestone list, which keeps ordering unambiguous. */
export async function PUT(request: Request) {
  const supabase = createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ reason: "not_configured" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ reason: "unauthorized" }, { status: 401 });

  let payload: { milestones?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ reason: "invalid_body" }, { status: 400 });
  }

  const milestones = parseMilestones(payload.milestones);
  if (!milestones) {
    return NextResponse.json({ reason: "invalid_milestones" }, { status: 400 });
  }

  const { data: application } = await supabase
    .from("entrepreneur_applications")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle<{ id: string }>();

  if (!application) {
    return NextResponse.json({ reason: "no_application" }, { status: 404 });
  }

  const { error: deleteError } = await supabase
    .from("project_milestones")
    .delete()
    .eq("application_id", application.id);

  if (deleteError) {
    console.error("[platform/milestones] delete failed:", deleteError.message);
    return NextResponse.json({ reason: "save_failed" }, { status: 500 });
  }

  if (milestones.length > 0) {
    const { error: insertError } = await supabase.from("project_milestones").insert(
      milestones.map((milestone, index) => ({
        application_id: application.id,
        title: milestone.title,
        description: milestone.description,
        target_date: milestone.targetDate,
        release_percent: milestone.releasePercent,
        position: index,
      })),
    );

    if (insertError) {
      console.error("[platform/milestones] insert failed:", insertError.message);
      return NextResponse.json({ reason: "save_failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
