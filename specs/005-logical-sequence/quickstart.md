# Quickstart: Sequência Lógica

**Feature**: 005-logical-sequence
**Date**: 2026-05-31

## Overview

New game module — "Sequência Lógica" — where children identify the missing emoji that completes a repeating pattern. Patterns are generated algorithmically from rule definitions across three difficulty levels.

## Files Created / Modified

| File | Status | Change Summary |
|------|--------|---------------|
| `src/games/logical-sequence/index.ts` | NEW | Plugin definition with game metadata |
| `src/games/logical-sequence/LogicalSequenceGame.tsx` | NEW | Main game component — manages round state, renders pattern + options, handles answers |
| `src/games/logical-sequence/components/LogicalSequenceIcon.tsx` | NEW | Game card icon (🔴🔵🔴🔵❓ style) |
| `src/games/logical-sequence/components/PatternDisplay.tsx` | NEW | Renders emoji sequence with ❓ placeholder for the missing element |
| `src/games/logical-sequence/components/OptionButtons.tsx` | NEW | Renders 2–3 tappable answer options with selection feedback |
| `src/games/logical-sequence/components/FeedbackOverlay.tsx` | NEW | Shows ✅/🎉 or ❌ feedback overlay after selection |
| `src/games/logical-sequence/logic/pattern-rules.ts` | NEW | Pattern rule definitions, emoji sets, and rule-to-difficulty mapping |
| `src/games/logical-sequence/logic/pattern-generator.ts` | NEW | Generates PatternInstance from a PatternRule + emoji set |
| `src/games/logical-sequence/logic/round-generator.ts` | NEW | Selects and generates 10 patterns for a round at a given difficulty |
| `src/games/index.ts` | MODIFIED | Add `import { plugin as logicalSequence } from './logical-sequence'` and register |

## Prerequisites

```bash
cd .worktrees/005-logical-sequence  # or repo root
npm install                          # No new dependencies
npm run dev                          # Start dev server
```

## Recommended Implementation Order

1. **Pattern logic** (`logic/`) — Implement pattern rules, generator, and round generator first. These are pure functions, easily unit-tested in isolation.

2. **Unit tests for pattern logic** — Write Vitest tests to validate:
   - Each rule type generates the correct sequence
   - Answer is always the correct completion
   - Distractors don't include the answer (before shuffling)
   - Distractor comes from the same emoji category
   - Round generator produces exactly `roundSize` patterns

3. **Game component** (`LogicalSequenceGame.tsx`) — Wire up state management (current index, correct count), call `onCorrectItem` / `onRoundComplete`.

4. **UI components** (`components/`) — Implement PatternDisplay, OptionButtons, FeedbackOverlay with design system tokens and Framer Motion animations.

5. **Plugin registration** — Create `index.ts` plugin definition and register in `src/games/index.ts`.

6. **Integration testing** — Verify full game flow: home page → game card → difficulty selection → play round → results screen.

## Key Reused Infrastructure

| Component / Module | Usage |
|-------------------|-------|
| `GameShell` | Handles difficulty selection, results screen, score display |
| `DifficultySelector` | Difficulty selection UI (easy/medium/hard) |
| `ScoreDisplay` | Results screen with score, stars, high score |
| `StarRating` | Star visualization (1–3 stars) |
| `CelebrationAnimation` | Particle animation on round complete |
| `NewRecordAnimation` | Particle animation for new high scores |
| `useGameSession` | Game session lifecycle (start, correct, complete) |
| `scoring-engine` | Score calculation and star rating |
| `session-store` / `score-store` | IndexedDB persistence |
| `design-system/tokens` | Colors, spacing, typography, radii |
| `animations/presets` | Framer Motion animation presets |
