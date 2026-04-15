-- Add `role` and `plan` to members.
--
-- Two orthogonal axes:
--   role: staff status      (user | moderator | admin)
--   plan: billing status    (free | paid)
--
-- Both columns are NOT NULL with a default, so existing rows get backfilled
-- automatically — no separate UPDATE needed. (Frontend analogy: like adding a
-- prop with a default value — existing usages keep working without changes.)

create type member_role as enum ('user', 'moderator', 'admin');
create type member_plan as enum ('free', 'paid');

alter table public.members
  add column role member_role not null default 'user',
  add column plan member_plan not null default 'free';

-- Helper for RLS policies. SECURITY DEFINER lets it bypass RLS to read the
-- caller's own member row (otherwise the policy would recurse into itself
-- when checking permissions on `members`).
--
-- Frontend analogy: this is like a `useCurrentUserRole()` composable — call
-- it anywhere and get back the active user's role. The DB version is just
-- callable from inside SQL policies and RPCs.
create or replace function public.auth_role()
returns member_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.members where id = auth.uid()
$$;

create or replace function public.auth_plan()
returns member_plan
language sql
stable
security definer
set search_path = public
as $$
  select plan from public.members where id = auth.uid()
$$;

-- Lock down `role` and `plan` so users can't promote themselves.
--
-- The existing UPDATE policy ("matching auth id") would otherwise let any
-- authenticated user run `update members set role = 'admin' where id = auth.uid()`.
--
-- We can't easily add a per-column rule to an existing policy, so the cleanest
-- fix is: tighten the existing policy with a WITH CHECK that compares the new
-- row to the old row. If `role` or `plan` changed, the update is rejected.
--
-- Frontend analogy: this is like a form validator that runs on submit and
-- rejects the payload if certain fields were touched — except it's enforced
-- by the database, so no client (or server route) can bypass it.

drop policy if exists "Enable update for authenticated users with matching auth id" on public.members;

create policy "members can update their own non-privileged fields"
on public.members
for update
to authenticated
using (auth.uid() = id)
with check (
  auth.uid() = id
  and role = (select role from public.members where id = auth.uid())
  and plan = (select plan from public.members where id = auth.uid())
);

-- Admins can change anyone's role or plan. Moderators intentionally cannot —
-- promoting users is an admin-only concern.
create policy "admins can update any member"
on public.members
for update
to authenticated
using (auth_role() = 'admin')
with check (auth_role() = 'admin');
