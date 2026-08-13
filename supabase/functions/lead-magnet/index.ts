// lead-magnet — Handoff §4.7
//
// "Read Chapter 1 free": capture the email into leads, hand back a short-lived
// signed URL for the chapter-1 PDF. leads is closed to clients by RLS, so this
// function (service role) is the only insert path. No marketing automation —
// export is manual for now.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders, fail, json } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const CHAPTER_ONE_PATH = "course-docs/samples/LLB_EBOOK_CHAPTER_1_v1.pdf";
const SIGNED_URL_TTL_SECONDS = 900; // 15 minutes.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { email, source } = await req.json();
    if (typeof email !== "string" || !EMAIL_RE.test(email.trim()) || email.length > 254) {
      return json({ error: "A valid email address is required." }, 400);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // Upsert, not insert: a repeat visitor should get the chapter, not an error.
    const { error: leadError } = await admin
      .from("leads")
      .upsert(
        {
          email: email.trim().toLowerCase(),
          source: typeof source === "string" ? source.slice(0, 120) : "unknown",
        },
        { onConflict: "email", ignoreDuplicates: true },
      );
    if (leadError) throw leadError;

    const slash = CHAPTER_ONE_PATH.indexOf("/");
    const { data: signed, error: signError } = await admin.storage
      .from(CHAPTER_ONE_PATH.slice(0, slash))
      .createSignedUrl(CHAPTER_ONE_PATH.slice(slash + 1), SIGNED_URL_TTL_SECONDS);

    if (signError || !signed) {
      // The lead is captured either way — that is the part that matters.
      console.warn("[lead-magnet] chapter PDF not uploaded yet", signError);
      return json({ captured: true, url: null, code: "no_asset" });
    }

    return json({ captured: true, url: signed.signedUrl });
  } catch (error) {
    return fail("lead-magnet", error);
  }
});
