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
