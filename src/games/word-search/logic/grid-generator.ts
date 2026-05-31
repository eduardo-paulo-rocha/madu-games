import { normalizeText } from '../../../core/text/normalize';

export interface GridCell {
    letter: string;
    row: number;
    col: number;
}

export interface PlacedWord {
    word: string;
    normalizedWord: string;
    cells: { row: number; col: number }[];
}

type Direction = [number, number];

const DIRECTIONS: Direction[] = [
    [0, 1],   // horizontal right
    [1, 0],   // vertical down
    [1, 1],   // diagonal down-right
    [0, -1],  // horizontal left
    [-1, 0],  // vertical up
    [-1, -1], // diagonal up-left
    [1, -1],  // diagonal down-left
    [-1, 1],  // diagonal up-right
];

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }
    return shuffled;
}

export function generateGrid(
    words: string[],
    wordCount: number,
): { grid: string[][]; placedWords: PlacedWord[]; gridSize: number } {
    const selectedWords = shuffleArray(words).slice(0, wordCount);
    const normalizedWords = selectedWords.map((w) => normalizeText(w).toUpperCase());

    const maxLen = Math.max(...normalizedWords.map((w) => w.length));
    const gridSize = Math.max(maxLen + 2, Math.ceil(Math.sqrt(wordCount * maxLen * 1.5)));

    const grid: (string | null)[][] = Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => null),
    );

    const placedWords: PlacedWord[] = [];

    for (let i = 0; i < normalizedWords.length; i++) {
        const normalized = normalizedWords[i]!;
        const original = selectedWords[i]!;
        const placed = tryPlaceWord(grid, normalized, gridSize);

        if (placed) {
            placedWords.push({
                word: original,
                normalizedWord: normalized,
                cells: placed,
            });
        }
    }

    // Fill empty cells with random letters
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (grid[r]![c] === null) {
                grid[r]![c] = LETTERS[Math.floor(Math.random() * LETTERS.length)]!;
            }
        }
    }

    return {
        grid: grid as string[][],
        placedWords,
        gridSize,
    };
}

function tryPlaceWord(
    grid: (string | null)[][],
    word: string,
    gridSize: number,
): { row: number; col: number }[] | null {
    const shuffledDirs = shuffleArray(DIRECTIONS);

    for (const [dr, dc] of shuffledDirs) {
        const positions = getValidPositions(word.length, gridSize, dr!, dc!);
        const shuffledPositions = shuffleArray(positions);

        for (const [startRow, startCol] of shuffledPositions) {
            if (canPlace(grid, word, startRow!, startCol!, dr!, dc!)) {
                const cells: { row: number; col: number }[] = [];
                for (let i = 0; i < word.length; i++) {
                    const row = startRow! + i * dr!;
                    const col = startCol! + i * dc!;
                    grid[row]![col] = word[i]!;
                    cells.push({ row, col });
                }
                return cells;
            }
        }
    }

    return null;
}

function getValidPositions(
    wordLen: number,
    gridSize: number,
    dr: number,
    dc: number,
): [number, number][] {
    const positions: [number, number][] = [];

    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const endR = r + (wordLen - 1) * dr;
            const endC = c + (wordLen - 1) * dc;
            if (endR >= 0 && endR < gridSize && endC >= 0 && endC < gridSize) {
                positions.push([r, c]);
            }
        }
    }

    return positions;
}

function canPlace(
    grid: (string | null)[][],
    word: string,
    startRow: number,
    startCol: number,
    dr: number,
    dc: number,
): boolean {
    for (let i = 0; i < word.length; i++) {
        const row = startRow + i * dr;
        const col = startCol + i * dc;
        const cell = grid[row]?.[col];
        if (cell !== null && cell !== undefined && cell !== word[i]) {
            return false;
        }
    }
    return true;
}
