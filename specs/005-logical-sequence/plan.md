# Implementation Plan: Sequência Lógica

**Branch**: `005-logical-sequence` | **Date**: 2026-05-31 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/005-logical-sequence/spec.md`

## Summary

New game module — "Sequência Lógica" — where children identify the missing emoji that completes a repeating pattern. The game generates patterns algorithmically using defined rules (alternation, cycles, growth) across three difficulty levels. Follows the existing plugin architecture: self-contained game module with components, logic, and data directories. Reuses the existing GameShell flow, scoring engine, design system components, and storage infrastructure. No new dependencies required.

## Technical Context

**Language/Version**: TypeScript 6.0+ (strict mode, `noUncheckedIndexedAccess`)

**Primary Dependencies**: React 19, Vite 8, Framer Motion 12 (animations), react-router-dom 7

**Storage**: IndexedDB via `idb` library — existing session/score stores, no schema changes

**Testing**: Vitest (unit tests for pattern generation logic), Playwright (E2E)

**Target Platform**: PWA — Android 8+, iOS 14+, desktop Chrome/Edge. Mobile-first, 320px–1024px.

**Project Type**: PWA / SPA (client-only, zero-backend)

**Performance Goals**: 60 fps rendering; pattern generation < 5ms; feedback within 500ms of selection

**Constraints**: Offline-capable (all pattern rules bundled); touch targets ≥ 44px; universally supported Unicode emojis only

**Scale/Scope**: 1 new game module, ~10 new files, 1 existing file modified (`src/games/index.ts`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Code Quality | ✅ PASS | New module follows existing plugin pattern; unit tests for pattern generation logic ensure correctness |
| II. Simplicity | ✅ PASS | Self-contained module; algorithmic generation avoids large data files; reuses existing shared infrastructure |
| III. UX Consistency | ✅ PASS | Reuses DifficultySelector, ScoreDisplay, StarRating, CelebrationAnimation from design system; same GameShell flow |
| IV. Performance | ✅ PASS | Pattern generation is O(1) per pattern (small fixed arrays); no hot-path allocations; emoji rendering is native |
| V. Maintainability | ✅ PASS | Game is a self-contained module under `src/games/logical-sequence/`; logic separated from components |
| VI. Extensibility | ✅ PASS | Follows plugin pattern; registered via `gameRegistry.register()`; no changes to core infrastructure |

**Gate Result**: PASS — no violations detected. Proceeding to Phase 0.

**Post-Design Re-Check**: PASS — design confirmed: new module is self-contained (Principle VI), uses no new abstractions beyond pattern rule functions (Principle II), reuses all existing design system components (Principle III), pattern generation is O(1) per element with no allocations (Principle IV), logic is separated from UI in dedicated `logic/` directory (Principle V).

## Project Structure

### Documentation (this feature)

```text
specs/005-logical-sequence/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A — no external interfaces)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── games/
│   ├── index.ts                              # MODIFIED — register logical-sequence plugin
│   └── logical-sequence/
│       ├── index.ts                          # NEW — plugin definition
│       ├── LogicalSequenceGame.tsx           # NEW — main game component
│       ├── components/
│       │   ├── LogicalSequenceIcon.tsx       # NEW — game card icon
│       │   ├── PatternDisplay.tsx            # NEW — renders emoji sequence with ❓
│       │   ├── OptionButtons.tsx             # NEW — answer option buttons
│       │   └── FeedbackOverlay.tsx           # NEW — correct/incorrect feedback
│       └── logic/
│           ├── pattern-rules.ts             # NEW — pattern rule definitions & emoji sets
│           ├── pattern-generator.ts          # NEW — generates pattern instances from rules
│           └── round-generator.ts            # NEW — selects patterns for a round
```

**Structure Decision**: Existing single-project SPA structure. New game module follows the same directory pattern as `emoji-guess`, `word-search`, and `crossword`. Logic is separated from UI components. Pattern generation is algorithmic (no data JSON files needed).

## Complexity Tracking

> No violations detected — table intentionally left empty.
