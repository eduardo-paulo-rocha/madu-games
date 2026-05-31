import type { PlacedWord } from './grid-generator';

export function validateWord(
    selectedCells: { row: number; col: number }[],
    placedWords: PlacedWord[],
    foundWords: Set<string>,
): PlacedWord | null {
    for (const placed of placedWords) {
        if (foundWords.has(placed.normalizedWord)) continue;

        if (cellsMatch(selectedCells, placed.cells)) {
            return placed;
        }

        // Also check reversed selection
        const reversed = [...selectedCells].reverse();
        if (cellsMatch(reversed, placed.cells)) {
            return placed;
        }
    }

    return null;
}

function cellsMatch(
    selected: { row: number; col: number }[],
    target: { row: number; col: number }[],
): boolean {
    if (selected.length !== target.length) return false;
    return selected.every(
        (cell, i) => cell.row === target[i]!.row && cell.col === target[i]!.col,
    );
}
