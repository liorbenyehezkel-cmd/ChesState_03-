-- ChesState registrant and purchase-intent report.
-- Connects to your Supabase project (SQL editor): run this after schema.sql.
-- Additive: extra waitlist columns, events, and operator views.

alter table public.investor_waitlist
  add column if not exists phone text,
  add column if not exists country text,
  add column if not exists source text,
  add column if not exists created_at timestamptz default now();

create table if not exists public.platform_events (
  id          uuid primary key default gen_random_uuid(),
  event_type  text not null check (event_type in (
    'waitlist_join',
    'entrepreneur_signup',
    'investment_request',
    'payout_request',
    'product_feedback'
  )),
  actor_email text,
  detail      jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

alter table public.platform_events
  drop constraint if exists platform_events_event_type_check;

alter table public.platform_events
  add constraint platform_events_event_type_check
  check (event_type in (
    'waitlist_join',
    'entrepreneur_signup',
    'investment_request',
    'payout_request',
    'product_feedback'
  ));

alter table public.platform_events enable row level security;

create index if not exists platform_events_type_idx
  on public.platform_events (event_type, created_at desc);
create index if not exists platform_events_email_idx
  on public.platform_events (actor_email);

-- 1) Number of Register interest signups
create or replace view public.v_signup_count as
select count(*)::int as signup_count
from public.investor_waitlist;

-- 2–6) Each waitlist user: date, email, phone, country, arrival source
create or replace view public.v_waitlist_signups as
select
  id,
  created_at as signup_at,
  email,
  phone,
  country,
  coalesce(nullif(source, ''), 'Direct') as arrival_source,
  locale
from public.investor_waitlist
order by created_at desc;

-- 7) How many people submitted a purchase before the "not ready" screen
create or replace view public.v_purchase_intent_count as
select
  count(*)::int as purchase_attempts,
  count(distinct actor_email)::int as unique_buyers
from public.platform_events
where event_type = 'investment_request';

-- 8) Intended purchase amount per user
create or replace view public.v_intended_purchases as
select
  e.id,
  e.created_at as attempted_at,
  e.actor_email as email,
  w.phone,
  w.country,
  coalesce(nullif(w.source, ''), e.detail->>'source', 'Direct') as arrival_source,
  (e.detail->>'amountUsd')::numeric as intended_amount_usd,
  e.detail->>'projectTitle' as project_title,
  e.detail->>'method' as payment_method
from public.platform_events e
left join public.investor_waitlist w
  on lower(w.email) = lower(e.actor_email)
where e.event_type = 'investment_request'
order by e.created_at desc;

-- Combined operator row: signup + latest intended purchase
create or replace view public.v_registrant_report as
select
  w.email,
  w.created_at as signup_at,
  w.phone,
  w.country,
  coalesce(nullif(w.source, ''), 'Direct') as arrival_source,
  (
    select count(*)
    from public.platform_events e
    where e.event_type = 'investment_request'
      and lower(e.actor_email) = lower(w.email)
  )::int as purchase_attempts,
  (
    select (e.detail->>'amountUsd')::numeric
    from public.platform_events e
    where e.event_type = 'investment_request'
      and lower(e.actor_email) = lower(w.email)
    order by e.created_at desc
    limit 1
  ) as last_intended_amount_usd
from public.investor_waitlist w
order by w.created_at desc;

create or replace view public.v_product_feedback as
select
  id,
  created_at,
  actor_email as email,
  detail->>'message' as message,
  detail->>'projectTitle' as project_title
from public.platform_events
where event_type = 'product_feedback'
order by created_at desc;

alter view public.v_signup_count set (security_invoker = true);
alter view public.v_waitlist_signups set (security_invoker = true);
alter view public.v_purchase_intent_count set (security_invoker = true);
alter view public.v_intended_purchases set (security_invoker = true);
alter view public.v_registrant_report set (security_invoker = true);
alter view public.v_product_feedback set (security_invoker = true);

revoke all on public.platform_events from anon, authenticated, public;
revoke all on public.v_signup_count from anon, authenticated, public;
revoke all on public.v_waitlist_signups from anon, authenticated, public;
revoke all on public.v_purchase_intent_count from anon, authenticated, public;
revoke all on public.v_intended_purchases from anon, authenticated, public;
revoke all on public.v_registrant_report from anon, authenticated, public;
revoke all on public.v_product_feedback from anon, authenticated, public;

grant select on public.v_signup_count to service_role;
grant select on public.v_waitlist_signups to service_role;
grant select on public.v_purchase_intent_count to service_role;
grant select on public.v_intended_purchases to service_role;
grant select on public.v_registrant_report to service_role;
grant select on public.v_product_feedback to service_role;
grant all on public.platform_events to service_role;

-- Operator queries (Supabase SQL editor, connected to the live project) -----
-- 1) מספר הרשמות (Register interest)
-- select * from public.v_signup_count;
-- 2–6) תאריך הרשמה, אימייל, פלאפון, מדינה, מקור הגעה
-- select * from public.v_waitlist_signups;
-- 7) כמה משתמשים באו לבצע רכישה לפני ההודעה
-- select * from public.v_purchase_intent_count;
-- 8) סכום הרכישה שכל משתמש התכוון לבצע
-- select * from public.v_intended_purchases;
-- דוח מאוחד
-- select * from public.v_registrant_report;
-- הצעות לשיפור מהמסך של "עדיין לא מוכן"
-- select * from public.v_product_feedback;
