# Feature Specification: Web Calculator

**Feature Branch**: `001-web-calculator`

**Created**: 2026-08-13

**Status**: Draft

**Input**: User description: "Build a web calculator. A user opens the page and can perform everyday arithmetic: addition, subtraction, multiplication, division, and percentages. They can clear the current entry, clear everything, and delete the last digit. They can use the on-screen buttons or their keyboard. It must not crash or show nonsense when the user does something odd. It must look considered and consistent, and it must work on a phone."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Perform a basic calculation (Priority: P1)

A user opens the page and computes the result of a simple arithmetic expression (addition,
subtraction, multiplication, or division) using the on-screen buttons.

**Why this priority**: This is the entire reason the product exists. Without it there is no
calculator, so it is the MVP.

**Independent Test**: Load the page, click digit and operator buttons to enter an expression
such as "12 + 7", click equals, and confirm the correct result (19) is displayed.

**Acceptance Scenarios**:

1. **Given** the calculator is freshly loaded, **When** the user enters "12 + 7" and presses
   equals, **Then** the display shows "19".
2. **Given** a result is already displayed, **When** the user starts a new calculation by
   entering a digit, **Then** the previous result is replaced by the new entry rather than
   appended to it.
3. **Given** the user has entered a first number and an operator, **When** the user enters a
   second number and presses equals, **Then** the display shows the correct result for
   addition, subtraction, multiplication, or division.
4. **Given** a result is displayed, **When** the user presses an operator immediately after,
   **Then** the calculator uses that result as the starting value of the next calculation.

---

### User Story 2 - Correct a mistake without starting over (Priority: P2)

A user who has mistyped part of an entry can delete just the last digit, clear only the
current entry, or clear the entire calculation, without losing more work than necessary.

**Why this priority**: Mistakes during entry are common; being forced to restart the whole
calculation after every typo makes the calculator frustrating to use.

**Independent Test**: Enter a multi-digit number, press delete to remove the last digit and
confirm the remaining digits are unchanged; press "clear entry" and confirm only the current
number resets while a pending operation is preserved; press "clear all" and confirm the
calculator returns to its initial state.

**Acceptance Scenarios**:

1. **Given** the user has typed "123", **When** the user presses delete, **Then** the display
   shows "12".
2. **Given** the display shows only "0" (nothing entered yet), **When** the user presses
   delete, **Then** the display remains "0" and no error occurs.
3. **Given** the user has entered "50 +" and started typing "3", **When** the user presses
   "clear entry", **Then** the current entry resets to "0" while the pending "50 +" operation
   is preserved.
4. **Given** the user is mid-calculation, **When** the user presses "clear all", **Then** the
   display resets to "0" and any pending operator or stored value is discarded.

---

### User Story 3 - Operate the calculator entirely from the keyboard (Priority: P3)

A user performs every action available on-screen — digits, operators, percentage, clear
entry, clear all, delete, and equals — using only the keyboard.

**Why this priority**: Keyboard support is essential for accessibility and for users who
prefer not to switch to a mouse or touchscreen, but the calculator is already usable via
on-screen buttons without it, so it builds on Stories 1 and 2 rather than blocking them.

**Independent Test**: With the on-screen buttons untouched, complete a full calculation
(including a correction and a clear) using only keyboard keys, and confirm the outcome
matches the equivalent mouse-driven interaction.

**Acceptance Scenarios**:

1. **Given** the calculator is focused, **When** the user types number keys and an operator
   key followed by Enter, **Then** the result matches what clicking the equivalent buttons
   would produce.
2. **Given** the user has typed digits, **When** the user presses Backspace, **Then** the last
   digit is removed, matching the on-screen delete button.
3. **Given** the user is mid-entry, **When** the user presses Escape, **Then** the calculator
   clears entirely, matching the on-screen "clear all" button.
4. **Given** the calculator is focused, **When** the user presses any key with no on-screen
   equivalent, **Then** the key press is ignored and the current state is unchanged.

---

### User Story 4 - Calculate a percentage (Priority: P4)

A user applies the percentage function to compute a proportion of a number, such as a
discount or tip.

**Why this priority**: Percentage is a named requirement but is used less frequently than
the four basic operations, so it is valuable but not blocking for the core MVP.

**Independent Test**: Enter "200 + 10 %" and confirm the calculator shows the result of
adding 10% of 200 (i.e., 220); enter "50 %" alone and confirm it shows 0.5.

**Acceptance Scenarios**:

1. **Given** the user has entered "200 +" and then "10", **When** the user presses percent,
   **Then** the display shows "220" (200 plus 10% of 200).
