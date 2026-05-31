# Implementation Plan: Game Hints & Word Highlights

**Branch**: `002-game-hints-highlights` | **Date**: 2026-05-31 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-game-hints-highlights/spec.md`

## Summary

Add a hint mechanism to all three games (Word Search, Crossword, Emoji Guess) with a centralized -5 point penalty per hint and visual feedback (toast notification + score animation). Word Search hints highlight the first letter of an unfound word; Crossword hints reveal the correct letter at the selected cell; Emoji Guess hints append the next correct letter sequentially. Additionally, implement distinct background color coding for completed words in the Crossword game. The scoring engine is extended to accept hint count and compute deductions centrally.

## Technical Context

**Language/Version**: TypeScript 5.5+ (strict mode)

**Primary Dependencies**: React 19, Vite 8, framer-motion 12 (animations), zustand 5 (state), idb 8 (IndexedDB)

**Storage**: IndexedDB via idb — hint count persisted per session (extends existing session-store)

**Testing**: Vitest (unit), Testing Library (component), Playwright (E2E)

**Target Platform**: PWA — smartphones Android 8+, iOS 14+, desktop Chrome/Edge. Mobile-first, 320px-1024px.

**Project Type**: PWA / SPA (client-only, zero-backend)

**Performance Goals**: 60 fps animations; hint activation < 100ms; toast notification renders within 1 frame

**Constraints**: Offline-capable; no additional bundle size > 5KB for hint feature; touch targets ≥ 44x44px

**Scale/Scope**: 3 games affected, ~6 new/modified components, 1 scoring engine extension, 1 shared hook

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Code Quality | ✅ PASS | Feature covered by unit tests for scoring + integration tests for each game hint flow |
| II. Simplicity | ✅ PASS | Reuses existing scoring engine (extends, doesn't replace), single shared hook, minimal new state |
| III. UX Consistency | ✅ PASS | Hint button uses existing Button component from design system, toast uses existing animation presets, consistent placement across all games |
| IV. Performance | ✅ PASS | Hint logic is synchronous state update (<1ms); toast uses CSS animation (GPU accelerated); no hot-path allocations |
| V. Maintainability | ✅ PASS | Hint logic per game is self-contained in game module; shared hook provides common interface; color palette in design tokens |
| VI. Extensibility | ✅ PASS | New games can adopt hints by using the shared `useHint` hook; color palette is token-based and extensible |

**Gate Result**: PASS — no violations detected. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/002-game-hints-highlights/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── hint-system.md   # Hint hook & scoring contracts
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── core/
│   ├── hooks/
│   │   └── use-hint.ts              # NEW — shared hint state/logic hook
│   ├── scoring/
│   │   └── scoring-engine.ts        # MODIFIED — add calculateScoreWithHints()
│   └── storage/
│       └── session-store.ts         # MODIFIED — persist hintCount per session
├── design-system/
│   ├── components/
│   │   ├── HintButton.tsx           # NEW — reusable hint button component
│   │   └── HintPenaltyToast.tsx     # NEW — penalty notification toast
│   └── tokens/
│       └── index.ts                 # MODIFIED — add wordHighlightColors palette
├── games/
│   ├── word-search/
│   │   └── WordSearchGame.tsx       # MODIFIED — integrate hint (highlight cell)
│   ├── crossword/
│   │   ├── CrosswordGame.tsx        # MODIFIED — integrate hint (reveal letter) + word colors
│   │   └── components/
│   │       └── CrosswordGrid.tsx    # MODIFIED — render word highlight colors
│   └── emoji-guess/
│       ├── EmojiGuessGame.tsx       # MODIFIED — integrate hint (append letter)
│       └── components/
│           └── AnswerInput.tsx      # MODIFIED — render locked hint letters distinctly
└── pages/
    └── GameShell.tsx                # MODIFIED — score penalty animation (red flash on hint use)
```

**Structure Decision**: Extends existing feature-based structure. Shared hint infrastructure lives in `core/hooks/` and `design-system/components/`. Game-specific hint logic remains within each game module. No new top-level directories needed.
