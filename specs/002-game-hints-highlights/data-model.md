# Data Model: Game Hints & Word Highlights

**Feature**: 002-game-hints-highlights | **Date**: 2026-05-31

## Entities

### GameSession (extended)

Existing entity in `core/storage/session-store.ts`. Extended with hint tracking.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique session identifier (existing) |
| gameId | string | Game plugin ID (existing) |
| difficulty | Difficulty | easy/medium/hard (existing) |
| totalItems | number | Total items in round (existing) |
| correctItems | number | Correctly answered items (existing) |
| score | number | Final score including deductions (existing) |
| stars | number | 0-3 star rating (existing) |
| status | SessionStatus | in-progress/completed/abandoned (existing) |
| **hintCount** | **number** | **NEW — Total hints used in this session (default: 0)** |
| startedAt | Date | Session start time (existing) |
| completedAt | Date? | Session end time (existing) |

### HintState (runtime only — not persisted)

Managed by `useHint` hook. Not stored in IndexedDB.

| Field | Type | Description |
|-------|------|-------------|
| hintCount | number | Hints used so far in current session |
| showPenalty | boolean | Whether the penalty toast is currently visible |
| isDisabled | boolean | Whether the hint button should be disabled |

### CrosswordCellData (runtime only)

Extended cell value tracked in CrosswordGame component state.

| Field | Type | Description |
|-------|------|-------------|
| letter | string | The letter in the cell |
| isHint | boolean | Whether this letter was revealed by a hint |

### CompletedWordState (runtime only)

Tracked in CrosswordGame component state.

| Field | Type | Description |
|-------|------|-------------|
| word | string | The completed word's identifier |
| colorIndex | number | Index into the wordHighlightColors palette |
| completedOrder | number | Order in which word was completed (for intersection priority) |

### EmojiGuessHintState (runtime only)

Additional state for Emoji Guess hint tracking.

| Field | Type | Description |
|-------|------|-------------|
| lockedPositions | Set\<number\> | Positions (indices) that contain hint-revealed letters |

### WordSearchHintState (runtime only)

Additional state for Word Search hint tracking.

| Field | Type | Description |
|-------|------|-------------|
| hintedWordCells | Map\<string, CellCoord\> | Map of word → highlighted cell coordinate |

## Relationships

```
GameSession 1──* Hint (tracked as hintCount)
CrosswordGame 1──* CrosswordCellData (via filledLetters Map)
CrosswordGame 1──* CompletedWordState (via completedWords state)
EmojiGuessGame 1──1 EmojiGuessHintState
WordSearchGame 1──1 WordSearchHintState
```

## State Transitions

### Hint Usage Flow

```
idle → hint_requested → [game-specific logic] → penalty_applied → toast_shown → toast_dismissed → idle
```

### Crossword Word Completion (with colors)

```
incomplete → all_cells_correct → color_assigned → highlighted
```

When a cell belongs to two words and the second word completes:
```
cell_color = first_word_color → cell_color = second_word_color (last wins)
```

## Validation Rules

- `hintCount` MUST be >= 0
- `hintCount` MUST only increment by 1 per hint action
- Score MAY go negative (no floor)
- `colorIndex` cycles through palette using `completedWords.size % palette.length`
- Locked positions cannot be modified by player input (backspace skips them)
- A hint in Crossword on a cell that already has the correct letter does NOT increment hintCount

## Design Tokens Extension

```typescript
// Added to design-system/tokens/index.ts
export const wordHighlightColors = [
    '#B3E5FC', // light blue
    '#C8E6C9', // light green
    '#FFE0B2', // light orange
    '#E1BEE7', // light purple
    '#FFCCBC', // light coral
    '#B2DFDB', // light teal
    '#FFF9C4', // light yellow
    '#F8BBD0', // light pink
    '#D1C4E9', // light lavender
    '#DCEDC8', // light lime
] as const;
```
