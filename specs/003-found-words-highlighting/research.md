# Research: Found Words Highlighting

**Feature**: 003-found-words-highlighting
**Date**: 2026-05-31

## Research Tasks

### R1: Word Search — Best approach for per-word color assignment

**Context**: Word Search currently uses a single `colors.success` green for all found cells via a `Set<string>` of cell keys. Need to track which color belongs to which word.

**Decision**: Replace the flat `foundCells: Set<string>` with a `foundWordColors: Map<string, number>` that maps each found word's normalized name to a color index (0–9, cycling). When rendering, build a `cellColorIndex: Map<string, number>` by iterating placed words in discovery order, mapping each cell to the color of the word that found it. For intersections, the most recently found word's color wins (higher discovery index = later).

**Rationale**: This mirrors the pattern Crossword already uses (`completedWords: Map<string, CompletedWordInfo>`), but simpler since Word Search only needs the color index. The `foundCells: Set<string>` remains for quick "is this cell found?" checks but is augmented with per-word color data.

**Alternatives considered**:
- Store color per cell directly in `foundCells` → loses word-level association, can't show per-word color in word list.
- Use a separate data structure per found word with cell lists → over-engineered; `placedWords` already has cell positions.

---

### R2: Crossword — Simplifying to uniform color

**Context**: Crossword currently tracks `CompletedWordInfo { colorIndex, completedOrder }` per completed word and uses `wordHighlightColors[colorIndex]` for cell backgrounds.

**Decision**: Use a single uniform color (`colors.success + '30'` — 30% opacity green) for all completed cells, matching the existing success color pattern. Remove the `colorIndex` from `CompletedWordInfo` (keep `completedOrder` if needed for intersection precedence, or simplify to a `Set<string>` of completed word names).

**Rationale**: The `colorIndex` was the mechanism for multi-color highlighting. Since we're switching to uniform color, it becomes dead code. Removing it follows Constitution Principle II (Simplicity) — every abstraction must justify itself.

**Alternatives considered**:
- Keep `CompletedWordInfo` with `colorIndex` but ignore it → violates "no dead code" principle.
- Use `colors.primary` instead of `colors.success` → `success` better communicates "completed" semantics.

---

### R3: Word Search WordList — Per-word color indicators

**Context**: The `WordList` component currently shows found words with `colors.success` green text and strikethrough. Need to show each word's assigned highlight color.

**Decision**: Pass a `foundWordColors: Map<string, number>` prop to `WordList`. For found words, use the corresponding `wordHighlightColors[colorIndex]` as the background color and keep the strikethrough. For unfound words, keep the current style.

**Rationale**: Minimal change — only the color source changes from a fixed green to a palette lookup.

**Alternatives considered**:
- Colored dot indicator next to each word → adds visual complexity; colored background is cleaner.
- Colored border instead of background → less visible, especially on small screens.

---

### R4: Crossword ClueList — Simplification

**Context**: The `ClueList` component receives `completedWords: Map<string, { colorIndex: number; completedOrder: number }>` but only uses it to check `isCompleted` (boolean check). The `colorIndex` and `completedOrder` values are not used in the clue list rendering.

**Decision**: Keep the current prop type for `ClueList` since it only checks `.has()` on the map. The underlying type change in `CompletedWordInfo` will be transparent to ClueList. The visual style (green text + strikethrough) already uses the uniform `colors.success` color.

**Rationale**: No change needed in ClueList — it already renders uniformly.

---

## Summary

All unknowns resolved. No external dependencies or new libraries required. Changes are purely presentational state management adjustments within existing components.
