---
name: update-docs
description: Analyse branch changes in `src/` and `supabase/` and update docs in `docs/` to reflect them — surfacing concerns, questions, and inconsistencies before writing
allowed-tools: Read, Edit, Write, Bash, Glob, Grep
---

## Workflow

### Step 1 — Identify changed source files

Before running the following commands, make sure the master branch is up to date (don't checkout master, just fetch updates): `git fetch origin master`

Run the following two commands to capture all changes, whether committed or not:

1. **Committed changes** (branch commits vs master):
   `git diff master...HEAD --name-only -- src/ supabase/`

2. **Uncommitted changes** (staged or unstaged working tree changes):
   `git status --short -- src/ supabase/`

Combine both lists, deduplicating as needed. This is necessary because branches sometimes have only uncommitted/staged changes with no commits yet.

Filter out:

- Test files (`tests/`)
- Config and fixture files (`*.config.*`)
- Non-source files (`*.md`, `*.json`, `*.lock`, `*.css`) — unless a `.md` is in `docs/`

You are left with the **source files to analyse**.

### Step 2 — Understand each change

For each source file:

1. Diff it to understand exactly what changed:
   - Committed: `git diff master...HEAD -- <file>`
   - Uncommitted staged: `git diff HEAD -- <file>`
   - Uncommitted unstaged: `git diff -- <file>`
   - If nothing is returned (newly untracked file), read it directly.

2. Read the full file for context.

3. Identify what changed that has documentation implications:
   - New props, emits, slots, or composable parameters added or removed
   - Renamed APIs or changed signatures
   - New behaviours or modes
   - Removed or deprecated functionality
   - Changes to default values
   - Meaningful internal restructuring that users might reason about
   - New or changed database tables, columns, RLS policies, RPC functions, or triggers
   - New or changed edge functions

### Step 3 — Locate existing docs

1. Check `docs/src/` for documentation files related to the changed source. Common mappings:
   - `src/components/foo/bar.vue` → `docs/src/components/bar.md` or `docs/src/components/foo/bar.md`
   - `src/composables/use-foo.ts` → may be documented in a system overview page under `docs/src/`

2. Read the existing docs so you understand what's already written.

3. Check `docs/.vitepress/config.ts` to understand the sidebar structure and whether a new page needs to be registered.

4. **If no doc file exists at all** for a changed source file, treat this as an opportunity to write a full documentation entry for it — not just the changed surface area. Cover the overview, all public props/emits/slots/return values, usage examples, and any notable behaviours. Note this in the Step 6 report as "new doc page (full coverage)".

### Step 4 — Surface concerns before writing

**Do not write any documentation yet.** Present a brief checkpoint to the user. Keep it short — only flag items that genuinely need input.

1. **Plan** — One bullet per doc change you intend to make (`file → what`). No elaboration needed for straightforward updates.

2. **Blockers** (only if any) — Questions you _cannot resolve from the code alone_. Max 3. Skip this section entirely if there are none. Don't ask about things you can infer.

3. **Heads-up** (only if any) — Possible bugs or doc/code mismatches worth mentioning. One line each.

**Wait for the user to respond** before proceeding to Step 5.

### Step 5 — Write the documentation

Once the user has reviewed the concerns in Step 4 and given the go-ahead:

1. For each change that needs a doc update:
   - Edit the relevant `.md` file(s) in `docs/src/`
   - Match the existing style, tone, and structure of the surrounding docs
   - Use code examples where appropriate — prefer short, realistic snippets

2. If a new page is needed:
   - Create the file at the appropriate path under `docs/src/`
   - Register it in the sidebar in `docs/.vitepress/config.ts`

3. Do not add filler, padding, or sections that aren't backed by actual source behaviour. Document what exists, not what might exist.

4. Do not document internal implementation details that are not part of the public API.

5. **Check whether `README.md` needs updating.** After updating the docs, consider whether anything in the root `README.md` is affected — for example, a renamed directory, a new major system that belongs in the project structure map, or a link that now points to the wrong place. If so, update it as part of this step. Keep README changes minimal and "book cover" level — deep detail belongs in the docs, not the README.

### Step 6 — Report

Output a short summary:

| Source file changed | Doc file updated | What changed |
| ------------------- | ---------------- | ------------ |
| ...                 | ...              | ...          |

If any changed source file was skipped (no public API changed, already accurately documented, or out of scope), explain why in one line.

Include a **Deferred items** section for anything raised in Step 4 that was not resolved, so it's not forgotten.
