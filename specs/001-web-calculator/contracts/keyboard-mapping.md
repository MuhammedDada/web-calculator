# Contract: Keyboard Mapping (`src/ui/useKeyboard.ts`)

This is the input contract required by spec FR-008 and confirmed in the Clarifications
session. Every on-screen action MUST have exactly the keyboard equivalent below — no more,
no fewer — so User Story 3 ("operate entirely from the keyboard") is fully satisfiable and
testable.

| Key(s) | `CalculatorAction` dispatched |
|---|---|
| `0`-`9` | `{ type: "DIGIT", digit }` |
| `.` | `{ type: "DECIMAL_POINT" }` |
| `+`, `-`, `*`, `/` | `{ type: "OPERATOR", operator }` |
| `%` | `{ type: "PERCENT" }` |
| `Enter` or `=` | `{ type: "EQUALS" }` |
| `Backspace` | `{ type: "DELETE" }` |
| `Delete` | `{ type: "CLEAR_ENTRY" }` |
| `Escape` | `{ type: "CLEAR_ALL" }` |
| `F9` | `{ type: "SIGN_TOGGLE" }` |

## Rules

- Any key not in this table MUST be ignored — no `dispatch` call, no side effect, no
  `preventDefault()` (spec User Story 3, Acceptance Scenario 4).
- The mapping is exhaustive and symmetric with the on-screen buttons: every row above
  corresponds to exactly one on-screen control, and every on-screen control has exactly one
  row above (FR-008).
- The listener attaches at a scope that captures key presses whenever the calculator is
  on-screen (this is a single-view app, so this is effectively `window`/document-level), and
  MUST NOT interfere with browser-native behavior for keys outside this table (e.g., Tab
  navigation between buttons still works normally, per Constitution Principle IV).
