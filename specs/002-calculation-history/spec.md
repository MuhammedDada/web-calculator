# Feature Specification: Calculation History

**Feature Branch**: `002-calculation-history`

**Created**: 2026-08-16

**Status**: Draft

**Input**: User description: "Add calculation history. The calculator keeps a short history of recent calculations. The user can see them, reuse one, and clear the list. The history must not get in the way on a small screen."

## Clarifications

### Session 2026-08-16

- Q: When a user selects a history entry, should the calculator load only the numeric result, or restore the full original expression for re-editing? → A: Load only the result (e.g., "19") as the fresh current entry
- Q: Should the history panel be visible by default on a small screen, or hidden until opened on demand? → A: Hidden by default, opened via a toggle control

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View recent calculation history (Priority: P1)

A user who has performed one or more calculations can see a running list of their recent
calculations, each showing the expression and its result, without leaving the calculator.

**Why this priority**: This is the foundational capability the whole feature depends on —
without a visible history there is nothing to reuse or clear.

**Independent Test**: Perform a few calculations (e.g., "12 + 7 =", "6 * 7 ="), open the
history panel via its toggle, and confirm both appear with their expressions and results,
most-recent first.

**Acceptance Scenarios**:

1. **Given** the user has completed one calculation, **When** they open the history panel,
   **Then** that calculation appears showing both its expression and its result.
2. **Given** the user has completed multiple calculations, **When** they open the history
   panel, **Then** the entries are listed with the most recent calculation first.
3. **Given** the user has performed no calculations yet, **When** they open the history
   panel, **Then** it shows an empty state rather than an error or a confusing blank area.
4. **Given** the history already holds the maximum number of entries, **When** the user
   completes one more calculation, **Then** the oldest entry is dropped and the new one
   appears at the top.
5. **Given** the history panel is closed (the default state), **When** the user activates the
   history toggle, **Then** the panel opens without shrinking, clipping, or displacing the
   primary keypad controls; activating the toggle again closes it.

---

### User Story 2 - Reuse a past calculation (Priority: P2)

A user viewing their history can select a past entry to bring its result back into the
calculator, so they can continue calculating from it without retyping.

**Why this priority**: This is the main practical payoff of keeping history — viewing alone
has some value, but reuse is what actually saves the user work.

**Independent Test**: With at least one history entry present, select it and confirm the
calculator's current entry becomes that calculation's result, ready for further operations.

**Acceptance Scenarios**:

1. **Given** a history entry showing "12 + 7 = 19", **When** the user selects it, **Then**
   the calculator's current entry becomes "19".
2. **Given** the user selects a history entry while another calculation is in progress,
   **When** the entry is applied, **Then** it replaces the in-progress entry, the same way
   starting a fresh digit entry does.
3. **Given** the user has selected a history entry, **When** they press an operator and then
   a number, **Then** the calculation proceeds normally starting from the reused value.

---

### User Story 3 - Clear history (Priority: P3)

A user can clear their entire calculation history in one action, so old calculations don't
accumulate indefinitely or stay visible longer than wanted.

**Why this priority**: Needed for a complete, tidy feature, but the calculator is fully usable
via Stories 1-2 without it — this is cleanup, not core value.

**Independent Test**: With at least one history entry present, clear the history and confirm
the list is empty afterward.

**Acceptance Scenarios**:

1. **Given** the history contains one or more entries, **When** the user clears it, **Then**
   the history becomes empty immediately with no confirmation step required.
2. **Given** the history is already empty, **When** the user attempts to clear it, **Then**
   nothing happens and no error occurs.

---

### Edge Cases

- Very long expressions or results in a history entry MUST remain readable and must not
  overflow or clip the layout on a small screen.
- Clearing history while a calculation is in progress MUST NOT interrupt or alter the
  calculator's current entry — only the history list is affected.
- An error result (e.g., from a divide-by-zero) MUST NOT be added to history, since it is not
  a valid completed calculation.
- Selecting a history entry MUST NOT itself be recorded as a new history entry (no
  duplication or feedback loop).
- Rapid, repeated calculations (e.g., completing several calculations in quick succession)
  MUST each be added as separate entries with no lost or duplicated rows.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST record a history entry each time a calculation is completed
  (equals, or percent applied against a pending operation).
- **FR-002**: Each history entry MUST show both the expression that was calculated and its
  result.
- **FR-003**: System MUST display history entries in most-recent-first order.
- **FR-004**: System MUST retain only a limited, bounded number of recent history entries,
  discarding the oldest entry once that limit is exceeded.
- **FR-005**: Users MUST be able to select any history entry to bring it back into the
  calculator.
- **FR-006**: Users MUST be able to clear the entire history in a single action.
- **FR-007**: System MUST show an empty state when no history entries exist yet.
- **FR-008**: System MUST NOT record an error result (e.g., from division by zero) as a
  history entry.
- **FR-009**: System MUST NOT record the act of selecting/reusing a history entry as a new
  history entry.
- **FR-010**: History MUST be hidden by default and only shown when the user opens it via a
  toggle control, so it never obscures or crowds out the primary calculator controls on a
  small screen.
- **FR-011**: Selecting a history entry MUST load only its numeric result into the calculator
  as the current entry — the same way a freshly completed calculation would appear — without
  restoring the original expression's operator or operands.
- **FR-012**: Clearing history MUST NOT affect any calculation currently in progress on the
  main display.
- **FR-013**: System MUST provide a toggle control to open and close the history panel.

### Key Entities

- **History Entry**: A record of one completed calculation — the expression that was
  evaluated (e.g., "12 + 7"), its result (e.g., "19"), and its recency relative to other
  entries. Entries exist only in memory for the current session.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can view their last several calculations with no additional steps beyond
  completing them.
- **SC-002**: A user can bring a past result back into an active calculation in a single
  interaction.
- **SC-003**: A user can clear their entire history in a single action.
- **SC-004**: On a screen as narrow as 375px wide, the history feature never causes the
  primary calculator controls to be clipped, overlapped, or require horizontal scrolling.
- **SC-005**: 100% of completed calculations (excluding errors) appear in history in the
  correct order, with no duplicates or omissions, across at least 20 consecutive
  calculations.

## Assumptions

- History is kept in memory for the current browser session only; it is not persisted across
  page reloads or stored on any server, consistent with the base calculator's no-backend,
  no-accounts scope.
- The history holds the 20 most recent calculations; older entries are automatically
  discarded beyond that.
- Clearing history does not require a confirmation step, consistent with the base
  calculator's other clearing actions (AC/CE), which are also immediate.
- Only equals and percent (when applied against a pending operation) produce a "calculation"
  worth recording; intermediate digit or operator entry alone does not.
