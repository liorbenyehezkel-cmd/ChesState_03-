export type AccountProfile = {
  name: string;
  visibility: "public" | "private";
  avatarId: string;
  photo: string | null;
};

export const ACCOUNT_KEY = "chesstate_account";

export const avatarPresets = [
  { id: "palm", label: "Palm", from: "#1F6E5A", to: "#0B1D33" },
  { id: "sand", label: "Sand", from: "#C4A574", to: "#5C4632" },
  { id: "marina", label: "Marina", from: "#7BA3C9", to: "#0B1D33" },
  { id: "dusk", label: "Dusk", from: "#8C5A7A", to: "#1A1020" },
  { id: "citrus", label: "Citrus", from: "#D7A441", to: "#6B4A12" },
  { id: "ink", label: "Ink", from: "#F8F6F0", to: "#8A867C" },
] as const;

export const defaultAccount: AccountProfile = {
  name: "You",
  visibility: "public",
  avatarId: "flag",
  photo: null,
};

export function loadAccount(): AccountProfile {
  if (typeof window === "undefined") return defaultAccount;
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    if (!raw) return defaultAccount;
    return { ...defaultAccount, ...(JSON.parse(raw) as AccountProfile) };
  } catch {
    return defaultAccount;
  }
}

export function saveAccount(profile: AccountProfile) {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(profile));
}

export function usernameOf(profile: Pick<AccountProfile, "name">) {
  const value = profile.name.trim();
  return value || "You";
}

export function investorLevel(totalUsd: number) {
  if (!Number.isFinite(totalUsd) || totalUsd <= 0) return 0;
  return Math.min(100, Math.floor(totalUsd));
}
