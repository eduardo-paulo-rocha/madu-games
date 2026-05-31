import { useState, useCallback, useEffect, useRef } from 'react';
import type { GameProps } from '../../core/registry/types';
import { selectRound } from './logic/round-selector';
import type { RhymeWordSet } from './logic/round-selector';
import { TargetWord } from './components/TargetWord';
import { OptionGrid } from './components/OptionGrid';
import { spacing, typography, colors } from '../../design-system/tokens';
import rhymeDictionary from './data/rhyme-dictionary.json';

const FEEDBACK_DELAY_MS = 1500;

export default function RhymeGame({
    difficulty,
    roundSize,
    onCorrectItem,
    onRoundComplete,
}: GameProps) {
    const [round] = useState(() =>
        selectRound(rhymeDictionary as RhymeWordSet[], difficulty, roundSize),
    );
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [feedbackState, setFeedbackState] = useState<'idle' | 'showing'>('idle');
    const [correctCount, setCorrectCount] = useState(0);
    const feedbackTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const currentQuestion = round[currentIndex];

    useEffect(() => {
        return () => {
            if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
        };
    }, []);

    const advanceToNext = useCallback(
        (newCorrectCount: number) => {
            const nextIndex = currentIndex + 1;
            if (nextIndex >= round.length) {
                onRoundComplete({
                    totalItems: round.length,
                    correctItems: newCorrectCount,
                    hintCount: 0,
                });
            } else {
                setCurrentIndex(nextIndex);
                setSelectedIndex(null);
                setFeedbackState('idle');
            }
        },
        [currentIndex, round.length, onRoundComplete],
    );

    const onSelect = useCallback(
        (index: number) => {
            if (feedbackState === 'showing' || !currentQuestion) return;

            setSelectedIndex(index);
            setFeedbackState('showing');

            const isCorrect = index === currentQuestion.correctIndex;
            let newCorrectCount = correctCount;
            if (isCorrect) {
                newCorrectCount = correctCount + 1;
                setCorrectCount(newCorrectCount);
                onCorrectItem();
            }

            feedbackTimerRef.current = setTimeout(() => {
                advanceToNext(newCorrectCount);
            }, FEEDBACK_DELAY_MS);
        },
        [feedbackState, currentQuestion, correctCount, onCorrectItem, advanceToNext],
    );

    if (!currentQuestion) return null;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing.lg,
                width: '100%',
                maxWidth: '480px',
                padding: spacing.md,
            }}
        >
            <p style={{ fontSize: typography.fontSize.sm, color: colors.textSecondary, alignSelf: 'flex-start' }}>
                {currentIndex + 1} / {round.length}
            </p>

            <TargetWord
                word={currentQuestion.target.word}
                emoji={currentQuestion.target.emoji}
                questionIndex={currentIndex}
            />

            <OptionGrid
                options={currentQuestion.options}
                selectedIndex={selectedIndex}
                correctIndex={currentQuestion.correctIndex}
                feedbackState={feedbackState}
                onSelect={onSelect}
            />
        </div>
    );
}
