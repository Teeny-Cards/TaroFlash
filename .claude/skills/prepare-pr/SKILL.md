---
name: prepare-pr
description: Prepare a branch for PR by rewriting commit messages into release-notes-friendly Conventional Commits, renaming the branch if it no longer fits the changes, splitting unrelated or oversized work into a stack of smaller PRs, drafting a PR title and body, and opening the GitHub "create PR" page pre-filled. Use when a feature branch is code-complete and ready for review.
allowed-tools: Read, Edit, Write, Bash, Glob, Grep
---

## Why this skill exists

Feature branches often accumulate vague commits ("fix", "tests", "refactor study-session to be cleaner"), a branch name that no longer describes the work, unrelated drive-by changes bundled in, and no thought given to how the PR will read in release notes. This skill fixes all of that in one pass so the PR is ready to review and the final merge lands in the changelog in a usable shape.

The output is:

1. The branch's commits grouped into one or more PRs — unrelated concerns split out, oversized work broken into a reviewable stack.
2. Commits renamed into **Conventional Commits** format (see style guide below).
3. Branches renamed if their slugs no longer fit.
4. Branches pushed (force-with-lease if rewritten, fresh push if new).
5. GitHub "create PR" pages opened in the browser with title + body pre-filled via `gh pr create --web`, one per PR, each with the correct base branch for stacked reviews.

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
git diff master..HEAD --stat
git status --short
gh auth status
```

Block and surface a warning if any of these are true:

- Current branch is `master` or `main`.
- `git status` shows uncommitted changes — ask the user to commit or stash first.
- `master..HEAD` is empty. Nothing to prepare.
- `gh` is not authenticated. The final step needs it; either authenticate now or agree to skip the auto-open at the end.

Note the current upstream (`git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null`) so the push step can decide flags.

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
4. Does this commit depend on an earlier commit on the branch, or is it independent?

### Step 3 — Decide: one PR or several

Before writing any messages, decide whether the branch should ship as a single PR or be split into multiple. Two separate forces push toward splitting:

**A. Unrelated concerns.** Commits that touch genuinely different areas and could merge in either order. Review load, revert blast radius, and changelog noise all get worse when unrelated work rides together.

Signs of unrelated concerns:

- Different top-level domains/scopes with no shared code changes (e.g. `study-session` feature + `skills` tooling).
- One commit could be reverted without affecting any of the others.
- Commit types tell you: a `feat` + a `chore` that share no files is almost always two PRs.
- A drive-by fix, tooling change, or doc update tacked onto a feature branch.

**B. Size.** Even related work becomes unreviewable past a certain size. Reviewers skim or rubber-stamp large PRs.

Rough size thresholds (use judgment, not a hard rule):

- **> ~400 net lines changed** or **> ~15 files touched** → consider splitting.
- **> ~800 net lines** → split unless the diff is mostly mechanical (generated code, renames, lockfile churn). Call out mechanical portions so reviewers know what to skim.
- Multiple logical phases on the branch (e.g. "introduce abstraction" then "migrate callers" then "delete old API") → each phase is a natural split point.

**When to keep it together:**

- Commits build on each other in a tightly-coupled way and the final state only makes sense as a unit.
- Total size is small (under the thresholds above).
- All commits share a scope and a single user-visible outcome.

Propose the grouping to the user as a short plan:

```
Proposed PRs:
  1. <branch-name-1> — <one-line summary>
     - <sha> <subject>
     - <sha> <subject>
  2. <branch-name-2> — <one-line summary>   [stacked on #1]
     - <sha> <subject>
```

If any PR depends on another (the later PR's commits need the earlier PR's changes to compile/run/make sense), mark it stacked. **Wait for approval** before proceeding. If the user wants a single PR, skip to Step 5 with the whole branch as one group.

### Step 4 — Plan the split (only if splitting)

For each proposed PR, decide:

- **Branch name** — kebab-case, 3–6 words, describes that PR's primary change. See Step 6 rules.
- **Base branch** — `master` for the first (or only independent) PR. For stacked PRs, base is the previous PR's branch.
- **Commits** — the SHAs that belong in this PR, in order.

Then execute the split. The exact mechanics depend on the shape of the split:

**Case A — Contiguous commits, splittable by cut point.** The branch's commits already sit in an order where each PR's commits are contiguous. Use `git branch` + `git reset` to carve them out:

```sh
# Starting state: current branch has commits A - B - C - D off master.
# Want PR#1 = A, B (base master) and PR#2 = C, D (base PR#1's branch).

git branch <pr2-branch>            # mark current tip for later
git reset --hard <sha-of-B>        # current branch now ends at B → becomes PR#1
git branch -m <pr1-branch>         # rename if needed
# PR#2's branch already points at D; its base will be <pr1-branch>
```

**Case B — Non-contiguous or interleaved commits.** Cherry-pick the relevant commits onto fresh branches off the correct base:

```sh
git checkout -b <pr1-branch> master
git cherry-pick <sha-a> <sha-c>    # PR#1's commits
git checkout -b <pr2-branch>       # off <pr1-branch>
git cherry-pick <sha-b> <sha-d>    # PR#2's commits, which depend on PR#1
```

After either case, run `git log <base>..HEAD --oneline` on each branch to confirm the expected commits are present and `git diff <base>..HEAD --stat` to confirm the diff is what you expect. If a cherry-pick hits a conflict, stop and surface it — do not resolve speculatively.

Keep a note of which branch is which PR and what each one's base is. The remaining steps run **per branch**.

### Step 5 — Propose new commit messages

For each branch in the plan, show a table:

| SHA (short) | Current | Proposed |
| --- | --- | --- |
| `71538c8` | add edit functionality to session | `feat(study-session): edit card text mid-session` |
| `e6d0a22` | Refactor study-session to be cleaner | `refactor(study-session): extract composables and introduce deck context` |
| `7475c52` | refactor card editing network pipeline | `refactor(cards): replace CardRecord class with saveCard API` |

**Wait for approval.** Integrate any user edits. Messages that are already in good Conventional Commits shape can be left unchanged — call that out rather than re-proposing them verbatim.

### Step 6 — Rewrite commit messages

Run this on each branch that has messages to rewrite. Use `git filter-branch --msg-filter` with a `case` on `$GIT_COMMIT` (the pre-rewrite SHA). This preserves authorship, dates, trailers, and parentage — only the subject changes.

```sh
git checkout <branch>
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch -f --msg-filter '
case "$GIT_COMMIT" in
  <full-sha-1>) echo "<new message 1>" ;;
  <full-sha-2>) echo "<new message 2>" ;;
  *) cat ;;
