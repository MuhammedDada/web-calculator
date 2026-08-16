# Phase 0 Research: Calculation History

All items below were resolved from the user-supplied technical direction (extend the existing
stack, domain engine unchanged, history is UI-only React state, no new dependencies) plus the
clarified spec. No `NEEDS CLARIFICATION` markers remain.

## 1. How does the UI know a "real" calculation just completed, without duplicating domain logic?

**Decision**: Before dispatching `EQUALS` or `PERCENT`, the UI calls the already-exported pure
`reduce(state, action)` function directly to "peek" at what the next state would be. A history
entry is recorded if and only if `!state.justEvaluated && nextState.justEvaluated &&
!nextState.isError` — i.e., `justEvaluated` transitions from `false` to `true` and no error
occurred.

**Rationale**: This is a pure observation of the domain engine's already-documented public
`CalculatorState` fields (`justEvaluated`, `isError`) — it requires no new knowledge of
`pendingOperator`/`overwriteOnNextDigit` internals in the UI, so it does not violate
`contracts/domain-engine.md`'s rule that "no input-sequencing decision may be duplicated... in
`src/ui/`". It also happens to exactly match FR-001's scope for free: standalone percent (no
pending operator) sets `justEvaluated: false` in the existing engine, so it is correctly
excluded without any extra UI-side logic; divide-by-zero sets `isError: true`, also excluded
for free.

**Alternatives considered**: Re-deriving "is this a real evaluation" from
`pendingOperator`/`overwriteOnNextDigit` directly in the UI — rejected, since it duplicates
reducer-internal decision logic the UI has no business knowing, and would break silently if
the reducer's internal fields ever changed shape. Adding a dedicated `onCalculationComplete`
callback parameter to `reduce()` — rejected, since it requires editing `src/domain/`, which is
out of scope for this feature by explicit instruction.

## 2. How is the "expression" text for a history entry built?

**Decision**: Captured from the **pre-action** state, at the moment of dispatch:
`` `${formatResult(state.previousOperand)} ${state.pendingOperator} ${state.currentEntry}` ``
for equals, with a trailing `%` appended to the last term for percent. `formatResult` is
imported from the existing `src/domain/format.ts` — reused as-is, not reimplemented.

**Rationale**: At the instant just before `EQUALS`/`PERCENT` is dispatched, `state` still holds
the first operand (`previousOperand`), the operator, and the second operand
(`currentEntry`) — exactly the inputs needed to reconstruct the expression the user typed.
After the action is dispatched, the engine clears `previousOperand`/`pendingOperator` by
design (data-model.md, `001-web-calculator`), so this information is unrecoverable from the
*post*-action state — it must be captured before, not after.

**Alternatives considered**: Reconstructing the expression from the *result* alone — not
possible, information is lost. Storing the expression inside `CalculatorState` so it survives
evaluation — rejected, it would mean editing the domain engine, which is explicitly out of
scope.

## 3. How does selecting a history entry load its result, without a new domain action type?

**Decision**: Reuse dispatches a *sequence* of already-existing `CalculatorAction`s that
reproduce what typing the result would do: `CLEAR_ALL`, then one `DIGIT`/`DECIMAL_POINT`
dispatch per character of the result (skipping a leading `-`), then a trailing `SIGN_TOGGLE`
dispatch if the result was negative.

**Rationale**: `useReducer` processes multiple `dispatch()` calls made synchronously within one
handler in order, each folded through the pure `reduce()` function exactly as if a user had
pressed that sequence of buttons — this is standard, well-defined React behavior, not a hack.
It reproduces the required end state (current entry equals the history result, no pending
operator/operand) using zero new action types, so `src/domain/calculator.types.ts` needs no
changes. Result strings are already capped at 10 significant digits (`001-web-calculator`
FR-014), which combined with an optional sign and decimal point always fits within the
existing 12-character `currentEntry` cap, so this replay can never be truncated mid-way.

**Alternatives considered**: Adding a `LOAD_VALUE` action to the domain engine — rejected,
edits `src/domain/`, explicitly out of scope. Directly constructing a `CalculatorState` object
in the UI and somehow injecting it — rejected, `useReducer`'s state can only change through
dispatched actions processed by `reduce`; bypassing that would break the single-source-of-truth
guarantee the domain contract relies on.

## 4. Where does history state live, and what shape does it have?

**Decision**: A dedicated `useHistory()` hook in `src/ui/useHistory.ts`, using `useState` for
a capped, newest-first array of `{ id, expression, result }` entries (max 20 — see
data-model.md), plus `addEntry`, `reuse` (returns the entry so the caller can synthesize the
replay dispatches), and `clear`. No persistence: the hook's state is discarded on reload and is
never shared across tabs, since it is ordinary in-memory React state with no storage backing
(matches clarified FR-014).

**Rationale**: Matches the user's explicit instruction — "history persistence/state lives in
the UI layer (React state), not the domain engine" — and needs no new dependency, satisfying
Constitution Principle I.

**Alternatives considered**: `useReducer` for history state, mirroring the domain engine's
style — rejected as unnecessary ceremony for a simple bounded list with two mutating
operations (add, clear); a plain `useState` + `useCallback` pair is simpler and equally
testable (Principle I, Simplicity & YAGNI).

## 5. Layout: how does the history panel avoid crowding the keypad at 375px?

**Decision**: `Calculator.tsx` holds an `isHistoryOpen` boolean and conditionally renders
either `<Keypad />` or `<HistoryPanel />` in the same layout slot — never both. `Display` and
the toggle button that flips `isHistoryOpen` remain rendered outside that slot, so they are
always visible. `HistoryPanel`'s own entry list uses a bounded `max-height` with
`overflow-y: auto` so a full 20-entry list scrolls internally rather than growing the page.

**Rationale**: Directly implements the clarified FR-010 ("history panel replaces the keypad in
the same screen space... rather than compressing, overlapping, or sharing space with the
keypad"). A conditional swap is the only layout approach that can guarantee zero crowding at
the narrowest supported width (375px), since any shared/split layout would have to compress
the keypad below its already-established minimum comfortable button size.

**Alternatives considered**: A slide-over/modal overlay on top of the keypad — rejected by the
clarification (Q3 chose the in-place swap over an overlay). A split/stacked layout showing
both at once — rejected by the same clarification for the same reason.

## 6. Dependencies

**Decision**: No new dependencies. `@testing-library/react`'s `renderHook` (already available
in the installed `@testing-library/react` version) covers testing `useHistory` in isolation;
everything else reuses the existing Vitest/Testing Library/ESLint setup from
`001-web-calculator`.

**Rationale**: Directly satisfies the user's explicit instruction ("No backend, no
localStorage, no new state-management library") and Constitution Principle I.

**Alternatives considered**: N/A — explicitly out of scope per the user's instruction.
