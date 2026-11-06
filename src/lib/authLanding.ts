/**
 * Remembers how the visitor arrived when the URL carried a Supabase auth
 * link. The invite email ("Accept the invite") and the password-reset email
 * land on the site with `#access_token=...&type=invite|recovery`; supabase-js
 * consumes and strips that hash as soon as it initialises, so it is read
 * here, at module load, before that happens, and kept in sessionStorage
 * until the visitor has set a password.
 */
export type AuthLanding = "invite" | "recovery" | "magiclink" | "signup";

const KEY = "llb:auth-landing";

function readFromUrl(): AuthLanding | null {
  if (typeof window === "undefined") return null;
  const source = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.search.slice(1);
  const type = new URLSearchParams(source).get("type");
  return type === "invite" || type === "recovery" || type === "magiclink" || type === "signup" ? type : null;
}

const fromUrl = readFromUrl();
if (fromUrl) {
  try {
    sessionStorage.setItem(KEY, fromUrl);
  } catch {
    // Storage can be unavailable in private windows; the metadata flag still works.
  }
}

/** The landing type recorded for this tab, if any. */
export function getAuthLanding(): AuthLanding | null {
  try {
    return (sessionStorage.getItem(KEY) as AuthLanding | null) ?? null;
  } catch {
    return fromUrl;
  }
}

export function clearAuthLanding() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // nothing to clear
  }
}
