# Contract: Hint System

**Feature**: 002-game-hints-highlights | **Date**: 2026-05-31

## 1. Scoring Engine Contract

### `calculateScoreWithHints`

```typescript
/**
 * Calculate final score accounting for hint penalties.
 * @param correctItems - Number of correctly answered items
 * @param pointsPerItem - Points awarded per correct item
 * @param hintCount - Number of hints used (>= 0)
 * @param hintPenalty - Points deducted per hint (default: 5)
 * @returns Final score (may be negative)
 */
export function calculateScoreWithHints(
    correctItems: number,
    pointsPerItem: number,
    hintCount: number,
    hintPenalty?: number,
): number;
```

**Behavior**:
- Returns `correctItems * pointsPerItem - hintCount * (hintPenalty ?? 5)`
- Result MAY be negative (no floor)
- `hintCount` of 0 produces identical result to existing `calculateScore`

---

## 2. useHint Hook Contract

### Interface

```typescript
interface UseHintOptions {
    /** Game-specific hint execution. Returns true if hint was valid/applied. */
    onHint: () => boolean;
    /** Whether hint is currently unavailable (game-specific logic) */
    isDisabled: boolean;
}

interface UseHintReturn {
    /** Total hints used in this session */
    hintCount: number;
    /** Trigger a hint. Calls onHint, increments count if valid, shows toast. */
    triggerHint: () => void;
    /** Whether to show the penalty toast */
    showPenalty: boolean;
    /** Whether the hint button should be disabled */
    isHintDisabled: boolean;
}

export function useHint(options: UseHintOptions): UseHintReturn;
```

**Behavior**:
- `triggerHint()` calls `onHint()`. If it returns `true`, increments `hintCount` and sets `showPenalty = true`.
- `showPenalty` auto-resets to `false` after 2500ms.
- `isHintDisabled` reflects the `isDisabled` option prop.

---

## 3. HintButton Component Contract

### Props

```typescript
interface HintButtonProps {
    /** Called when player taps the hint button */
    onClick: () => void;
    /** Whether the button is disabled (no hints available) */
    disabled: boolean;
}
```

**Visual Spec**:
- Uses `Button` component from design system with `variant="secondary"`
- Displays lightbulb icon (💡) + "Dica" label
- Touch target: minimum 44x44px
- When disabled: reduced opacity (0.5), non-interactive

---

## 4. HintPenaltyToast Component Contract

### Props

```typescript
interface HintPenaltyToastProps {
    /** Whether the toast is visible */
    visible: boolean;
    /** Penalty amount to display */
    penalty?: number; // default: 5
}
```

**Visual Spec**:
- Fixed position at top-center of game area
- Background: `colors.error` with 90% opacity
- Text: white, bold, "-5 pontos (dica usada)"
- Enter animation: slide down + fade in (200ms)
- Exit animation: fade out + slide up (300ms)
- Z-index: above game content, below modals

---

## 5. Game-Specific Hint Callbacks

### Word Search `onHint`

```typescript
// Returns true if a valid unfound word was highlighted
() => boolean
```

**Logic**:
1. Filter `placedWords` to exclude `foundWords` and already-hinted words
2. If empty → return `false`
3. Pick random unfound word from filtered list
4. Highlight its first cell position (row, col) with accent border animation
5. Add to `hintedWordCells` state
6. Return `true`

### Crossword `onHint`

```typescript
// Returns true if a valid letter was revealed
() => boolean
```

**Logic**:
1. If no cell is selected → show "Selecione uma célula" message, return `false`
2. Get correct letter for selected cell from puzzle solution
3. If cell already contains correct letter → show "Já está correto" message, return `false`
4. Set cell value to correct letter with `isHint: true`
5. Check word completion (may trigger color assignment)
6. Advance selection to next empty cell in active clue
7. Return `true`

### Emoji Guess `onHint`

```typescript
// Returns true if a valid letter was appended
() => boolean
```

**Logic**:
1. Get correct answer for current emoji (normalized)
2. If `input.length >= answer.length` → return `false` (all revealed)
3. Get letter at position `input.length`
4. Append letter to input
5. Add position to `lockedPositions` set
6. Return `true`

---

## 6. Integration with GameSession

### Modified `handleRoundComplete` flow

```
1. Game calls onRoundComplete({ totalItems, correctItems })
2. useGameSession receives results
3. useGameSession calls calculateScoreWithHints(correctItems, pointsPerItem, hintCount)
4. Score (possibly negative) is persisted to session-store
5. Stars calculated from correctItems/totalItems (unaffected by hints)
```

**Key**: `hintCount` must be accessible to `useGameSession`. This is achieved by:
- Games pass `hintCount` in the `RoundResults` interface (extended with optional field)

### Extended RoundResults

```typescript
export interface RoundResults {
    totalItems: number;
    correctItems: number;
    hintCount?: number; // NEW — defaults to 0 if omitted
}
```
