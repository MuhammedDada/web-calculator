<!--
Sync Impact Report
- Version change: (unratified template) → 1.0.0
- Rationale: Initial ratification. The prior file contained only unfilled template
  placeholders and was never adopted; this is the founding version.
- Modified principles: none (initial adoption)
- Added principles:
  - I. Simplicity & YAGNI
  - II. Pure Logic Core
  - III. Test-First for the Core (NON-NEGOTIABLE)
  - IV. Accessible & Responsive by Default
  - V. Change Tracking
- Added sections: Development Constraints, Development Workflow, Governance
- Removed sections: none
- Templates requiring follow-up: none found requiring edits at this time
  (.specify/templates/*.md read generic placeholders from this file at runtime;
  no direct contradictions detected). Re-check on next amendment.
- Deferred placeholders: none
-->

# Calculator Constitution

## Core Principles

### I. Simplicity & YAGNI
Build the simplest thing that satisfies the spec — no more. No dependency may be
added to the project without a written justification, recorded in the commit
message or PR description, explaining why existing code or the standard library
is insufficient.
Rationale: the problem domain is small and well understood; unjustified
complexity or dependencies are the primary risk to maintainability.

### II. Pure Logic Core
The calculation engine MUST be implemented as a pure module with zero imports
from React, the DOM, or any browser API. It MUST be importable and fully
testable in a plain JavaScript/Node environment, with no UI runtime present.
Rationale: keeps arithmetic logic deterministic, portable, and independently
verifiable; UI concerns must never leak into business logic.

### III. Test-First for the Core (NON-NEGOTIABLE)
A failing unit test MUST exist before any engine code is written or changed.
Red-Green-Refactor is mandatory for all changes to the calculation core: write
the test, watch it fail, implement the minimum code to pass, then refactor.
Rationale: the calculation engine is the part of the system where correctness
matters most; test-first is the strongest guarantee against regressions.

### IV. Accessible & Responsive by Default
Every UI surface MUST support full keyboard operation, labelled controls,
visible focus indicators, and a contrast ratio of at least 4.5:1. The UI MUST
remain fully usable at a 375px viewport width.
Rationale: accessibility and responsiveness are baseline requirements for any
interface a user touches, not features to retrofit later.

### V. Change Tracking
Every commit that changes observable behavior MUST append a dated line to
CHANGELOG.md describing the change.
Rationale: gives users and contributors a readable history of behavioral
changes that is independent of raw git log noise.

## Development Constraints

- Project structure MUST keep the pure logic core (Principle II) physically
  separated from UI code (e.g. a dedicated `core`/`engine` directory with no
  UI imports), so the boundary is enforced by directory layout, not convention
  alone.
- New dependencies are limited to build tooling, testing, and accessibility
  verification unless a written justification (Principle I) accompanies the
  addition.
- Target runtime and browser support are defined in the feature spec/plan; the
  375px minimum viewport (Principle IV) is a floor, not a ceiling.

## Development Workflow

- No engine code is merged without a preceding failing test demonstrating the
  Red state (Principle III).
- Every PR touching UI MUST confirm keyboard operability, focus visibility,
  and contrast compliance (Principle IV) before merge — manually or via an
  automated accessibility check.
- Every PR that changes behavior MUST include the corresponding CHANGELOG.md
  entry (Principle V); PRs missing this are incomplete.
- Reviewers MUST reject added dependencies or complexity that lack the written
  justification required by Principle I.

## Governance

This constitution supersedes all other project practices. Amendments require:
1. A documented rationale for the change.
2. An explicit version bump following semantic versioning:
   - MAJOR: backward-incompatible principle removal or redefinition.
   - MINOR: a new principle or materially expanded guidance is added.
   - PATCH: clarifications or wording fixes with no semantic change.
3. Propagation check across dependent templates and guidance docs, noted in a
   Sync Impact Report prepended to this file.

All PRs and reviews MUST verify compliance with the principles above.
Complexity that violates Principle I MUST be justified in writing or removed.

**Version**: 1.0.0 | **Ratified**: 2026-08-13 | **Last Amended**: 2026-08-13
