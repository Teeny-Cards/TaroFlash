---
name: audit-architecture
description: Run a full architecture audit (separation of concerns, reusability, naming, theming tokens, locale paths, default centralization, prop drilling vs provide/inject, ui-kit domain neutrality, layout-kit usage, stale tests, dead code). Default scope is the current branch's diff vs master. Use `--global` to expand to the entire `src/` tree. Optional `--context "<note>"` feeds extra heuristics. Trigger on `/audit-architecture`, "audit architecture", "audit this branch", "review for smells", or after a multi-step refactor when the user wants a structural sanity check.
allowed-tools: Read, Bash, Glob, Grep
lastUpdated: 2026-05-10T00:00:00Z
---

## What this skill produces

A **dense, scannable** punch list. The user should be able to read the whole report in under a minute.

Format: one line per finding. Skip empty audit areas entirely. End with a 3–5 item priority list. Do **not** apply fixes — wait for the user to pick.

Each finding line:

```
- {severity} {path:line} — {problem}. {why it matters in one phrase}. → {fix in one phrase}
```

Severity tags: `H` (real bug or architectural break), `M` (clear smell, easy fix), `L` (nit, taste).

Don't write "Suggested fix:" / "Reason:" labels — the structure carries them. Don't add prose paragraphs around findings. If a finding needs more than one sentence to explain, it's two findings.

## Inputs

| Flag / param         | Purpose                                                                                                                                                                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--global`           | Expand scope from `git diff master..HEAD` to the entire `src/` tree (and relevant `tests/` mirrors). Use sparingly — global scans are slow.                                                                                                                                           |
| `--context "<note>"` | Free-text hint that biases the audit. Examples: `"focus on ui-kit primitives"`, `"ignore study-session/* — separate refactor"`, `"the deck-editor refactor is not done; flag prop drilling but defer fixes"`. Surface the note in the report header so the user knows you applied it. |

If neither is provided, default scope is the branch diff. If a global scan finds > 50 findings, stop and ask whether to focus on a sub-area first.

## Audit areas

Walk these in order. Each has its own checks; bundle the findings under one heading per area.

### 1. Separation of concerns

- Components mixing networking, business logic, and presentation in one file.
- Composables that own session state but also format payloads, mutate args, or render markup.
- `src/api/<domain>/db/*.ts` containing pure helpers that should live under `src/utils/<domain>/`.
- Functions doing more than one job (orchestrator + worker in the same body — see `code-style.md`).

### 2. Reusability + duplication

- The same writable-computed factory (`field<K>(key)`) repeated in two or more components → lift to a shared util/composable, or replace the pattern with provide/inject.
- The same `bg-X dark:bg-Y` (or `text-`, `ring-`) pair appearing in ≥ 3 files → promote to a semantic `--color-*` token in `main.css` (see `theming.md`).
- Triple-repeated `v-sfx="{ hover: ..., click: ... }"` blocks on similar buttons → extract a private subcomponent.
- Default values (form defaults, runtime fallbacks, UI bounds) defined inline in multiple call sites → centralize in `src/utils/<domain>/defaults.ts`.

### 3. Prop drilling vs provide/inject

- A modal/page root passes the same composable's reactive output (`config`, `settings`, `cover`, etc.) through 2+ levels as props. Prefer `provide()` at the root and `inject()` at the leaves.
- A child component takes a prop named after the parent's reactive object and mutates `props.foo[key] = v` — explicit smell. Either inject the editor directly, or accept primitive props with proper `v-model` bindings per field.
- Skip if the leaf takes a derived slice (e.g. one side's `CardAttributes`) and doesn't need the rest of the editor.

### 4. ui-kit domain neutrality

- Prop, slot, or emit names on `src/components/ui-kit/*` that bake consumer semantics: `all_label`, `published`, `is_premium`, etc. Rename to shape-describing names (`pill_label`, `data-active`) and let the call site map domain meaning.
- ui-kit components with `theme` / `themeDark` props (anti-pattern — let `data-theme` forward via `inheritAttrs`).
- ui-kit primitives that span multiple files but live as siblings under `ui-kit/`. Promote to `ui-kit/<name>/index.vue` + siblings (see `architecture.md`).

### 5. Layout-kit usage

- Components in `src/components/layout-kit/` with their own visual treatment (colors, themed surfaces, font choices). Layout primitives arrange other content; visual identity belongs in `ui-kit/`.
- Recurring `flex-col gap-X` containers that mirror `section-list` / `labeled-section` but reimplement the structure inline. Refactor to use the layout primitives.

### 6. Theming tokens

- `bg-blue-500` / `bg-pink-400` / hex literals on themeable surfaces. Should use `var(--theme-primary)` etc.
- `--theme-*` tokens applied to base chrome (labels, idle states, section headings) — base chrome stays on the static brown/grey palette per `theming.md`.
- `@apply` usage in `<style>` blocks (forbidden by `no-apply`).

### 7. Locale path conventions

- Top-level locale keys (`card-designer.foo`) that should live under their feature path (`deck.settings-modal.design.card-designer.foo`).
- Strings hardcoded in templates instead of going through `t()` / `useI18n()` (see `i18n.md`).
- Shared keys across unrelated callsites (also in `i18n.md`).

### 8. Naming + file structure

- Single-file directories (`foo/index.vue` with no siblings) — flatten unless the directory mirrors a sibling pattern intentionally.
- Cross-directory imports that suggest the file is misplaced (`'../tab-bar.vue'` — likely belongs inside the importer's directory).
- Inconsistent leaf placement (one feature uses `card-designer/index.vue` + `card-designer/align-picker.vue`, another uses flat `card-designer.vue` + sibling helpers). Pick one and apply consistently.
- Directory names that repeat the parent (`deck-settings/tab-deck-settings/`).

### 9. Defaults + dead code

- Unused size/variant maps (`sm` / `base` / `lg` where every caller passes `base`) — see `code-style.md`.
- Settings/config fields defaulted in 3+ places — centralize in `src/utils/<domain>/defaults.ts`.
- Orphaned locale keys after a feature was removed (search for the key; if no callers, drop it).
- Components imported but never used (rare — TS / lint usually catches).

### 10. Stale or thin tests

- Test files referencing testids, prop shapes, or import paths that don't match the current source.
- Tests that pass vacuously (only assert truthy / `toBeDefined()` after a destructive change to the component).
- Component tests that assert on Tailwind class names (forbidden — `testing.md` says `data-*` only).
- Missing tests for newly added composables / primitives.

### 11. Cross-cutting consistency

- Mixed state-attr conventions (`data-checked` on some components, `data-active` on others). `data-active` is canonical (`vue-templates.md`).
- Inconsistent kebab-case vs camelCase on file/dir names.
- Mixed `defineModel` vs prop+emit patterns where the codebase has chosen one (defineModel is the project default).

## Workflow

1. **Resolve scope.**
   - Default: `git diff --name-only master...HEAD -- 'src/' 'tests/' '.claude/'`. If the branch hasn't diverged from master, fall back to the staged + unstaged changes.
   - With `--global`: glob `src/**/*.{ts,vue}` and the matching `tests/` files.
   - Print the file count up-front so the user can re-scope if needed.

2. **Read the rules.** Load every file under `.claude/rules/` so the audit's heuristics match the project's current conventions. Don't audit against generic Vue best practices when a project rule says otherwise.

3. **Walk the audit areas in order.** For each area, run the checks above and write findings to a buffer. Don't intersperse findings from different areas — the report is grouped.

4. **Apply context bias.** If `--context` was passed, drop or down-weight findings the note tells you to ignore, and surface the note at the top of the report so the user sees how it shaped the output.

5. **Render the report.** One line per finding. Skip empty audit areas (no "0 findings" placeholder). End with 3–5 priority items.

6. **Stop.** Do **not** edit code. Wait for the user to say "fix #N" or "do the high-severity ones" before touching files.

## Report shape

Header lines (no preamble), then one heading per area with findings, then a short priority list. Skip any heading that has no findings.

```markdown
# Audit — `refactor-foo` (branch diff)

