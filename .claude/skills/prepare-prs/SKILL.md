---
name: prepare-pr
description: Prepare a branch for PR by rewriting commit messages into release-notes-friendly Conventional Commits, renaming the branch if it no longer fits the changes, splitting unrelated or oversized work into a stack of smaller PRs, drafting a PR title and body, and opening the GitHub "create PR" page pre-filled. Use when a feature branch is code-complete and ready for review.
allowed-tools: Read, Edit, Write, Bash, Glob, Grep
lastUpdated: 2026-04-17T01:40:00Z
---

## Why this skill exists

Feature branches accumulate vague commits ("fix", "tests", "refactor study-session to be cleaner"), stale branch names, unrelated drive-bys, no release-notes thought. Skill fix all in one pass so PR ready for review and merge lands clean in changelog.

Output:

1. Branch commits grouped into one or more PRs — unrelated split out, oversized broken into reviewable stack.
2. Commits renamed to **Conventional Commits** (see style guide below).
3. Branches renamed if slug no longer fit.
4. Branches pushed (force-with-lease if rewritten, fresh push if new).
5. Each PR submitted via `gh pr create` — created directly (no browser) for multi-PR plans, opened pre-filled in browser for single PR.

History may be published — **user pre-authorised force-push on this branch** — don't block on upstream. Still surface actions before doing them.

## Conventional Commits — style guide

### Why

Release-notes tools (release-please, semantic-release, git-cliff, Changesets) read commit subject to categorise:

- `feat:` → **Features**, often minor bump
- `fix:` → **Bug Fixes**, patch bump
- `refactor:`, `perf:`, `docs:`, `test:`, `chore:`, `style:`, `build:`, `ci:`, `revert:` → **Internal** or omitted from user-facing notes
- `feat!:` / trailer `BREAKING CHANGE:` → **Breaking Changes**, major bump

Even without automation, format reads well in changelog and makes git log skim productive.

### Format

```
<type>(<scope>): <description>
```

- **type** — one of `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`, `style`, `build`, `ci`, `revert`. Pick by user-facing effect, not biggest file changed.
- **scope** — short domain tag (`study-session`, `cards`, `auth`, `deck-settings`). Omit only if truly cross-cutting. Prefer existing scope from branch or recent git log.
- **description** — imperative ("add X", not "added X" or "adds X"), lowercase, no trailing period, no ticket numbers. Describe user-visible change or concrete outcome — not mechanics. Under ~72 chars.

### Examples

Good:

- `feat(study-session): edit card text mid-session`
- `fix(auth): prevent infinite redirect after session refresh`
- `refactor(cards): replace CardRecord class with saveCard API`

Bad:

- `updates` — no type, no info
- `refactor study-session to be cleaner` — no scope, vague
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

Block and warn if any true:

- Current branch is `master` or `main`.
- `master..HEAD` empty **and** no staged changes. Nothing to prepare.
- `gh` not authenticated. Final step need it; authenticate now or agree to skip auto-open.

**Uncommitted changes.** Inspect `git status --short`:

- **Staged** (`A`/`M`/`D`/`R` col 1): commit before continuing. Read staged diff (`git diff --cached`), group by concern if mixed, propose Conventional Commits messages. Wait for approval, commit. Treat new commits as part of branch for rest of workflow.
- **Unstaged** (col 2 only — `M`/`D`/`?`): leave alone. Don't `git add`, don't stash, don't mention as blocker. Sit out of PR by design.
- **Mixed**: handle staged as above; ignore unstaged.

Note current upstream (`git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null`) so push step can decide flags.

### Step 2 — Inspect each commit

For each SHA from `git log master..HEAD --oneline`, run:

```sh
git show --stat <sha>
```

Read enough of diff to understand user-visible effect. If stat ambiguous, `git show <sha> -- <path>` on interesting files. Goal: know what _belongs_ in subject, not just what got touched.

Per commit answer:

1. User-visible (feature, fix, UX tweak) or internal (refactor, test, docs, chore)?
2. Smallest accurate scope?
3. Concrete outcome in one imperative clause?
4. Depends on earlier commit, or independent?

### Step 3 — Decide: one PR or several

Before writing messages, decide single PR or split. Two forces push toward splitting:

**A. Unrelated concerns.** Commits touching different areas, could merge in any order. Review load, revert blast radius, changelog noise all worse when unrelated work rides together.

Signs:

- Different top-level domains/scopes, no shared code changes (e.g. `study-session` feature + `skills` tooling).
- One commit revertable without affecting others.
- Commit types tell you: `feat` + `chore` sharing no files ≈ two PRs.
- Drive-by fix, tooling change, or doc update tacked onto feature branch.

