-- LLB Course Platform — Row Level Security
-- Handoff §3 + §6. Non-negotiables enforced here:
--   * RLS enabled on EVERY table.
--   * Public catalog metadata is readable, but private storage paths
--     (workbook_path / video_path / audio_path) are NEVER reachable by anon
--     or authenticated roles — enforced with column-level GRANTs, not just views.
--   * purchases / entitlements / progress: owner-read only, and NO client write
--     path at all. Only the service role (edge functions) may write them.
--   * leads: no client access whatsoever; insert-only via edge function.

alter table public.profiles     enable row level security;
alter table public.products     enable row level security;
alter table public.bundle_items enable row level security;
alter table public.courses      enable row level security;
alter table public.modules      enable row level security;
alter table public.purchases    enable row level security;
alter table public.entitlements enable row level security;
alter table public.progress     enable row level security;
alter table public.leads        enable row level security;

-- ---------------------------------------------------------------------------
-- Column-level privilege lockdown
-- ---------------------------------------------------------------------------
-- Supabase grants ALL on public tables to anon/authenticated by default. Strip
-- that back so a private storage path cannot be selected even with a crafted
-- PostgREST query. RLS controls *rows*; this controls *columns*.
revoke all on public.products     from anon, authenticated;
revoke all on public.bundle_items from anon, authenticated;
revoke all on public.courses      from anon, authenticated;
revoke all on public.modules      from anon, authenticated;
revoke all on public.purchases    from anon, authenticated;
revoke all on public.entitlements from anon, authenticated;
revoke all on public.progress     from anon, authenticated;
revoke all on public.leads        from anon, authenticated;
revoke all on public.profiles     from anon, authenticated;

grant select (id, slug, title, subtitle, type, price_cents, active, sort)
  on public.products to anon, authenticated;
-- NOTE: stripe_price_id is deliberately withheld. The client never names a
-- price; create-checkout resolves it server-side from the product slug.

grant select (bundle_product_id, child_product_id)
  on public.bundle_items to anon, authenticated;

grant select (id, product_id, slug, title, subtitle, description, trailer_url)
  on public.courses to anon, authenticated;
-- workbook_path withheld.

grant select (id, course_id, sort, title, summary, duration_seconds)
  on public.modules to anon, authenticated;
-- video_path / audio_path withheld.

grant select (id, user_id, product_id, status, amount_cents, currency, created_at)
  on public.purchases to authenticated;
grant select (id, user_id, product_id, source_purchase, created_at)
  on public.entitlements to authenticated;
-- DELETE takes no column list in Postgres, so it is granted separately.
grant select (user_id, module_id, completed_at),
      insert (user_id, module_id, completed_at)
  on public.progress to authenticated;
grant delete on public.progress to authenticated;
grant select (id, full_name, created_at) on public.profiles to authenticated;
grant update (full_name) on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- profiles — owner only
-- ---------------------------------------------------------------------------
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Catalog metadata — public read of active rows
-- ---------------------------------------------------------------------------
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select to anon, authenticated using (active = true);

drop policy if exists "bundle_items_public_read" on public.bundle_items;
create policy "bundle_items_public_read" on public.bundle_items
  for select to anon, authenticated using (true);

drop policy if exists "courses_public_read" on public.courses;
create policy "courses_public_read" on public.courses
  for select to anon, authenticated using (
    exists (select 1 from public.products p where p.id = courses.product_id and p.active = true)
  );

drop policy if exists "modules_public_read" on public.modules;
create policy "modules_public_read" on public.modules
  for select to anon, authenticated using (
    exists (
      select 1 from public.courses c
      join public.products p on p.id = c.product_id
      where c.id = modules.course_id and p.active = true
    )
  );

-- No INSERT/UPDATE/DELETE policies on catalog tables: content is managed by
-- migrations / the service role only.

-- ---------------------------------------------------------------------------
-- purchases / entitlements — owner read, service-role write only
-- ---------------------------------------------------------------------------
drop policy if exists "purchases_select_own" on public.purchases;
create policy "purchases_select_own" on public.purchases
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "entitlements_select_own" on public.entitlements;
create policy "entitlements_select_own" on public.entitlements
  for select to authenticated using (auth.uid() = user_id);

-- Intentionally absent: any INSERT/UPDATE/DELETE policy. Handoff §6.3 —
-- "no entitlement writes from the client, ever." The Stripe webhook writes
-- these with the service role, which bypasses RLS.

-- ---------------------------------------------------------------------------
-- progress — owner read/write, but only for modules they are entitled to
-- ---------------------------------------------------------------------------
drop policy if exists "progress_select_own" on public.progress;
create policy "progress_select_own" on public.progress
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "progress_insert_own" on public.progress;
create policy "progress_insert_own" on public.progress
  for insert to authenticated with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.modules m
      where m.id = progress.module_id
        and public.has_course_access(auth.uid(), m.course_id)
    )
  );

drop policy if exists "progress_delete_own" on public.progress;
create policy "progress_delete_own" on public.progress
  for delete to authenticated using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- leads — completely closed to clients (edge function uses service role)
-- ---------------------------------------------------------------------------
-- RLS enabled with zero policies => anon and authenticated can do nothing.

-- ---------------------------------------------------------------------------
-- Catalog views
-- ---------------------------------------------------------------------------
-- Convenience shapes for the client. security_invoker = true so they run with
-- the caller's privileges (RLS + the column grants above still apply) and do
-- NOT trip Supabase's "SECURITY DEFINER view" advisor.
create or replace view public.catalog_products
with (security_invoker = true) as
  select id, slug, title, subtitle, type, price_cents, sort
  from public.products
  where active = true;

create or replace view public.catalog_courses
with (security_invoker = true) as
  select c.id, c.product_id, c.slug, c.title, c.subtitle, c.description, c.trailer_url,
         p.slug as product_slug, p.price_cents, p.type as product_type
  from public.courses c
  join public.products p on p.id = c.product_id
  where p.active = true;

create or replace view public.catalog_modules
with (security_invoker = true) as
  select m.id, m.course_id, m.sort, m.title, m.summary, m.duration_seconds
  from public.modules m;

grant select on public.catalog_products to anon, authenticated;
grant select on public.catalog_courses  to anon, authenticated;
grant select on public.catalog_modules  to anon, authenticated;
