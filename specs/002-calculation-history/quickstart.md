# Quickstart: Calculation History

Validates that the feature works end-to-end once implemented. See
[`data-model.md`](./data-model.md) for the `HistoryEntry`/hook shape and
[`contracts/`](./contracts/) for the capture/reuse integration contract.

## Prerequisites

- Node.js (LTS) and npm installed; dependencies already installed for `001-web-calculator`
  (`npm install` — no new dependencies are added by this feature).

## Run it

```bash
npm run dev
```

Open the printed local URL in a browser.

## Automated checks

```bash
npm run test        # Vitest: existing 001 suite + new useHistory/history component tests
npm run lint         # ESLint — must pass cleanly
npm run build        # Vite production build — must complete with no TypeScript errors
```

- `tests/unit/ui/use-history.test.ts` must cover `addEntry`'s 20-entry cap and newest-first
  ordering, and `clear`'s no-op-when-empty behavior (data-model.md validation rules).
- `tests/component/history-*.test.tsx` must cover the capture procedure (only real,
  non-error evaluations are recorded), the reuse procedure, and the toggle/layout swap.

## Manual validation scenarios

Each scenario maps to a prioritized user story or clarification in `spec.md`; walk through
them in a browser after `npm run dev`.

1. **View history (User Story 1)** — Compute `12 + 7 =` (19), then `6 * 7 =` (42). Open the
   history toggle. Confirm both appear, most-recent first ("6 * 7 = 42" above "12 + 7 = 19"),
   and that opening the panel replaced the keypad (the digit/operator buttons are gone; the
   display and toggle are still visible).
2. **Empty state (User Story 1)** — Reload the page, open history before computing anything.
   Confirm an empty state is shown, not an error or blank confusion.
3. **20-entry cap (User Story 1)** — Perform 21 distinct calculations. Open history and confirm
   only the most recent 20 appear; the very first calculation performed is gone.
4. **Reuse (User Story 2)** — With "12 + 7 = 19" in history, select it. Confirm the display now
   shows "19" and the history panel closed, returning to the keypad. Press `+`, `3`, `=` and
   confirm the result is "22".
5. **Reuse interrupts in-progress entry (User Story 2)** — Start typing "50 +" (leave it
   pending), open history, and select an entry showing "19". Confirm the display becomes "19"
   and the previously pending "50 +" is gone (replaced, not merged).
6. **Clear history (User Story 3)** — With at least one entry present, clear the history.
   Confirm the list is immediately empty, no confirmation prompt appears, and the main
   display/current entry is unaffected. Clear again with an empty list — confirm nothing
   breaks.
7. **Errors are not recorded (clarified)** — Compute `5 / 0 =` (shows an error). Open history
   and confirm no entry was added for it.
8. **No reload/cross-tab persistence (clarified)** — Perform a calculation, confirm it's in
   history, then reload the page. Confirm history is empty again. Open a second tab to the
   same URL and confirm its history is independently empty (not shared with the first tab).
9. **Responsive/accessibility spot-check (SC-004)** — Resize the browser to 375px wide. Open
   and close the history panel: confirm the keypad and panel never appear at the same time and
   neither is ever clipped or requires horizontal scrolling. Tab through the toggle, each
   history row, and the clear button: confirm every control has a visible focus outline and an
   accessible name.

If all nine scenarios behave as described, the feature satisfies its spec's Success Criteria
(SC-001 through SC-005).
