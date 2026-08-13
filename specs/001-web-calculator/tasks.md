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

- [ ] T001 Initialize the Vite + React + TypeScript (strict) project at the repository root
      per `plan.md`'s Project Structure: `package.json`, `tsconfig.json` (`strict: true`),
      `vite.config.ts`, `index.html`, `src/main.tsx`, and empty `src/domain/`, `src/ui/`,
      `src/styles/`, `tests/unit/domain/`, `tests/component/` directories, with `dev` and
      `build` npm scripts.
- [ ] T002 Configure Vitest in `vite.config.ts` (or a `vitest.workspace.ts`) with two test
      projects: a `node` environment covering `tests/unit/**` and a `jsdom` environment
      covering `tests/component/**`; install `vitest`, `@testing-library/react`, and
      `@testing-library/user-event`; add a `test` npm script.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared scaffolding every user story depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Define `Operator`, `CalculatorAction`, and `CalculatorState` types in
      `src/domain/calculator.types.ts`, matching `contracts/domain-engine.md` exactly.
- [ ] T004 [P] Implement `createInitialState()` and a pass-through `reduce()` stub (returns
      the input state unchanged for every action) in `src/domain/calculator.ts`, establishing
      the module's public shape ahead of story-specific branches.
- [ ] T005 [P] Implement `formatResult(value: number): string` skeleton in
      `src/domain/format.ts` (signature only, per `contracts/domain-engine.md`); the rounding
      body is filled in by User Story 1.
- [ ] T006 [P] Create presentational `Button`, `Display`, and `Keypad` components (props-only,
      no dispatch wiring yet) in `src/ui/Button.tsx`, `src/ui/Display.tsx`,
      `src/ui/Keypad.tsx`.
- [ ] T007 [P] Create the design-token stylesheet and global styles — palette pre-checked for
      ≥4.5:1 contrast, spacing/typography scale, and a visible `:focus-visible` outline — in
      `src/styles/tokens.css` and `src/styles/global.css` (Constitution Principle IV).
- [ ] T008 Wire `src/ui/App.tsx` and `src/main.tsx` to render `Keypad` + `Display` via
      `useReducer(reduce, undefined, createInitialState)`, rendering the static initial `"0"`
      (depends on T004, T006, T007).
- [ ] T009 [P] Create `CHANGELOG.md` at the repository root with an `## Unreleased` heading
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

- [ ] T010 [P] [US1] Unit test digit and decimal-point entry — append to `currentEntry`,
      overwrite-on-next-digit after an operator/equals, and duplicate-decimal-point guard (first
      wins) — in `tests/unit/domain/entry.test.ts`.
- [ ] T011 [P] [US1] Unit test operator selection: chaining a displayed result into the next
      calculation, and newest-operator-wins when an operator is pressed twice in a row, in
      `tests/unit/domain/operators.test.ts`.
- [ ] T012 [P] [US1] Unit test equals evaluation for all four operators, result rounding, and
      that pressing equals again with no new input is a no-op (no repeated operation), in
      `tests/unit/domain/equals.test.ts`.
- [ ] T013 [P] [US1] Unit test that dividing by zero sets an error state (not a crash, not
      `Infinity`/`NaN`), and that any subsequent action (digit, operator, or clear) clears the
      error and starts a fresh entry, in `tests/unit/domain/error.test.ts`.
- [ ] T014 [P] [US1] Unit test sign-toggle flips the current entry's sign without disturbing
      any pending operator/operand, in `tests/unit/domain/sign-toggle.test.ts`.
- [ ] T015 [P] [US1] Unit test `formatResult` rounds to at most 10 significant digits with no
      floating-point artifacts (e.g., `1/3`, `0.1 + 0.2`), in `tests/unit/domain/format.test.ts`.
- [ ] T016 [P] [US1] Component test: clicking on-screen buttons for "12 + 7 =" shows "19" and
      chaining "+  3 =" shows "22", in `tests/component/basic-calculation.test.tsx`.

