import { colors, typography, spacing, wordHighlightColors } from '../../../design-system/tokens';

interface WordListProps {
    words: { word: string; normalizedWord: string }[];
    foundWords: Set<string>;
    foundWordColors: Map<string, number>;
}

export function WordList({ words, foundWords, foundWordColors }: WordListProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: spacing.sm,
                justifyContent: 'center',
                padding: spacing.sm,
            }}
        >
            {words.map((w) => {
                const isFound = foundWords.has(w.normalizedWord);
                const colorIdx = foundWordColors.get(w.normalizedWord);
                const highlightColor = colorIdx !== undefined ? wordHighlightColors[colorIdx] : undefined;
                return (
                    <span
                        key={w.normalizedWord}
                        style={{
                            fontSize: typography.fontSize.sm,
                            fontWeight: typography.fontWeight.bold,
                            color: isFound ? colors.textPrimary : colors.textPrimary,
                            textDecoration: isFound ? 'line-through' : 'none',
                            opacity: isFound ? 0.6 : 1,
                            padding: `${spacing.xs} ${spacing.sm}`,
                            backgroundColor: isFound && highlightColor ? highlightColor : `${colors.primary}10`,
                            borderRadius: '8px',
                        }}
                    >
                        {w.word.toUpperCase()}
                    </span>
                );
            })}
        </div>
    );
}
