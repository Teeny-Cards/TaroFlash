---
name: update-docs
description: Bring `docs/` up to date with all code changes since the last docs sync — driven by `docs/.last-updated.json`, not branch diffs
allowed-tools: Read, Edit, Write, Bash, Glob, Grep
argument-hint: ''
arguments: []
lastUpdated: 2026-04-16T23:13:06Z
---

## Model

`docs/.last-updated.json` holds a single ISO timestamp representing **when the docs were last brought in sync with code**. Every run of this skill does three things:

1. Finds every `src/` and `supabase/` change since that timestamp.
2. Updates whichever doc pages need it.
3. Advances the timestamp (and the `lastUpdated` frontmatter on each edited page) to the current time.

This is a continuous catch-up model — not a per-branch one. Run it on master, or on a branch about to merge.

## Workflow

### Step 1 — Load the sync anchor

```sh
git fetch origin master
TS=$(jq -r .lastUpdated docs/.last-updated.json)
echo "Last sync: $TS"
```

If `docs/.last-updated.json` is missing, stop and ask the user — don't silently recreate it.

### Step 2 — Enumerate changed source files

Committed changes since the anchor:

```sh
git log --since="$TS" --name-only --pretty=format: -- src/ supabase/ | sort -u | sed '/^$/d'
```

Uncommitted working-tree changes (so in-progress work is covered too):

```sh
git status --short -- src/ supabase/
```

Combine both lists and filter out:

- Test files (`tests/`, `*.test.*`, `*.spec.*`)
- Config / fixture files (`*.config.*`, `*.json`, `*.lock`)
- Non-source assets (`*.css`, images, fonts) — unless the change is genuinely user-visible
- `.md` files outside `docs/`

What remains is the **source set to analyse**. If it's empty, report "docs are already in sync since `$TS`" and stop — do not bump the timestamp.

### Step 3 — Understand each change

For each file in the source set:

1. Diff from just before the anchor to HEAD, plus any working-tree changes:
   - Find the commit that introduced the oldest in-window change: `git log --since="$TS" --reverse --pretty=format:%H -- <file> | head -1`
   - Diff from its parent to HEAD: `git diff <that-sha>^..HEAD -- <file>`
   - Plus uncommitted: `git diff HEAD -- <file>` and `git diff -- <file>`
   - For a brand-new, never-committed file, just read it.

2. Read the full file for context.

3. Identify what changed with documentation implications:
   - New / removed / renamed props, emits, slots, composable parameters, return values
   - Changed function signatures or default values
   - New behaviours, modes, or public surface
   - Database: new tables, columns, RLS policies, RPC functions, triggers
   - New or changed edge functions

### Step 4 — Locate existing docs

1. Map source to docs under `docs/src/`. Common patterns:
   - `src/components/foo/bar.vue` → `docs/src/components/bar.md` (or `.../foo/bar.md`)
   - `src/composables/use-foo.ts` → usually part of a system overview page
   - `supabase/migrations/*` → typically reflected in `docs/src/supabase/*`

2. Read the existing docs so you understand the current baseline.

3. Check `docs/.vitepress/config.ts` for sidebar structure and whether a new page needs registering.

4. **No doc page exists?** Treat it as an opportunity to write full coverage — overview, all public API, usage examples, notable behaviours. Flag this as `new doc page (full coverage)` in Step 5.

### Step 5 — Surface concerns before writing

**Do not write any documentation yet.** Present a short checkpoint to the user:

1. **Plan** — One bullet per doc change (`file → what`). No elaboration for straightforward updates.
2. **Blockers** (only if any) — Questions you cannot resolve from the code alone. Max 3. Omit section if none.
3. **Heads-up** (only if any) — Possible doc/code mismatches or suspected bugs. One line each.

**Wait for the user** before proceeding.

### Step 6 — Write the documentation

Once the user gives the go-ahead:

1. Edit the relevant `.md` files in `docs/src/`:
   - Match the existing style, tone, and section structure
   - Short, realistic code examples; no filler
   - Document public behaviour, not internal implementation

2. For any new page:
   - Create it under `docs/src/` at the appropriate path
   - Include the `lastUpdated:` frontmatter field (Step 7 will set it)
   - Register it in the sidebar in `docs/.vitepress/config.ts`

3. **Check `README.md`** — if a rename, new major system, or broken link is now visible from the top level, update it. Keep it "book cover" level; detail belongs in `docs/`.

### Step 7 — Stamp timestamps

Compute the new timestamp once:

```sh
NEW_TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
```

For **each doc page edited or created**, set frontmatter `lastUpdated: $NEW_TS`.

- If the file already has frontmatter, update the `lastUpdated:` line.
- If it has no frontmatter, prepend:

  ```
  ---
  lastUpdated: <NEW_TS>
  ---
  ```

Then write the same value to the global file:

```sh
printf '{\n  "lastUpdated": "%s"\n}\n' "$NEW_TS" > docs/.last-updated.json
```

Only bump the global if at least one doc page was actually edited or created in Step 6. A run that produces no doc changes must not advance the anchor.

### Step 8 — Report

| Source file changed | Doc file updated | What changed |
| ------------------- | ---------------- | ------------ |
| ...                 | ...              | ...          |

- One line per skipped source file (and why) — "no public API changed", "already accurately documented", "out of scope".
- **Deferred items** section for anything raised in Step 5 that wasn't resolved, so it's not lost.
- State the new anchor: `docs synced up to <NEW_TS>`.
