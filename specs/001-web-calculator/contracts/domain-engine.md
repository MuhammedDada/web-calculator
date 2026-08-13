# Contract: Domain Engine (`src/domain/`)

This is the boundary Constitution Principle II protects: `src/ui/` MAY only interact with
`src/domain/` through this surface, and `src/domain/` MUST NOT import React, the DOM, or any
browser API. Everything below is importable and testable in a plain Node/Vitest environment.

## Types (`calculator.types.ts`)

```text
type Operator = "+" | "-" | "*" | "/"

type CalculatorAction =
  | { type: "DIGIT"; digit: "0".."9" }
  | { type: "DECIMAL_POINT" }
  | { type: "OPERATOR"; operator: Operator }
  | { type: "PERCENT" }
  | { type: "SIGN_TOGGLE" }
  | { type: "CLEAR_ENTRY" }
  | { type: "CLEAR_ALL" }
  | { type: "DELETE" }
  | { type: "EQUALS" }

interface CalculatorState {
  currentEntry: string
  previousOperand: number | null
  pendingOperator: Operator | null
  overwriteOnNextDigit: boolean
  isError: boolean
  justEvaluated: boolean
}
```

Field semantics, validation rules, and the full state-transition table are defined in
[`../data-model.md`](../data-model.md) — this contract fixes the shape and calling
convention; the data model is the source of truth for behavior.

## Functions (`calculator.ts`)

### `createInitialState(): CalculatorState`

Returns the Initial state exactly as defined in `data-model.md` (`currentEntry: "0"`, no
pending operator, `overwriteOnNextDigit: true`, not in error).

- **Preconditions**: none.
- **Postconditions**: result is a fresh object each call (no shared mutable state between
  calls).

### `reduce(state: CalculatorState, action: CalculatorAction): CalculatorState`

Pure function. Given a state and one action, returns the next state per the transition table
in `data-model.md`. Never throws — every action is valid for every state, including
malformed-input and error-recovery cases (FR-011, FR-010).

- **Preconditions**: `state` is a value previously produced by `createInitialState()` or a
  prior `reduce()` call (never hand-constructed with invalid combinations).
- **Postconditions**:
  - Referentially new object; `state` itself is never mutated.
  - `currentEntry` is always a non-empty numeric string (or the error text when `isError`).
  - `currentEntry` never exceeds 12 characters (the length cap defined in `data-model.md`).
  - Any numeric result placed into `currentEntry` has already been passed through
    `format.ts`'s rounding (≤10 significant digits) — callers never re-round.

## Functions (`format.ts`)

### `formatResult(value: number): string`

Rounds `value` to at most 10 significant digits and returns its canonical display string
(no unbounded floating-point tails, no unnecessary trailing zeros beyond what the rounding
implies).

- **Preconditions**: `value` is a finite JavaScript number (division-by-zero is handled by
  `reduce()` before a value ever reaches this function — `formatResult` is never called with
  `Infinity`/`NaN`).
- **Postconditions**: output is a string safe to assign directly to `currentEntry` /
  `Display`.

## UI-side usage contract

`src/ui/Calculator.tsx` MUST only:
1. Hold `const [state, dispatch] = useReducer(reduce, undefined, createInitialState)`.
2. Translate on-screen button clicks and keyboard events (see
   [`keyboard-mapping.md`](./keyboard-mapping.md)) into `CalculatorAction` values passed to
   `dispatch`.
3. Render `state.currentEntry` (and, if desired, `state.pendingOperator` /
   `state.previousOperand` for an operator/expression indicator).

No arithmetic, rounding, or input-sequencing decision may be duplicated or re-implemented in
`src/ui/` — if a UI component needs to know "is this valid to press," that answer comes from
`state`, not from re-deriving it.
