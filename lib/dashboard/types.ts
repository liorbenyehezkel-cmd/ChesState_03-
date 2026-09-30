export type UserRole = "investor" | "entrepreneur";

export const ROLE_COOKIE = "chesstate_role";

export type KycStatus = "unverified" | "pending" | "verified" | "rejected";

export type CampaignStatus = "draft" | "live" | "funded" | "failed" | "refunding";

export type InvestmentStatus = "pending" | "locked" | "confirmed" | "refunded";

export type PaymentMethod = "card" | "apple_pay" | "bank";

export type Profile = {
  id: string;
  role: UserRole;
  countryCode: string | null;
  virtualBalanceUsd: number;
  kycStatus: KycStatus;
  email: string;
};

export type Project = {
  id: string;
  slug: string;
  image: string;
  title: string;
  summary: string;
  description: string;
  story: string;
  city: string;
  neighborhood: string;
  propertyType: string;
  targetAmount: number;
  currentAmount: number;
  minStakeUsd: number;
  expectedYield: number;
  status: CampaignStatus;
  endDate: string;
  investorCount: number;
  updates: ProjectUpdate[];
  yieldSeries: Array<{ year: string; estimate: number }>;
};

export type ProjectUpdate = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

export type Investment = {
  id: string;
  projectId: string;
  projectSlug: string;
  projectTitle: string;
  amountUsd: number;
  shareLabel: string;
  status: InvestmentStatus;
  createdAt: string;
};

export type ActivityItem = {
  id: string;
  label: string;
  detail: string;
  amountUsd?: number;
  at: string;
};

export type DashboardState = {
  profile: Profile;
  investments: Investment[];
  activity: ActivityItem[];
  payouts: Array<{ id: string; amountUsd: number; at: string; status: string }>;
};

export function fundingPercent(project: Project) {
  if (project.targetAmount <= 0) return 0;
  return Math.min(100, Math.round((project.currentAmount / project.targetAmount) * 100));
}

export function daysLeft(endDate: string) {
  const ms = new Date(endDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export function money(value: number, locale = "en") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function formatShortDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function investmentStatusLabel(status: InvestmentStatus) {
  switch (status) {
    case "pending":
      return "Pending · Smart Contract";
    case "locked":
      return "Locked in Contract";
    case "confirmed":
      return "Active";
    case "refunded":
      return "Refunded";
  }
}