**B. Size.** Even related work unreviewable past a size. Reviewers skim or rubber-stamp big PRs.

Rough thresholds (judgment, not hard rule):

- **> ~400 net lines changed** or **> ~15 files touched** → consider split.
- **> ~800 net lines** → split unless mostly mechanical (generated, renames, lockfile churn). Call out mechanical portions so reviewers skim.
- Multiple logical phases (e.g. "introduce abstraction" → "migrate callers" → "delete old API") → each phase natural split point.

**Keep together when:**

- Commits tightly coupled, final state only makes sense as unit.
- Total size small (under thresholds).
- All share scope and single user-visible outcome.

Propose grouping as short plan:

```
Proposed PRs:
  1. <branch-name-1> — <one-line summary>
     - <sha> <subject>
     - <sha> <subject>
  2. <branch-name-2> — <one-line summary>   [stacked on #1]
     - <sha> <subject>
```

If PR depends on another (later PR's commits need earlier PR's changes to compile/run/make sense), mark stacked. **Wait for approval** before proceeding. If user want single PR, skip to Step 5 with whole branch as one group.

### Step 4 — Plan the split (only if splitting)

For each proposed PR, decide:

- **Branch name** — kebab-case, 3–6 words, describes PR's primary change. See Step 6 rules.
- **Base branch** — `master` for first (or only independent) PR. For stacked, base is previous PR's branch.
- **Commits** — SHAs belonging in this PR, in order.

Execute split. Mechanics depend on shape:

**Case A — Contiguous commits, splittable by cut point.** Commits already ordered so each PR's commits contiguous. Use `git branch` + `git reset` to carve:

```sh
# Starting state: current branch has commits A - B - C - D off master.
# Want PR#1 = A, B (base master) and PR#2 = C, D (base PR#1's branch).

git branch <pr2-branch>            # mark current tip for later
git reset --hard <sha-of-B>        # current branch now ends at B → becomes PR#1
git branch -m <pr1-branch>         # rename if needed
# PR#2's branch already points at D; its base will be <pr1-branch>
```

**Case B — Non-contiguous or interleaved commits.** Cherry-pick relevant commits onto fresh branches off correct base:

```sh
git checkout -b <pr1-branch> master
git cherry-pick <sha-a> <sha-c>    # PR#1's commits
git checkout -b <pr2-branch>       # off <pr1-branch>
git cherry-pick <sha-b> <sha-d>    # PR#2's commits, which depend on PR#1
```

After either case, run `git log <base>..HEAD --oneline` on each branch to confirm expected commits present, and `git diff <base>..HEAD --stat` to confirm diff expected. If cherry-pick hits conflict, stop and surface — don't resolve speculatively.

Keep note of which branch is which PR and each base. Remaining steps run **per branch**.

### Step 5 — Propose new commit messages

Per branch, show table:

| SHA (short) | Current                                | Proposed                                                                  |
| ----------- | -------------------------------------- | ------------------------------------------------------------------------- |
| `71538c8`   | add edit functionality to session      | `feat(study-session): edit card text mid-session`                         |
| `e6d0a22`   | Refactor study-session to be cleaner   | `refactor(study-session): extract composables and introduce deck context` |
| `7475c52`   | refactor card editing network pipeline | `refactor(cards): replace CardRecord class with saveCard API`             |

**Wait for approval.** Integrate user edits. Messages already good Conventional Commits can stay — call out rather than re-propose verbatim.

### Step 6 — Rewrite commit messages

Run per branch with messages to rewrite. Use `git filter-branch --msg-filter` with `case` on `$GIT_COMMIT` (pre-rewrite SHA). Preserves authorship, dates, trailers, parentage — only subject changes.

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

Use **full** 40-char SHAs in case — short SHAs won't match. `<base>` is `master` for root PR and parent PR's branch for stacked.

For multi-line messages (body after blank line), use heredoc inside case arm:

```sh
<sha>) cat <<'EOF'
feat(study-session): edit card text mid-session

Adds an edit button on the study card that swaps in a text editor
and debounces saves through saveCard.
EOF
;;
```

Verify with `git log <base>..HEAD --oneline` and `git log <base>..HEAD --stat` (diffs unchanged from before rewrite).

If stacked, rewrite base PR first, then rebase stacked children onto rewritten base so they pick up new parent SHAs:

```sh
git checkout <child-branch>
git rebase <parent-branch>
```

### Step 7 — Evaluate and, if needed, rename each branch

PR titles in GitHub UI default to:

- single commit's subject if branch has **one** commit off base, or
- branch name humanised (kebab-case → spaces, capitalised) if multiple commits.

