-- LLB Course Platform — core schema
-- Handoff §3 (Data Model). Additive only: touches no existing objects.

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

-- Auto-provision a profile row whenever an auth user is created (including the
-- users the Stripe webhook provisions for signed-out purchasers).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  type text not null check (type in ('course', 'bundle', 'download')),
  price_cents integer not null check (price_cents >= 0),
  stripe_price_id text,
  active boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);

-- A bundle grants entitlements to the products listed here. Keeps the
-- webhook's fan-out data-driven instead of hard-coded.
create table if not exists public.bundle_items (
  bundle_product_id uuid not null references public.products (id) on delete cascade,
  child_product_id uuid not null references public.products (id) on delete cascade,
  primary key (bundle_product_id, child_product_id),
  constraint bundle_items_no_self_reference check (bundle_product_id <> child_product_id)
);

-- ---------------------------------------------------------------------------
-- courses / modules
-- ---------------------------------------------------------------------------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  slug text not null unique,
  title text not null,
  subtitle text,
  description text,
  trailer_url text,          -- public asset: safe to expose
  workbook_path text,        -- PRIVATE storage path: never exposed to anon
  created_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  sort integer not null default 0,
  title text not null,
  summary text,
  video_path text,           -- PRIVATE storage path
  audio_path text,           -- PRIVATE storage path
  duration_seconds integer,
  created_at timestamptz not null default now(),
  unique (course_id, sort)
);

create index if not exists modules_course_id_sort_idx on public.modules (course_id, sort);
create index if not exists courses_product_id_idx on public.courses (product_id);

-- ---------------------------------------------------------------------------
-- purchases / entitlements / progress
-- ---------------------------------------------------------------------------
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  email text,
  product_id uuid references public.products (id) on delete set null,
  stripe_session_id text not null unique,   -- idempotency key for the webhook
  stripe_payment_intent_id text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'refunded', 'failed')),
  amount_cents integer,
  currency text not null default 'usd',
  livemode boolean not null default false,  -- false while we are in Stripe TEST mode
  created_at timestamptz not null default now()
);

create index if not exists purchases_user_id_idx on public.purchases (user_id);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  source_purchase uuid references public.purchases (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index if not exists entitlements_user_id_idx on public.entitlements (user_id);

create table if not exists public.progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  module_id uuid not null references public.modules (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, module_id)
);

-- ---------------------------------------------------------------------------
-- leads (lead magnet — insert-only via edge function)
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- entitlement helper — used by RLS and by the media edge function
-- ---------------------------------------------------------------------------
-- SECURITY DEFINER so it can read entitlements without recursing through RLS.
create or replace function public.has_entitlement(p_user_id uuid, p_product_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.entitlements e
    where e.user_id = p_user_id and e.product_id = p_product_id
  );
$$;

create or replace function public.has_course_access(p_user_id uuid, p_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.courses c
    join public.entitlements e on e.product_id = c.product_id
    where c.id = p_course_id and e.user_id = p_user_id
  );
$$;
