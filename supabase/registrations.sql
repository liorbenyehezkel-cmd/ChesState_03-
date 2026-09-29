-- ChesState → public.registrations
-- Safe to re-run. Does not UPDATE or DELETE existing rows.
-- Anon/publishable key: INSERT only.
-- Admin reads: service_role on the Next.js server (bypasses RLS). Never in the browser.

-- Extra fields the site sends. Existing columns stay as they are:
-- id, created_at, email, phone, country, try_to_make_a_purchase, purchase_amount
alter table public.registrations
  add column if not exists source text,
  add column if not exists locale text,
  add column if not exists project_title text,
  add column if not exists message text;

alter table public.registrations enable row level security;

-- Remove previous open policies (data is not touched).
do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'registrations'
  loop
    execute format('drop policy if exists %I on public.registrations', pol.policyname);
  end loop;
end $$;

revoke all on table public.registrations from anon, authenticated, public;
grant insert on table public.registrations to anon;

-- Public site may add a row. It may not read, update, or delete.
create policy "anon can insert registrations"
  on public.registrations
  for insert
  to anon
  with check (
    email is not null
    and char_length(email) between 3 and 320
  );
