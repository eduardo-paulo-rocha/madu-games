export interface RhymeWordOption {
    word: string;
    emoji: string;
}

export function shuffleOptions(
    correct: RhymeWordOption,
    distractors: RhymeWordOption[],
): { options: RhymeWordOption[]; correctIndex: number } {
    const all = [correct, ...distractors];

    for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j]!, all[i]!];
    }

    const correctIndex = all.findIndex((o) => o.word === correct.word && o.emoji === correct.emoji);
    return { options: all, correctIndex };
}
