<!--
  Sync Impact Report
  ===================
  Version change: N/A → 1.0.0 (initial ratification)
  Modified principles: N/A (first version)
  Added sections:
    - Principle I: Code Quality
    - Principle II: Simplicity
    - Principle III: User Experience Consistency
    - Principle IV: Performance Requirements
    - Principle V: Code Maintainability
    - Principle VI: Standalone Extensibility
    - Section: Development Standards
    - Section: Quality Gates
    - Section: Governance
  Removed sections: N/A
  Templates requiring updates:
    - plan-template.md ✅ (Constitution Check section is generic)
    - spec-template.md ✅ (requirements/success criteria align)
    - tasks-template.md ✅ (phase structure supports principles)
    - checklist-template.md ✅ (generic, no conflicts)
  Follow-up TODOs: None
-->

# Madu Games Constitution

## Core Principles

### I. Code Quality

Every piece of code committed to the project MUST meet a
verifiable quality standard. This is non-negotiable.

- Code MUST compile without warnings in the strictest
  lint/analyzer configuration available for the language.
- Every public API (class, method, endpoint) MUST have at
  least one automated test covering its primary behavior.
- Code reviews MUST verify correctness, readability, and
  adherence to this constitution before merge.
- Dead code, commented-out code, and TODO hacks MUST NOT
  persist across pull requests — they are resolved or
  removed before merge.
- Naming MUST be intention-revealing: a reader unfamiliar
  with the codebase MUST understand a symbol's purpose
  from its name alone.

**Rationale**: Games are complex systems where subtle bugs
destroy player trust. Enforcing quality at the gate is
cheaper than fixing defects in production.

### II. Simplicity

The simplest correct solution MUST be chosen over a
clever or speculative one.

