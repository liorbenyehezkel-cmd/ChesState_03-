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
    decoded = atob(value.slice(6));
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
