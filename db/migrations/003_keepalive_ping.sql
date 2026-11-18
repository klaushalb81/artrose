-- 003: a harmless Data API endpoint for the daily keep-alive job.
--
-- Supabase pauses free projects without "API" activity. We switch the Data API on,
-- but make sure the API roles (anon, authenticated) can reach NOTHING except this
-- one function, which only returns the current time.

-- 1. Close the real tables to the Data API roles (RLS with no policies also blocks them).
revoke all on table public.videos, public.purchases, public.video_package from anon, authenticated;

-- 2. Don't expose anything created in the future automatically.
alter default privileges in schema public revoke all on tables    from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
alter default privileges in schema public revoke all on functions from anon, authenticated, public;

-- 3. The ping.
create or replace function public.keepalive_ping()
returns timestamptz
language sql
stable
security invoker
set search_path = ''
as $$ select now() $$;

revoke all on function public.keepalive_ping() from public, anon, authenticated;
grant execute on function public.keepalive_ping() to anon;
