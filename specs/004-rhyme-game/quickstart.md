# Quickstart: Rima com o Quê?

**Feature**: 004-rhyme-game | **Date**: 2026-05-31

## Prerequisites

- Node.js 18+
- npm 9+
- Project dependencies installed (`npm install`)

## Development

```bash
# Start dev server
npm run dev

# Run tests
npm test

# Lint
npm run lint

# Build
npm run build
```

## Implementation Order

### Step 1: Data Layer

Create `src/games/rhyme-game/data/rhyme-dictionary.json` with curated word sets. Start with 10 sets per difficulty for initial development; expand to 30+ before feature completion.

### Step 2: Logic Layer

1. `src/games/rhyme-game/logic/round-selector.ts` — Filter by difficulty, shuffle, select `roundSize` items, transform `RhymeWordSet` into `RhymeQuestion` (with shuffled options)
2. `src/games/rhyme-game/logic/option-shuffler.ts` — Fisher-Yates shuffle for answer options, returning shuffled array and correct index

### Step 3: Components

1. `src/games/rhyme-game/components/RhymeGameIcon.tsx` — SVG icon for home page
2. `src/games/rhyme-game/components/TargetWord.tsx` — Large, prominent display of target word + emoji
3. `src/games/rhyme-game/components/OptionCard.tsx` — Tappable card for a single answer option (emoji + text), with correct/incorrect states
4. `src/games/rhyme-game/components/OptionGrid.tsx` — 2x2 grid layout of OptionCards

### Step 4: Main Game Component

`src/games/rhyme-game/RhymeGame.tsx` — Orchestrates round flow, manages state, handles selection feedback, calls `onCorrectItem` and `onRoundComplete`.

### Step 5: Registration

1. `src/games/rhyme-game/index.ts` — GamePlugin definition
2. Update `src/games/index.ts` — Import and register rhyme-game plugin

### Step 6: Testing

1. Unit tests for `round-selector.ts` and `option-shuffler.ts`
2. Component tests for OptionCard and RhymeGame
3. Integration: play a full round via GameShell

## Key Patterns to Follow

- **Plugin registration**: Copy pattern from `src/games/emoji-guess/index.ts`
- **Game component**: Implement `GameProps` interface from `src/core/registry/types.ts`
- **Animations**: Use presets from `src/design-system/animations/presets.ts`
- **Styling**: Use tokens from `src/design-system/tokens/index.ts`
- **State management**: Local useState/useCallback (no external state library)

## File Checklist

| File | Status | Notes |
|------|--------|-------|
| `data/rhyme-dictionary.json` | ⬜ | 90+ word sets, 30+ per difficulty |
| `logic/round-selector.ts` | ⬜ | Filter, shuffle, transform |
| `logic/option-shuffler.ts` | ⬜ | Fisher-Yates + correct index tracking |
| `components/RhymeGameIcon.tsx` | ⬜ | SVG, accepts `size` prop |
| `components/TargetWord.tsx` | ⬜ | Animated entry, large text |
| `components/OptionCard.tsx` | ⬜ | Touch target ≥ 44px, feedback states |
| `components/OptionGrid.tsx` | ⬜ | 2×2 responsive grid |
| `RhymeGame.tsx` | ⬜ | Main game, implements GameProps |
| `index.ts` | ⬜ | GamePlugin export |
| `../index.ts` (modify) | ⬜ | Register plugin |
