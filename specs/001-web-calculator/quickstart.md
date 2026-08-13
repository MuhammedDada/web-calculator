# Quickstart: Web Calculator

Validates that the feature works end-to-end once implemented. See
[`data-model.md`](./data-model.md) for state/field details and
[`contracts/`](./contracts/) for the domain-engine and keyboard-mapping contracts.

## Prerequisites

- Node.js (LTS) and npm installed.
- Dependencies installed: `npm install`.

## Run it

```bash
npm run dev
```

Open the printed local URL in a browser.

## Automated checks

```bash
npm run test        # Vitest: domain unit tests + component/keyboard tests
npm run build        # Vite production build — must complete with no TypeScript errors
```

- Domain unit tests (`tests/unit/domain/`) must cover every row of the state-transition table
  in `data-model.md`, written before the corresponding `reduce()` branch (Constitution
  Principle III).
- Component tests (`tests/component/`) must cover the full keyboard mapping in
  `contracts/keyboard-mapping.md`.

## Manual validation scenarios

Each scenario below maps to a prioritized user story in `spec.md`; walk through them in a
browser after `npm run dev`.

1. **Basic calculation (User Story 1)** — Click `1`, `2`, `+`, `7`, `=`. Display shows `19`.
   Press `+` again, `3`, `=`. Display shows `22` (result chained into the next calculation).
2. **Sign toggle (User Story 1, clarified)** — Enter `5`, press the sign-toggle. Display shows
   `-5`.
3. **Correcting a mistake (User Story 2)** — Type `123`, press delete. Display shows `12`.
   Enter `50`, `+`, `3`, then press Clear Entry. Display resets to `0` while `50 +` is still
   pending (confirm by entering `4` and pressing `=`: result is `54`). Press Clear All at any
   point — display returns to `0` with nothing pending.
4. **Keyboard-only pass (User Story 3)** — Without touching the mouse/touchscreen, repeat
   scenario 1 and 3 using only the keys in `contracts/keyboard-mapping.md`. Confirm `Enter`
   triggers `=` and `Escape` triggers Clear All.
5. **Percentage (User Story 4, clarified)** — Enter `200`, `+`, `10`, `%`. Display shows `220`.
   Clear all, enter `50`, `%`. Display shows `0.5`.
6. **Divide by zero and recovery (clarified)** — Enter `5`, `/`, `0`, `=`. Display shows an
   error indicator. Press any digit (e.g., `7`) — the error clears and `7` starts a fresh
   entry.
7. **No repeat-equals (clarified)** — Enter `5`, `+`, `3`, `=` (shows `8`). Press `=` again
   with no new input — display stays `8` (no repeated addition).
8. **Malformed input guards** — Type `1`, `.`, `.`, `2` — display shows `1.2` (second decimal
   point ignored). Press `+`, then `-` — the operator silently becomes subtraction (newest
   wins), confirmable by completing the calculation.
9. **Responsive/accessibility spot-check** — Resize the browser to 375px wide: no control is
   clipped or overlapping. Tab through every control with the keyboard: focus is always
   visible. Confirm every control has an accessible name (via browser dev tools or a screen
   reader).

If all nine scenarios behave as described, the feature satisfies its spec's Success Criteria
(SC-001 through SC-005).
