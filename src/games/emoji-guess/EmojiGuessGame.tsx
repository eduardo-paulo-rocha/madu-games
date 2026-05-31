import { useState, useCallback } from 'react';
import type { GameProps } from '../../core/registry/types';
import { selectRound } from './logic/round-selector';
import { validateAnswer } from './logic/answer-validator';
import { normalizeText } from '../../core/text/normalize';
import { useHint } from '../../core/hooks/use-hint';
import { EmojiDisplay } from './components/EmojiDisplay';
import { AnswerInput } from './components/AnswerInput';
import { Keyboard } from '../../design-system/components/Keyboard';
import { HintButton } from '../../design-system/components/HintButton';
import { HintPenaltyToast } from '../../design-system/components/HintPenaltyToast';
import { usePhysicalKeyboard } from '../../core/hooks/use-physical-keyboard';
import { spacing, typography, colors, radii } from '../../design-system/tokens';
import emojiDictionary from './data/emoji-dictionary.json';

export default function EmojiGuessGame({
    difficulty,
    roundSize,
    onCorrectItem,
    onRoundComplete,
}: GameProps) {
    const [round] = useState(() => selectRound(emojiDictionary as Parameters<typeof selectRound>[0], difficulty, roundSize));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [input, setInput] = useState('');
    const [isWrong, setIsWrong] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [showKeyboard, setShowKeyboard] = useState(true);
    const [lockedPositions, setLockedPositions] = useState<Set<number>>(new Set());

    const currentEmoji = round[currentIndex];
    const correctAnswer = currentEmoji ? normalizeText(currentEmoji.words[0]!) : '';

    const onHintCallback = useCallback((): boolean => {
        if (input.length >= correctAnswer.length) return false;
        const nextLetter = correctAnswer[input.length];
        setInput((prev) => prev + nextLetter);
        setLockedPositions((prev) => new Set(prev).add(input.length));
        return true;
    }, [input, correctAnswer]);

    const isHintDisabled = !currentEmoji || input.length >= correctAnswer.length;

    const { hintCount, triggerHint, showPenalty, isHintDisabled: hintDisabled } = useHint({
        onHint: onHintCallback,
        isDisabled: isHintDisabled,
    });

    const advanceToNext = useCallback(
        (wasCorrect: boolean) => {
            const newCorrect = wasCorrect ? correctCount + 1 : correctCount;
            if (wasCorrect) {
                setCorrectCount(newCorrect);
                onCorrectItem();
            }

            const nextIndex = currentIndex + 1;
            if (nextIndex >= round.length) {
                onRoundComplete({
                    totalItems: round.length,
                    correctItems: newCorrect,
                    hintCount,
                });
            } else {
                setCurrentIndex(nextIndex);
                setInput('');
                setIsWrong(false);
                setLockedPositions(new Set());
            }
        },
        [correctCount, currentIndex, round.length, onCorrectItem, onRoundComplete, hintCount],
    );

    const onKeyPress = useCallback(
        (key: string) => {
            setIsWrong(false);
            setInput((prev) => prev + key.toLowerCase());
        },
        [],
    );

    const onBackspace = useCallback(() => {
        setIsWrong(false);
        setInput((prev) => {
            const newLen = prev.length - 1;
            if (newLen < 0) return prev;
            // Skip locked positions
            if (lockedPositions.has(newLen)) return prev;
            return prev.slice(0, -1);
        });
    }, [lockedPositions]);

    const onConfirm = useCallback(() => {
        if (!currentEmoji || !input.trim()) return;

        if (validateAnswer(input, currentEmoji.words)) {
            advanceToNext(true);
        } else {
            setIsWrong(true);
        }
    }, [currentEmoji, input, advanceToNext]);

    usePhysicalKeyboard({ onKeyPress, onBackspace, onConfirm });

    if (!currentEmoji) return null;

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
            <HintPenaltyToast visible={showPenalty} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.textSecondary }}>
                    {currentIndex + 1} / {round.length}
                </p>
                <HintButton onClick={triggerHint} disabled={hintDisabled} />
            </div>

            <EmojiDisplay emoji={currentEmoji.emoji} index={currentIndex} />

            <AnswerInput value={input} isWrong={isWrong} lockedPositions={lockedPositions} />

            {isWrong && (
                <p style={{ fontSize: typography.fontSize.sm, color: colors.error }}>
                    Tente de novo! 💪
                </p>
            )}

            <button
                onClick={() => setShowKeyboard((v) => !v)}
                style={{
                    background: 'none',
                    border: `1px solid ${colors.border}`,
                    borderRadius: radii.sm,
                    padding: `${spacing.xs} ${spacing.sm}`,
                    fontSize: typography.fontSize.sm,
                    color: colors.textSecondary,
                    cursor: 'pointer',
                    fontFamily: typography.fontFamily,
                }}
            >
                {showKeyboard ? '⌨️ Ocultar teclado' : '⌨️ Mostrar teclado'}
            </button>

            {showKeyboard && (
                <Keyboard onKeyPress={onKeyPress} onBackspace={onBackspace} onConfirm={onConfirm} />
            )}
        </div>
    );
}
