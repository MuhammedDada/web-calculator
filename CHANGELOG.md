# Changelog

## Unreleased

### 2026-08-13

- Added basic calculation: digit/decimal entry, the four arithmetic operators with chaining,
  equals, sign-toggle, and safe divide-by-zero handling with any-key error recovery.
- Added mistake correction: delete last digit, clear entry (CE), and clear all (AC).
- Added full keyboard parity: every action reachable via the keyboard-mapping contract
  (digits, operators, `%`, `Enter`/`=`, `Backspace`, `Delete`, `Escape`, `F9`); unmapped keys
  are ignored.
- Added percentage: percent of the previous operand when a calculation is pending (e.g.
  200 + 10% = 220), divide-by-100 when standalone.

### 2026-08-16

- Added viewable calculation history: completed calculations (equals, and percent against a
  pending operation) are recorded and shown most-recent-first, behind a toggle that replaces
  the keypad in place; capped at the 20 most recent, with an empty state when none exist yet.
- Added reusing a past calculation: selecting a history entry loads its result as the current
  entry, replacing any in-progress calculation, and closes the history panel.
- Added clearing history: empties the list immediately with no confirmation step, and never
  affects a calculation currently in progress.
