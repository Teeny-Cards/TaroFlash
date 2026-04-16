-- =============================================================================
-- Set security_invoker on cards_with_images
-- =============================================================================
--
-- The cards_with_images view was created without the `security_invoker = true`
-- option, so by default it runs with the view owner's privileges (the role
-- that created it, typically `postgres`). That means queries against the view
-- bypass RLS on the underlying `cards` and `media` tables — a potential
-- information leak that's only accidentally mitigated today by the fact that
-- PostgREST always filters by the caller's member_id in client queries.
--
-- `ALTER VIEW ... SET (...)` lets us flip the option without having to drop
-- and recreate the view — useful because `cards_with_images` has many
-- callers and recreating it would require coordinating column ordering.
-- =============================================================================

BEGIN;

ALTER VIEW public.cards_with_images SET (security_invoker = true);

COMMIT;
