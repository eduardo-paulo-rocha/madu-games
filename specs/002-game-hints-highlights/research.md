# Research: Game Hints & Word Highlights

**Feature**: 002-game-hints-highlights | **Date**: 2026-05-31

## Research Tasks

### 1. Scoring Engine Extension Pattern

**Context**: Current scoring engine is a pure function `calculateScore(correctItems, pointsPerItem)`. Need to support hint deductions.

**Decision**: Add a new exported function `calculateScoreWithHints(correctItems, pointsPerItem, hintCount, hintPenalty)` rather than modifying the existing function signature. This preserves backward compatibility.

**Rationale**: Adding a new function avoids breaking the existing `useGameSession` hook callers and allows incremental migration. The penalty formula is `finalScore = correctItems * pointsPerItem - hintCount * hintPenalty`.

**Alternatives considered**:
- Modify existing `calculateScore` to accept optional params → rejected because it changes the signature semantics and risks missed call sites.
- Put deduction logic in each game → rejected because spec explicitly requires centralized computation.

---

### 2. Shared Hint Hook Design (`useHint`)

**Context**: All three games need hint state (count, disabled status) and trigger logic. Need a reusable pattern.

**Decision**: Create a custom hook `useHint` that encapsulates:
- `hintCount: number` — total hints used in current session
- `useHint(callback): { hintCount, triggerHint, isHintDisabled, showPenalty }` — where callback is game-specific logic
- `showPenalty: boolean` — toggles the toast visibility (auto-dismisses after 2.5s)

**Rationale**: A shared hook enforces the consistent -5 penalty, manages toast timing, and exposes `hintCount` for the scoring engine. Each game provides its own hint execution callback (what the hint actually does).

**Alternatives considered**:
- Zustand global store for hints → rejected because hint state is session-scoped and component-local; a hook is simpler per Constitution Principle II.
- Higher-order component wrapper → rejected because hooks compose better in the existing codebase pattern.

---

### 3. Toast Notification Pattern (Hint Penalty)

**Context**: Need a temporary "-5 pontos" notification that appears on hint use and auto-dismisses.

**Decision**: Create a `HintPenaltyToast` component using framer-motion `AnimatePresence` for enter/exit animations. Position: fixed at top-center, overlaying game content. Duration: 2.5 seconds. Uses existing `colors.error` for the penalty color and `colors.surface` for background.

**Rationale**: framer-motion is already a dependency and used extensively for animations. A dedicated component (not a generic toast system) keeps it simple per Constitution Principle II — we don't need a full toast infrastructure for a single notification type.

**Alternatives considered**:
- Generic toast/notification system → rejected (YAGNI — only one notification type needed now).
- Inline text below score → rejected because it wouldn't be noticeable enough per SC-002.

---

### 4. Word Highlight Color Palette

**Context**: Need 8-10 visually distinct colors for completed crossword words. Must maintain text contrast (dark text on colored backgrounds).

**Decision**: Use a curated palette of 10 pastel/medium-saturation colors stored in `design-system/tokens/index.ts` as `wordHighlightColors`. All colors have WCAG AA contrast ratio with `colors.textPrimary` (#2D2B55).

**Palette** (selected for distinctness and contrast):
```
#B3E5FC (light blue)
#C8E6C9 (light green)
#FFE0B2 (light orange)
#E1BEE7 (light purple)
#FFCCBC (light coral)
#B2DFDB (light teal)
#FFF9C4 (light yellow)
#F8BBD0 (light pink)
#D1C4E9 (light lavender)
#DCEDC8 (light lime)
```

**Rationale**: Pastel backgrounds ensure dark text remains readable. 10 colors exceeds the max words in any puzzle difficulty (typically 6-8), providing sufficient variety. Colors chosen to be perceptually distinct from each other.

**Alternatives considered**:
- Saturated/bold colors → rejected because text readability suffers.
- CSS hue rotation formula → rejected because computed colors may not guarantee contrast.

---

### 5. Hint-Revealed Letter Visual Distinction

**Context**: FR-007 requires hint-revealed letters to be visually distinguishable from player-typed letters.

**Decision**: Hint-revealed letters use `colors.primary` (#6C63FF) text color + italic style, while player-typed letters remain `colors.textPrimary` (#2D2B55) with normal weight. In Word Search, the hint cell gets a pulsing border animation using `colors.accent` (#FFD93D).

**Rationale**: Color differentiation is the most accessible and obvious visual cue. Using the existing `colors.primary` maintains design system consistency. The italic style adds a secondary cue for colorblind users.

**Alternatives considered**:
- Underline → rejected because it can be confused with cursor indicators.
- Different background → rejected for Crossword because it conflicts with the word-highlight-color feature.

---

### 6. Hint Button in GameShell vs. Per-Game

**Context**: FR-001 places the hint button next to the score display. The score area is rendered in `GameShell.tsx`. But hint logic is game-specific.

**Decision**: Render the `HintButton` component in each game's component (not in GameShell), positioned absolutely at the top-right of the game area, adjacent to where GameShell renders the score. Each game passes its own `onHint` callback and `isDisabled` state.

**Rationale**: Placing the button in GameShell would require threading game-specific hint logic upward (increasing coupling). Each game already manages its own state; the button simply needs consistent visual placement which CSS handles. This aligns with Constitution Principle VI (games are self-contained modules).

**Alternatives considered**:
- Render in GameShell with callback prop drilling → rejected because it couples GameShell to hint-specific state from each game.
- Render in GameShell with context/event bus → over-engineered for a single button (Principle II).

---

### 7. Locked Letters & Word Completion

**Context**: FR-008 requires hint-revealed letters to be locked (non-editable). In Crossword, these locked letters must count toward word completion.

**Decision**: Extend the `filledLetters` Map in CrosswordGame to track `{ letter: string, isHint: boolean }` instead of just `string`. The `checkWordCompletion` function treats hint letters the same as player letters. The grid renderer uses `isHint` to apply visual styling. Backspace skips hint cells.

For Emoji Guess: maintain a `Set<number>` of locked positions. The display renders locked positions with hint styling. Backspace stops at locked positions.

**Rationale**: Minimal state extension that preserves existing completion logic while adding the visual/behavioral distinction.

**Alternatives considered**:
- Separate `hintedCells` Set alongside `filledLetters` → rejected because it duplicates position tracking and requires two lookups per render.