Context: focus on ui-kit primitives
Files in scope: 12

## SoC

- M `src/components/foo.vue:42` — payload built inline pre-save. Couples view to persistence shape. → move builder to `src/utils/foo/payload.ts`.

## Reuse

- M `tab-study + card-designer` — same `field<K>(key)` factory in both. Bypasses Vue's emit contract. → provide/inject the editor (see `architecture.md`).
- L 4 components — repeat `bg-brown-100 dark:bg-grey-700`. Drift risk on dark-mode tweaks. → promote to `--color-input` token.

## Naming + structure

- L `deck-settings/tab-bar.vue` — used only by `tab-design` via `'../tab-bar.vue'`. Cross-dir import smell. → move into `tab-design/`.

## Priority

1. H `deck-settings/tab-study` — prop drilling → provide/inject.
2. H `cover-designer/index.test.js` — stale testids after refactor.
3. M Promote `bg-brown-100 dark:bg-grey-700` → `--color-input`.
```

If a finding doesn't fit on one line, split it or trim the "why". The user can open the cited file for more detail.

## When NOT to invoke

- Single-file changes — overkill, just review the diff.
- Already mid-refactor with an open task list — the audit will repeat what the user is already tracking.
- No git history available (e.g. fresh worktree without master) — fall back to `--global` only if the user explicitly asks.

## Heuristics

- Audit is **non-destructive**. Read-only tools. Don't run formatters, lints, or tests as part of the audit — those are validation steps the user can run separately.
- If a finding overlaps with an existing project rule, cite the rule by name in the suggested fix (e.g. "see `architecture.md` — provide/inject section"). Saves the user re-reading the audit logic.
- Cap the report at ~20 findings. If the count exceeds that, group similar findings on a single line ("4 components mutate prop reactives — X, Y, Z, W") and recommend running `--context` with a focus filter on the next pass.
- Brevity > completeness. Findings the user can't act on shouldn't be in the report. If you're unsure whether something's a smell, leave it out.
- Be specific about locations. `src/components/foo.vue:42` beats "the foo component". The user shouldn't need to grep.

## Trigger phrases

`/audit-architecture`, "audit architecture", "audit this branch", "review for smells", "structural review", "architecture pass". Don't auto-trigger after every commit — user-invoked only.
