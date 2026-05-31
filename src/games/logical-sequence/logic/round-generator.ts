import type { Difficulty } from '../../../core/registry/types';
import type { PatternInstance } from './pattern-rules';
import { difficultyConfigs } from './pattern-rules';
import { generatePattern } from './pattern-generator';

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }
    return shuffled;
}

function randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function generateRound(difficulty: Difficulty, roundSize: number = 10): PatternInstance[] {
    const config = difficultyConfigs[difficulty];
    const patterns: PatternInstance[] = [];

    for (let i = 0; i < roundSize; i++) {
        // Cycle through shuffled rules to ensure variety
        const shuffledRules = shuffleArray(config.rules);
        const rule = shuffledRules[i % shuffledRules.length]!;

        // Pick a random emoji set
        const shuffledSets = shuffleArray(config.emojiSets);
        const emojiSet = shuffledSets[i % shuffledSets.length]!;

        // Random sequence length within the difficulty range
        const [minLen, maxLen] = config.sequenceLengthRange;
        const sequenceLength = randomInRange(minLen, maxLen);

        patterns.push(
            generatePattern(rule, emojiSet, sequenceLength, config.optionsCount),
        );
    }

    return patterns;
}
