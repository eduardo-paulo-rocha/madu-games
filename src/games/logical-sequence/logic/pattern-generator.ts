import type { PatternRule, PatternInstance, EmojiSet } from './pattern-rules';

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }
    return shuffled;
}

function pickRandom<T>(array: T[], count: number, exclude?: Set<T>): T[] {
    const filtered = exclude ? array.filter((item) => !exclude.has(item)) : [...array];
    return shuffleArray(filtered).slice(0, count);
}

export function generatePattern(
    rule: PatternRule,
    emojiSet: EmojiSet,
    sequenceLength: number,
    optionsCount: number,
): PatternInstance {
    const shuffledEmojis = shuffleArray(emojiSet.emojis);
    const selectedEmojis = shuffledEmojis.slice(0, rule.emojiCount);

    // Generate the full sequence (visible + answer)
    const fullSequence = rule.generate(selectedEmojis, sequenceLength + 1);
    const visibleSequence = fullSequence.slice(0, sequenceLength);
    const answer = fullSequence[sequenceLength]!;

    // Generate distractors from the same emoji set
    const usedInPattern = new Set(selectedEmojis);
    const patternElementsExcludingAnswer = selectedEmojis.filter((e) => e !== answer);

    const distractors: string[] = [];
    const distractorCount = optionsCount - 1;

    // Prefer pattern elements as distractors (more plausible)
    const patternDistractors = shuffleArray(patternElementsExcludingAnswer).slice(
        0,
        distractorCount,
    );
    distractors.push(...patternDistractors);

    // Fill remaining from the same emoji category (excluding answer & existing distractors)
    if (distractors.length < distractorCount) {
        const excluded = new Set([answer, ...distractors]);
        const remaining = pickRandom(
            emojiSet.emojis,
            distractorCount - distractors.length,
            excluded,
        );
        distractors.push(...remaining);
    }

    // If still not enough (unlikely), fill from unused pattern emojis
    if (distractors.length < distractorCount) {
        const excluded = new Set([answer, ...distractors]);
        const fromUsed = pickRandom([...usedInPattern], distractorCount - distractors.length, excluded);
        distractors.push(...fromUsed);
    }

    // Combine answer + distractors and shuffle (FR-010: randomize correct position)
    const options = shuffleArray([answer, ...distractors.slice(0, distractorCount)]);

    return {
        sequence: visibleSequence,
        answer,
        options,
        ruleId: rule.id,
    };
}
