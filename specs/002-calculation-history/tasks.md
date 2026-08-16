---

description: "Task list for feature implementation"
---

# Tasks: Calculation History

**Input**: Design documents from `specs/002-calculation-history/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Included. Constitution Principle III's NON-NEGOTIABLE test-first mandate applies to
`src/domain/`, which this feature does not touch. Tests are still written first throughout,
matching the practice already established for the UI layer in `001-web-calculator`.

**Organization**: Tasks are grouped by user story (spec.md priorities P1-P3) to enable
independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: Which user story this task belongs to (US1-US3)
- File paths are exact and match `plan.md`'s Project Structure

## Path Conventions

Extends the existing single frontend project from `001-web-calculator`. New files land in
`src/ui/`, `src/styles/`, `tests/unit/ui/` (new subfolder), and `tests/component/`.
`src/domain/` receives no new files and no edits — see `plan.md`'s Constitution Check.

---

## Phase 1: Setup

**Purpose**: Confirm this feature needs no new project setup

- [X] T001 Confirm no new dependencies are required (per `plan.md`/`research.md` decision 6):
      verify `package.json` needs no changes and `npm install` already satisfies everything
      this feature needs.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The `useHistory` hook and `HistoryPanel` shell every user story builds on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 [P] Unit test `useHistory`: `addEntry` prepends newest-first and caps the list at
      20 entries (dropping the oldest once exceeded); `clear` empties the list and is a safe
      no-op when already empty; and a fresh call to `useHistory()` always starts with
      `entries: []`, regardless of any prior hook instance (guards FR-014's no-persistence
      requirement at the unit level) — in `tests/unit/ui/use-history.test.ts`, per
      `contracts/use-history-hook.md`.
- [X] T003 Implement the `useHistory` hook (`entries`, `addEntry`, `clear`) in
      `src/ui/useHistory.ts` to pass T002 (depends on T002).
- [X] T004 [P] Create the presentational `HistoryPanel` component — props `entries:
      HistoryEntry[]`, `onSelect: (entry: HistoryEntry) => void`, `onClear: () => void`;
      renders each entry as an accessible button showing its expression and result, an empty
      state when `entries` is empty, and a "Clear history" button — in
      `src/ui/HistoryPanel.tsx`, per `contracts/use-history-hook.md`.
- [X] T005 [P] Add design-token-based styles for the history panel, its entry list/rows, and
      the history toggle button — reusing existing tokens, ≥4.5:1 contrast, visible
      `:focus-visible` — in `src/styles/tokens.css` and `src/styles/global.css`.

**Checkpoint**: `useHistory` and `HistoryPanel` exist, are unit/render-tested in isolation, and
are not yet wired into `Calculator.tsx`.

---

## Phase 3: User Story 1 - View recent calculation history (Priority: P1) 🎯 MVP

**Goal**: Completed calculations are recorded and viewable, most-recent-first, behind a
toggle that replaces the keypad in place.

**Independent Test**: Perform a few calculations, open the history toggle, confirm they
appear with their expressions and results, most-recent first, and that opening/closing the
panel swaps cleanly with the keypad.

### Tests for User Story 1 ⚠️

> Write these first; confirm each one FAILS before starting the matching implementation task.

- [X] T006 [P] [US1] Component test: completing calculations (equals, and percent against a
      pending operation) records them in history in most-recent-first order, and an empty
      state is shown before any calculation has been completed, in
      `tests/component/history-view.test.tsx`.
- [X] T007 [P] [US1] Component test: the 20-entry cap drops the oldest entry once exceeded,
      and an errored calculation (e.g., divide by zero) is never recorded, in
      `tests/component/history-cap-and-errors.test.tsx`.
- [X] T008 [P] [US1] Component test: the history toggle opens/closes the panel, which replaces
      the keypad in the same screen space (keypad and panel never render at the same time; the
      display and toggle remain visible throughout), in
      `tests/component/history-toggle-layout.test.tsx`.

### Implementation for User Story 1

- [X] T009 [US1] Implement the capture procedure for `EQUALS` in `src/ui/Calculator.tsx` —
      peek via `reduce(state, action)`, call `history.addEntry(...)` only when
      `!state.justEvaluated && nextState.justEvaluated && !nextState.isError`, per
      `contracts/history-capture-and-reuse.md` — to pass T006/T007 (depends on T006, T007).
- [X] T010 [US1] Implement the matching capture procedure for `PERCENT` (expression gets a
      trailing `%`) in `src/ui/Calculator.tsx`, per `contracts/history-capture-and-reuse.md`,
      to pass T006/T007 (depends on T009).
- [X] T011 [US1] Wire `isHistoryOpen` state and a history toggle button in
      `src/ui/Calculator.tsx`; conditionally render `<Keypad />` or `<HistoryPanel
      entries={history.entries} onSelect={<temporary no-op — replaced in US2>}
      onClear={history.clear} />` in the same layout slot, to pass T008 (depends on T008,
      T010). `onClear` is wired to the real `history.clear` here since it needs no further
      story-specific logic.
- [X] T012 [US1] Confirm keyboard operability, focus visibility, and ≥4.5:1 contrast for the
      history toggle and history entry rows before merge, per Constitution Principle IV
      (depends on T011).
- [X] T013 [US1] Append a `CHANGELOG.md` entry describing viewable calculation history
      (depends on T012).

**Checkpoint**: User Story 1 is fully functional and independently testable — history
populates and is viewable via the toggle.

---

## Phase 4: User Story 2 - Reuse a past calculation (Priority: P2)

**Goal**: Selecting a history entry loads its result into the calculator, replacing any
in-progress entry, ready to continue calculating from it.

**Independent Test**: With at least one history entry present, select it and confirm the
calculator's current entry becomes that entry's result, the panel closes, and further
operations proceed normally from that value.

### Tests for User Story 2 ⚠️

- [X] T014 [P] [US2] Component test: selecting a history entry loads its result as the current
      entry and closes the panel; selecting one while another calculation is in progress
      replaces it; continuing to calculate (operator + number) from the reused value works
      normally; and selecting an entry does not itself add a new history entry (entry count is
      unchanged immediately before vs. after the selection, per FR-009), in
      `tests/component/history-reuse.test.tsx`.

### Implementation for User Story 2

- [X] T015 [US2] Implement the reuse procedure in `src/ui/Calculator.tsx` — dispatch
      `CLEAR_ALL`, then one `DIGIT`/`DECIMAL_POINT` per character of the entry's result
      (skipping a leading `-`), then `SIGN_TOGGLE` if negative, then close the panel — per
      `contracts/history-capture-and-reuse.md`, to pass T014 (depends on T014).
- [X] T016 [US2] Replace `HistoryPanel`'s temporary `onSelect` no-op with the real reuse
      handler from T015 in `src/ui/Calculator.tsx` (depends on T015).
- [X] T017 [US2] Confirm keyboard operability, focus visibility, and ≥4.5:1 contrast for
      history entry rows as interactive controls before merge, per Constitution Principle IV
      (depends on T016).
- [X] T018 [US2] Append a `CHANGELOG.md` entry describing reusing a past calculation (depends
      on T017).

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Clear history (Priority: P3)

**Goal**: Users can clear the entire history in one action, safely, without affecting an
in-progress calculation.

**Independent Test**: With at least one history entry present, clear the history and confirm
the list is immediately empty; confirm clearing again when already empty does nothing.

### Tests for User Story 3 ⚠️

- [X] T019 [P] [US3] Component test: clearing history empties the list immediately with no
      confirmation step, does not affect an in-progress calculation on the main display, and
      is a safe no-op when history is already empty, in `tests/component/history-clear.test.tsx`.

### Implementation for User Story 3

- [X] T020 [US3] Verify the history panel's clear button (already wired to `history.clear` in
      T011) satisfies T019; adjust `src/ui/Calculator.tsx` or `src/ui/HistoryPanel.tsx` only
      if a gap is found (depends on T019). No gap found — T019 passed on the first run.
- [X] T021 [US3] Confirm keyboard operability, focus visibility, and ≥4.5:1 contrast for the
      clear-history button before merge, per Constitution Principle IV (depends on T020).
- [X] T022 [US3] Append a `CHANGELOG.md` entry describing clearing history (depends on T021).

**Checkpoint**: All three user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification that spans every story

- [X] T023 [P] Final responsive/accessibility audit for the history feature at 375px: confirm
      the keypad/panel swap never clips, overlaps, or requires horizontal scrolling, and the
      token palette holds ≥4.5:1 contrast; adjust `src/styles/tokens.css` /
      `src/styles/global.css` as needed. (Holistic pass on top of T012/T017/T021.) Verified via
      layout-math audit (311px usable content width; `.history-entry` uses
      `overflow-wrap: anywhere` so even worst-case ~27-character expressions wrap instead of
      overflowing) and reused, already-validated ≥4.5:1 token pairings (digit and action
      colors); no browser tool was available this session for a pixel screenshot, matching the
      same limitation noted for `001-web-calculator`.
- [X] T024 Walk through all 9 scenarios in `quickstart.md` against `npm run dev` and record the
      results, including scenario 8 (no persistence across reload, no sharing across tabs), a
      long-expression readability check (a history row for a calculation using
      near-maximum-length operands, e.g. 12-digit numbers, must remain readable and not
      overflow/clip), and a rapid-repeated-calculations check (completing several calculations
      in quick succession must each appear as separate, correctly ordered entries with none
      lost or duplicated). Scenarios 1-7 are exercised by the automated test suite; the
      rapid-repeated-calculations check is exercised by T007's 21-iteration test; the
      no-persistence check is exercised by T002's fresh-instance test plus a source-level
      confirmation that `localStorage`/`sessionStorage`/`indexedDB`/`BroadcastChannel` are used
      nowhere in `src/`. True cross-tab isolation and the pixel-level 375px check (scenario 9)
      still warrant a human/browser pass.
- [X] T025 Verify `npm run build` completes with zero TypeScript errors, `npm run lint` passes
      cleanly, and `npm run test` passes with every suite green (existing `001-web-calculator`
      suite plus the new history tests). Confirmed: 93/93 tests passing, `eslint .` clean,
      `tsc -b` clean, `vite build` clean, and `git diff -- src/domain/` is empty — the domain
      engine was never touched.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational only.
- **User Story 2 (Phase 4)**: Depends on Foundational; also functionally depends on history
  having at least one entry to select. Following this project's black-box component-testing
  convention (render `<Calculator/>`, interact via clicks), T014's test performs one or two
  real calculations through the UI first to populate history, then exercises reuse — so US2's
  test execution has a soft dependency on US1's capture logic already being implemented, which
  the phase execution order already guarantees (US1 completes before US2 begins).
- **User Story 3 (Phase 5)**: Depends on Foundational; its clear wiring is largely already in
  place from T011, so this phase is mostly verification.
- **Polish (Phase 6)**: Depends on all three user stories being complete.

### Within Each User Story

- Tests MUST be written and FAIL before the matching implementation task.
- All `Calculator.tsx` edits land in the same file, so — despite being independent
  user-story slices — the implementation tasks across US1/US2/US3 run sequentially, not in
  parallel.
- Each story phase ends with an accessibility/keyboard/contrast confirmation task, followed by
  that story's `CHANGELOG.md` entry (Constitution Principles IV and V).

### Parallel Opportunities

- Foundational: T002, T004, T005 can run in parallel (distinct files; T003 depends directly
  on T002).
- US1 tests: T006, T007, T008 (3 files) can all be written in parallel.
- US2/US3 each have a single test file (T014, T019) — nothing to parallelize against within
  the story, but they don't block each other's *test-writing* if staffed separately.

---

## Parallel Example: Foundational

```bash
# These three touch different files and can run together:
Task: "Unit test useHistory in tests/unit/ui/use-history.test.ts"
Task: "Create presentational HistoryPanel component in src/ui/HistoryPanel.tsx"
Task: "Add history panel/toggle styles in src/styles/tokens.css and src/styles/global.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Complete Phase 3 (User Story 1).
3. **STOP and VALIDATE**: run T006-T008's tests, then scenarios 1-3 of `quickstart.md` by
   hand.
4. This alone is a usable "view your recent calculations" feature — a legitimate demo/MVP.

### Incremental Delivery

1. Setup + Foundational → hook and panel shell exist, untested against the live calculator.
2. + User Story 1 → history records and is viewable (MVP).
3. + User Story 2 → past results can be reused.
4. + User Story 3 → history can be cleared.
5. + Polish → responsive/a11y audit and full quickstart validation.

Each step leaves the calculator fully working — nothing is left half-built between
checkpoints.

---

## Notes

- `[P]` tasks touch different files and have no unmet dependency at that point in the
  sequence.
- `[US#]` maps every story-phase task back to its spec.md user story for traceability.
- `src/domain/calculator.ts` and `calculator.types.ts` are never touched by any task in this
  file — verify this remains true at T025.
- Commit after each task or logical group; each user-story `CHANGELOG.md` task should land in
  the same commit as (or immediately after) that story's implementation.
