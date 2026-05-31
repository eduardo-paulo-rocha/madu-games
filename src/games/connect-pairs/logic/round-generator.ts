import type { PairSet, PairItem } from './types';

export function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }
    return shuffled;
}

export function generateRound(pairSet: PairSet): { leftColumn: PairItem[]; rightColumn: PairItem[] } {
    const leftColumn = shuffleArray(pairSet.pairs.map((p) => p.left));
    const rightColumn = shuffleArray(pairSet.pairs.map((p) => p.right));
    return { leftColumn, rightColumn };
}
