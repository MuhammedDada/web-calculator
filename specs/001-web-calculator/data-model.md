# Phase 1 Data Model: Web Calculator

This feature has one entity — the in-memory `Calculation State` identified in the spec's Key
Entities section. There is no persistence; this is the shape of the value the domain reducer
(see `contracts/domain-engine.md`) holds and returns.

## CalculatorState

| Field | Type | Description |
|---|---|---|
| `currentEntry` | `string` | The raw digits currently shown/being typed (e.g., `"12"`, `"3.5"`, `"0"`). Always a valid, parseable numeric string except transiently while typing a trailing decimal point (e.g., `"3."`). |
| `previousOperand` | `number \| null` | The stored left-hand value once an operator has been chosen and a second operand is being entered. `null` before any operator is pressed. |
| `pendingOperator` | `"+" \| "-" \| "*" \| "/" \| null` | The operator awaiting a second operand. `null` when no operation is in progress. |
| `overwriteOnNextDigit` | `boolean` | `true` immediately after an operator, percent, equals, or clear-entry action, so the next digit press replaces `currentEntry` instead of appending to it (spec User Story 1, Acceptance Scenario 2). |
| `isError` | `boolean` | `true` after a divide-by-zero. While `true`, `currentEntry` holds the error display text (e.g., `"Error"`) and every other field is inert until the next action clears it. |
| `justEvaluated` | `boolean` | `true` immediately after `=` produces a result and no new digit/operator has been pressed since; used to make a second, immediate `=` press a no-op (clarified: repeated equals does not repeat the last operation). |

### Initial state

```text
currentEntry: "0"
previousOperand: null
pendingOperator: null
overwriteOnNextDigit: true
isError: false
justEvaluated: false
```

## Validation rules

Derived directly from the spec's Functional Requirements and Edge Cases:

- `currentEntry` MUST contain at most one decimal point (`.`). A second decimal-point
  keystroke on the same entry is a no-op — first one wins (FR-011, clarified asymmetric
  rule).
- `currentEntry` MUST NOT grow beyond 12 characters (accounting for an optional leading `-`
  and one `.`); digit/decimal-point presses beyond that length are ignored rather than
  appended (spec Edge Cases: "entering a number long enough to overflow the display").
- Selecting a new operator while `pendingOperator` is already set (with no second operand
  digits typed yet) REPLACES `pendingOperator` with the newest choice — newest wins (FR-011,
  clarified asymmetric rule).
- Any numeric result written into `currentEntry` MUST be rounded to at most 10 significant
  digits before display (FR-014).
- Division where the right-hand operand is `0` MUST set `isError: true` instead of computing
  a value (FR-010). No other operation produces an error state.
- While `isError` is `true`, the very next action of ANY kind (digit, operator, percent,
  clear-entry, clear-all, delete, sign-toggle, equals) MUST clear the error and start a fresh
  entry rather than being processed as that action against stale operands (FR-010,
  clarified).
- Pressing `=` when `justEvaluated` is already `true` and no new input occurred since MUST be
  a no-op (clarified: no repeat-last-operation behavior).
- Pressing delete/backspace when `currentEntry` is already `"0"` (or empty) MUST be a no-op,
  not an error (spec Edge Cases).
- Pressing percent or an operator with no digits ever entered MUST NOT throw — it is treated
  as an operation on the current default value (`"0"`) (spec Edge Cases).
- Pressing `=` while `pendingOperator` is set and no digit has been typed since (i.e.,
  `overwriteOnNextDigit` is still `true`) MUST be a no-op — state is left exactly as-is
  (clarified: premature equals does not crash and does not evaluate).

## State transitions

| From | Action | To |
|---|---|---|
| Initial / any settled state | Digit / decimal pressed | Appends to `currentEntry` (or replaces it if `overwriteOnNextDigit` is true), clears `overwriteOnNextDigit`. |
| Settled state with a value | Operator pressed | If `pendingOperator` already set and no new digits typed, replaces it (newest wins). Otherwise evaluates any pending operation against `currentEntry`, stores result as `previousOperand`, sets `pendingOperator`, sets `overwriteOnNextDigit: true`. |
| Operand entered, operator pending | Percent pressed | Computes the effective second operand as `previousOperand * (currentEntry / 100)`, applies `pendingOperator` between `previousOperand` and that effective operand (e.g., 200 + (200×10/100) = 220), rounds, writes the result into `currentEntry`, and clears `pendingOperator`/`previousOperand` (mirrors equals); with no `pendingOperator`, simply divides `currentEntry` by 100 in place (FR-003). |
| Any state | Sign-toggle pressed | Flips the numeric sign of `currentEntry` in place; no effect on `pendingOperator`/`previousOperand`. |
| Mid-entry | Clear-entry (CE) pressed | Resets `currentEntry` to `"0"`; `previousOperand` and `pendingOperator` are preserved. |
| Any state | Clear-all (AC) pressed | Resets to Initial state exactly. |
| `currentEntry` non-empty | Delete pressed | Removes the last character of `currentEntry`; if that empties it, `currentEntry` becomes `"0"`. No-op if already `"0"`. |
| Operand + operator entered, no second operand typed yet (`overwriteOnNextDigit: true`) | Equals pressed | No-op — state is left completely unchanged (clarified: premature equals). |
| Operand + operator + operand entered | Equals pressed | Evaluates `previousOperand <pendingOperator> currentEntry`, rounds to ≤10 significant digits, writes result into `currentEntry`, clears `pendingOperator`/`previousOperand`, sets `justEvaluated: true`. |
| `justEvaluated: true` | Equals pressed again, no new input | No-op (clarified). |
| Any state | Division by zero evaluated | `isError: true`; `currentEntry` shows the error text. |
| `isError: true` | Any action | Clears error, returns to Initial state, then applies the triggering action as if from Initial (e.g., a digit press starts a fresh entry with that digit). |

This table is the basis for the domain unit tests under `tests/unit/domain/` (Constitution
Principle III: a failing test for each transition exists before the corresponding reducer
branch is implemented).
