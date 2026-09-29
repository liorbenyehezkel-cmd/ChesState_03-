-- ChesState schema.
--
-- Investors and entrepreneurs are deliberately kept in two separate tables with
-- no foreign key between them:
--
--   investor_waitlist          — email only, no account, no login. Written by the
--                                server via the service role; never readable by
--                                the public.
--   entrepreneur_applications  — tied to a real auth.users account, holds the
--                                project questionnaire. Each entrepreneur can
--                                only ever read or edit their own row.
--
-- An address appearing in one table says nothing about the other; the same
-- person signing up as both would produce two unrelated records.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Investors
-- ---------------------------------------------------------------------------

create table if not exists public.investor_waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  locale     text not null default 'en',
  phone      text,
  country    text,
  source     text,
  created_at timestamptz not null default now()
);

alter table public.investor_waitlist enable row level security;

-- No policies on purpose: with RLS on and nothing granted, only the service
-- role key (used server-side in /api/waitlist) can read or write this table.

-- ---------------------------------------------------------------------------
-- Entrepreneurs
-- ---------------------------------------------------------------------------

create table if not exists public.entrepreneur_applications (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null unique references auth.users (id) on delete cascade,
  email              text not null unique,

  -- Every questionnaire field is optional by design; only the account itself
  -- (email + password, held in auth.users) is required.
  property_type      text,
  funding_target_usd bigint,
  city               text,
  neighborhood       text,

  locale             text not null default 'en',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  constraint funding_target_non_negative
    check (funding_target_usd is null or funding_target_usd >= 0),
  constraint property_type_known
    check (property_type is null or property_type in (
      'residential_apartment',
      'residential_building',
      'villa',
      'office',
      'retail',
      'hospitality',
      'industrial_logistics',
      'mixed_use',
      'land',
      'other'
    ))
);

alter table public.entrepreneur_applications enable row level security;

drop policy if exists "entrepreneurs read own application"
  on public.entrepreneur_applications;
create policy "entrepreneurs read own application"
  on public.entrepreneur_applications
  for select
  using (auth.uid() = user_id);

drop policy if exists "entrepreneurs update own application"
  on public.entrepreneur_applications;
create policy "entrepreneurs update own application"
  on public.entrepreneur_applications
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Inserts go through the server using the service role, so no insert policy is
-- granted to authenticated users.

create index if not exists entrepreneur_applications_user_id_idx
  on public.entrepreneur_applications (user_id);

-- ---------------------------------------------------------------------------
-- Platform fields
--
-- The signup questionnaire captures the minimum; the rest is filled in later
-- from the platform, so every column here is nullable.
-- ---------------------------------------------------------------------------

alter table public.entrepreneur_applications
  add column if not exists project_name    text,
  add column if not exists description     text,
  add column if not exists total_value_usd bigint,
  add column if not exists timeline_months integer,
  add column if not exists status          text not null default 'draft';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'entrepreneur_application_status_known'
  ) then
    alter table public.entrepreneur_applications
      add constraint entrepreneur_application_status_known
      check (status in ('draft', 'in_review', 'approved', 'live'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'total_value_non_negative'
  ) then
    alter table public.entrepreneur_applications
      add constraint total_value_non_negative
      check (total_value_usd is null or total_value_usd >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'timeline_months_sane'
  ) then
    alter table public.entrepreneur_applications
      add constraint timeline_months_sane
      check (timeline_months is null or (timeline_months > 0 and timeline_months <= 600));
  end if;
end $$;

-- Entrepreneurs own the draft, so they may insert their row from the platform
-- as well as update it.
drop policy if exists "entrepreneurs insert own application"
  on public.entrepreneur_applications;
create policy "entrepreneurs insert own application"
  on public.entrepreneur_applications
  for insert
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Milestones
--
-- Escrow releases a slice of the raise as each milestone is met, which is the
-- protection described to investors in the FAQ.
-- ---------------------------------------------------------------------------

create table if not exists public.project_milestones (
  id              uuid primary key default gen_random_uuid(),
  application_id  uuid not null references public.entrepreneur_applications (id) on delete cascade,
  title           text not null,
  description     text,
  target_date     date,
  release_percent numeric(5, 2) not null default 0,
  position        integer not null default 0,
  created_at      timestamptz not null default now(),

  constraint release_percent_in_range
    check (release_percent >= 0 and release_percent <= 100)
);

alter table public.project_milestones enable row level security;

create index if not exists project_milestones_application_id_idx
  on public.project_milestones (application_id, position);

-- Access follows the parent application: you reach a milestone only through an
-- application row you already own.
drop policy if exists "entrepreneurs manage own milestones"
  on public.project_milestones;
create policy "entrepreneurs manage own milestones"
  on public.project_milestones
  for all
  using (
    exists (
      select 1 from public.entrepreneur_applications a
      where a.id = application_id and a.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.entrepreneur_applications a
      where a.id = application_id and a.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists entrepreneur_applications_touch_updated_at
  on public.entrepreneur_applications;
create trigger entrepreneur_applications_touch_updated_at
  before update on public.entrepreneur_applications
  for each row execute function public.touch_updated_at();
