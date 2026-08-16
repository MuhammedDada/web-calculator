# Phase 1 Data Model: Calculation History

This feature adds one new entity, owned entirely by the UI layer (`src/ui/useHistory.ts`).
The existing `CalculatorState` from `001-web-calculator` (see
`../001-web-calculator/data-model.md`) is referenced but **not modified**.

## HistoryEntry

| Field | Type | Description |
|---|---|---|
| `id` | `string` | A stable unique identifier for the entry (e.g., a monotonically increasing counter or timestamp-based id), used as the React list key and as the target of a "reuse" action. |
| `expression` | `string` | The calculation as typed, e.g. `"12 + 7"` or `"200 + 10%"` — captured from the pre-action `CalculatorState` per research.md decision 2. |
| `result` | `string` | The formatted result, e.g. `"19"` — identical in format to what `Display` would have shown (already rounded to ≤10 significant digits by the unchanged domain engine). |

### Ordering and bounds

- Entries are stored **newest-first**: a new entry is prepended (`unshift`), not appended.
- The list is capped at **20 entries** (spec Assumptions). Once the 21st entry would be added,
  the oldest entry (last in the array) is dropped.

## HistoryHookState (the `useHistory()` hook's internal/returned shape)

| Field | Type | Description |
|---|---|---|
| `entries` | `HistoryEntry[]` | The current, newest-first, ≤20-length list. |
| `addEntry(expression: string, result: string)` | function | Prepends a new entry, enforcing the 20-entry cap. Called only from the capture point described in research.md decision 1 — never called for errored or no-op evaluations. |
| `clear()` | function | Empties `entries`. Safe to call when already empty (no-op, no error) — satisfies spec User Story 3, Acceptance Scenario 2. |

`isHistoryOpen` (panel visibility) is **not** part of this hook — it is a separate, simple
boolean `useState` owned directly by `Calculator.tsx`, since it is pure UI-visibility state
with no relationship to the entries themselves (research.md decision 5).

## Validation rules

Derived directly from the spec's Functional Requirements, Edge Cases, and Clarifications:

- An entry MUST only be added when the pre-action → post-action `CalculatorState` transition
  satisfies `!before.justEvaluated && after.justEvaluated && !after.isError` (FR-001, FR-008,
  research.md decision 1). No other trigger adds an entry.
- Selecting/reusing an entry MUST NOT itself call `addEntry` (FR-009) — the replay dispatches
  synthesized for reuse (research.md decision 3) never include `EQUALS`/`PERCENT`, so they
  cannot trigger the capture point at all; this is a structural guarantee, not just a rule to
  remember.
- `entries.length` MUST NOT exceed 20 (FR-004); enforced inside `addEntry`, not by callers.
- `clear()` MUST be safe to call on an empty list (spec User Story 3, Acceptance Scenario 2).
- History state MUST NOT be written to any storage (`localStorage`, cookies, etc.) or read on
  mount from anything but an empty initial array (FR-014, clarified) — each page load and each
  browser tab starts with `entries: []`.

## State interaction with the existing CalculatorState (001-web-calculator)

This feature does not add fields to `CalculatorState` and does not add new
`CalculatorAction` variants. It interacts with the existing engine in exactly two ways, both
confined to `src/ui/Calculator.tsx`:

1. **Capture** (read-only peek): before dispatching `EQUALS` or `PERCENT`, call
   `reduce(state, action)` to compute `nextState` without applying it, decide whether to
   `addEntry(...)` per the validation rule above, then dispatch the action as normal so the
   real state transition proceeds unchanged from `001-web-calculator`'s behavior.
2. **Reuse** (write via existing actions only): dispatch `CLEAR_ALL`, then one
   `DIGIT`/`DECIMAL_POINT` per character of the entry's `result` (skipping a leading `-`),
   then `SIGN_TOGGLE` if the result was negative (research.md decision 3).

No other coupling exists. `src/domain/calculator.ts` and `calculator.types.ts` require zero
changes for this feature.
