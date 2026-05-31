import type { Difficulty } from '../../../core/registry/types';

export interface EmojiSet {
    category: string;
    emojis: string[];
}

export interface PatternRule {
    id: string;
    type: 'alternation' | 'cycle' | 'growth' | 'nested';
    emojiCount: number;
    generate: (emojis: string[], length: number) => string[];
}

export interface PatternInstance {
    sequence: string[];
    answer: string;
    options: string[];
    ruleId: string;
}

export interface DifficultyConfig {
    rules: PatternRule[];
    emojiSets: EmojiSet[];
    sequenceLengthRange: [number, number];
    optionsCount: number;
}

// --- Emoji Sets (Unicode 9.0 or earlier for broad support) ---

export const emojiSets: Record<string, EmojiSet> = {
    colors: {
        category: 'colors',
        emojis: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤'],
    },
    animals: {
        category: 'animals',
        emojis: ['🐱', '🐶', '🐰', '🐸', '🐻', '🐼', '🐨', '🦁', '🐷', '🐮'],
    },
    fruits: {
        category: 'fruits',
        emojis: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🍑', '🍒'],
    },
    nature: {
        category: 'nature',
        emojis: ['🌸', '🌻', '🌺', '🌷', '🌹', '🍀', '🌿', '🌴', '🌲', '⭐'],
    },
    objects: {
        category: 'objects',
        emojis: ['⚽', '🏀', '🎾', '🎲', '🔔', '🎵', '🎨', '📚', '✏️', '🎁'],
    },
};

// --- Pattern Rules ---

const alternationAB: PatternRule = {
    id: 'ab-alternation',
    type: 'alternation',
    emojiCount: 2,
    generate: (emojis, length) =>
        Array.from({ length }, (_, i) => emojis[i % 2]!),
};

const alternationABBA: PatternRule = {
    id: 'abba-alternation',
    type: 'alternation',
    emojiCount: 2,
    generate: (emojis, length) => {
        const pattern = [emojis[0]!, emojis[1]!, emojis[1]!, emojis[0]!];
        return Array.from({ length }, (_, i) => pattern[i % 4]!);
    },
};

const alternationAABB: PatternRule = {
    id: 'aabb-alternation',
    type: 'alternation',
    emojiCount: 2,
    generate: (emojis, length) => {
        const pattern = [emojis[0]!, emojis[0]!, emojis[1]!, emojis[1]!];
        return Array.from({ length }, (_, i) => pattern[i % 4]!);
    },
};

const alternationABA: PatternRule = {
    id: 'aba-alternation',
    type: 'alternation',
    emojiCount: 2,
    generate: (emojis, length) => {
        const pattern = [emojis[0]!, emojis[1]!, emojis[0]!];
        return Array.from({ length }, (_, i) => pattern[i % 3]!);
    },
};

const cycleABC: PatternRule = {
    id: 'abc-cycle',
    type: 'cycle',
    emojiCount: 3,
    generate: (emojis, length) =>
        Array.from({ length }, (_, i) => emojis[i % 3]!),
};

const cycleABCD: PatternRule = {
    id: 'abcd-cycle',
    type: 'cycle',
    emojiCount: 4,
    generate: (emojis, length) =>
        Array.from({ length }, (_, i) => emojis[i % 4]!),
};

const cycleABCB: PatternRule = {
    id: 'abcb-cycle',
    type: 'cycle',
    emojiCount: 3,
    generate: (emojis, length) => {
        const pattern = [emojis[0]!, emojis[1]!, emojis[2]!, emojis[1]!];
        return Array.from({ length }, (_, i) => pattern[i % 4]!);
    },
};

const growthSequence: PatternRule = {
    id: 'growth',
    type: 'growth',
    emojiCount: 9,
    generate: (emojis, length) =>
        Array.from({ length }, (_, i) => emojis[i]!),
};

const nestedCycle2x3: PatternRule = {
    id: 'nested-2x3',
    type: 'nested',
    emojiCount: 5,
    generate: (emojis, length) => {
        // Two independent cycles: positions 0-1 alternate, position 2-4 cycle in 3
        // This creates patterns like: A C A D A E B C B D B E ...
        const group1 = [emojis[0]!, emojis[1]!];
        const group2 = [emojis[2]!, emojis[3]!, emojis[4]!];
        return Array.from({ length }, (_, i) => {
            const pair = Math.floor(i / 2);
            return i % 2 === 0 ? group1[pair % 2]! : group2[pair % 3]!;
        });
    },
};

const nestedDoubleCycle: PatternRule = {
    id: 'nested-double',
    type: 'nested',
    emojiCount: 5,
    generate: (emojis, length) => {
        // Cycle of 2 interleaved with cycle of 3: AB pattern overlaid with CDE pattern
        const outer = [emojis[0]!, emojis[1]!];
        const inner = [emojis[2]!, emojis[3]!, emojis[4]!];
        return Array.from({ length }, (_, i) => {
            return i % 2 === 0 ? outer[Math.floor(i / 2) % 2]! : inner[Math.floor(i / 2) % 3]!;
        });
    },
};

// --- Difficulty Configurations ---

export const difficultyConfigs: Record<Difficulty, DifficultyConfig> = {
    easy: {
        rules: [alternationAB, alternationABBA, alternationAABB, alternationABA],
        emojiSets: [emojiSets.colors!, emojiSets.animals!, emojiSets.fruits!, emojiSets.nature!, emojiSets.objects!],
        sequenceLengthRange: [5, 6],
        optionsCount: 2,
    },
    medium: {
        rules: [cycleABC, cycleABCD, cycleABCB, growthSequence],
        emojiSets: [emojiSets.animals!, emojiSets.fruits!, emojiSets.nature!, emojiSets.objects!, emojiSets.colors!],
        sequenceLengthRange: [6, 7],
        optionsCount: 3,
    },
    hard: {
        rules: [nestedCycle2x3, nestedDoubleCycle, cycleABCD, growthSequence],
        emojiSets: [emojiSets.colors!, emojiSets.animals!, emojiSets.fruits!, emojiSets.nature!, emojiSets.objects!],
        sequenceLengthRange: [7, 9],
        optionsCount: 3,
    },
};
