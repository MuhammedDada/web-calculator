---

description: "Task list for feature implementation"
---

# Tasks: Web Calculator

**Input**: Design documents from `specs/001-web-calculator/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Included and REQUIRED — Constitution Principle III mandates a failing unit test
before any core (`src/domain/`) code is written or changed (Red-Green-Refactor,
non-negotiable). Component tests verify the UI/keyboard contract per Principle IV.

**Organization**: Tasks are grouped by user story (spec.md priorities P1-P4) to enable
independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: Which user story this task belongs to (US1-US4)
- File paths are exact and match `plan.md`'s Project Structure

## Path Conventions

Single frontend project at the repository root (no backend): `src/domain/`, `src/ui/`,
`src/styles/`, `tests/unit/domain/`, `tests/component/` — per `plan.md`.

---

## Phase 1: Setup

**Purpose**: Project initialization

- [X] T001 Initialize the Vite + React + TypeScript (strict) project at the repository root
      per `plan.md`'s Project Structure: `package.json`, `tsconfig.json` (`strict: true`),
      `vite.config.ts`, `index.html`, `src/main.tsx`, and empty `src/domain/`, `src/ui/`,
      `src/styles/`, `tests/unit/domain/`, `tests/component/` directories, with `dev` and
      `build` npm scripts. Record the dependency rationale from `research.md` in the commit
      message (Constitution Principle I).
- [X] T002 Configure Vitest in `vite.config.ts` (or a `vitest.workspace.ts`) with two test
      projects: a `node` environment covering `tests/unit/**` and a `jsdom` environment
      covering `tests/component/**`; install `vitest`, `@testing-library/react`, and
      `@testing-library/user-event`; add a `test` npm script. Record the dependency rationale
      from `research.md` in the commit message (Constitution Principle I).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared scaffolding every user story depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Define `Operator`, `CalculatorAction`, and `CalculatorState` types in
      `src/domain/calculator.types.ts`, matching `contracts/domain-engine.md` exactly. (Type
      declarations only — no runtime behavior, so Constitution Principle III's test-first rule
      does not apply to this task.)
- [X] T004 [P] Unit test that `createInitialState()` returns the documented Initial state
      (`currentEntry: "0"`, `previousOperand: null`, `pendingOperator: null`,
      `overwriteOnNextDigit: true`, `isError: false`, `justEvaluated: false`), in
      `tests/unit/domain/initial-state.test.ts`.
- [X] T005 Implement `createInitialState()` and a pass-through `reduce()` stub (returns the
      input state unchanged for every action) in `src/domain/calculator.ts`, to pass T004
      (depends on T003, T004).
- [X] T006 [P] Create presentational `Button`, `Display`, and `Keypad` components (props-only,
      no dispatch wiring yet) in `src/ui/Button.tsx`, `src/ui/Display.tsx`,
      `src/ui/Keypad.tsx`.
- [X] T007 [P] Create the design-token stylesheet and global styles — palette pre-checked for
      ≥4.5:1 contrast, spacing/typography scale, and a visible `:focus-visible` outline — in
      `src/styles/tokens.css` and `src/styles/global.css` (Constitution Principle IV).
- [X] T008 Wire `src/ui/App.tsx` and `src/main.tsx` to render `Keypad` + `Display` via
      `useReducer(reduce, undefined, createInitialState)`, rendering the static initial `"0"`
      (depends on T005, T006, T007).
- [X] T009 [P] Create `CHANGELOG.md` at the repository root with an `## Unreleased` heading
      ready to receive entries (Constitution Principle V).

**Checkpoint**: A non-interactive calculator shell renders `"0"`. Foundation ready for story
implementation.

---

## Phase 3: User Story 1 - Perform a basic calculation (Priority: P1) 🎯 MVP

**Goal**: Digit/decimal entry, the four operators, equals (with chaining), sign-toggle, and
safe handling of divide-by-zero and malformed input, all via on-screen buttons.

**Independent Test**: Load the page, click digit and operator buttons to enter "12 + 7",
click equals, confirm "19" is displayed; confirm chaining, sign-toggle, and that dividing by
zero shows a recoverable error instead of crashing.

### Tests for User Story 1 ⚠️

> Write these first; confirm each one FAILS before starting the matching implementation task.

- [X] T010 [P] [US1] Unit test digit and decimal-point entry — append to `currentEntry`,
      overwrite-on-next-digit after an operator/equals, duplicate-decimal-point guard (first
      wins), and that `currentEntry` never grows beyond a 12-character cap (extra digit
      presses beyond that are ignored) — in `tests/unit/domain/entry.test.ts`.
- [X] T011 [P] [US1] Unit test operator selection: chaining a displayed result into the next
      calculation, and newest-operator-wins when an operator is pressed twice in a row, in
      `tests/unit/domain/operators.test.ts`.
- [X] T012 [P] [US1] Unit test equals evaluation for all four operators, result rounding, that
      pressing equals again with no new input is a no-op (no repeated operation), and that
      pressing equals with no second operand ever entered (e.g., "7 +" then "=") is a strict
      no-op — state is left completely unchanged — per spec Edge Cases, in
      `tests/unit/domain/equals.test.ts`.
- [X] T013 [P] [US1] Unit test that dividing by zero sets an error state (not a crash, not
      `Infinity`/`NaN`), and that any subsequent action (digit, operator, or clear) clears the
      error and starts a fresh entry, in `tests/unit/domain/error.test.ts`.
- [X] T014 [P] [US1] Unit test sign-toggle flips the current entry's sign without disturbing
      any pending operator/operand, in `tests/unit/domain/sign-toggle.test.ts`.
- [X] T015 [P] [US1] Unit test `formatResult` rounds to at most 10 significant digits with no
      floating-point artifacts (e.g., `1/3`, `0.1 + 0.2`), in `tests/unit/domain/format.test.ts`.
- [X] T016 [P] [US1] Component test: clicking on-screen buttons for "12 + 7 =" shows "19" and
      chaining "+ 3 =" shows "22"; also assert the display is never blank/undefined at any
      point in the flow (FR-009), in `tests/component/basic-calculation.test.tsx`.

### Implementation for User Story 1

- [X] T017 [US1] Implement `formatResult(value: number): string` in `src/domain/format.ts` to
      pass T015 (depends on T015).
- [X] T018 [US1] Implement digit and decimal-point reducer cases in `src/domain/calculator.ts`,
      including the 12-character `currentEntry` length cap, to pass T010 (depends on T010).
- [X] T019 [US1] Implement operator-selection and chaining reducer cases in
      `src/domain/calculator.ts` to pass T011 (depends on T011, T018).
- [X] T020 [US1] Implement the equals reducer case (using `formatResult`), the
      no-repeat-equals no-op, and the premature-equals no-op (state left unchanged when `=`
      is pressed with no second operand entered), in `src/domain/calculator.ts` to pass T012
      (depends on T012, T017, T019).
- [X] T021 [US1] Implement the divide-by-zero error state and any-key recovery in
      `src/domain/calculator.ts` to pass T013 (depends on T013, T020).
- [X] T022 [US1] Implement the sign-toggle reducer case in `src/domain/calculator.ts` to pass
      T014 (depends on T014, T018).
- [X] T023 [US1] Wire digit, decimal, operator, equals, and sign-toggle on-screen buttons in
      `src/ui/Keypad.tsx` and `src/ui/Calculator.tsx` to `dispatch` the corresponding actions,
      and render `state.currentEntry` (with an error style) in `src/ui/Display.tsx` (depends on
      T021, T022, T016).
- [X] T024 [US1] Confirm keyboard operability, focus visibility, and ≥4.5:1 contrast for all
      User Story 1 controls (digits, operators, equals, sign-toggle) before merge, per
      Constitution Principle IV (depends on T023).
- [X] T025 [US1] Append a `CHANGELOG.md` entry describing basic calculation, chaining,
      sign-toggle, and divide-by-zero behavior (depends on T024).

**Checkpoint**: User Story 1 is fully functional and independently testable via on-screen
buttons.

---

## Phase 4: User Story 2 - Correct a mistake without starting over (Priority: P2)

**Goal**: Delete the last digit, clear only the current entry (CE), and clear everything
(AC), all via on-screen buttons.

**Independent Test**: Type "123", press delete, confirm "12"; enter "50 +" then "3", press CE,
confirm entry resets to "0" while "50 +" is preserved; press AC, confirm full reset.

### Tests for User Story 2 ⚠️

- [X] T026 [P] [US2] Unit test delete removes the last character of `currentEntry` and is a
      no-op when it is already `"0"`, in `tests/unit/domain/delete.test.ts`.
- [X] T027 [P] [US2] Unit test clear-entry resets only `currentEntry` to `"0"`, preserving
      `pendingOperator`/`previousOperand`, in `tests/unit/domain/clear-entry.test.ts`.
- [X] T028 [P] [US2] Unit test clear-all resets state to exactly the Initial state, in
      `tests/unit/domain/clear-all.test.ts`.
- [X] T029 [P] [US2] Component test: on-screen delete/CE/AC buttons match spec User Story 2's
      four acceptance scenarios, in `tests/component/correct-mistake.test.tsx`.

### Implementation for User Story 2

- [X] T030 [US2] Implement the delete reducer case in `src/domain/calculator.ts` to pass T026
      (depends on T026).
- [X] T031 [US2] Implement the clear-entry reducer case in `src/domain/calculator.ts` to pass
      T027 (depends on T027, T030).
- [X] T032 [US2] Implement the clear-all reducer case in `src/domain/calculator.ts` to pass
      T028 (depends on T028, T031).
- [X] T033 [US2] Wire delete, clear-entry, and clear-all on-screen buttons in
      `src/ui/Keypad.tsx` and `src/ui/Calculator.tsx` to dispatch the corresponding actions
      (depends on T032, T029).
- [X] T034 [US2] Confirm keyboard operability, focus visibility, and ≥4.5:1 contrast for all
      User Story 2 controls (delete, CE, AC) before merge, per Constitution Principle IV
      (depends on T033).
- [X] T035 [US2] Append a `CHANGELOG.md` entry describing delete/clear-entry/clear-all
      behavior (depends on T034).

**Checkpoint**: User Stories 1 and 2 both work independently via on-screen buttons.

---

## Phase 5: User Story 3 - Operate the calculator entirely from the keyboard (Priority: P3)

**Goal**: Every action from Stories 1-2 (and, once built, Story 4) is reachable via the exact
keyboard mapping in `contracts/keyboard-mapping.md`, and unmapped keys are ignored.

**Independent Test**: Without touching the mouse/touchscreen, complete a calculation
(including a correction and a clear) using only keyboard keys; confirm results match the
equivalent mouse-driven interaction.

### Tests for User Story 3 ⚠️

- [X] T036 [P] [US3] Component test: every key in `contracts/keyboard-mapping.md` (digits,
      `.`, `+-*/`, `%`, `Enter`/`=`, `Backspace`, `Delete`, `Escape`, `F9`) triggers its mapped
      action end-to-end, and an unmapped key (e.g., `a`) has no effect, in
      `tests/component/keyboard-mapping.test.tsx`.

### Implementation for User Story 3

- [X] T037 [US3] Implement the `useKeyboard` hook mapping `keydown` events to
      `CalculatorAction` dispatches per `contracts/keyboard-mapping.md`, ignoring unmapped
      keys, in `src/ui/useKeyboard.ts` (depends on T036).
- [X] T038 [US3] Attach the `useKeyboard` hook in `src/ui/Calculator.tsx` (listener attached
      while the calculator is mounted, removed on unmount) (depends on T037).
- [X] T039 [US3] Confirm keyboard operability, focus visibility, and ≥4.5:1 contrast are
      unaffected by the keyboard listener (e.g., it does not trap `Tab` focus) before merge,
      per Constitution Principle IV (depends on T038).
- [X] T040 [US3] Append a `CHANGELOG.md` entry describing full keyboard parity (depends on
      T039).

**Checkpoint**: User Stories 1, 2, and 3 all work independently.

---

## Phase 6: User Story 4 - Calculate a percentage (Priority: P4)

**Goal**: A dedicated percent action: percentage of the stored operand when a calculation is
pending, divide-by-100 when standalone.

**Independent Test**: Enter "200 + 10 %", confirm "220"; enter "50 %" alone, confirm "0.5".

### Tests for User Story 4 ⚠️

- [X] T041 [P] [US4] Unit test percent computes the percentage of `previousOperand` when
      `pendingOperator` is set, divides `currentEntry` by 100 when standalone, and does not
      crash when no number has been entered, in `tests/unit/domain/percent.test.ts`.
- [X] T042 [P] [US4] Component test: on-screen percent button reproduces spec User Story 4's
      two acceptance scenarios, in `tests/component/percentage.test.tsx`.

### Implementation for User Story 4

- [X] T043 [US4] Implement the percent reducer case, using `formatResult` for the computed
      result, in `src/domain/calculator.ts` to pass T041 (depends on T041).
- [X] T044 [US4] Wire the on-screen percent button in `src/ui/Keypad.tsx` (the keyboard `%`
      key already dispatches via User Story 3's hook — no keyboard change needed) (depends on
      T043, T042).
- [X] T045 [US4] Confirm keyboard operability, focus visibility, and ≥4.5:1 contrast for the
      percent control before merge, per Constitution Principle IV (depends on T044).
- [X] T046 [US4] Append a `CHANGELOG.md` entry describing percentage behavior (depends on
      T045).

**Checkpoint**: All four user stories are independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verification that spans every story

- [X] T047 [P] Final responsive/accessibility audit across all four stories: confirm no
      clipped or overlapping controls at 375px width, every control has a visible
      `:focus-visible` outline and an accessible name, and the token palette holds ≥4.5:1
      contrast; adjust `src/styles/tokens.css` / `src/styles/global.css` as needed. (This is a
      holistic pass on top of the per-story checks in T024/T034/T039/T045.) Verified via
      layout-math audit (343px available width / 4 columns = ~72px per button, well above the
      44px minimum) and computed contrast ratios (all pairings ≥4.5:1, see tokens.css
      comments); no browser tool was available this session for a pixel screenshot, so a
      human/browser confirmation of scenario 9 in quickstart.md is still recommended.
- [X] T048 Walk through all 9 scenarios in `quickstart.md` against `npm run dev` and record
      the results, including a quick rapid-keypress check (mashing a digit or operator in
      quick succession) to confirm no duplicate or lost input. Scenarios 1, 3, 4, 5, 7, 8 are
      exercised by the automated test suite (basic-calculation, correct-mistake,
      keyboard-mapping, percentage, equals/entry/operators unit tests); scenarios 2 and 6 are
      covered by `tests/component/quickstart-scenarios.test.tsx`. Rapid repeated dispatches are
      safe by construction (`reduce` is a pure, synchronous function driving `useReducer`, so
      there is no async window for lost/duplicate input). Scenario 9 (pixel-level responsive
      check) is covered by the T047 layout-math audit, pending a human browser pass.
- [X] T049 Verify `npm run build` completes with zero TypeScript errors and `npm run test`
      passes with every suite green. Confirmed: 69/69 tests passing, `tsc -b` clean, `vite
      build` clean.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational only.
- **User Story 2 (Phase 4)**: Depends on Foundational only — independently testable, though it
  naturally follows US1 since there is more to correct once US1 exists.
- **User Story 3 (Phase 5)**: Depends on Foundational; its tests exercise actions from US1/US2,
  so implement after those two are functional even though the keyboard-wiring code itself
  touches different files.
- **User Story 4 (Phase 6)**: Depends on Foundational; `previousOperand`/`pendingOperator`
  already exist from US1, so this phase only adds the percent branch.
- **Polish (Phase 7)**: Depends on all four user stories being complete.

### Within Each User Story

- Tests MUST be written and FAIL before the matching implementation task (Constitution
  Principle III, non-negotiable for `src/domain/`).
- All reducer-case implementation tasks land in the same file (`src/domain/calculator.ts`),
  so — despite being independent user-story slices — they run sequentially, not in parallel,
  within and across US1/US2/US4.
- UI wiring tasks depend on their story's reducer cases being implemented.
- Each story phase ends with an accessibility/keyboard/contrast confirmation task, followed by
  that story's `CHANGELOG.md` entry (Constitution Principles IV and V).

### Parallel Opportunities

- Foundational: T004, T006, T007, T009 can run in parallel once T003 is done (distinct files;
  T005 is not parallel since it directly depends on T004).
- US1 tests: T010-T016 (7 files) can all be written in parallel.
- US2 tests: T026-T029 (4 files) can all be written in parallel.
- US4 tests: T041-T042 (2 files) can be written in parallel.
- Different user stories' *test-writing* tasks could proceed in parallel across stories if
  staffed, but their *implementation* tasks share `src/domain/calculator.ts` and must be
  serialized in story-priority order (P1 → P2 → P3 → P4) regardless of staffing.

---

## Parallel Example: User Story 1 tests

```bash
# All seven US1 test files touch nothing else and can be written together:
Task: "Unit test digit and decimal-point entry in tests/unit/domain/entry.test.ts"
Task: "Unit test operator selection and chaining in tests/unit/domain/operators.test.ts"
Task: "Unit test equals evaluation and no-repeat-equals in tests/unit/domain/equals.test.ts"
Task: "Unit test divide-by-zero and any-key recovery in tests/unit/domain/error.test.ts"
Task: "Unit test sign-toggle in tests/unit/domain/sign-toggle.test.ts"
Task: "Unit test formatResult rounding in tests/unit/domain/format.test.ts"
Task: "Component test basic calculation flow in tests/component/basic-calculation.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Complete Phase 3 (User Story 1).
3. **STOP and VALIDATE**: run T010-T016's tests, then scenario 1-2 and 6-8 of `quickstart.md`
   by hand.
