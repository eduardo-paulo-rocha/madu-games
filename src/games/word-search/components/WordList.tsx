import { colors, typography, spacing } from '../../../design-system/tokens';

interface WordListProps {
    words: { word: string; normalizedWord: string }[];
    foundWords: Set<string>;
}

export function WordList({ words, foundWords }: WordListProps) {
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
                return (
                    <span
                        key={w.normalizedWord}
                        style={{
                            fontSize: typography.fontSize.sm,
                            fontWeight: typography.fontWeight.bold,
                            color: isFound ? colors.success : colors.textPrimary,
                            textDecoration: isFound ? 'line-through' : 'none',
                            opacity: isFound ? 0.6 : 1,
                            padding: `${spacing.xs} ${spacing.sm}`,
                            backgroundColor: isFound ? `${colors.success}20` : `${colors.primary}10`,
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
