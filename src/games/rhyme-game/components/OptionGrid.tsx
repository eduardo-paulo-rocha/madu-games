import type { RhymeWordOption } from '../logic/option-shuffler';
import { OptionCard } from './OptionCard';
import { spacing } from '../../../design-system/tokens';

type FeedbackState = 'idle' | 'showing';

interface OptionGridProps {
    options: RhymeWordOption[];
    selectedIndex: number | null;
    correctIndex: number;
    feedbackState: FeedbackState;
    onSelect: (index: number) => void;
}

export function OptionGrid({ options, selectedIndex, correctIndex, feedbackState, onSelect }: OptionGridProps) {
    const isShowingFeedback = feedbackState === 'showing';

    function getOptionState(index: number): 'idle' | 'correct' | 'incorrect' {
        if (!isShowingFeedback) return 'idle';
        if (index === correctIndex) return 'correct';
        if (index === selectedIndex) return 'incorrect';
        return 'idle';
    }

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: spacing.md,
                width: '100%',
            }}
        >
            {options.map((option, index) => (
                <OptionCard
                    key={`${option.word}-${index}`}
                    word={option.word}
                    emoji={option.emoji}
                    state={getOptionState(index)}
                    disabled={isShowingFeedback}
                    onClick={() => onSelect(index)}
                />
            ))}
        </div>
    );
}
