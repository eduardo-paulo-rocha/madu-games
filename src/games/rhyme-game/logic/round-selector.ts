import type { Difficulty } from '../../../core/registry/types';
import { shuffleOptions } from './option-shuffler';
import type { RhymeWordOption } from './option-shuffler';

export interface RhymeWordSet {
    target: RhymeWordOption;
    correct: RhymeWordOption;
    distractors: RhymeWordOption[];
    difficulty: Difficulty;
}

export interface RhymeQuestion {
    target: RhymeWordOption;
    options: RhymeWordOption[];
    correctIndex: number;
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
    dictionary: RhymeWordSet[],
    difficulty: Difficulty,
    roundSize: number,
): RhymeQuestion[] {
    const filtered = dictionary.filter((entry) => entry.difficulty === difficulty);
    const shuffled = shuffleArray(filtered);
    const selected = shuffled.slice(0, Math.min(roundSize, shuffled.length));

    return selected.map((entry) => {
        const { options, correctIndex } = shuffleOptions(entry.correct, entry.distractors);
        return {
            target: entry.target,
            options,
            correctIndex,
        };
    });
}
