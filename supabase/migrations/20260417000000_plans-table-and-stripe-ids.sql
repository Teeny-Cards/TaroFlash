-- Plans lookup table + Stripe identifier columns on members.
--
-- The `plan` column currently uses a postgres ENUM (`member_plan`). Enums are
-- quick to add but rigid: adding a new tier means an ALTER TYPE migration
-- *and* a client code change to teach the app about the new label.
--
-- Switching to a lookup table ("plans") lets us:
--   1. Add a tier by inserting a row — pure data change
--   2. Store the Stripe price_id next to the tier it sells
--   3. Let the webhook resolve Stripe price_id → plan id via a join
--
-- Frontend analogy: moving from a hardcoded TS union (`'free' | 'paid'`) to a
-- config array you ship independently of the code that consumes it.

-- ---------------------------------------------------------------------------
-- 1. Plans lookup table.
-- ---------------------------------------------------------------------------
create table public.plans (
  id              text primary key,      -- 'free', 'paid', ...
  stripe_price_id text unique,           -- NULL for non-billable tiers (free)
  display_name    text not null,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- Seed the current tiers. stripe_price_id is left NULL on purpose: test-mode
-- and prod price IDs differ, so we set them per-environment (see the
-- follow-up "where to paste your price ID" note at the bottom of this file).
insert into public.plans (id, display_name) values
  ('free', 'Free'),
  ('paid', 'Paid');

-- ---------------------------------------------------------------------------
-- 2. Convert members.plan from enum to FK-backed text.
-- ---------------------------------------------------------------------------
-- Two things hold references to the enum / the column and block us from
-- altering them:
--   a. auth_plan() returns the `member_plan` type
--   b. the self-update RLS policy references the `plan` column in its
--      WITH CHECK clause
-- Drop both up-front; we'll recreate them (with the new text type, and the
-- extended Stripe-field guard) at the end of the migration.
drop function if exists public.auth_plan();
drop policy  if exists "members can update their own non-privileged fields" on public.members;

-- Can't change a column's type while it has a default of the old type —
-- drop the default first, change the type, then re-add it as text.
alter table public.members
  alter column plan drop default;

-- `USING plan::text` tells postgres how to convert each existing row —
-- here, just take the enum's label as a plain string.
alter table public.members
  alter column plan type text using plan::text;

alter table public.members
  alter column plan set default 'free';

-- Existing rows are all 'free' or 'paid', which both exist in plans — so
-- the FK validates without any data fixups.
alter table public.members
  add constraint members_plan_fkey
  foreign key (plan) references public.plans(id);

-- The enum type isn't referenced anywhere now. Drop it so it can't drift
-- out of sync with the plans table.
drop type public.member_plan;

-- ---------------------------------------------------------------------------
-- 3. Recreate auth_plan() returning text.
-- ---------------------------------------------------------------------------
create or replace function public.auth_plan()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select plan from public.members where id = auth.uid()
$$;

-- ---------------------------------------------------------------------------
-- 4. Stripe identifier columns on members.
-- ---------------------------------------------------------------------------
-- Nullable because free users have no Stripe record until they upgrade.
-- UNIQUE on stripe_customer_id so a webhook receiving a `customer.*` event
-- can find exactly one matching member row.
alter table public.members
  add column stripe_customer_id     text unique,
  add column stripe_subscription_id text;

-- ---------------------------------------------------------------------------
-- 5. RLS on plans.
-- ---------------------------------------------------------------------------
alter table public.plans enable row level security;

-- Authenticated users can read active plans. The UI needs these rows to show
-- pricing strings and render the upgrade button. Inactive plans stay hidden
-- so we can deprecate a tier without yanking it from the DB.
create policy "plans readable by authenticated users"
on public.plans
for select
to authenticated
using (is_active = true);

-- No INSERT/UPDATE/DELETE policies: those ops require service_role (which
-- bypasses RLS). Plans are curated via migrations and admin tooling only.

-- ---------------------------------------------------------------------------
-- 6. Extend the self-update guard to block Stripe field tampering.
-- ---------------------------------------------------------------------------
-- Same pattern as the existing role/plan guard: reject the UPDATE if the
-- Stripe columns changed. Only the webhook (running as service_role) is
-- allowed to write these.
--
-- `is not distinct from` instead of `=` because `NULL = NULL` evaluates to
-- UNKNOWN in SQL, which would silently reject every free-plan user's own
-- updates. `is not distinct from` treats two NULLs as equal.
create policy "members can update their own non-privileged fields"
on public.members
for update
to authenticated
using (auth.uid() = id)
with check (
  auth.uid() = id
  and role = (select role from public.members where id = auth.uid())
  and plan = (select plan from public.members where id = auth.uid())
  and stripe_customer_id     is not distinct from (select stripe_customer_id     from public.members where id = auth.uid())
  and stripe_subscription_id is not distinct from (select stripe_subscription_id from public.members where id = auth.uid())
);

-- ---------------------------------------------------------------------------
-- Follow-up (manual, per environment):
--   update public.plans set stripe_price_id = '<your test-mode price_id>' where id = 'paid';
-- Run this once in local dev after `stripe products create` / the dashboard.
-- Prod gets its own price_id the same way.
-- ---------------------------------------------------------------------------
