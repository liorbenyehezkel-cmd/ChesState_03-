export type SavedContact = {
  email: string;
  iso: string;
  dial: string;
  phone: string;
};

const KEY = "chesstate_contact";

export function saveContact(contact: SavedContact) {
  localStorage.setItem(KEY, JSON.stringify(contact));
}

export function loadContact(): SavedContact | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedContact;
    if (!parsed.iso || !parsed.dial) return null;
    return parsed;
  } catch {
    return null;
  }
}