### Implementation for User Story 1

- [ ] T017 [US1] Implement the `formatResult` rounding body in `src/domain/format.ts` to pass
      T015 (depends on T015).
- [ ] T018 [US1] Implement digit and decimal-point reducer cases in `src/domain/calculator.ts`
      to pass T010 (depends on T010).
- [ ] T019 [US1] Implement operator-selection and chaining reducer cases in
      `src/domain/calculator.ts` to pass T011 (depends on T011, T018).
- [ ] T020 [US1] Implement the equals reducer case (using `formatResult`) and the
      no-repeat-equals no-op in `src/domain/calculator.ts` to pass T012 (depends on T012, T017,
      T019).
- [ ] T021 [US1] Implement the divide-by-zero error state and any-key recovery in
      `src/domain/calculator.ts` to pass T013 (depends on T013, T020).
- [ ] T022 [US1] Implement the sign-toggle reducer case in `src/domain/calculator.ts` to pass
      T014 (depends on T014, T018).
- [ ] T023 [US1] Wire digit, decimal, operator, equals, and sign-toggle on-screen buttons in
      `src/ui/Keypad.tsx` and `src/ui/Calculator.tsx` to `dispatch` the corresponding actions,
      and render `state.currentEntry` (with an error style) in `src/ui/Display.tsx` (depends on
      T021, T022, T016).
- [ ] T024 [US1] Append a `CHANGELOG.md` entry describing basic calculation, chaining,
      sign-toggle, and divide-by-zero behavior (depends on T023).

**Checkpoint**: User Story 1 is fully functional and independently testable via on-screen
buttons.

---

## Phase 4: User Story 2 - Correct a mistake without starting over (Priority: P2)

**Goal**: Delete the last digit, clear only the current entry (CE), and clear everything
(AC), all via on-screen buttons.

**Independent Test**: Type "123", press delete, confirm "12"; enter "50 +" then "3", press CE,
confirm entry resets to "0" while "50 +" is preserved; press AC, confirm full reset.

### Tests for User Story 2 ⚠️

- [ ] T025 [P] [US2] Unit test delete removes the last character of `currentEntry` and is a
      no-op when it is already `"0"`, in `tests/unit/domain/delete.test.ts`.
- [ ] T026 [P] [US2] Unit test clear-entry resets only `currentEntry` to `"0"`, preserving
      `pendingOperator`/`previousOperand`, in `tests/unit/domain/clear-entry.test.ts`.
- [ ] T027 [P] [US2] Unit test clear-all resets state to exactly the Initial state, in
      `tests/unit/domain/clear-all.test.ts`.
- [ ] T028 [P] [US2] Component test: on-screen delete/CE/AC buttons match spec User Story 2's
      four acceptance scenarios, in `tests/component/correct-mistake.test.tsx`.

### Implementation for User Story 2

- [ ] T029 [US2] Implement the delete reducer case in `src/domain/calculator.ts` to pass T025
      (depends on T025).
- [ ] T030 [US2] Implement the clear-entry reducer case in `src/domain/calculator.ts` to pass
      T026 (depends on T026, T029).
- [ ] T031 [US2] Implement the clear-all reducer case in `src/domain/calculator.ts` to pass
      T027 (depends on T027, T030).
- [ ] T032 [US2] Wire delete, clear-entry, and clear-all on-screen buttons in
      `src/ui/Keypad.tsx` and `src/ui/Calculator.tsx` to dispatch the corresponding actions
      (depends on T031, T028).
- [ ] T033 [US2] Append a `CHANGELOG.md` entry describing delete/clear-entry/clear-all
      behavior (depends on T032).

**Checkpoint**: User Stories 1 and 2 both work independently via on-screen buttons.

---

## Phase 5: User Story 3 - Operate the calculator entirely from the keyboard (Priority: P3)

