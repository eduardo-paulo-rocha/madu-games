import { useState, useCallback, useEffect, useRef } from 'react';
import type { GameProps } from '../../core/registry/types';
import type { PatternInstance } from './logic/pattern-rules';
import { generateRound } from './logic/round-generator';
import { PatternDisplay } from './components/PatternDisplay';
import { OptionButtons } from './components/OptionButtons';
import { FeedbackOverlay } from './components/FeedbackOverlay';
import { spacing, typography, colors } from '../../design-system/tokens';

const CORRECT_DELAY_MS = 1500;
const INCORRECT_DELAY_MS = 2500;

export default function LogicalSequenceGame({
    difficulty,
    roundSize,
    onCorrectItem,
    onRoundComplete,
}: GameProps) {
    const [patterns] = useState<PatternInstance[]>(() => generateRound(difficulty, roundSize));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const feedbackTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const currentPattern = patterns[currentIndex];

    useEffect(() => {
        return () => {
            if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
        };
    }, []);

    const advanceToNext = useCallback(
        (wasCorrect: boolean) => {
            const newCorrectCount = wasCorrect ? correctCount + 1 : correctCount;

            const nextIndex = currentIndex + 1;
            if (nextIndex >= patterns.length) {
                onRoundComplete({
                    totalItems: patterns.length,
                    correctItems: newCorrectCount,
                });
            } else {
                setCurrentIndex(nextIndex);
                setSelectedOption(null);
                setShowFeedback(false);
            }
        },
        [correctCount, currentIndex, patterns.length, onRoundComplete],
    );

    const handleSelect = useCallback(
        (emoji: string) => {
            if (selectedOption !== null || !currentPattern) return;

            const isCorrect = emoji === currentPattern.answer;
            setSelectedOption(emoji);
            setShowFeedback(true);

            if (isCorrect) {
                setCorrectCount((prev) => prev + 1);
                onCorrectItem();
            }

            const delay = isCorrect ? CORRECT_DELAY_MS : INCORRECT_DELAY_MS;
            feedbackTimerRef.current = setTimeout(() => {
                advanceToNext(isCorrect);
            }, delay);
        },
        [selectedOption, currentPattern, onCorrectItem, advanceToNext],
    );

    if (!currentPattern) return null;

    const isCorrect = selectedOption === currentPattern.answer;

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
                position: 'relative',
            }}
        >
            <p style={{ fontSize: typography.fontSize.sm, color: colors.textSecondary, alignSelf: 'flex-start' }}>
                {currentIndex + 1} / {patterns.length}
            </p>

            <p
                style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.textPrimary,
                    fontFamily: typography.fontFamily,
                    textAlign: 'center',
                    margin: 0,
                }}
            >
                Qual emoji completa a sequência?
            </p>

            <PatternDisplay
                sequence={currentPattern.sequence}
                answer={currentPattern.answer}
                revealed={selectedOption !== null}
                currentIndex={currentIndex}
            />

            <OptionButtons
                options={currentPattern.options}
                correctAnswer={currentPattern.answer}
                selectedOption={selectedOption}
                onSelect={handleSelect}
            />

            <FeedbackOverlay
                visible={showFeedback}
                isCorrect={isCorrect}
                correctAnswer={currentPattern.answer}
            />
        </div>
    );
}