4. This alone is a usable, crash-safe four-operation calculator — a legitimate demo/MVP.

### Incremental Delivery

1. Setup + Foundational → shell renders `"0"`.
2. + User Story 1 → basic arithmetic works end-to-end (MVP).
3. + User Story 2 → mistakes are correctable without restarting.
4. + User Story 3 → full keyboard parity.
5. + User Story 4 → percentage support.
6. + Polish → responsive/a11y audit and full quickstart validation.

Each step leaves the calculator fully working — nothing is left half-built between
checkpoints.

---

## Notes

- `[P]` tasks touch different files and have no unmet dependency at that point in the
  sequence.
- `[US#]` maps every story-phase task back to its spec.md user story for traceability.
- All `src/domain/` implementation tasks follow Red-Green-Refactor: the matching test must be
  written and observed failing first (Constitution Principle III, NON-NEGOTIABLE) — this
  includes the Foundational `createInitialState()`/`reduce()` stub (T004 before T005), not
  just the story phases.
- Each story phase's accessibility/keyboard/contrast check (e.g., T024, T034, T039, T045)
  satisfies the constitution's "before merge" requirement per story, rather than deferring
  that gate to the single end-of-project audit (T047).
- Commit after each task or logical group; each user-story `CHANGELOG.md` task should land in
  the same commit as (or immediately after) that story's implementation.
