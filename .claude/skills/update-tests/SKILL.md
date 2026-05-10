---
name: update-tests
description: Analyse branch changes in `src/` and `supabase/` and write tests to reach ~90% coverage of changed lines
allowed-tools: Read, Edit, Write, Bash, Glob, Grep
argument-hint: ''
arguments: []
lastUpdated: 2026-04-16T18:00:00-07:00
---

## Workflow

### Step 1 — Identify changed source files

Before running the following commands, make sure the master branch is up to date. (don't checkout master, just fetch updates) `git fetch origin master`

Run the following two commands to capture all changes, whether committed or not:

1. **Committed changes** (branch commits vs master):
   git diff master...HEAD --name-only -- src/ supabase/

2. **Uncommitted changes** (staged or unstaged working tree changes):
   git status --short -- src/ supabase/

Combine both lists, deduplicating as needed. This is necessary because branches sometimes have only uncommitted/staged changes
with no commits yet.

Filter out:

- Test files (`tests/`)
- Config and fixture files (`*.config.*`)
- Non-source files (`*.md`, `*.json`, `*.lock`, `*.css`)

You are left with the **source files to cover**.

### Step 2 — Understand the changes

Before reading source files, check two things in `vite.config.ts` (or equivalent):

- **Test file locations**: Look at `test.projects` include globs (e.g. `tests/unit/**/*.test.js`) so new test files are placed where the runner will find them.
- **Coverage exclusions**: Check `coverage.exclude` — do not write tests for excluded files.

For each source file:

1. Run the following commands to see exactly what lines changed.

- For committed changes: `git diff master...HEAD -- <file>`
- For uncommitted staged changes: `git diff HEAD -- <file>`
- For uncommitted unstaged changes: `git diff -- <file>`
- If all three return nothing for a file (e.g. a newly untracked file), use `git status` output to confirm its state and read the file directly.

2. Read the file to understand the full context of the changed code. Watch for module-level `ref`/`reactive` state in Vue composables — these values persist across `useXxx()` calls and across tests, and need an explicit reset in `beforeEach`.
3. Check whether an existing test file already covers this source file (look under `tests/` mirroring the source path, e.g. `src/components/foo/bar.vue` → `tests/integration/components/foo/bar.test.js`, or `src/composables/foo.ts` → `tests/unit/composables/foo.test.js`).
4. If a test file exists, read it to understand what is already covered before writing new tests.
5. **If no test file exists at all**, treat this as an opportunity to write full coverage for the entire file — not just the changed lines. Cover the public API, all meaningful branches, and edge cases. Note this in the Step 8 report as "new test file (full coverage)".

#### Bias: always write the test

When you find yourself reaching for a reason to skip, push past it. Reasons that are **not** valid grounds to skip:

- "No test file exists yet for this source file" — create one. The skill _expects_ this case (see step 5 above).
- "Out of scope for this PR" / "this change is small" — the change ships untested otherwise. Cover it.
- "Already covered indirectly via another component / composable" — indirect coverage masks the regression surface this skill is meant to lock down. Add a direct test anyway.
- "Would need a new fixture / harness" — build it. Reusable fixtures are cheap long-term, fragile manual repros are not.
- "Orchestration is glue code" — glue code is exactly where invalidation contracts, emit wiring, and feature-flag branches silently break. Glue code gets tested.

Valid grounds to skip are narrow and listed in step 8: barrel re-exports with no logic, files in `coverage.exclude`, and pure config / static-asset changes. Anything else, write the test.

### Step 2b — Backend changes (`supabase/`)

#### Migrations (`supabase/migrations/*.sql`)

1. Read the migration to understand what changed (new tables, RLS policies, triggers, RPC functions, views).
2. Check if existing tests in `supabase/tests/` already cover the changed functionality.
3. Write pgTAP tests in `supabase/tests/` following the conventions in the existing test files:
   - Use `tests.create_user()` and `tests.set_claims()` helpers for setup
   - Use inline `SET LOCAL role = 'authenticated'` / `SET LOCAL role = 'postgres'` for role switching
   - Wrap in `BEGIN` / `ROLLBACK` for isolation
   - Name files with a numeric prefix for ordering (e.g. `00007_new_feature.sql`)
4. Run with `supabase test db` to validate.
5. Prioritise testing: RLS policies (security) > RPC functions (business logic) > triggers (data integrity).
6. **If the migration changes the resource type of an object** (view↔function, table↔view, `RETURNS TABLE` shape change), the FE↔PostgREST contract may break in ways pgTAP cannot see (FK embed resolution lives in PostgREST, not Postgres). Add or update a contract test under `tests/contract/api/<domain>.test.js` that exercises the FE call path against a real local Supabase. See Step 2d.

#### Edge functions (`supabase/functions/<name>/`)

1. Read the function to understand what changed.
2. Tests are **Deno**, not Vitest. Colocate as `index.test.ts` next to `index.ts`.
3. Inject a fake supabase via `supabase/functions/_shared/test-utils.ts` (`makeFakeSupabase`). Never hit a real network — the handler must be exported as a pure `handler({ supabase, ... })` and `Deno.serve(...)` gated on `import.meta.main`.
4. Run from `supabase/functions/`: `deno test --allow-net --allow-env --allow-read`.
5. See `docs/src/supabase/edge-functions.md` for full conventions.

Skip to Step 8 for these files — Steps 3–7 are frontend-specific.

### Step 2d — API-layer changes (`src/api/<domain>/db/**`)

Files under `src/api/*/db/` talk to PostgREST. Mocked unit tests pin call shapes but cannot detect schema-cache drift, broken FK embeds, missing GRANTs, or RLS regressions — those are HTTP-layer concerns.

For every changed file under `src/api/*/db/`:

1. Add or extend a contract test under `tests/contract/api/<domain>.test.js`. Each function should have at least one happy-path assertion that runs against a real local Supabase via the `signInAsTestUser` helper in `tests/contract/setup.js`.
2. Assert on **response shape**, not on which arguments were passed to `supabase.from(...).select(...)`. String-shape assertions pin broken behaviour.
3. Run with `vp test --project Contract` (needs `supabase start`).

### Step 2c — Capture business-logic decisions from the current session

When this skill is invoked during a working session that produced the changes, the conversation often carries _why_ — invariants, race conditions, and edge-case guards that the diff alone doesn't expose. A test writer who only reads the code will cover _what_ changed but miss the _decisions_ that shaped it.

Before writing tests, distill the conversation into a short "test obligations" list. Each obligation should map to at least one test case that exercises the decision directly.

Sources to mine:

- **Invariants agreed verbally** but not captured in code comments (e.g. "member id is sourced from the session, not the profile query, to avoid a race during auth restore" → a test proving `.id` is defined the moment the session restores, regardless of the profile query's state)
- **Edge-case guards with a specific reason** — if `if (!x) return` was added because `x` could be undefined in a known scenario, write a test for that scenario
- **Invalidation / state-flow contracts** — which query keys a mutation invalidates, what cross-cutting fields (debounce keys, deck_id, etc.) are required on the wire, what happens when they're absent
- **Bugs found and fixed mid-session** — the failing case is a guaranteed-valuable test; preserve it before moving on
- **Memory entries** — scan `memory/MEMORY.md` for project decisions relevant to the changed files (paradigm choices, topology rules, etc.)

If this skill is invoked cold on an already-merged branch with no session context, skip this step and rely on Step 2's code reading alone.

### Step 3 — Determine test type (in priority order)

For each changed unit of code, choose the **lowest-cost test type** that can meaningfully cover it:

| Priority | Type            | When to use                                                                                                                                                                       |
| -------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | **Unit**        | Pure functions, utilities, composables with no rendering, store logic that can be called directly                                                                                 |
| 2        | **Integration** | Vue components — anything that renders HTML (runs in Chromium via browser mode)                                                                                                   |
| 2        | **Contract**    | `src/api/<domain>/db/*` — anything that round-trips through PostgREST / GoTrue / Storage. See Step 2d.                                                                            |
| 3        | **E2E**         | **Last resort only.** Use only when the behaviour cannot be covered without full navigation or multi-step flow interaction. Always justify why integration is insufficient first. |

**Default to integration tests for components.** Use `shallowMount` for isolated component tests (stub child components) and `mount` only when child component behaviour is directly under test.

### Step 4 — Run existing tests (baseline)

Before writing any new tests, run the relevant existing test files to establish a baseline.

```bash
vp test --no-coverage <path-to-test-file>
```

For example:

```bash
vp test --no-coverage tests/integration/components/ui-kit/toggle.test.js
```

**Always use `--no-coverage` when running targeted file paths.** Running with coverage against a subset of files can crash the coverage provider.

#### Interpreting results

- Record only failures **in the target test file** as your baseline.
- If unrelated test files appear in the output and some fail, note them as pre-existing and **do not investigate or fix them**. They are out of scope for this branch.

### Step 5 — Write the tests

Target **~90% line coverage of the changed lines** (higher if achievable without test bloat).

Integration tests run in **Chromium browser mode** — not jsdom. This means:

- Test stubs must use **render functions** (`h()`), not `template` strings (no runtime compiler in Vite's runtime-only Vue build)
- GSAP mocks must call `onComplete` so `transition-group` JS hooks complete
- Don't find elements by auto-generated stub tag names (`ui-icon-stub`) — use `findComponent({ name: '...' })`
- `global` is not available — the browser setup file (`tests/setup-browser.js`) handles i18n only

See `testing.md` "Browser mode constraints" for full details and examples.

### Step 6 — Validate all tests pass

After writing each new test file, run it using the same command as baseline (step 4).

If any test fails:

1. Read the failure output carefully.
2. Fix the test (or the source if the test revealed a real bug — call this out explicitly).

- If the source needs to be fixed, suggest the change to the user.
- Ask for confirmation before making any changes to source files.

3. Re-run until green.

Do not proceed to the next file until the current file's tests are passing.

### Step 7 — Review and quality check

Once all tests are written and passing, review the full set of new tests for quality using the flakiness audit in `.claude/rules/testing.md` (auto-loaded when working on test files).

**Fix any critical issues** — specifically anything that would cause intermittent CI failures or mask real regressions. Call out non-critical issues (low severity style/practice notes) in the report but do not auto-fix them.

### Step 8 — Report

After writing all tests, output a short summary table:

| File changed | Test file | Type             | New tests | Lines covered (approx) |
| ------------ | --------- | ---------------- | --------- | ---------------------- |
| ...          | ...       | unit/integration | N         | ~X%                    |

If any changed file was skipped, explain why in one line. Skipping is reserved for the narrow valid cases only: barrel re-exports with no logic, files in `coverage.exclude`, or pure config / static-asset changes. "No test file exists yet", "out of scope for the PR", "covered indirectly elsewhere", and "would need a new harness" are **not** valid skip reasons — write the test (see Step 2 "Bias: always write the test").

Also include a **Quality notes** section listing any non-critical issues spotted during the review (step 7) that were not auto-fixed, so the author is aware of them.
