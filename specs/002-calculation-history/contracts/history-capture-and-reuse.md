# Contract: History Capture & Reuse (`src/ui/Calculator.tsx`)

This is the integration contract between the unchanged `001-web-calculator` domain engine
(`src/domain/calculator.ts`) and the new history feature. It exists because the two pieces of
state (`CalculatorState` and history) are not connected by any domain-level action — the
connection is entirely procedural, implemented in `Calculator.tsx`. Any implementation MUST
follow this exactly; deviating (e.g., trying to infer history from `CalculatorState` alone
after the fact) will silently lose the expression text (see research.md decision 2).

## Capture procedure (runs before every `EQUALS` and `PERCENT` dispatch)

```text
function handleEquals():
  nextState = reduce(state, { type: "EQUALS" })
  if not state.justEvaluated and nextState.justEvaluated and not nextState.isError:
    expression = `${formatResult(state.previousOperand)} ${state.pendingOperator} ${state.currentEntry}`
    history.addEntry(expression, nextState.currentEntry)
  dispatch({ type: "EQUALS" })

function handlePercent():
  nextState = reduce(state, { type: "PERCENT" })
  if not state.justEvaluated and nextState.justEvaluated and not nextState.isError:
    expression = `${formatResult(state.previousOperand)} ${state.pendingOperator} ${state.currentEntry}%`
    history.addEntry(expression, nextState.currentEntry)
  dispatch({ type: "PERCENT" })
```

- `reduce` and `formatResult` are imported as-is from `src/domain/` — never reimplemented.
- The `reduce(state, action)` peek call and the `dispatch(action)` call use the *same* `state`
  and the *same* action — this is safe because `reduce` is pure, so peeking never causes the
  real dispatch to behave differently.
- This procedure is the **only** place `history.addEntry` may be called. `Keypad`/`HistoryPanel`
  never call it directly.

## Reuse procedure (runs when a `HistoryEntry` is selected)

```text
function handleReuse(entry: HistoryEntry):
  dispatch({ type: "CLEAR_ALL" })
  digits = entry.result starts with "-" ? entry.result[1:] : entry.result
  for char in digits:
    if char == ".":
      dispatch({ type: "DECIMAL_POINT" })
    else:
      dispatch({ type: "DIGIT", digit: char })
  if entry.result starts with "-":
    dispatch({ type: "SIGN_TOGGLE" })
  isHistoryOpen = false   // close the panel, returning the keypad to view (FR-010)
```

- Every dispatch in this sequence uses an action type that already exists in
  `CalculatorAction` (`calculator.types.ts` is unchanged).
- This sequence MUST run inside a single event handler so React processes all dispatches in
  order before the next render (standard `useReducer` batching guarantee) — do not split it
  across `setTimeout`/async boundaries, which could interleave with other input.
- After this sequence, `state.currentEntry === entry.result`, `state.pendingOperator === null`,
  and `state.previousOperand === null` — matching FR-011 and User Story 2's acceptance
  scenarios.

## UI-side usage contract

`src/ui/Calculator.tsx` MUST:
1. Hold `const history = useHistory()` alongside the existing `useReducer`.
2. Hold `const [isHistoryOpen, setIsHistoryOpen] = useState(false)`.
3. Implement `handleEquals`/`handlePercent`/`handleReuse` exactly as specified above, wiring
   them in place of the plain `dispatch({ type: "EQUALS" })` / `dispatch({ type: "PERCENT" })`
   calls used by `001-web-calculator`.
4. Render `<Keypad />` when `!isHistoryOpen`, `<HistoryPanel entries={history.entries}
   onSelect={handleReuse} onClear={history.clear} />` when `isHistoryOpen`, per
   `data-model.md`'s layout decision — never both at once.

No other file may call `history.addEntry` or synthesize the reuse dispatch sequence.