esac
' <base>..HEAD
```

Use the **full** 40-char SHAs in the case statement — short SHAs will not match. `<base>` is `master` for the root PR and the parent PR's branch for stacked PRs.

For multi-line messages (body after a blank line), use a heredoc inside the case arm:

```sh
<sha>) cat <<'EOF'
feat(study-session): edit card text mid-session

Adds an edit button on the study card that swaps in a text editor
and debounces saves through saveCard.
EOF
;;
```

Verify with `git log <base>..HEAD --oneline` and `git log <base>..HEAD --stat` (diffs should be unchanged from before the rewrite).

If PRs are stacked, rewrite the base PR first, then rebase stacked children onto the rewritten base so they pick up the new parent SHAs:

```sh
git checkout <child-branch>
git rebase <parent-branch>
```

### Step 7 — Evaluate and, if needed, rename each branch

PR titles in the GitHub UI default to:

- the single commit's subject if the branch has **one** commit off its base, or
- the branch name humanised (kebab-case → spaces, capitalised) if there are **multiple** commits.

So the branch name is the primary lever for a good default title when there are multiple commits. Even with a single commit, a tidy branch name reads better in the PR list and in the branch sidebar.

For each branch, compare the name to its commit subjects. If it still fits, keep it. Otherwise propose a kebab-case slug:

- 3–6 words
- Describes the primary change for that PR (feature focus or primary refactor)
- Lowercase, hyphen-separated
- No ticket prefix unless repo convention uses one (check recent merged PRs via `gh pr list --state merged --limit 10`)
- Humanises into a clean sentence — e.g. `study-session-inline-edit-cleanup` → "Study session inline edit cleanup"

Show old → new, wait for approval, then rename:

```sh
git branch -m <old-name> <new-name>
```

### Step 8 — Push branches

The user has pre-authorised force-pushing here.

For each branch:

- No upstream previously: `git push -u origin <branch>`
- Had upstream under the same name: `git push --force-with-lease`
- Renamed and had upstream under the old name:
  ```sh
  git push -u origin <new-name>
  git push origin --delete <old-name>
  ```

Push stacked branches in order — parents before children — so GitHub resolves the base refs correctly.

If `--force-with-lease` is rejected on any branch, stop and surface the output. The remote has commits you don't have locally. Don't escalate to `--force` without explicit confirmation.

### Step 9 — Draft PR title and body (per PR)

**Title** — one line, release-notes friendly. Derive from:

- the single `feat:` commit if the PR has exactly one — use its description (without the `feat(scope):` prefix) capitalised, or
- a concise summary of that PR's work otherwise.

Examples:

- `Inline card editing during study sessions` (single feat commit)
- `Study session inline editing and architecture cleanup` (multiple commits, mixed types)

Avoid repeating the Conventional-Commits prefix in the title itself — GitHub release tooling reads commit subjects, not PR titles, and human readers don't need `feat(study-session):` twice.

**Body** — structured so reviewers can skim:

```md
## Summary

