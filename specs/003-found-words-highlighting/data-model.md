# Data Model: Found Words Highlighting

**Feature**: 003-found-words-highlighting
**Date**: 2026-05-31

## Entities

### Word Search — Found Word Color Map

Tracks the color assignment for each found word by discovery order.

| Field | Type | Description |
|-------|------|-------------|
| normalizedWord | string (key) | The normalized word string (e.g., "GATO") |
| colorIndex | number (value) | Index into `wordHighlightColors` palette (0–9, cycling) |

**State**: `foundWordColors: Map<string, number>`

**Assignment rule**: `colorIndex = foundWordColors.size % wordHighlightColors.length` at the moment the word is found.

**Relationship**: Each entry corresponds to a word in `placedWords[]`. The `normalizedWord` key matches `PlacedWord.normalizedWord`.

### Word Search — Cell Color Resolution

Derived at render time from `foundWordColors` + `placedWords`. Not stored as state.

| Field | Type | Description |
|-------|------|-------------|
| cellKey | string (key) | Cell coordinate key `"row,col"` |
| colorIndex | number (value) | The color index to apply to this cell |

**Resolution rule**: For each found word (in discovery order), map all its cells to its `colorIndex`. Later words overwrite earlier ones at intersections. This is computed inline during render, not stored.

### Crossword — Completed Words (simplified)

Tracks which words have been completed. Replaces the current `CompletedWordInfo` type.

**Current type** (being simplified):
```typescript
interface CompletedWordInfo {
    colorIndex: number;      // REMOVED — no longer needed
    completedOrder: number;  // KEPT — used for intersection precedence
}
```

**New type**:
```typescript
// CompletedWordInfo is kept but colorIndex is no longer used for rendering.
// completedOrder is retained to determine which word "owns" an intersection cell.
```

| Field | Type | Description |
|-------|------|-------------|
| normalizedWord | string (key) | The completed word identifier |
| completedOrder | number | Sequence number of completion (1, 2, 3...) |

**Rendering**: All completed cells use a single uniform color: `${colors.success}30` (success green at 30% opacity).

## Existing Entities (unchanged)

### wordHighlightColors palette

```typescript
// src/design-system/tokens/index.ts — no changes
export const wordHighlightColors = [
    '#B3E5FC', '#C8E6C9', '#FFE0B2', '#E1BEE7', '#FFCCBC',
    '#B2DFDB', '#FFF9C4', '#F8BBD0', '#D1C4E9', '#DCEDC8',
] as const;
```

**Usage change**: Previously used only by Crossword. Now used by Word Search instead. Crossword will stop using it.

### PlacedWord (Word Search)

Existing structure with `cells: { row, col }[]` — used to map found words to grid cells for color assignment. No changes.

## State Transitions

### Word Search: Finding a word

```
Before: foundWords={}, foundWordColors={}
Action: Player finds "GATO"
After:  foundWords={"GATO"}, foundWordColors={"GATO": 0}

Before: foundWords={"GATO"}, foundWordColors={"GATO": 0}
Action: Player finds "SOL"
After:  foundWords={"GATO","SOL"}, foundWordColors={"GATO": 0, "SOL": 1}
```

### Crossword: Completing a word

```
Before: completedWords={}
Action: Player completes "CASA"
After:  completedWords={"CASA": {completedOrder: 1}}
  → All cells of "CASA" render with uniform ${colors.success}30

Before: completedWords={"CASA": {completedOrder: 1}}
Action: Player completes "SOL" (shares a cell with "CASA")
After:  completedWords={"CASA": {completedOrder: 1}, "SOL": {completedOrder: 2}}
  → Shared cell renders same uniform color as all other completed cells
```
