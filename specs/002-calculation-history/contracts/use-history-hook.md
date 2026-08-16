# Contract: `useHistory` hook (`src/ui/useHistory.ts`)

This is the public surface `Calculator.tsx` and `HistoryPanel.tsx` are allowed to depend on
for history state. It is UI-layer code (uses React hooks) — it does **not** live in
`src/domain/` and is not subject to the Constitution Principle II purity rule, but it must
still have no dependency on `localStorage`/network/any persistence API, per FR-014.

## Types

```text
interface HistoryEntry {
  id: string
  expression: string
  result: string
}

interface UseHistoryResult {
  entries: HistoryEntry[]      // newest-first, length <= 20
  addEntry: (expression: string, result: string) => void
  clear: () => void
}
```

## `useHistory(): UseHistoryResult`

- **Preconditions**: called once per `Calculator` instance (standard hook usage — not called
  conditionally or in a loop).
- **Postconditions**:
  - `entries` starts as `[]` on every mount (no persistence — FR-014).
  - Calling `addEntry` prepends a new `HistoryEntry` with a fresh `id` and truncates `entries`
    to at most 20 items, dropping the oldest (last) entry if the cap is exceeded (FR-004).
  - Calling `clear` sets `entries` to `[]` unconditionally; calling it when already empty is a
    safe no-op (spec User Story 3, Acceptance Scenario 2).
  - Neither `addEntry` nor `clear` ever throws.

## Caller responsibility (enforced by `Calculator.tsx`, not by this hook)

`useHistory` does not know anything about `CalculatorState`, `reduce`, or what a "valid"
calculation is — it just stores whatever it's told. The responsibility for calling `addEntry`
**only** at the correct capture point (research.md decision 1 / data-model.md's validation
rules) belongs entirely to `Calculator.tsx`. This keeps `useHistory` simple, generic, and
trivially unit-testable in isolation (via `@testing-library/react`'s `renderHook`), while the
calculation-specific logic stays in one place.