<1–3 sentence overview of the user-visible outcome and why this PR exists.>

## Changes

- <bullet per meaningful change, grouped by commit type if helpful>
- ...

## Test plan

- [ ] <what to verify, manually or automated>
- [ ] ...
```

For **stacked PRs**, add a short prelude at the top of the body pointing at the parent so reviewers know the context:

```md
> Stacked on #<parent-pr-number-or-branch>. Review after the base PR merges, or review the diff against the parent branch on the "Files changed" tab.
```

If the parent PR hasn't been opened yet when drafting, reference it by branch name and update the body later (GitHub renders `#N` references live).

If `.github/pull_request_template.md` exists, use its structure instead and fill in the sections.

Keep the body tight. One short paragraph + a handful of bullets beats a wall of text.

### Step 10 — Open pre-filled PR page (per PR)

For each branch, open the GitHub create-PR page with base set correctly:

```sh
gh pr create --web \
  --base <base-branch> \
  --title "<title from Step 9>" \
  --body "<body from Step 9>"
```

`<base-branch>` is `master` for the root PR and the parent PR's branch name for stacked PRs. `--web` opens the browser on the GitHub "create pull request" form with the fields pre-filled. The user clicks "Create pull request" when satisfied.

Open root PRs first so their PR numbers exist by the time stacked PRs are drafted (lets you reference `#N` in the body).

If `gh` isn't available or auth failed in Step 1: skip this command and print the title and body as fenced blocks so the user can paste them manually.

### Step 11 — Report

Output a summary per PR:

```
PR 1: <branch>   (base: master)   (was: <old-name>)   # omit "was" if unchanged
  <new log — short>

PR 2: <branch>   (base: <parent-branch>) [stacked]
  <new log — short>

All PR draft pages opened in browser.
```

If anything was skipped (split declined, rename declined, gh unavailable, push blocked), list it under **Deferred items** so it's not forgotten.

## Notes

- **Scope is always `<base>..HEAD`.** Never rewrite or rename anything already on `master`/`main` — or, for stacked PRs, anything already on the parent branch.
- Splitting a branch may require reordering or cherry-picking commits onto a fresh base. That's expected here; it is not "rewriting history on master" — it's carving the feature-branch history into reviewable units before anything merges.
- Do not prefix subjects with ticket numbers; those belong in the body as a `Refs: PROJ-123` trailer if used.
- Do not add co-author trailers during a rename — leave the existing authorship alone.
- If the branch is based on something other than `master` (e.g. a stacked PR on another feature branch), adjust the base-ref everywhere (`<base>..HEAD`, `--base <base>`) and confirm with the user first.
- After stacked PRs merge upstream, the user may need to rebase remaining children onto `master` — that is outside this skill's scope; just flag it in the report if relevant.
