import type { PropertyTypeKey, ProjectStatus } from "@/lib/i18n/types";

export type Project = {
  id: string;
  email: string;
  projectName: string | null;
  description: string | null;
  propertyType: PropertyTypeKey | null;
  fundingTargetUsd: number | null;
  totalValueUsd: number | null;
  timelineMonths: number | null;
  city: string | null;
  neighborhood: string | null;
  status: ProjectStatus;
  createdAt: string;
};

export type Milestone = {
  id: string;
  title: string;
  description: string | null;
  targetDate: string | null;
  releasePercent: number;
};

export type PlatformData = {
  project: Project;
  milestones: Milestone[];
  /** True when Supabase is absent and the page is showing sample content. */
  isPreview: boolean;
};

export function readinessOf(project: Project, milestones: Milestone[]) {
  return {
    name: Boolean(project.projectName?.trim()),
    propertyType: project.propertyType !== null,
    funding: project.fundingTargetUsd !== null,
    location: Boolean(project.city),
    description: Boolean(project.description?.trim()),
    milestones: milestones.length >= 2,
  };
}

export function allocatedPercent(milestones: Milestone[]) {
  return milestones.reduce((total, m) => total + (m.releasePercent || 0), 0);
}
