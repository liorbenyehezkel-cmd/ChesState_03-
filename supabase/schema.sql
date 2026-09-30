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

-- ---------------------------------------------------------------------------
-- Registrations + messages (with sample data)
--
-- public.registrations is the site's signup log (see registrations.sql for its
-- RLS / grants). Created here only if missing, so re-running is safe.
-- ---------------------------------------------------------------------------

create table if not exists public.registrations (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz not null default now(),
  email                  text not null,
  phone                  text,
  country                text,
  source                 text,      -- referral: LinkedIn, Instagram, Google, Direct, ...
  locale                 text,
  try_to_make_a_purchase boolean not null default false,
  purchase_amount        numeric(14, 2),
  purchase_currency      text,      -- 'USDC' or a fiat code such as 'USD', 'ILS', 'EUR'
  project_title          text,
  message                text,

  constraint purchase_amount_non_negative
    check (purchase_amount is null or purchase_amount >= 0)
);

alter table public.registrations
  add column if not exists source text,
  add column if not exists locale text,
  add column if not exists project_title text,
  add column if not exists message text,
  add column if not exists purchase_currency text;

create unique index if not exists registrations_email_lower_idx
  on public.registrations (lower(email));

-- Entrepreneur submission requests and customer-service texts. Service-role
-- only: RLS on with no policies.
create table if not exists public.registration_messages (
  id              uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations (id) on delete cascade,
  kind            text not null check (kind in ('entrepreneur_submission', 'customer_service')),
  body            text not null,
  created_at      timestamptz not null default now()
);

alter table public.registration_messages enable row level security;

create index if not exists registration_messages_registration_id_idx
  on public.registration_messages (registration_id, created_at);

-- Sample data: 10 registrations. Safe to re-run (skips existing emails).
insert into public.registrations
  (created_at, email, phone, country, source, locale, try_to_make_a_purchase, purchase_amount, purchase_currency, project_title)
select v.created_at::timestamptz, v.email, v.phone, v.country, v.source, v.locale, v.intent, v.amount, v.currency, v.project_title
from (values
  ('2026-08-01 09:14+00', 'dana.levi@example.com',     '+972-52-555-0101', 'Israel',         'LinkedIn',  'he', true,  25000.00, 'USDC', null),
  ('2026-08-03 13:40+00', 'mark.owens@example.com',    '+1-415-555-0102',  'United States',  'Google',    'en', true,  50000.00, 'USD',  null),
  ('2026-08-05 18:22+00', 'sofia.rossi@example.com',   '+39-333-555-0103', 'Italy',          'Instagram', 'en', false, null,     null,   null),
  ('2026-08-09 07:55+00', 'yossi.cohen@example.com',   '+972-54-555-0104', 'Israel',         'Direct',    'he', true,  10000.00, 'ILS',  null),
  ('2026-08-12 21:03+00', 'amelie.durand@example.com', '+33-6-55-55-0105', 'France',         'LinkedIn',  'en', true,  15000.00, 'EUR',  null),
  ('2026-08-15 11:30+00', 'omar.haddad@example.com',   '+971-50-555-0106', 'UAE',            'Google',    'en', true,  100000.00,'USDC', null),
  ('2026-08-19 16:45+00', 'lena.fischer@example.com',  '+49-151-555-0107', 'Germany',        'Instagram', 'en', false, null,     null,   'Boutique hotel in Tel Aviv'),
  ('2026-08-23 08:10+00', 'noam.baron@example.com',    '+972-50-555-0108', 'Israel',         'Direct',    'he', false, null,     null,   'Residential building, Haifa'),
  ('2026-09-02 19:27+00', 'priya.nair@example.com',    '+44-7700-555-0109','United Kingdom', 'LinkedIn',  'en', true,  5000.00,  'USDC', null),
  ('2026-09-10 12:05+00', 'carlos.mendez@example.com', '+34-612-555-0110', 'Spain',          'Google',    'en', true,  20000.00, 'USD',  null)
) as v(created_at, email, phone, country, source, locale, intent, amount, currency, project_title)
where not exists (
  select 1 from public.registrations r where lower(r.email) = lower(v.email)
);

-- Sample messages: entrepreneur submissions and customer-service texts.
insert into public.registration_messages (registration_id, kind, body, created_at)
select r.id, m.kind, m.body, m.created_at::timestamptz
from (values
  ('lena.fischer@example.com', 'entrepreneur_submission',
   'We are raising $2M to renovate a 24-room boutique hotel in Tel Aviv. Permits are approved; happy to share the full plan.', '2026-08-19 16:50+00'),
  ('noam.baron@example.com', 'entrepreneur_submission',
   'Six-storey residential building in Haifa, 18 units, construction starts Q4. Looking to tokenize 40% of the equity.', '2026-08-23 08:15+00'),
  ('dana.levi@example.com', 'customer_service',
   'Hi, how do I fund my purchase with USDC? Which network should I send it on?', '2026-08-01 09:30+00'),
  ('mark.owens@example.com', 'customer_service',
   'Do I need to complete KYC before I can wire USD?', '2026-08-03 14:05+00'),
  ('omar.haddad@example.com', 'customer_service',
   'I would like to discuss a larger allocation. Can someone call me?', '2026-08-15 11:45+00'),
  ('priya.nair@example.com', 'customer_service',
   'Is there a minimum purchase amount for the first project?', '2026-09-02 19:40+00')
) as m(email, kind, body, created_at)
join public.registrations r on lower(r.email) = lower(m.email)
where not exists (
  select 1 from public.registration_messages x
  where x.registration_id = r.id and x.kind = m.kind and x.body = m.body
);
