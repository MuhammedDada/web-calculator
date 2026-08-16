# Implementation Plan: Web Calculator

**Branch**: `001-web-calculator` | **Date**: 2026-08-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-web-calculator/spec.md`

## Summary

A single-page web calculator supporting the four basic operations, percentage, sign-toggle,
clear-entry/clear-all/backspace, full keyboard parity, and graceful handling of malformed
input (divide-by-zero, repeated operators, double decimals). Built as a Vite + React +
TypeScript SPA with no backend, no state-management library, and no UI component library.
All arithmetic and input-sequencing logic lives in a pure, framework-free domain module
(`src/domain/`); React is used only to render that state and forward events to it.

## Technical Context

**Language/Version**: TypeScript 5.x (`strict: true`)

**Primary Dependencies**: React 18, Vite 5.x, `@vitejs/plugin-react`. No state-management
library (React's built-in `useReducer` wraps the pure domain reducer). No UI/component
library — plain CSS with design tokens.

**Storage**: N/A — no persistence, no accounts, no backend/database (confirmed in spec
Assumptions).

**Testing**: Vitest for domain unit tests (Node environment, TDD per Constitution
Principle III). Vitest + `@testing-library/react` + `@testing-library/user-event` (jsdom
environment) for keyboard-mapping and interaction tests.

**Target Platform**: Evergreen web browsers (desktop and mobile), static SPA — no server
runtime.

**Project Type**: Web frontend only (single project, no backend component).

**Performance Goals**: Interactions (digit/operator press → display update) feel instant —
sub-100ms perceived response; matches SC-001 (basic calculation completed within 10s by a
first-time user, with headroom to spare).

**Constraints**: Fully usable/legible with no layout breakage at 375px viewport width
(FR-013); contrast ratio ≥ 4.5:1 and full keyboard operability (Constitution Principle IV);
offline-capable is not required (no network dependency exists to begin with, since there is
no backend).

**Scale/Scope**: One screen, ~16-18 interactive controls (digits, 4 operators, %, =, AC, CE,
delete, sign-toggle), one pure domain module. No multi-user or data-volume concerns.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Simplicity & YAGNI | Stack is React + Vite only — no state library, no UI kit, no router (single screen). Each dependency has a stated reason in Technical Context / research.md. | PASS |
| II. Pure Logic Core | All arithmetic/input-sequencing logic lives in `src/domain/`, which the Project Structure below keeps free of React/DOM imports and independently unit-testable. | PASS |
| III. Test-First for the Core | Vitest is the domain test runner; tasks phase will require a failing test before each engine change (Red-Green-Refactor). | PASS |
| IV. Accessible & Responsive by Default | research.md documents the concrete approach: semantic `<button>`s, visible `:focus-visible`, ≥4.5:1 token palette, relative-unit responsive layout validated at 375px. | PASS |
| V. Change Tracking | `CHANGELOG.md` will be created as part of the first implementation task and updated by every behavior-changing commit thereafter. | PASS (scaffolding task, not a design artifact) |

No violations — Complexity Tracking table is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-web-calculator/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── domain-engine.md
│   └── keyboard-mapping.md
└── tasks.md              # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
index.html
vite.config.ts
tsconfig.json
package.json

src/
├── domain/                  # Pure calculation engine (Constitution Principle II)
│   ├── calculator.ts         # reduce(state, action) -> state; pure, zero React/DOM imports
│   ├── calculator.types.ts   # CalculatorState, CalculatorAction union
│   └── format.ts             # display rounding/formatting (FR-014: <=10 significant digits)
├── ui/
│   ├── App.tsx
│   ├── Calculator.tsx        # wires domain reducer to on-screen + keyboard events
│   ├── Display.tsx
│   ├── Keypad.tsx
│   ├── Button.tsx
│   └── useKeyboard.ts        # keyboard event -> domain action (per FR-008 mapping table)
├── styles/
│   ├── tokens.css            # color/spacing/typography design tokens, contrast-checked
│   └── global.css
└── main.tsx

tests/
├── unit/
│   └── domain/                # Vitest: calculator.ts, format.ts (Principle III, TDD)
└── component/                 # Vitest + Testing Library: keyboard mapping, a11y, responsive smoke

CHANGELOG.md                   # Constitution Principle V
```

**Structure Decision**: Single frontend project at the repository root — no `backend/` or
`api/` directory, since the spec and user instruction both confirm no server/database
component. The `src/domain/` vs `src/ui/` split is the physical enforcement of Constitution
Principle II: `domain/` MUST NOT import from `ui/`, React, or any DOM/browser API, and is
tested in isolation under `tests/unit/domain/`. `src/ui/` is a thin adapter layer that owns
all rendering, keyboard listening, and styling, and depends on `domain/` — never the reverse.

## Complexity Tracking

*No Constitution Check violations — this table is intentionally empty.*
