# Phase 0 Research: Web Calculator

All items below were resolved from the user-supplied technical direction (Vite + React +
TypeScript strict, Vitest, plain CSS with design tokens, pure engine in `src/domain/`, no
backend) plus the project constitution. No `NEEDS CLARIFICATION` markers remain.

## 1. State management approach

**Decision**: No external state-management library. The pure domain module exposes a
`reduce(state, action): state` function; the React UI wraps it with the built-in
`useReducer` hook and re-renders on state change.

**Rationale**: A single-screen calculator has one piece of shared state. `useReducer`
already gives predictable, testable state transitions, and the reducer itself is the pure
domain function required by Constitution Principle II — no adapter is needed beyond calling
it from `useReducer`'s signature.

**Alternatives considered**: Redux Toolkit, Zustand, Jotai — rejected under Principle I
(Simplicity & YAGNI): each adds a dependency and boilerplate to solve a problem
(cross-component/cross-route shared state) that doesn't exist in a one-screen app.

## 2. Domain engine design

**Decision**: Model the engine as a pure reducer over a `CalculatorState` object and a
closed `CalculatorAction` union (digit, decimal-point, operator, percent, sign-toggle,
clear-entry, clear-all, delete, equals). Every transition required by the spec's Functional
Requirements and Edge Cases — chaining (FR-007), percent-of-previous-operand (FR-003),
divide-by-zero error with any-key recovery (FR-010), newest-operator-wins /
first-decimal-wins asymmetry, no-repeat on double-equals — is a case in this reducer.

**Rationale**: A pure reducer is trivially unit-testable in isolation (Principle III) and
keeps 100% of decision logic out of the UI layer (Principle II). It also gives the UI a
single, narrow integration point (see `contracts/domain-engine.md`).

**Alternatives considered**: A `Calculator` class with mutable internal fields — rejected,
since mutable hidden state is harder to assert against in tests and encourages logic to leak
into whichever caller mutates it. Inline `useState` fields directly in the React component —
rejected outright, as it would put arithmetic logic inside a React component and violate
Principle II by construction.

## 3. Testing stack

**Decision**: Vitest as the single test runner for both layers:
- `tests/unit/domain/` — Node environment, testing `calculator.ts` and `format.ts` directly
  with no DOM.
- `tests/component/` — jsdom environment, using `@testing-library/react` and
  `@testing-library/user-event` to drive the rendered UI via keyboard and click events and
  assert on accessible roles/text.

**Rationale**: Vitest is already implied by the Vite toolchain (shared config/transform, near
-zero setup). Testing Library's role-based queries naturally encourage accessible markup,
supporting Principle IV's keyboard/labelling requirements. Together they cover both
Constitution gates (TDD on the core; a verifiable check on keyboard operability) without a
heavier E2E framework.

**Alternatives considered**: Playwright/Cypress E2E — rejected for v1 as heavier setup than a
single-screen calculator warrants; can be added later without disrupting this structure if a
real cross-browser regression need arises. Manual-only UI verification — rejected, since the
constitution's Development Workflow expects a repeatable (automated or scripted) accessibility
check, not a one-time manual pass.

## 4. Display precision & formatting

**Decision**: A dedicated `format.ts` function rounds any numeric result to at most 10
significant digits (per the clarified FR-014) before it is ever placed into display state,
independent of the arithmetic itself.

**Rationale**: Keeps the "what number did we compute" and "how do we show it" concerns
separate and each independently testable — e.g., 1 ÷ 3 must resolve to a rounded 10-digit
string, not a raw floating-point value like `0.3333333333333333`, and `0.1 + 0.2` must not
leak IEEE-754 artifacts (`0.30000000000000004`) to the display.

**Alternatives considered**: Relying on default `Number.prototype.toString()` — rejected, it
shows unbounded/artifact-laden precision and directly violates FR-014 and the related edge
case.

## 5. Accessibility & responsive approach

**Decision**:
- Every control is a real `<button>` element (never a `<div>` with a click handler), so
  keyboard focus, `Enter`/`Space` activation, and screen-reader semantics come for free.
- Icon-only or symbol-only controls (e.g., `AC`, `CE`, `⌫`, `+/-`) get an explicit
  `aria-label`.
- `:focus-visible` gets a visible outline defined in `tokens.css`, never suppressed.
- Layout uses CSS Grid for the keypad and relative units (`rem`, `%`, `clamp()` for type
  scale) so the same markup reflows correctly from 375px up with no separate mobile
  stylesheet or breakpoint-specific component.
- The design-token color palette is chosen and hand-checked for ≥4.5:1 contrast between text
  and background in its default (light) scheme before implementation begins.

**Rationale**: This satisfies Constitution Principle IV directly, using only platform HTML/CSS
features — no dependency required.

**Alternatives considered**: A pre-built UI/component library (MUI, Chakra, etc.) — rejected
under Principle I; a ~16-button calculator does not need a full design system, and pulling
one in would work against the "considered and consistent" look the spec asks for by fighting
someone else's defaults instead of a small owned token set.

## 6. Deployment/runtime shape

**Decision**: `vite build` produces a static SPA (HTML/CSS/JS) with no server-side component.

**Rationale**: Directly matches the user's explicit instruction ("No backend, no database")
and the spec's Assumptions (single-page, single-user, no persistence across sessions).

**Alternatives considered**: N/A — explicitly out of scope per the spec.
