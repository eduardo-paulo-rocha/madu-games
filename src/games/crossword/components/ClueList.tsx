import type { PlacedClue } from '../logic/puzzle-generator';
import { colors, spacing, typography, radii } from '../../../design-system/tokens';

interface ClueListProps {
    clues: PlacedClue[];
    activeClue: PlacedClue | null;
    completedWords: Set<string>;
    onClueClick: (clue: PlacedClue) => void;
}

export function ClueList({ clues, activeClue, completedWords, onClueClick }: ClueListProps) {
    const acrossClues = clues.filter((c) => c.direction === 'across');
    const downClues = clues.filter((c) => c.direction === 'down');

    const renderSection = (title: string, items: PlacedClue[]) => (
        <div>
            <h4
                style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.primary,
                    marginBottom: spacing.xs,
                }}
            >
                {title}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {items.map((clue) => {
                    const isActive = activeClue?.number === clue.number;
                    const isCompleted = completedWords.has(clue.normalizedWord);
                    return (
                        <button
                            key={`${clue.direction}-${clue.number}`}
                            onClick={() => onClueClick(clue)}
                            style={{
                                textAlign: 'left',
                                padding: `${spacing.xs} ${spacing.sm}`,
                                backgroundColor: isActive
                                    ? `${colors.primary}15`
                                    : 'transparent',
                                border: 'none',
                                borderRadius: radii.sm,
                                cursor: 'pointer',
                                fontFamily: typography.fontFamily,
                                fontSize: typography.fontSize.sm,
                                color: isCompleted ? colors.success : colors.textPrimary,
                                textDecoration: isCompleted ? 'line-through' : 'none',
                                opacity: isCompleted ? 0.6 : 1,
                            }}
                        >
                            <strong>{clue.number}.</strong> {clue.clue}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.md,
                maxHeight: '200px',
                overflowY: 'auto',
                padding: spacing.sm,
            }}
        >
            {acrossClues.length > 0 && renderSection('Horizontal →', acrossClues)}
            {downClues.length > 0 && renderSection('Vertical ↓', downClues)}
        </div>
    );
}