So branch name is primary lever for good default title with multiple commits. Even with single commit, tidy branch name reads better in PR list and branch sidebar.

Per branch, compare name to commit subjects. If still fits, keep. Else propose kebab-case slug:

- 3–6 words
- Describes primary change for that PR (feature focus or primary refactor)
- Lowercase, hyphen-separated
- No ticket prefix unless repo convention uses one (check recent merged via `gh pr list --state merged --limit 10`)
- Humanises into clean sentence — e.g. `study-session-inline-edit-cleanup` → "Study session inline edit cleanup"

Show old → new, wait for approval, rename:

```sh
git branch -m <old-name> <new-name>
```

### Step 8 — Push branches

User pre-authorised force-push here.

Per branch:

- No upstream previously: `git push -u origin <branch>`
- Had upstream under same name: `git push --force-with-lease`
- Renamed and had upstream under old name:
  ```sh
  git push -u origin <new-name>
  git push origin --delete <old-name>
  ```

Push stacked in order — parents before children — so GitHub resolves base refs correctly.

If `--force-with-lease` rejected on any branch, stop and surface output. Remote has commits you don't have locally. Don't escalate to `--force` without explicit confirmation.

### Step 9 — Draft PR title and body (per PR)

**Title** — one line, release-notes friendly. Derive from:

- single `feat:` commit if PR has exactly one — use description (without `feat(scope):` prefix) capitalised, or
- concise summary of PR's work otherwise.

Examples:

- `Inline card editing during study sessions` (single feat commit)
- `Study session inline editing and architecture cleanup` (multiple commits, mixed types)

Avoid repeating Conventional-Commits prefix in title — GitHub release tooling reads commit subjects, not PR titles, and humans don't need `feat(study-session):` twice.

**Body** — structured for skim:

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

For **stacked PRs**, add short prelude at top of body pointing to parent so reviewers know context:

```md
> Stacked on #<parent-pr-number-or-branch>. Review after the base PR merges, or review the diff against the parent branch on the "Files changed" tab.
```

If parent PR not opened yet when drafting, reference by branch name and update body later (GitHub renders `#N` references live).

If `.github/pull_request_template.md` exists, use its structure and fill sections.

Keep body tight. One short paragraph + handful of bullets beats wall of text.

### Step 10 — Submit or open each PR

Behaviour depends on PR count:

**Multiple PRs → create each directly, no browser.** Spawning N create-PR tabs in stack annoying; stacked reviews also need parent PR numbers resolved before stacked children reference them.

```sh
gh pr create \
  --base <base-branch> \
  --title "<title from Step 9>" \
  --body "<body from Step 9>"
```

Run parents before children. Capture URL each invocation prints — needed for Step 11 report and for substituting `#N` refs into stacked-child bodies before their own create call.

**Single PR → open pre-filled create page in browser.**

```sh
gh pr create --web \
  --base master \
  --title "<title from Step 9>" \
  --body "<body from Step 9>"
```

`--web` opens GitHub "create pull request" form with fields pre-filled. User click "Create pull request" when satisfied.

`<base-branch>` is `master` for root PR and parent PR's branch name for stacked.

If `gh` unavailable or auth failed in Step 1: skip these and print each PR's title, body, base as fenced blocks so user can create manually.

### Step 11 — Report

Output summary per PR:

```
PR 1: <branch>   (base: master)   (was: <old-name>)   # omit "was" if unchanged
  <url-or-draft-note>
  <new log — short>

PR 2: <branch>   (base: <parent-branch>) [stacked]
  <url>
  <new log — short>
```

Line under header:

- **Multiple-PR runs**: URL returned by each `gh pr create` (e.g. `https://github.com/org/repo/pull/123`).
- **Single-PR runs**: `Draft opened in browser — submit when ready.`

If anything skipped (split declined, rename declined, gh unavailable, push blocked), list under **Deferred items** so not forgotten.

## Notes

- **Scope is always `<base>..HEAD`.** Never rewrite or rename anything already on `master`/`main` — or, for stacked PRs, anything already on parent branch.
- Splitting branch may require reordering or cherry-picking commits onto fresh base. Expected here; not "rewriting history on master" — carving feature-branch history into reviewable units before merge.
- Don't prefix subjects with ticket numbers; belong in body as `Refs: PROJ-123` trailer if used.
- Don't add co-author trailers during rename — leave authorship alone.
- If branch based on something other than `master` (e.g. stacked PR on another feature branch), adjust base-ref everywhere (`<base>..HEAD`, `--base <base>`) and confirm with user first.
- After stacked PRs merge upstream, user may need to rebase remaining children onto `master` — outside skill's scope; flag in report if relevant.
