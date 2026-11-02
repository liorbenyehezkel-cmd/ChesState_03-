/**
 * The operator pages show registrants' contact details, so they sit behind
 * HTTP Basic Auth (any username, password = ADMIN_PASSWORD). With no password
 * configured they stay locked rather than open.
 *
 * Shared by the middleware (which guards the pages) and the admin server
 * actions (which re-check before changing data).
 */
export function isAdminAuthorization(header: string | null | undefined) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const value = header ?? "";
  if (!value.startsWith("Basic ")) return false;
  let decoded = "";
  try {
    // Browsers send Basic credentials as UTF-8 (the realm says charset="UTF-8"),
    // so decode the bytes properly; plain atob() breaks non-ASCII passwords.
    const binary = atob(value.slice(6));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return false;
  }
  const given = decoded.slice(decoded.indexOf(":") + 1);
  // Constant-time comparison so response timing does not leak the password.
  let diff = given.length ^ expected.length;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ (given.charCodeAt(i) || 0);
  }
  return diff === 0;
}
