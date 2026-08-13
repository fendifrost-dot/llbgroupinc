-- Helper used only by the Stripe webhook to resolve an existing account from
-- the email Stripe Checkout collected. SECURITY DEFINER because auth.users is
-- not readable by the API roles — and it stays that way: execute is revoked
-- from anon and authenticated so this cannot be used as an email oracle.

create or replace function public.user_id_for_email(p_email text)
returns uuid
language sql
stable
security definer
set search_path = auth, public
as $$
  select id from auth.users where lower(email) = lower(p_email) limit 1;
$$;

revoke all on function public.user_id_for_email(text) from public, anon, authenticated;
grant execute on function public.user_id_for_email(text) to service_role;

-- Same reasoning for the entitlement helpers: `authenticated` needs EXECUTE
-- because the progress INSERT policy calls has_course_access() as the invoking
-- role, but anon has no business probing who owns what.
revoke all on function public.has_entitlement(uuid, uuid) from public, anon;
revoke all on function public.has_course_access(uuid, uuid) from public, anon;
grant execute on function public.has_entitlement(uuid, uuid) to authenticated, service_role;
grant execute on function public.has_course_access(uuid, uuid) to authenticated, service_role;
