export const SITE_NAME = "ChesState";
export const SITE_URL = "https://chesstate.com";
export const SITE_HOST = "chesstate.com";

export function absoluteUrl(path = "/") {
  if (!path.startsWith("/")) return `${SITE_URL}/${path}`;
  return `${SITE_URL}${path}`;
}