- YAGNI (You Aren't Gonna Need It): features, abstractions,
  and infrastructure MUST NOT be added until a concrete,
  immediate need exists.
- Every abstraction layer MUST justify itself — if removing
  it would not cause a measurable problem, it MUST be
  removed.
- Functions and methods MUST do one thing. If a method
  requires more than one sentence to describe its purpose,
  it MUST be split.
- Prefer flat structures over deep nesting in both code
  and project directories.
- Configuration MUST use sensible defaults; zero-config
  startup MUST be the goal for local development.

**Rationale**: Complexity is the primary source of bugs,
onboarding friction, and development slowdowns. Simplicity
preserves velocity over the long term.

### III. User Experience Consistency

Players MUST encounter a unified, predictable experience
across every screen, interaction, and game feature.

- All UI components MUST follow a single design system
  (shared color palette, typography, spacing, and
  interaction patterns).
- Transitions, animations, and feedback (haptic, visual,
  audio) MUST behave consistently for equivalent actions
  across all features.
- Error states and empty states MUST be designed, not
  afterthoughts — every screen MUST define what the
  player sees when something goes wrong or data is absent.
- New features MUST NOT introduce novel interaction
  patterns unless explicitly approved; reuse existing
  patterns first.
- Accessibility MUST be considered from the start: text
  contrast, touch target sizes, and colorblind-safe palettes
  are mandatory.

**Rationale**: Inconsistency confuses players and erodes the
perceived quality of the product. A cohesive experience
builds trust and retention.

### IV. Performance Requirements

Every feature MUST meet explicit performance targets before
it is considered complete.

- UI rendering MUST sustain 60 fps on the minimum supported
  target device; drops below 30 fps are treated as
  blocking bugs.
- Screen transitions and navigation MUST complete in
  under 300 ms perceived time.
- Network requests MUST implement timeouts, retries with
  backoff, and graceful degradation for offline or
  high-latency scenarios.
- Memory allocations in hot paths (game loops, animations,
  frequent UI updates) MUST minimize GC pressure — prefer
  object pooling and pre-allocation.
- Performance budgets MUST be defined per feature during
  planning and validated during the review phase.

**Rationale**: Players abandon games that stutter or feel
slow. Performance is a feature, not an optimization pass
done later.

### V. Code Maintainability

The codebase MUST remain easy to understand, modify, and
extend by any team member at any time.

- Every module MUST have a single, well-defined
  responsibility. Cross-cutting concerns (logging, analytics,
  error reporting) MUST be handled through shared
  infrastructure, not duplicated per feature.
- Dependencies between modules MUST be explicit and
  minimal — prefer dependency injection over hard-coded
  references.
- File and folder organization MUST mirror the logical
  architecture: a developer MUST be able to locate code
  for a given feature by navigating the directory tree
  without searching.
- Refactoring MUST be done incrementally and accompanied
  by tests that prove behavior is preserved. Large-scale
  rewrites are prohibited without a documented plan
  and explicit approval.
- Technical debt MUST be tracked as backlog items with
  severity and estimated impact; it MUST NOT be silently
  accumulated.

**Rationale**: A game codebase that is hard to maintain
becomes impossible to evolve. Maintainability directly
enables sustained delivery speed.

### VI. Standalone Extensibility

The architecture MUST support the continuous addition of
new, independent features without destabilizing existing
functionality.

- New features MUST be implemented as self-contained
  modules with clear boundaries and minimal coupling to
  existing features.
- Adding a new feature MUST NOT require modifying the
  internal implementation of any existing feature — only
  well-defined extension points (registries, event buses,
  plugin hooks) are permitted.
- Each standalone feature MUST be independently testable:
  its test suite MUST pass without requiring other features
  to be present or active.
- Feature flags or configuration MUST allow enabling or
  disabling individual features at runtime without
  redeployment when feasible.
- Shared infrastructure (networking, storage, UI framework)
  MUST provide stable, versioned APIs that features
  depend on — breaking changes require a migration path.

**Rationale**: A games project grows through new content,
modes, and mechanics. An architecture that resists addition
becomes a bottleneck that slows the entire team.

## Development Standards

- **Branching**: One feature branch per feature or fix;
  branches MUST be short-lived (merge within days, not
  weeks).
- **Commit messages**: MUST follow Conventional Commits
  format (`feat:`, `fix:`, `refactor:`, `docs:`, `perf:`,
  `test:`, `chore:`).
- **Code formatting**: Automated formatters MUST be
  configured and enforced via CI — no style debates in
  reviews.
- **Dependencies**: Third-party dependencies MUST be
  evaluated for license compatibility, maintenance health,
  and security before adoption. Prefer fewer, well-maintained
  dependencies over many small ones.
- **Documentation**: Public APIs and non-obvious decisions
  MUST be documented inline or in companion docs. READMEs
  MUST be kept up-to-date with setup and usage instructions.

## Quality Gates

Every pull request MUST pass the following gates before
merge:

1. **Build**: Clean compilation with zero warnings.
2. **Tests**: All automated tests pass.
3. **Performance**: No regressions against defined
   performance budgets.
4. **Review**: At least one approving review from a team
   member who did not author the change.
5. **Constitution Compliance**: Changes MUST NOT violate
   any principle in this constitution. Reviewers MUST
   explicitly verify compliance.

## Governance

This constitution is the highest-authority document for
development practices in the Madu Games project. All other
guidelines, style guides, and process documents MUST be
consistent with it.

- **Amendments**: Any team member MAY propose amendments.
  Amendments MUST be documented as a pull request modifying
  this file, reviewed, and approved before taking effect.
- **Versioning**: This constitution follows semantic
  versioning (MAJOR.MINOR.PATCH):
  - MAJOR: Principle removed or fundamentally redefined.
  - MINOR: New principle or section added, or material
    expansion of existing guidance.
  - PATCH: Clarifications, wording fixes, non-semantic
    refinements.
- **Compliance Review**: At the start of each major feature
  cycle, the team MUST review this constitution to verify
  it remains relevant and complete.
- **Conflict Resolution**: When a development decision
  conflicts with this constitution, the constitution wins.
  If the decision is believed correct, amend the
  constitution first.

**Version**: 1.0.0 | **Ratified**: 2026-05-31 | **Last Amended**: 2026-05-31
