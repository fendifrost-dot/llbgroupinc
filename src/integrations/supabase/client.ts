import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase browser client.
 *
 * The backend is provisioned by enabling Lovable Cloud on this project, which
 * injects these at build time. Until that happens the variables are absent —
 * so this module must never throw on import, or the nine approved marketing
 * pages would go down with it. Callers check `isBackendConfigured` (or let
 * `requireSupabase()` throw a message meant for a human) instead.
 */
const url =
  import.meta.env.VITE_SUPABASE_URL ??
  import.meta.env.VITE_SUPABASE_PROJECT_URL ??
  "";

const publishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "";

export const isBackendConfigured = Boolean(url && publishableKey);

export const supabase: SupabaseClient | null = isBackendConfigured
  ? createClient(url, publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
      },
    })
  : null;

export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      "The course backend is not connected yet. Enable Lovable Cloud on this project to provision it.",
    );
  }
  return supabase;
}

/**
 * Resolve a stored "bucket/key" path in the PUBLIC bucket to a URL.
 *
 * Only ever called with course-public paths (trailers, poster frames). Gated
 * media has no client-side URL by design — it goes through get-media-url.
 */
export function publicStorageUrl(storedPath: string | null | undefined): string | null {
  if (!storedPath || !url) return null;
  if (/^https?:\/\//i.test(storedPath)) return storedPath;
  if (!storedPath.startsWith("course-public/")) return null;
  return `${url.replace(/\/$/, "")}/storage/v1/object/public/${storedPath}`;
}

/** Invoke an edge function and unwrap its JSON, normalising the error shape. */
export async function callFunction<T>(
  name: string,
  body: Record<string, unknown>,
): Promise<T> {
  const client = requireSupabase();
  const { data, error } = await client.functions.invoke(name, { body });
  if (error) throw error;
  if (data && typeof data === "object" && "error" in data) {
    throw new Error(String((data as { error: unknown }).error));
  }
  return data as T;
}
