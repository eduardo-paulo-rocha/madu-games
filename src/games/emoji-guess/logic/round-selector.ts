import type { Difficulty } from '../../../core/registry/types';

interface EmojiEntry {
    emoji: string;
    words: string[];
    difficulty: Difficulty;
}

function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }
    return shuffled;
}

export function selectRound(
    dictionary: EmojiEntry[],
    difficulty: Difficulty,
    roundSize: number,
): EmojiEntry[] {
    const filtered = dictionary.filter((e) => e.difficulty === difficulty);
    const shuffled = shuffleArray(filtered);
    return shuffled.slice(0, roundSize);
}
