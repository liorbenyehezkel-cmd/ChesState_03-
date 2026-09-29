const KEY = "chesstate_attribution";

export type Attribution = {
  source: string;
  medium: string | null;
  campaign: string | null;
  referrer: string | null;
  capturedAt: string;
};

const HOST_TO_SOURCE: Array<[RegExp, string]> = [
  [/linkedin\.com|lnkd\.in/i, "LinkedIn"],
  [/instagram\.com/i, "Instagram"],
  [/facebook\.com|fb\.com|fb\.me/i, "Facebook"],
  [/tiktok\.com/i, "TikTok"],
  [/youtube\.com|youtu\.be/i, "YouTube"],
  [/twitter\.com|x\.com|t\.co/i, "X"],
  [/whatsapp\.com|wa\.me/i, "WhatsApp"],
  [/telegram\.org|t\.me/i, "Telegram"],
  [/google\./i, "Google"],
];

function titleCase(value: string) {
  if (!value) return "Direct";
  const known: Record<string, string> = {
    linkedin: "LinkedIn",
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
    youtube: "YouTube",
    twitter: "X",
    x: "X",
    google: "Google",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
  };
  const lower = value.trim().toLowerCase();
  return known[lower] ?? value.trim();
}

function sourceFromHost(host: string | null) {
  if (!host) return null;
  const match = HOST_TO_SOURCE.find(([pattern]) => pattern.test(host));
  return match ? match[1] : host.replace(/^www\./, "");
}

export function captureAttribution(): Attribution {
  const existing = readAttribution();
  if (existing) return existing;

  const params = new URLSearchParams(window.location.search);
  const utm = params.get("utm_source") ?? params.get("ref") ?? params.get("source");
  let referrerHost: string | null = null;
  try {
    referrerHost = document.referrer ? new URL(document.referrer).hostname : null;
  } catch {
    referrerHost = null;
  }

  const source = utm
    ? titleCase(utm)
    : sourceFromHost(referrerHost) ?? "Direct";

  const value: Attribution = {
    source,
    medium: params.get("utm_medium"),
    campaign: params.get("utm_campaign"),
    referrer: referrerHost,
    capturedAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(value));
  return value;
}

export function readAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

const LOCAL_EVENTS_KEY = "chesstate_platform_events";

export type LocalPlatformEvent = {
  type: string;
  email?: string | null;
  detail?: Record<string, unknown>;
  at: string;
};

export function recordLocalEvent(event: Omit<LocalPlatformEvent, "at">) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    const list = raw ? (JSON.parse(raw) as LocalPlatformEvent[]) : [];
    list.unshift({ ...event, at: new Date().toISOString() });
    localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(list.slice(0, 300)));
  } catch {
    /* ignore quota */
  }
}

export function readLocalEvents(): LocalPlatformEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    return raw ? (JSON.parse(raw) as LocalPlatformEvent[]) : [];
  } catch {
    return [];
  }
}