**Goal**: Every action from Stories 1-2 (and, once built, Story 4) is reachable via the exact
keyboard mapping in `contracts/keyboard-mapping.md`, and unmapped keys are ignored.

**Independent Test**: Without touching the mouse/touchscreen, complete a calculation
(including a correction and a clear) using only keyboard keys; confirm results match the
equivalent mouse-driven interaction.

### Tests for User Story 3 ⚠️

- [ ] T034 [P] [US3] Component test: every key in `contracts/keyboard-mapping.md` (digits,
      `.`, `+-*/`, `%`, `Enter`/`=`, `Backspace`, `Delete`, `Escape`, `F9`) triggers its mapped
      action end-to-end, and an unmapped key (e.g., `a`) has no effect, in
      `tests/component/keyboard-mapping.test.tsx`.

### Implementation for User Story 3

- [ ] T035 [US3] Implement the `useKeyboard` hook mapping `keydown` events to
      `CalculatorAction` dispatches per `contracts/keyboard-mapping.md`, ignoring unmapped
      keys, in `src/ui/useKeyboard.ts` (depends on T034).
- [ ] T036 [US3] Attach the `useKeyboard` hook in `src/ui/Calculator.tsx` (listener attached
      while the calculator is mounted, removed on unmount) (depends on T035).
- [ ] T037 [US3] Append a `CHANGELOG.md` entry describing full keyboard parity (depends on
      T036).

**Checkpoint**: User Stories 1, 2, and 3 all work independently.

---

## Phase 6: User Story 4 - Calculate a percentage (Priority: P4)

**Goal**: A dedicated percent action: percentage of the stored operand when a calculation is
pending, divide-by-100 when standalone.

**Independent Test**: Enter "200 + 10 %", confirm "220"; enter "50 %" alone, confirm "0.5".

### Tests for User Story 4 ⚠️

- [ ] T038 [P] [US4] Unit test percent computes the percentage of `previousOperand` when
      `pendingOperator` is set, divides `currentEntry` by 100 when standalone, and does not
      crash when no number has been entered, in `tests/unit/domain/percent.test.ts`.
- [ ] T039 [P] [US4] Component test: on-screen percent button reproduces spec User Story 4's
      two acceptance scenarios, in `tests/component/percentage.test.tsx`.

### Implementation for User Story 4

- [ ] T040 [US4] Implement the percent reducer case in `src/domain/calculator.ts` to pass T038
      (depends on T038).
- [ ] T041 [US4] Wire the on-screen percent button in `src/ui/Keypad.tsx` (the keyboard `%`
      key already dispatches via User Story 3's hook — no keyboard change needed) (depends on
      T040, T039).
- [ ] T042 [US4] Append a `CHANGELOG.md` entry describing percentage behavior (depends on
      T041).

**Checkpoint**: All four user stories are independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verification that spans every story

- [ ] T043 [P] Responsive/accessibility audit: confirm no clipped or overlapping controls at
      375px width, every control has a visible `:focus-visible` outline and an accessible
      name, and the token palette holds ≥4.5:1 contrast; adjust `src/styles/tokens.css` /
      `src/styles/global.css` as needed.
- [ ] T044 Walk through all 9 scenarios in `quickstart.md` against `npm run dev` and record
      the results.
- [ ] T045 Verify `npm run build` completes with zero TypeScript errors and `npm run test`
      passes with every suite green.

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
- Each story's `CHANGELOG.md` task is last in its phase (Constitution Principle V).

### Parallel Opportunities

- Foundational: T004, T005, T006, T007, T009 can run in parallel once T003 is done (distinct
  files).
- US1 tests: T010-T016 (7 files) can all be written in parallel.
- US2 tests: T025-T028 (4 files) can all be written in parallel.
- US4 tests: T038-T039 (2 files) can be written in parallel.
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
  written and observed failing first (Constitution Principle III, NON-NEGOTIABLE).
- Commit after each task or logical group; each user-story `CHANGELOG.md` task should land in
  the same commit as (or immediately after) that story's implementation.
