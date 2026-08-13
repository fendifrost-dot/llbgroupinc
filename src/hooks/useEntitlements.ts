import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { callFunction, supabase } from "@/integrations/supabase/client";
import type { Entitlement, MediaKind, ProgressRow } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";

/**
 * Entitlement, progress, and gated-media reads.
 *
 * These are convenience reads for rendering — they are NOT the access control.
 * The real gate is server-side: RLS scopes these rows to the owner, and
 * get-media-url re-checks entitlement before it will sign anything. A user who
 * forged an entitlement in client state would still get a 403 from the media
 * function.
 */

export function useEntitlements() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["entitlements", user?.id],
    enabled: Boolean(user && supabase),
    queryFn: async (): Promise<Entitlement[]> => {
      if (!supabase || !user) return [];
      const { data, error } = await supabase
        .from("entitlements")
        .select("id, user_id, product_id, source_purchase, created_at");
      if (error) throw error;
      return (data as Entitlement[]) ?? [];
    },
  });
}

export function useHasEntitlement(productId: string | undefined) {
  const { data: entitlements, isLoading } = useEntitlements();
  return {
    isLoading,
    hasEntitlement: Boolean(
      productId && entitlements?.some((row) => row.product_id === productId),
    ),
  };
}

export function useProgress() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["progress", user?.id],
    enabled: Boolean(user && supabase),
    queryFn: async (): Promise<ProgressRow[]> => {
      if (!supabase || !user) return [];
      const { data, error } = await supabase
        .from("progress")
        .select("user_id, module_id, completed_at");
      if (error) throw error;
      return (data as ProgressRow[]) ?? [];
    },
  });
}

export function useToggleProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ moduleId, completed }: { moduleId: string; completed: boolean }) => {
      if (!supabase || !user) throw new Error("Not signed in");
      if (completed) {
        // ignoreDuplicates => ON CONFLICT DO NOTHING, which needs only INSERT.
        // A DO UPDATE upsert would require an UPDATE grant and an UPDATE
        // policy that progress deliberately does not have — and re-marking a
        // module complete is a no-op anyway.
        const { error } = await supabase
          .from("progress")
          .upsert(
            { user_id: user.id, module_id: moduleId },
            { onConflict: "user_id,module_id", ignoreDuplicates: true },
          );
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("progress")
          .delete()
          .eq("user_id", user.id)
          .eq("module_id", moduleId);
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["progress", user?.id] }),
  });
}

interface MediaRequest {
  kind: MediaKind;
  moduleId?: string;
  courseSlug?: string;
}

/**
 * Ask the edge function for a signed URL. Returns null when the asset simply
 * is not uploaded yet — the function answers 200 with a null url for that, so
 * it stays distinguishable from a 401/403, which still throws.
 */
export async function requestMediaUrl(request: MediaRequest): Promise<string | null> {
  const result = await callFunction<{ url: string | null }>("get-media-url", { ...request });
  return result?.url ?? null;
}

export function useMediaUrl(request: MediaRequest | null) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["media-url", request?.kind, request?.moduleId ?? request?.courseSlug, user?.id],
    enabled: Boolean(request && user && supabase),
    // Signed URLs live 30 minutes; refetch comfortably inside that window.
    staleTime: 20 * 60 * 1000,
    retry: false,
    queryFn: () => requestMediaUrl(request!),
  });
}
