-- ChesState post-login platform tables.
-- Additive to schema.sql. Run after the waitlist / application tables exist.
--
-- We do not create a table named `users` — that would collide with auth.users.
-- `profiles` is the application record the product spec called `users`.

create table if not exists public.profiles (
  id                 uuid primary key references auth.users (id) on delete cascade,
  role               text not null default 'investor'
                       check (role in ('investor', 'entrepreneur')),
  country_code       text,
  virtual_balance_usd numeric(14, 2) not null default 0
                       check (virtual_balance_usd >= 0),
  kyc_status         text not null default 'unverified'
                       check (kyc_status in ('unverified', 'pending', 'verified', 'rejected')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Marketplace projects. Live rows are readable by any signed-in user;
-- only the owning entrepreneur can edit.
create table if not exists public.projects (
  id               uuid primary key default gen_random_uuid(),
  entrepreneur_id  uuid not null references public.profiles (id) on delete restrict,
  slug             text not null unique,
  title            text not null,
  summary          text,
  description      text,
  city             text,
  neighborhood     text,
  property_type    text,
  target_amount    numeric(14, 2) not null check (target_amount > 0),
  current_amount   numeric(14, 2) not null default 0 check (current_amount >= 0),
  min_stake_usd    numeric(10, 2) not null default 9.99,
  expected_yield   numeric(6, 3),
  status           text not null default 'draft'
                     check (status in ('draft', 'live', 'funded', 'failed', 'refunding')),
  end_date         date,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.projects enable row level security;

drop policy if exists "projects public read live" on public.projects;
create policy "projects public read live"
  on public.projects for select
  using (status in ('live', 'funded', 'failed', 'refunding') or entrepreneur_id = auth.uid());

drop policy if exists "projects owner write" on public.projects;
create policy "projects owner write"
  on public.projects for all
  using (entrepreneur_id = auth.uid())
  with check (entrepreneur_id = auth.uid());

create table if not exists public.investments (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects (id) on delete restrict,
  investor_id   uuid not null references public.profiles (id) on delete restrict,
  amount_usd    numeric(14, 2) not null check (amount_usd > 0),
  tokens_issued numeric(20, 8),
  status        text not null default 'pending'
                  check (status in ('pending', 'locked', 'confirmed', 'refunded')),
  contract_url  text,
  created_at    timestamptz not null default now()
);

alter table public.investments enable row level security;

drop policy if exists "investments read own" on public.investments;
create policy "investments read own"
  on public.investments for select
  using (
    investor_id = auth.uid()
    or exists (
      select 1 from public.projects p
      where p.id = project_id and p.entrepreneur_id = auth.uid()
    )
  );

-- Inserts go through the service role in /api/dashboard/invest so the FBO
-- ledger and balance debit stay atomic.

create table if not exists public.project_updates (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  title       text not null,
  body        text not null,
  created_at  timestamptz not null default now()
);

alter table public.project_updates enable row level security;

drop policy if exists "updates read with project" on public.project_updates;
create policy "updates read with project"
  on public.project_updates for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and (p.status in ('live', 'funded', 'failed', 'refunding') or p.entrepreneur_id = auth.uid())
    )
  );

drop policy if exists "updates owner write" on public.project_updates;
create policy "updates owner write"
  on public.project_updates for all
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.entrepreneur_id = auth.uid()
    )
  );

create index if not exists projects_slug_idx on public.projects (slug);
create index if not exists investments_investor_idx on public.investments (investor_id);
create index if not exists investments_project_idx on public.investments (project_id);
