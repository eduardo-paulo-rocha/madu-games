# Quickstart: Game Hints & Word Highlights

**Feature**: 002-game-hints-highlights | **Date**: 2026-05-31

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
| `src/core/hooks/use-hint.ts` | Shared hint hook (count, toast, disabled state) |
| `src/core/scoring/scoring-engine.ts` | Extended with `calculateScoreWithHints()` |
| `src/core/registry/types.ts` | `RoundResults` extended with `hintCount` |
| `src/design-system/components/HintButton.tsx` | Reusable hint button UI |
| `src/design-system/components/HintPenaltyToast.tsx` | Penalty toast notification |
| `src/design-system/tokens/index.ts` | `wordHighlightColors` palette added |
| `src/games/word-search/WordSearchGame.tsx` | Hint: highlight first letter of unfound word |
| `src/games/crossword/CrosswordGame.tsx` | Hint: reveal letter + word color coding |
| `src/games/emoji-guess/EmojiGuessGame.tsx` | Hint: append next correct letter |
| `src/pages/GameShell.tsx` | Pass hint count to score calculation |

## Implementation Order

1. **Scoring engine** — Add `calculateScoreWithHints`, extend `RoundResults`
2. **Shared hook** — Create `useHint` hook
3. **Design system** — Add `HintButton`, `HintPenaltyToast`, `wordHighlightColors`
4. **Word Search** — Integrate hint (simplest game)
5. **Emoji Guess** — Integrate hint (sequential append)
6. **Crossword** — Integrate hint + word color coding (most complex)
7. **GameShell** — Wire hint count into score calculation flow

## Testing Strategy

- **Unit**: scoring engine (deduction math), useHint hook (state transitions, timing)
- **Component**: HintButton (disabled state, click), HintPenaltyToast (visibility, animation)
- **Integration**: Each game's hint flow (button → effect → score deduction → toast)
- **E2E**: Full gameplay with hints → verify final score reflects deductions

## Key Design Decisions

1. **Centralized scoring** — Hint penalty computed in `calculateScoreWithHints`, not per-game
2. **Hook pattern** — `useHint` shared across games; game provides `onHint` callback
3. **Last-wins intersection** — Crossword cells at word intersections take the most recent word's color
4. **Sequential hints (Emoji)** — Hints append next letter (no cursor concept)
5. **Persistent highlight (Word Search)** — Hint highlight stays until word is found
6. **Negative scores allowed** — No floor on score; players can use unlimited hints
