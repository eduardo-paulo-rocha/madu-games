import { normalizeText } from '../../../core/text/normalize';

export interface CrosswordClue {
    word: string;
    clue: string;
}

export interface PlacedClue {
    word: string;
    normalizedWord: string;
    clue: string;
    startRow: number;
    startCol: number;
    direction: 'across' | 'down';
    number: number;
}

export interface PuzzleResult {
    grid: (string | null)[][];
    placedClues: PlacedClue[];
    gridSize: number;
}

function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }
    return shuffled;
}

export function generatePuzzle(clues: CrosswordClue[], wordCount: number): PuzzleResult {
    const shuffled = shuffleArray(clues);
    const selected = shuffled.slice(0, Math.min(wordCount * 3, shuffled.length));

    const normalized = selected.map((c) => ({
        ...c,
        normalizedWord: normalizeText(c.word).toUpperCase(),
    }));

    // Sort by length descending for better placement
    normalized.sort((a, b) => b.normalizedWord.length - a.normalizedWord.length);

    const maxLen = Math.max(...normalized.map((w) => w.normalizedWord.length));
    const gridSize = Math.max(maxLen + 2, 12);

    const grid: (string | null)[][] = Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => null),
    );

    const placedClues: PlacedClue[] = [];
    let clueNumber = 1;

    // Place first word horizontally in the center
    const first = normalized[0];
    if (first) {
        const startRow = Math.floor(gridSize / 2);
        const startCol = Math.floor((gridSize - first.normalizedWord.length) / 2);

        for (let i = 0; i < first.normalizedWord.length; i++) {
            grid[startRow]![startCol + i] = first.normalizedWord[i]!;
        }

        placedClues.push({
            word: first.word,
            normalizedWord: first.normalizedWord,
            clue: first.clue,
            startRow,
            startCol,
            direction: 'across',
            number: clueNumber++,
        });
    }

    // Try to place remaining words
    for (let i = 1; i < normalized.length && placedClues.length < wordCount; i++) {
        const entry = normalized[i]!;
        const placed = tryPlaceCrossword(grid, entry, gridSize);

        if (placed) {
            placedClues.push({
                word: entry.word,
                normalizedWord: entry.normalizedWord,
                clue: entry.clue,
                startRow: placed.startRow,
                startCol: placed.startCol,
                direction: placed.direction,
                number: clueNumber++,
            });
        }
    }

    return { grid, placedClues, gridSize };
}

function tryPlaceCrossword(
    grid: (string | null)[][],
    entry: { normalizedWord: string },
    gridSize: number,
): { startRow: number; startCol: number; direction: 'across' | 'down' } | null {
    const word = entry.normalizedWord;

    // Find intersections with existing letters on the grid
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const existingLetter = grid[r]?.[c];
            if (!existingLetter) continue;

            // Check if this letter appears in our word
            for (let wi = 0; wi < word.length; wi++) {
                if (word[wi] !== existingLetter) continue;

                // Try placing vertically (down)
                const downRow = r - wi;
                if (canPlaceWord(grid, word, downRow, c, 'down', gridSize)) {
                    placeWord(grid, word, downRow, c, 'down');
                    return { startRow: downRow, startCol: c, direction: 'down' };
                }

                // Try placing horizontally (across)
                const acrossCol = c - wi;
                if (canPlaceWord(grid, word, r, acrossCol, 'across', gridSize)) {
                    placeWord(grid, word, r, acrossCol, 'across');
                    return { startRow: r, startCol: acrossCol, direction: 'across' };
                }
            }
        }
    }

    return null;
}

function canPlaceWord(
    grid: (string | null)[][],
    word: string,
    startRow: number,
    startCol: number,
    direction: 'across' | 'down',
    gridSize: number,
): boolean {
    const dr = direction === 'down' ? 1 : 0;
    const dc = direction === 'across' ? 1 : 0;

    // Check bounds
    const endRow = startRow + (word.length - 1) * dr;
    const endCol = startCol + (word.length - 1) * dc;
    if (startRow < 0 || startCol < 0 || endRow >= gridSize || endCol >= gridSize) return false;

    // Check cell before word
    const beforeR = startRow - dr;
    const beforeC = startCol - dc;
    if (beforeR >= 0 && beforeC >= 0 && grid[beforeR]?.[beforeC] !== null) return false;

    // Check cell after word
    const afterR = endRow + dr;
    const afterC = endCol + dc;
    if (afterR < gridSize && afterC < gridSize && grid[afterR]?.[afterC] !== null) return false;

    let hasIntersection = false;

    for (let i = 0; i < word.length; i++) {
        const r = startRow + i * dr;
        const c = startCol + i * dc;
        const cell = grid[r]?.[c];

        if (cell !== null && cell !== undefined) {
            if (cell === word[i]) {
                hasIntersection = true;
            } else {
                return false;
            }
        } else {
            // Check adjacent cells perpendicular to direction
            const perpDr = direction === 'across' ? 1 : 0;
            const perpDc = direction === 'down' ? 1 : 0;

            if (grid[r + perpDr]?.[c + perpDc] !== null && grid[r + perpDr]?.[c + perpDc] !== undefined) return false;
            if (grid[r - perpDr]?.[c - perpDc] !== null && grid[r - perpDr]?.[c - perpDc] !== undefined) return false;
        }
    }

    return hasIntersection;
}

function placeWord(
    grid: (string | null)[][],
    word: string,
    startRow: number,
    startCol: number,
    direction: 'across' | 'down',
): void {
    const dr = direction === 'down' ? 1 : 0;
    const dc = direction === 'across' ? 1 : 0;

    for (let i = 0; i < word.length; i++) {
        grid[startRow + i * dr]![startCol + i * dc] = word[i]!;
    }
}