2. **Given** the user has entered "50" with no pending operator, **When** the user presses
   percent, **Then** the display shows "0.5" (50 divided by 100).

---

### Edge Cases

- Dividing by zero MUST show a clear, recoverable error state (e.g., "Error") instead of
  crashing, freezing, or displaying "Infinity" or "NaN".
- Pressing equals with no second number entered (e.g., "7 +" then equals) MUST NOT crash;
  the calculator treats the missing operand safely (e.g., no-op or reuses the first number).
- Pressing an operator twice in a row (e.g., "7 + -") MUST NOT crash; the calculator uses the
  most recently pressed operator.
- Entering more than one decimal point in the same number (e.g., "1.2.3") MUST be prevented
  or ignored so the display never shows a malformed number.
- Pressing delete when the current entry is already empty/zero MUST be a no-op, not an error.
- Pressing percent with no number entered MUST NOT crash.
- Entering a number long enough to overflow the display MUST be handled gracefully (e.g.,
  truncated or shown in a shortened notation) rather than breaking the layout or crashing.
- Rapid repeated key presses or button clicks MUST NOT cause duplicate or lost input.
- Result values with long decimal expansions (e.g., 1 ÷ 3) MUST be rounded for display rather
  than shown with unbounded precision.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to enter digits 0-9 and a decimal point.
- **FR-002**: System MUST allow users to perform addition, subtraction, multiplication, and
  division on entered numbers.
- **FR-003**: System MUST allow users to compute a percentage via a dedicated percent action.
- **FR-004**: System MUST allow users to clear only the current entry ("CE") while preserving
  any pending operation and stored value.
- **FR-005**: System MUST allow users to clear the entire calculation ("AC"/"C") and return to
  the initial state.
- **FR-006**: System MUST allow users to delete the last digit of the current entry.
- **FR-007**: System MUST let a displayed result be used as the starting value for a
  subsequent calculation (chaining).
- **FR-008**: System MUST support performing every on-screen action (digits, operators,
  percent, clear entry, clear all, delete, equals) via an equivalent keyboard key.
- **FR-009**: System MUST always display the current entry or result in a readable form.
- **FR-010**: System MUST handle division by zero by presenting a clear, recoverable error
  state rather than crashing or displaying a raw technical value.
- **FR-011**: System MUST handle out-of-sequence or malformed input (repeated operators,
  multiple decimal points, premature equals, empty-entry actions) without crashing or
  producing a nonsensical or malformed display.
- **FR-012**: System MUST present a visually consistent interface: uniform spacing,
  typography, and button styling across every control.
- **FR-013**: System MUST remain fully usable, legible, and free of layout breakage on
  phone-sized screens.
- **FR-014**: System MUST round displayed results to a fixed, reasonable number of significant
  digits rather than showing unbounded decimal precision.

### Key Entities

- **Calculation State**: The calculator's current working data — the value currently being
  entered, the previously stored value, the pending operator (if any), and whether the
  calculator is in an error state. Drives what is shown on the display and how the next
  button press or key press is interpreted.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time user can complete a basic calculation (e.g., "12 + 7 =") within 10
  seconds of the page loading, with no instructions.
- **SC-002**: 100% of tested invalid or out-of-sequence input combinations (divide by zero,
  repeated operators, multiple decimal points, premature equals) result in a clear error
  indication or safe no-op — never a crash, freeze, or blank/garbled display.
- **SC-003**: Every action available via on-screen buttons (digits, operators, percent, clear
  entry, clear all, delete, equals) can also be completed using only the keyboard.
- **SC-004**: The calculator is fully operable, with no overlapping or clipped controls, on a
  screen as narrow as 375px wide.
- **SC-005**: Across all screens from 375px to desktop widths, every button and display
  element shares consistent sizing, spacing, and styling with no visibly mismatched controls.

## Assumptions

- Percentage behaves the same as in common calculator apps: with a pending operation, "%"
  computes that percentage of the stored value (e.g., 200 + 10% = 220); with no pending
  operation, "%" divides the current entry by 100.
- Displayed numbers are rounded to a fixed number of significant digits (consistent with
  typical calculator apps); the exact digit count is a design detail left to implementation.
- No calculation history or memory functions (M+, M-, MR) are required — only the current
  entry and one pending operation need to be tracked.
- The calculator is a single-page, single-user experience with no accounts, persistence
  across sessions, or backend/server component required.
- "Work on a phone" means a responsive layout usable via touch on common phone screen widths
  (starting at 375px); no native mobile app is required.
- Only the standard operator keys and a "%" key have on-screen and keyboard equivalents;
  scientific functions (trig, exponents, memory, etc.) are out of scope.
