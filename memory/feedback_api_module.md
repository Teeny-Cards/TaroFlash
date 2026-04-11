---
name: Extract Supabase calls to API module
description: Direct supabase client calls must go in src/api/, not inline in composables, views, or update functions
type: feedback
---

Always extract supabase client calls into the appropriate `src/api/` module rather than inlining them in composables, views, or other non-API files. If no suitable module exists, create one.

**Why:** Keeps the data access layer consistent and testable; components and composables should not import or call `supabase` directly.

**How to apply:** When writing code in `src/composables/`, `src/views/`, or `src/components/`, check if a supabase call belongs in an existing `src/api/` file. If there's no obvious home, create a new module (e.g., `src/api/media.ts` for media operations).
