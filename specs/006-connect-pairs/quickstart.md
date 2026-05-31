# Quickstart: Conecte os Pares

**Feature**: 006-connect-pairs | **Date**: 2026-05-31

## Prerequisites

- Node.js 20+
- npm 10+
- Project dependencies installed (`npm install`)

## Local Development

```bash
# Start dev server
npm run dev

# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Lint
npm run lint
```

## Feature Files Overview

| File | Purpose |
|------|---------|
| `src/games/connect-pairs/index.ts` | Plugin registration (id, name, icon, lazy component) |
| `src/games/connect-pairs/ConnectPairsGame.tsx` | Main game component (receives GameProps) |
| `src/games/connect-pairs/components/ConnectPairsIcon.tsx` | Icon for home page card |
| `src/games/connect-pairs/components/PairColumn.tsx` | Renders a column of selectable items |
| `src/games/connect-pairs/components/PairItem.tsx` | Individual item with selection/matched states |
| `src/games/connect-pairs/components/MatchFeedback.tsx` | ✅/❌ feedback overlay |
| `src/games/connect-pairs/logic/pair-matcher.ts` | Selection state machine (useReducer) |
| `src/games/connect-pairs/logic/round-generator.ts` | Pair set selection, column shuffling |
| `src/games/connect-pairs/logic/scoring.ts` | First-try tracking, attempt counting |
| `src/games/connect-pairs/data/pair-sets.ts` | Curated pair data (5+ categories, 30+ sets) |
| `src/games/index.ts` | Modified to register connect-pairs plugin |

## Implementation Order

1. **Pair data** — Create `pair-sets.ts` with curated content for all categories/difficulties
2. **Game logic** — Implement `round-generator.ts` (selection, shuffling) and `pair-matcher.ts` (state machine)
3. **Scoring logic** — Implement `scoring.ts` (first-try tracking, attempt counting)
4. **UI components** — Build `PairItem`, `PairColumn`, `MatchFeedback`, `ConnectPairsIcon`
5. **Main game** — Wire everything together in `ConnectPairsGame.tsx`
6. **Plugin registration** — Create `index.ts` and register in `src/games/index.ts`
7. **Testing** — Unit tests for logic, component tests for UI, integration tests for full flow

## Testing Strategy

- **Unit**: `pair-matcher.ts` (state transitions, match validation), `round-generator.ts` (shuffling, difficulty mapping), `scoring.ts` (first-try logic)
- **Component**: `PairItem` (selection states, disabled state), `PairColumn` (renders correct items), `MatchFeedback` (shows correct/incorrect)
- **Integration**: Full game flow (select pair → feedback → round complete → results)
- **E2E**: Navigate to game → select difficulty → complete round → verify results screen

## Key Design Decisions

1. **Reuse existing GamePlugin** — No modifications to core types; `correctItems` maps to first-try matches
2. **useReducer state machine** — Simple discriminated union for selection/matching states
3. **Static TypeScript data** — Pair sets as typed module, not JSON, for compile-time safety
4. **Independent column shuffle** — Both columns randomized independently per FR-009
5. **First-try tracking** — `failedItems` Set tracks items involved in wrong attempts
6. **Category rotation** — Track last category to avoid consecutive repeats
