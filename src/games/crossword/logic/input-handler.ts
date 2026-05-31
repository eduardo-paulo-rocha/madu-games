import { normalizeText } from '../../../core/text/normalize';

export function validateInput(input: string, correct: string): boolean {
    return normalizeText(input) === normalizeText(correct);
}

export function isLetterOnly(char: string): boolean {
    return /^[a-zA-ZÀ-ÿ]$/.test(char);
}

export function getNextCell(
    row: number,
    col: number,
    direction: 'across' | 'down',
): { row: number; col: number } {
    if (direction === 'across') return { row, col: col + 1 };
    return { row: row + 1, col };
}
