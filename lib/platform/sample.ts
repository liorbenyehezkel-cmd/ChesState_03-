import type { Milestone, Project } from "./types";

/**
 * Stand-in content for preview mode, shown only when Supabase is not
 * configured. It mirrors the illustrative card on the landing page so the two
 * read as the same product.
 */
export const sampleProject: Project = {
  id: "sample",
  email: "founder@example.com",
  projectName: "Marina District Residences",
  description:
    "A 48-unit residential block two streets back from the marina, bought at shell stage and finished for long-let tenancy. Income comes from rent once the building is handed over.",
  propertyType: "residential_building",
  fundingTargetUsd: 4_200_000,
  totalValueUsd: 11_500_000,
  timelineMonths: 24,
  city: "Dubai",
  neighborhood: "Dubai Marina",
  status: "draft",
  createdAt: new Date().toISOString(),
};

export const sampleMilestones: Milestone[] = [
  {
    id: "sample-1",
    title: "Purchase completed",
    description: "Title transferred and registered with the land department.",
    targetDate: null,
    releasePercent: 40,
  },
  {
    id: "sample-2",
    title: "Structural works signed off",
    description: "Engineer's certificate and a dated site survey.",
    targetDate: null,
    releasePercent: 35,
  },
  {
    id: "sample-3",
    title: "Handover and first tenancy",
    description: "Completion certificate and the first signed lease.",
    targetDate: null,
    releasePercent: 25,
  },
];
