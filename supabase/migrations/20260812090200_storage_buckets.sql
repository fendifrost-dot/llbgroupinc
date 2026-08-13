-- LLB Course Platform — private storage buckets
-- Handoff §6.1: "All course media in private Supabase Storage buckets.
-- Playback via short-lived signed URLs issued by an edge function that checks
-- entitlement server-side. Never public URLs."

-- course-media : lesson video + audio (gated)
-- course-docs  : workbook PDFs, the e-book, the free chapter-1 sample (gated,
--                except the sample which is released by the lead-magnet function)
-- course-public: trailers + poster frames only (safe to serve publicly)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('course-media',  'course-media',  false, 5368709120, null),
  ('course-docs',   'course-docs',   false, 104857600,
     array['application/pdf', 'application/epub+zip']),
  ('course-public', 'course-public', true,  5368709120, null)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- Object-level policies
-- ---------------------------------------------------------------------------
-- storage.objects has RLS on by default in Supabase. We add NO policies for
-- anon/authenticated on the two private buckets, so every direct read fails —
-- including a signed-out user pasting an object URL, and a signed-in user
-- without an entitlement. Signed URLs are minted exclusively by the
-- get-media-url edge function, which runs with the service role after checking
-- public.has_course_access().

drop policy if exists "course_public_read" on storage.objects;
create policy "course_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'course-public');

-- Deliberately no policies for bucket_id in ('course-media','course-docs').
-- Uploads are performed by Fendi through the Lovable/Supabase storage UI or by
-- the service role; they are not a client-facing operation.
