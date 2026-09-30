"use client";

import { catalog } from "./projects";
import type {
  ActivityItem,
  DashboardState,
  Investment,
  PaymentMethod,
  UserRole,
} from "./types";
import { ROLE_COOKIE } from "./types";

const STORAGE_KEY = "chesstate_dashboard_v3";

function seed(role: UserRole): DashboardState {
  return {
    profile: {
      id: "preview-user",
      role,
      countryCode: "AE",
      virtualBalanceUsd: 0,
      kycStatus: "pending",
      email: role === "entrepreneur" ? "founder@example.com" : "you@example.com",
    },
    investments: [],
    activity: [],
    payouts: [],
  };
}

function readRaw(): DashboardState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DashboardState) : null;
  } catch {
    return null;
  }
}

export function loadDashboard(role: UserRole): DashboardState {
  const existing = readRaw();
  if (!existing) {
    const created = seed(role);
    persist(created);
    return created;
  }
  if (existing.profile.role !== role) {
    existing.profile.role = role;
    persist(existing);
  }
  return existing;
}

function persist(state: DashboardState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function recordInvestment(input: {
  projectId: string;
  amountUsd: number;
  shareLabel: string;
  method: PaymentMethod;
}) {
  const state = readRaw() ?? seed("investor");
  const project = catalog.find((item) => item.id === input.projectId);
  if (!project) throw new Error("Unknown project");
  if (!Number.isFinite(input.amountUsd) || input.amountUsd <= 0) {
    throw new Error("Amount");
  }

  const investment: Investment = {
    id: `inv_${Date.now().toString(36)}`,
    projectId: project.id,
    projectSlug: project.slug,
    projectTitle: project.title,
    amountUsd: input.amountUsd,
    shareLabel: input.shareLabel,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const activity: ActivityItem = {
    id: `act_${Date.now().toString(36)}`,
    label: "Investment request",
    detail: `${project.title} · ${methodLabel(input.method)} · waiting on UAE authorisation`,
    amountUsd: input.amountUsd,
    at: investment.createdAt,
  };

  state.investments.unshift(investment);
  state.activity.unshift(activity);
  persist(state);
  return state;
}

export function addFunds(amountUsd: number, method: PaymentMethod) {
  const state = readRaw() ?? seed("investor");
  state.profile.virtualBalanceUsd = roundMoney(
    state.profile.virtualBalanceUsd + amountUsd,
  );
  state.activity.unshift({
    id: `act_${Date.now().toString(36)}`,
    label: "Added funds",
    detail: method === "apple_pay" ? "Apple Pay" : method === "bank" ? "Bank transfer" : "Card",
    amountUsd,
    at: new Date().toISOString(),
  });
  persist(state);
  return state;
}

export function recordPayout(amountUsd: number, reference: string) {
  const state = readRaw() ?? seed("entrepreneur");
  const at = new Date().toISOString();
  state.payouts.unshift({
    id: reference,
    amountUsd,
    at,
    status: "initiated",
  });
  state.activity.unshift({
    id: `act_${Date.now().toString(36)}`,
    label: "Payout requested",
    detail: "Transfer to the business account has been initiated",
    amountUsd,
    at,
  });
  persist(state);
  return state;
}

export function submitKyc(fields: {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  idType: string;
  idNumber: string;
}) {
  const state = readRaw() ?? seed("investor");
  state.profile.kycStatus = "pending";
  state.activity.unshift({
    id: `act_${Date.now().toString(36)}`,
    label: "Identity verification submitted",
    detail: `${fields.idType} · pending review`,
    at: new Date().toISOString(),
  });
  persist(state);
  return state;
}

export function setRoleCookie(role: UserRole) {
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

function methodLabel(method: PaymentMethod) {
  if (method === "apple_pay") return "Apple Pay";
  if (method === "bank") return "Bank transfer";
  return "Card";
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}
