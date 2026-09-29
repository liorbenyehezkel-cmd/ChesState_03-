import { redirect } from "next/navigation";
import type { ProjectStatus, PropertyTypeKey } from "@/lib/i18n/types";
import { createServerSupabase } from "@/lib/supabase/server";
import { sampleMilestones, sampleProject } from "./sample";
import type { Milestone, PlatformData, Project } from "./types";

type ApplicationRow = {
  id: string;
  email: string;
  project_name: string | null;
  description: string | null;
  property_type: PropertyTypeKey | null;
  funding_target_usd: number | null;
  total_value_usd: number | null;
  timeline_months: number | null;
  city: string | null;
  neighborhood: string | null;
  status: ProjectStatus | null;
  created_at: string;
};

type MilestoneRow = {
  id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  release_percent: number | string;
};

/**
 * Loads the signed-in entrepreneur's project. Redirects to the login page when
 * there is no session; falls back to sample content when Supabase has not been
 * configured, so the platform can still be reviewed during setup.
 */
export async function loadPlatformData(): Promise<PlatformData> {
  const supabase = createServerSupabase();

  if (!supabase) {
    return {
      project: sampleProject,
      milestones: sampleMilestones,
      isPreview: true,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrepreneurs/login");

  const { data: row } = await supabase
    .from("entrepreneur_applications")
    .select(
      "id, email, project_name, description, property_type, funding_target_usd, total_value_usd, timeline_months, city, neighborhood, status, created_at",
    )
    .eq("user_id", user.id)
    .maybeSingle<ApplicationRow>();

  // An account can exist without a row if the questionnaire insert ever failed;
  // treat that as an empty draft rather than an error page.
  const project: Project = row
    ? {
        id: row.id,
        email: row.email,
        projectName: row.project_name,
        description: row.description,
        propertyType: row.property_type,
        fundingTargetUsd: row.funding_target_usd,
        totalValueUsd: row.total_value_usd,
        timelineMonths: row.timeline_months,
        city: row.city,
        neighborhood: row.neighborhood,
        status: row.status ?? "draft",
        createdAt: row.created_at,
      }
    : {
        id: "",
        email: user.email ?? "",
        projectName: null,
        description: null,
        propertyType: null,
        fundingTargetUsd: null,
        totalValueUsd: null,
        timelineMonths: null,
        city: null,
        neighborhood: null,
        status: "draft",
        createdAt: new Date().toISOString(),
      };

  let milestones: Milestone[] = [];

  if (row) {
    const { data: milestoneRows } = await supabase
      .from("project_milestones")
      .select("id, title, description, target_date, release_percent")
      .eq("application_id", row.id)
      .order("position", { ascending: true })
      .returns<MilestoneRow[]>();

    milestones = (milestoneRows ?? []).map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      targetDate: m.target_date,
      releasePercent: Number(m.release_percent) || 0,
    }));
  }

  return { project, milestones, isPreview: false };
}
