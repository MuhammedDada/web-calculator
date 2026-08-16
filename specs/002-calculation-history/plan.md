# Implementation Plan: Calculation History

**Branch**: `002-calculation-history` | **Date**: 2026-08-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-calculation-history/spec.md`

## Summary

Add a bounded, in-memory history of completed calculations to the existing web calculator.
Users can open a history panel (via a toggle that replaces the keypad in place), see their
last 20 calculations most-recent-first, tap one to load its result back into the calculator,
and clear the list in one action. The existing pure domain engine (`src/domain/calculator.ts`)
is **not modified** — history state and all history-specific logic live entirely in the UI
layer (`src/ui/`), observing the domain engine's existing public state shape rather than
adding new action types to it.

## Technical Context

**Language/Version**: TypeScript 5.x (`strict: true`) — unchanged from `001-web-calculator`.

**Primary Dependencies**: React 18, Vite 5.x — unchanged. No new dependency is introduced by
this feature (no state-management library, no storage library); history is plain React state
(`useState`/`useCallback`) in a new `src/ui/useHistory.ts` hook.

**Storage**: N/A — per clarified FR-014, history is not persisted across page reloads and is
not shared across browser tabs. No `localStorage`, `sessionStorage`, or backend involved.

**Testing**: Vitest + `@testing-library/react` (already installed for `001-web-calculator`).
The new `useHistory` hook is tested via Testing Library's `renderHook`; the new UI is tested
via the same component-test approach already established (render, `user-event`, assert on
accessible roles/text).

**Target Platform**: Same as `001-web-calculator` — evergreen web browsers, static SPA, no
server runtime.

**Project Type**: Web frontend only (single project) — unchanged.

**Performance Goals**: History capture piggybacks on the domain engine's already-instant
`reduce()` call (see research.md decision 1); no perceptible added latency.

**Constraints**:
- `src/domain/calculator.ts` and `src/domain/calculator.types.ts` MUST NOT change — this is
  both an explicit instruction for this feature and a direct consequence of Constitution
  Principle II (pure logic core) combined with the user's stated intent that history is
  UI-only state.
- History is capped at 20 entries (spec Assumptions); the panel MUST replace the keypad in
  the same screen space on a 375px-wide screen (FR-010/SC-004), not share space with it.

**Scale/Scope**: One new hook (`useHistory`), one new presentational component
(`HistoryPanel`), small edits to `Calculator.tsx` to wire capture/toggle/reuse, and CSS
additions to the existing token-driven stylesheets. No new top-level architecture.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Simplicity & YAGNI | Zero new dependencies — reuses the existing React/Vite/Vitest/Testing Library stack and the existing design-token system. | PASS |
| II. Pure Logic Core | `src/domain/` is untouched by this feature; all history state and logic live in `src/ui/`, observing (never duplicating) the domain engine's existing `CalculatorState` shape. | PASS |
| III. Test-First for the Core | This feature adds no new `src/domain/` code, so the NON-NEGOTIABLE domain TDD mandate has no new surface to apply to. The new UI hook/components will still be built test-first, matching this project's established practice (not constitutionally mandated for UI code, but consistent with how `001-web-calculator` was actually built). | PASS (N/A for domain; honored by convention for UI) |
| IV. Accessible & Responsive by Default | `HistoryPanel` reuses the same semantic-button, `:focus-visible`, and contrast-checked-token patterns as the rest of the app; layout is a full swap (not a shrink) at 375px so nothing is clipped. | PASS |
| V. Change Tracking | `CHANGELOG.md` entries will be added per user story, matching the established pattern. | PASS |

No violations — Complexity Tracking table is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/002-calculation-history/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── use-history-hook.md
│   └── history-capture-and-reuse.md
└── tasks.md              # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root — extends the existing `001-web-calculator` layout)

```text
src/
├── domain/                     # UNCHANGED by this feature
│   ├── calculator.ts
│   ├── calculator.types.ts
│   └── format.ts
├── ui/
│   ├── App.tsx                  # unchanged
│   ├── Calculator.tsx            # MODIFIED: history capture, toggle state, panel/keypad swap
│   ├── Display.tsx               # unchanged
│   ├── Keypad.tsx                # unchanged
│   ├── Button.tsx                # unchanged, reused for history rows/toggle/clear
│   ├── useKeyboard.ts            # unchanged
│   ├── useHistory.ts             # NEW: history state (entries, addEntry, reuse-target, clear)
│   └── HistoryPanel.tsx          # NEW: entry list, empty state, clear button
└── styles/
    ├── tokens.css                 # MODIFIED: any new tokens needed for history rows (reuse first)
    └── global.css                 # MODIFIED: history panel/list/toggle layout

tests/
├── unit/
│   ├── domain/                   # unchanged — no new domain tests (engine untouched)
│   └── ui/                       # NEW subfolder: unit tests for UI-layer hooks (non-domain)
│       └── use-history.test.ts
└── component/                    # existing folder, new files added for this feature
    ├── history-view.test.tsx
    ├── history-reuse.test.tsx
    ├── history-clear.test.tsx
    └── accessibility-history.test.tsx

CHANGELOG.md                      # MODIFIED: entries per user story
```

**Structure Decision**: This feature extends the existing single frontend project — no new
top-level directories except `tests/unit/ui/`, added specifically because `useHistory` is a
React hook (not pure domain logic) and therefore belongs conceptually with UI-layer unit
tests, distinct from the existing `tests/unit/domain/` which is reserved for the pure engine.
Everything else slots into the established `src/ui/` / `src/styles/` / `tests/component/`
layout from `001-web-calculator`. `src/domain/` has no new files and no edits.

## Complexity Tracking

*No Constitution Check violations — this table is intentionally empty.*
