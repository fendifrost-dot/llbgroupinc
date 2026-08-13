// get-media-url — Handoff §6.1
//
// The only way to reach gated course media. Verifies the caller's session,
// checks entitlement SERVER-SIDE, then mints a short-lived signed URL. The
// private storage paths never leave this function — the client asks for a
// module id and an asset kind, nothing more.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders, fail, json } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

const SIGNED_URL_TTL_SECONDS = 1800; // 30 minutes — long enough for a lesson.

/** Stored paths are "bucket/object/key.mp4". */
function splitPath(stored: string): { bucket: string; key: string } | null {
  const slash = stored.indexOf("/");
  if (slash <= 0 || slash === stored.length - 1) return null;
  return { bucket: stored.slice(0, slash), key: stored.slice(slash + 1) };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const scoped = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });
    const { data: userData, error: userError } = await scoped.auth.getUser();
    if (userError || !userData.user) return json({ error: "Unauthorized" }, 401);
    const userId = userData.user.id;

    const { moduleId, courseSlug, kind } = await req.json();
    if (!["video", "audio", "workbook", "ebook"].includes(kind)) {
      return json({ error: "kind must be video, audio, workbook or ebook" }, 400);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    let storedPath: string | null = null;

    if (kind === "ebook") {
      const { data: product } = await admin
        .from("products")
        .select("id")
        .eq("slug", "ebook-7-principles")
        .maybeSingle();
      if (!product) return json({ error: "Not found" }, 404);

      const { data: allowed } = await admin.rpc("has_entitlement", {
        p_user_id: userId,
        p_product_id: product.id,
      });
      if (!allowed) return json({ error: "Forbidden" }, 403);

      storedPath = "course-docs/ebook/LLB_EBOOK_7_PRINCIPLES_v1.pdf";
    } else if (kind === "workbook") {
      if (typeof courseSlug !== "string") return json({ error: "courseSlug required" }, 400);
      const { data: course } = await admin
        .from("courses")
        .select("id, workbook_path")
        .eq("slug", courseSlug)
        .maybeSingle();
      if (!course) return json({ error: "Not found" }, 404);

      const { data: allowed } = await admin.rpc("has_course_access", {
        p_user_id: userId,
        p_course_id: course.id,
      });
      if (!allowed) return json({ error: "Forbidden" }, 403);

      storedPath = course.workbook_path;
    } else {
      if (typeof moduleId !== "string") return json({ error: "moduleId required" }, 400);
      const { data: module } = await admin
        .from("modules")
        .select("id, course_id, video_path, audio_path")
        .eq("id", moduleId)
        .maybeSingle();
      if (!module) return json({ error: "Not found" }, 404);

      const { data: allowed } = await admin.rpc("has_course_access", {
        p_user_id: userId,
        p_course_id: module.course_id,
      });
      if (!allowed) return json({ error: "Forbidden" }, 403);

      storedPath = kind === "video" ? module.video_path : module.audio_path;
    }

    if (!storedPath) return json({ error: "Asset not available yet", code: "no_asset" }, 404);

    const parts = splitPath(storedPath);
    if (!parts) throw new Error(`malformed storage path: ${storedPath}`);

    const { data: signed, error: signError } = await admin.storage
      .from(parts.bucket)
      .createSignedUrl(parts.key, SIGNED_URL_TTL_SECONDS);

    // Before the video pipeline delivers, the object genuinely does not exist.
    // Say so plainly rather than surfacing a storage error.
    if (signError || !signed) {
      console.warn(`[get-media-url] no object at ${storedPath}`, signError);
      return json({ error: "Asset not available yet", code: "no_asset" }, 404);
    }

    return json({ url: signed.signedUrl, expiresIn: SIGNED_URL_TTL_SECONDS });
  } catch (error) {
    return fail("get-media-url", error);
  }
});
