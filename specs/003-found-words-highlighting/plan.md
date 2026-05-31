# Implementation Plan: Found Words Highlighting

**Branch**: `003-found-words-highlighting` | **Date**: 2026-05-31 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-found-words-highlighting/spec.md`

## Summary

Swap the highlighting strategies between Word Search and Crossword games. Word Search will assign a unique color from the existing `wordHighlightColors` palette to each found word (replacing the current single-green approach), with per-word color indicators in the word list. Crossword will use a single uniform completion color for all completed cells (replacing the current multi-color per-word approach), simplifying the visual feedback. Both changes are purely presentational — no scoring, hint, or game logic changes.

## Technical Context

**Language/Version**: TypeScript 5.5+ (strict mode)

**Primary Dependencies**: React 19, Vite 8, framer-motion 12 (animations)

**Storage**: N/A — no persistence changes; highlighting is ephemeral in-game state

**Testing**: Vitest (unit), Playwright (E2E)

**Target Platform**: PWA — smartphones Android 8+, iOS 14+, desktop Chrome/Edge. Mobile-first, 320px-1024px.

**Project Type**: PWA / SPA (client-only, zero-backend)

**Performance Goals**: 60 fps grid rendering; color lookup < 1ms; no additional re-renders beyond existing found-word state updates

**Constraints**: Offline-capable; zero additional bundle size (reuses existing palette); touch targets unchanged

**Scale/Scope**: 2 games affected (Word Search, Crossword), 4 files modified, 0 new files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Code Quality | ✅ PASS | Changes are minimal and self-contained; existing test coverage validates game flows |
| II. Simplicity | ✅ PASS | Crossword becomes simpler (removes per-word color tracking); Word Search reuses existing palette |
| III. UX Consistency | ✅ PASS | Both games use colors from the shared design-system palette; behavior follows existing patterns |
| IV. Performance | ✅ PASS | Color assignment is O(1) index lookup; no hot-path allocations; grid rendering unchanged |
| V. Maintainability | ✅ PASS | Word Search gains a `Map<string, number>` for color indices, mirroring the pattern Crossword currently uses; Crossword removes unnecessary state |
| VI. Extensibility | ✅ PASS | Color palette remains token-based; new games can choose either strategy independently |

**Gate Result**: PASS — no violations detected. Proceeding to Phase 0.

**Post-Design Re-Check**: PASS — design confirmed: no new abstractions, no new dependencies, no performance concerns.

## Project Structure

### Documentation (this feature)

```text
specs/003-found-words-highlighting/
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
├── design-system/
│   └── tokens/
│       └── index.ts                 # UNCHANGED — wordHighlightColors palette reused as-is
├── games/
│   ├── word-search/
│   │   ├── WordSearchGame.tsx       # MODIFIED — add foundWordColors map, pass to grid & word list
│   │   └── components/
│   │       └── WordList.tsx          # MODIFIED — accept color map, display per-word color indicators
│   └── crossword/
│       ├── CrosswordGame.tsx        # MODIFIED — simplify CompletedWordInfo, remove colorIndex
│       └── components/
│           └── CrosswordGrid.tsx     # MODIFIED — use uniform color instead of per-word palette lookup
```

**Structure Decision**: Existing single-project SPA structure. All changes are in-place modifications to existing files within the game modules and components. No new files needed.
