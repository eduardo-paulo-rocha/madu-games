# Quickstart: Found Words Highlighting

**Feature**: 003-found-words-highlighting
**Date**: 2026-05-31

## Overview

This feature swaps the highlighting strategies between two games:
- **Word Search (Caça-Palavras)**: single green → multi-color per word
- **Crossword (Cruzadinha)**: multi-color per word → single uniform color

## Files Modified

| File | Change Summary |
|------|---------------|
| `src/games/word-search/WordSearchGame.tsx` | Add `foundWordColors` map; build cell-to-color lookup at render; pass colors to WordList |
| `src/games/word-search/components/WordList.tsx` | Accept `foundWordColors` prop; render per-word color indicator |
| `src/games/crossword/CrosswordGame.tsx` | Remove `colorIndex` from `CompletedWordInfo`; simplify `handleWordCompletion` |
| `src/games/crossword/components/CrosswordGrid.tsx` | Replace palette lookup with uniform `${colors.success}30` for all completed cells |

## Prerequisites

```bash
npm install   # No new dependencies
npm run dev   # Start dev server
```

## Recommended Implementation Order

1. **Word Search highlighting** — Modify `WordSearchGame.tsx` to track per-word color indices and build the cell color map at render time
2. **Word Search word list** — Update `WordList.tsx` to accept and display per-word colors
3. **Crossword highlighting** — Simplify `CrosswordGrid.tsx` to use uniform completion color
4. **Crossword state cleanup** — Remove `colorIndex` from `CompletedWordInfo` in `CrosswordGame.tsx`

## Verification

```bash
npm run build    # TypeScript compilation — zero errors
npm run lint     # ESLint — zero warnings
npm run test     # Vitest — all passing
```

Manual verification:
- Play Word Search: find 3+ words, confirm each has a distinct color in grid and word list
- Play Crossword: complete 3+ words, confirm all cells share the same green highlight
