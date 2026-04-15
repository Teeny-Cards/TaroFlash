---
name: prepare-pr
description: Prepare a branch for PR by rewriting commit messages into release-notes-friendly Conventional Commits, renaming the branch if it no longer fits the changes, drafting a PR title and body, and opening the GitHub "create PR" page pre-filled. Use when a feature branch is code-complete and ready for review.
allowed-tools: Read, Edit, Write, Bash, Glob, Grep
---

## Why this skill exists

Feature branches often accumulate vague commits ("fix", "tests", "refactor study-session to be cleaner"), a branch name that no longer describes the work, and no thought given to how the PR will read in release notes. This skill fixes all of that in one pass so the PR is ready to review and the final merge lands in the changelog in a usable shape.

The output is:

1. Commits renamed into **Conventional Commits** format (see style guide below).
2. Branch renamed if its slug no longer fits.
3. Branch pushed (force-with-lease if rewritten, fresh push if unpushed).
4. GitHub "create PR" page opened in the browser with title + body pre-filled via `gh pr create --web`.

History may have been published — **the user has pre-authorised force-pushing on this branch**, so don't block on upstream state. Still surface what you're about to do before you do it.

## Conventional Commits — style guide

### Why

Release-notes tooling (release-please, semantic-release, git-cliff, Changesets) reads the commit subject to categorise entries automatically:

- `feat:` → **Features** section, often triggers a minor version bump
- `fix:` → **Bug Fixes** section, patch bump
- `refactor:`, `perf:`, `docs:`, `test:`, `chore:`, `style:`, `build:`, `ci:`, `revert:` → typically **Internal changes** or omitted from user-facing release notes
- `feat!:` / trailer `BREAKING CHANGE:` → **Breaking Changes**, major bump

Even without automation, the format reads well in a bulleted changelog and makes skimming git log productive.

### Format

```
<type>(<scope>): <description>
```

- **type** — one of `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`, `style`, `build`, `ci`, `revert`. Pick based on the user-facing effect, not the biggest file changed.
- **scope** — a short domain tag (`study-session`, `cards`, `auth`, `deck-settings`). Omit only when the change is truly cross-cutting. Prefer an existing scope already used on the branch or in recent git log.
- **description** — imperative mood ("add X", not "added X" or "adds X"), lowercase, no trailing period, no ticket numbers. Describe the user-visible change or the concrete outcome — not the mechanics. Keep under ~72 characters.

### Examples

Good:

- `feat(study-session): edit card text mid-session`
- `fix(auth): prevent infinite redirect after session refresh`
- `refactor(cards): replace CardRecord class with saveCard API`

Bad:

- `updates` — no type, no information
- `refactor study-session to be cleaner` — no scope, vague description
- `fix: fixed the bug where clicking the button didn't work` — past tense, imprecise, redundant "fix"

## Workflow

### Step 1 — Sanity check

```sh
git rev-parse --abbrev-ref HEAD
git log master..HEAD --oneline
git status --short
gh auth status
```

Block and surface a warning if any of these are true:

- Current branch is `master` or `main`.
- `git status` shows uncommitted changes — ask the user to commit or stash first.
- `master..HEAD` is empty. Nothing to prepare.
- `gh` is not authenticated. The final step needs it; either authenticate now or agree to skip the auto-open at the end.

Note the current upstream (`git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null`) so Step 6 can decide push flags.

### Step 2 — Inspect each commit

For each SHA from `git log master..HEAD --oneline`, run:

```sh
git show --stat <sha>
```

Read enough of the diff to understand the user-visible effect. If the stat list is ambiguous, run `git show <sha> -- <path>` on the most interesting files. Goal: know what *belongs* in the subject line, not just what got touched.

For each commit answer:

1. Is this a user-visible change (feature, fix, UX tweak) or internal-only (refactor, test, docs, chore)?
2. What is the smallest accurate scope?
3. What is the concrete outcome in one short imperative clause?

### Step 3 — Propose new commit messages

Show a table:

| SHA (short) | Current | Proposed |
| --- | --- | --- |
| `71538c8` | add edit functionality to session | `feat(study-session): edit card text mid-session` |
| `e6d0a22` | Refactor study-session to be cleaner | `refactor(study-session): extract composables and introduce deck context` |
| `7475c52` | refactor card editing network pipeline | `refactor(cards): replace CardRecord class with saveCard API` |

**Wait for approval.** Integrate any user edits.

### Step 4 — Rewrite commit messages

Use `git filter-branch --msg-filter` with a `case` on `$GIT_COMMIT` (the pre-rewrite SHA). This preserves authorship, dates, trailers, and parentage — only the subject changes.

