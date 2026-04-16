---
name: revise-rules
description: Revise rule files under `.claude/rules/` and skill files under `.claude/skills/` so they stay accurate and consistent with the code — driven by `.claude/.last-updated.json`. Unlike update-docs this is a revision task, not a write-from-scratch one; flag drift, confirm with the user, then edit minimally.
allowed-tools: Read, Edit, Write, Bash, Glob, Grep
lastUpdated: 2026-04-16T23:13:06Z
---

## Model

`.claude/.last-updated.json` holds a single ISO timestamp representing **when the rules + skills were last verified against the codebase**. Every run:

1. Enumerates every `src/` and `supabase/` change since that timestamp.
2. Reads every rule file and SKILL.md, then checks each one for **drift** against the current code.
3. Flags inconsistencies to the user, applies confirmed fixes, and stamps what it touched.

The intent here is **revision, not authorship**. The skill does not invent new rules or new skills. It verifies existing ones, flags contradictions, and minimally edits.

## What counts as drift

For a **rule** (`.claude/rules/*.md`):

- The rule cites an API, pattern, directory, or file that has since been renamed, moved, or removed.
- The rule forbids a pattern the codebase now uses (or mandates one the codebase no longer follows).
- The rule overlaps with or contradicts another rule.
- The rule references a tool command that is no longer accurate (e.g. toolchain rename).
- The rule's example code has become wrong given current APIs.

For a **skill** (`.claude/skills/*/SKILL.md`):

- A command in the workflow no longer works (renamed CLI, removed flag, changed path).
- A referenced file, directory, or config key no longer exists.
- A step refers to a convention that a rule has since overridden.
- The skill's `description` frontmatter no longer matches what the skill actually does.

Stylistic tightening is out of scope unless the user has complained about it — this skill is for *correctness*, not *polish*.

## Workflow

### Step 1 — Load the sync anchor

```sh
TS=$(jq -r .lastUpdated .claude/.last-updated.json)
echo "Last revision sync: $TS"
```

If the anchor file is missing, stop and ask — don't silently recreate it.

### Step 2 — Enumerate code changes since the anchor

Committed, plus uncommitted:

```sh
git log --since="$TS" --name-only --pretty=format: -- src/ supabase/ | sort -u | sed '/^$/d'
git status --short -- src/ supabase/
```

Filter out tests, fixtures, lockfiles, and generated assets. The remaining set is the **change surface** — the code that rules/skills must still line up with.

Also capture any direct edits to the rules/skills themselves since the anchor:

```sh
git log --since="$TS" --name-only --pretty=format: -- .claude/rules/ .claude/skills/ | sort -u | sed '/^$/d'
git status --short -- .claude/rules/ .claude/skills/
```

These are the files the user already decided to touch — they're candidates for consistency review.

If both lists are empty, report "no drift possible since `$TS`" and stop. **Do not bump the anchor on an empty run.**

### Step 3 — Walk every rule and skill

For each file in `.claude/rules/*.md` and `.claude/skills/*/SKILL.md`:

1. Read the whole file.
2. For every concrete claim it makes (commands, paths, API names, forbidden/required patterns), verify against the current code with Grep/Read. Examples:
   - Rule says `use 'vp test'` → Grep for other invocations; confirm `package.json` scripts still match.
   - Rule forbids `@apply` → Grep `src/` for `@apply` to see if the codebase actually honours it.
   - Skill references `src/api/media.ts` → confirm it exists.
3. Cross-check rules against each other for contradiction.
4. Cross-check each skill's steps against the rules (a skill step that violates a rule is drift).

Be efficient: skip verification of claims that obviously haven't been affected by anything in the Step 2 change surface.

### Step 4 — Surface findings before editing

**Do not edit anything yet.** Present a compact report:

1. **Drift** — one line per finding: `<file>: <what's wrong>`. If empty, say so.
2. **Proposed edits** — one line per edit you'd make. Minimal surgery only.
3. **Questions** (only if any, max 3) — things you can't resolve without user input. E.g. "`animations.md` forbids magic timeouts, but `phone.ts` uses one — was this a deliberate exception?"
4. **Possibly new rule territory** — if the code clearly establishes a pattern with no corresponding rule, mention it as *one line*. Do **not** draft the rule. The user decides whether a new rule is warranted.

**Wait for the user** before Step 5.

### Step 5 — Apply confirmed edits

For each edit the user greenlit:

- Keep the change as small as possible — update a line, fix an example, rename a path.
- Preserve the file's existing structure and tone. No rewrites.
- If the user said "drop this rule entirely", delete the file. Grep for references in other rules and skills and clean those up too.

### Step 6 — Stamp timestamps

```sh
NEW_TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
```

For every rule/skill file edited or created in Step 5, update its frontmatter `lastUpdated: $NEW_TS`. For new files without frontmatter, add one:

```
---
lastUpdated: <NEW_TS>
---
```

SKILL.md files always have frontmatter; inject/update the `lastUpdated:` line inside the existing block.

Then write the global:

```sh
printf '{\n  "lastUpdated": "%s"\n}\n' "$NEW_TS" > .claude/.last-updated.json
```

Only bump the global when at least one rule or skill was edited. A "verified, nothing to change" run must not advance the anchor — the anchor represents the last time something actually changed.

### Step 7 — Report

| File | Kind | Change |
| ---- | ---- | ------ |
| ...  | rule / skill | ... |

- One line per file verified-but-unchanged (grouped).
- **Deferred** section for anything raised in Step 4 that wasn't resolved.
- State the new anchor: `rules + skills verified through <NEW_TS>`.
