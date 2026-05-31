# Implementation Plan: Rima com o Quê?

**Branch**: `004-rhyme-game` | **Date**: 2026-05-31 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/004-rhyme-game/spec.md`

## Summary

New educational game where children identify which word rhymes with a presented target word. The game presents a target word with 3-4 multiple-choice options (text + emoji), provides immediate visual feedback, progresses through 10-word rounds, and shows score/stars at the end. Follows the existing GamePlugin architecture established by Word Search, Crossword, and Emoji Guess. The game includes a curated Portuguese word bank organized by difficulty level (easy/medium/hard) for ages 6-10, with at least 30 word sets per level.

## Technical Context

**Language/Version**: TypeScript 5.5+ (strict mode)

**Primary Dependencies**: React 19, Vite 8, framer-motion 12 (animations)

**Storage**: IndexedDB via existing session-store and score-store — no schema changes needed

**Testing**: Vitest (unit), Playwright (E2E)

**Target Platform**: PWA — smartphones Android 8+, iOS 14+, desktop Chrome/Edge. Mobile-first, 320px-1024px.

**Project Type**: PWA / SPA (client-only, zero-backend)

**Performance Goals**: 60 fps UI rendering; feedback display < 500ms after selection; game launch < 2 seconds from home page

**Constraints**: Offline-capable; word bank bundled in JSON; zero additional runtime dependencies; touch targets ≥ 44px

**Scale/Scope**: 1 new game module, ~8 new files, 2 existing files modified (games/index.ts, copilot-instructions.md)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Code Quality | ✅ PASS | New module follows established plugin pattern; unit tests for validator and round selector |
| II. Simplicity | ✅ PASS | Multiple-choice UI is simpler than text-input (no keyboard/hint complexity); reuses all existing infrastructure |
| III. UX Consistency | ✅ PASS | Reuses DifficultySelector, ScoreDisplay, StarRating, CelebrationAnimation from shared design system; same game shell flow |
| IV. Performance | ✅ PASS | Static JSON word bank; O(1) answer validation; no hot-path allocations; grid of 3-4 buttons is trivial to render |
| V. Maintainability | ✅ PASS | Self-contained module under `src/games/rhyme-game/`; single responsibility per file; no cross-cutting changes |
| VI. Extensibility | ✅ PASS | Registered via existing GamePlugin registry; no modifications to existing games or core infrastructure |

**Gate Result**: PASS — no violations detected. Proceeding to Phase 0.

**Post-Design Re-Check**: PASS — design confirmed: no new abstractions, no new dependencies, no performance concerns. The multiple-choice approach is simpler than the text-input pattern used by Emoji Guess.

## Project Structure

### Documentation (this feature)

```text
specs/004-rhyme-game/
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
│   ├── index.ts                          # MODIFIED — register rhyme-game plugin
│   └── rhyme-game/
│       ├── index.ts                      # NEW — GamePlugin definition
│       ├── RhymeGame.tsx                 # NEW — Main game component
│       ├── data/
│       │   └── rhyme-dictionary.json     # NEW — Curated word bank (90+ word sets)
│       ├── logic/
│       │   ├── round-selector.ts         # NEW — Shuffle, filter by difficulty, pick round
│       │   └── option-shuffler.ts        # NEW — Randomize answer option order
│       └── components/
│           ├── TargetWord.tsx            # NEW — Prominent target word display
│           ├── OptionCard.tsx            # NEW — Single answer option (emoji + text)
│           ├── OptionGrid.tsx            # NEW — Grid of 3-4 OptionCards
│           └── RhymeGameIcon.tsx         # NEW — SVG icon for home page card
```

**Structure Decision**: Follows the existing single-project SPA structure with a new self-contained game module under `src/games/rhyme-game/`, mirroring the pattern established by `emoji-guess/`. The multiple-choice interaction model eliminates the need for Keyboard, HintButton, and AnswerInput components — replaced by OptionCard/OptionGrid.