```sh
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch -f --msg-filter '
case "$GIT_COMMIT" in
  <full-sha-1>) echo "<new message 1>" ;;
  <full-sha-2>) echo "<new message 2>" ;;
  *) cat ;;
esac
' master..HEAD
```

Use the **full** 40-char SHAs in the case statement — short SHAs will not match.

For multi-line messages (body after a blank line), use a heredoc inside the case arm:

```sh
<sha>) cat <<'EOF'
feat(study-session): edit card text mid-session

Adds an edit button on the study card that swaps in a text editor
and debounces saves through saveCard.
EOF
;;
```

Verify with `git log master..HEAD --oneline` and `git log master..HEAD --stat` (diffs should be unchanged from before).

### Step 5 — Evaluate and, if needed, rename the branch

PR titles in the GitHub UI default to:

- the single commit's subject if `master..HEAD` has **one** commit, or
- the branch name humanised (kebab-case → spaces, capitalised) if there are **multiple** commits.

So the branch name is the primary lever for a good default title when there are multiple commits. Even with a single commit, a tidy branch name reads better in the PR list and in the branch sidebar.

Compare the current branch name to the rewritten commit subjects. If it still fits, keep it. If it no longer describes the main thrust of the work, propose a kebab-case slug:

- 3–6 words
- Describes the primary change (feature focus or primary refactor)
- Lowercase, hyphen-separated
- No ticket prefix unless repo convention uses one (check recent merged PRs via `gh pr list --state merged --limit 10`)
- Humanises into a clean sentence — e.g. `study-session-inline-edit-cleanup` → "Study session inline edit cleanup"

Show old → new, wait for approval, then rename:

```sh
git branch -m <new-name>
```

If the branch had an upstream under the old name, Step 6 will push the new name and delete the old remote ref.

### Step 6 — Push the branch

The user has pre-authorised force-pushing here.

- No upstream previously: `git push -u origin <branch>`
- Had upstream under the same name: `git push --force-with-lease`
- Renamed and had upstream under the old name:
  ```sh
  git push -u origin <new-name>
  git push origin --delete <old-name>
  ```

If `--force-with-lease` is rejected, stop and surface the output — the remote has commits you don't have locally. Don't escalate to `--force` without explicit confirmation.

### Step 7 — Draft PR title and body

**Title** — one line, release-notes friendly. Derive from:

- the single `feat:` commit if there is exactly one — use its description (without the `feat(scope):` prefix) capitalised, or
- a concise summary of the whole branch otherwise.

Examples:

- `Inline card editing during study sessions` (single feat commit)
- `Study session inline editing and architecture cleanup` (multiple commits, mixed types)

Avoid repeating the Conventional-Commits prefix in the title itself — GitHub release tooling reads commit subjects, not PR titles, and human readers don't need `feat(study-session):` twice.

**Body** — structured so reviewers can skim:

```md
## Summary

<1–3 sentence overview of the user-visible outcome and why this branch exists.>

## Changes

- <bullet per meaningful change, grouped by commit type if helpful>
- ...

## Test plan

- [ ] <what to verify, manually or automated>
- [ ] ...
```

If `.github/pull_request_template.md` exists, use its structure instead and fill in the sections.

Keep the body tight. One short paragraph + a handful of bullets beats a wall of text.

### Step 8 — Open pre-filled PR page

```sh
gh pr create --web \
  --base master \
  --title "<title from Step 7>" \
  --body "<body from Step 7>"
```

`--web` opens the browser on the GitHub "create pull request" form with the fields pre-filled. The user clicks "Create pull request" when satisfied. They can still edit in the browser before submitting.

If `gh` isn't available or auth failed in Step 1: skip this command and print the title and body as two fenced blocks so the user can paste them manually.

### Step 9 — Report

Output:

```
Branch:   <name>   (was: <old-name>)   # omit "was" if unchanged
Commits:
  <new log — short>

PR draft opened in browser.
```

If anything was skipped (branch rename declined, gh unavailable, push blocked), list it under **Deferred items** so it's not forgotten.

## Notes

- **Scope is always `master..HEAD`.** Never rewrite or rename anything already on `master`/`main`.
- Do not squash or reorder in this skill — only rename commits/branches. If the user wants a cleanup pass that combines or drops commits, recommend a separate interactive rebase.
- Do not prefix subjects with ticket numbers; those belong in the body as a `Refs: PROJ-123` trailer if used.
- Do not add co-author trailers during a rename — leave the existing authorship alone.
- If the branch is based on something other than `master` (e.g. a stacked PR on another feature branch), adjust the base-ref everywhere (`master..HEAD`, `--base master`) and confirm with the user first.
