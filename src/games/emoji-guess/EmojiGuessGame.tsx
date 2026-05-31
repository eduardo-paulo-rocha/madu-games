import { useState, useCallback } from 'react';
import type { GameProps } from '../../core/registry/types';
import { selectRound } from './logic/round-selector';
import { validateAnswer } from './logic/answer-validator';
import { EmojiDisplay } from './components/EmojiDisplay';
import { AnswerInput } from './components/AnswerInput';
import { Keyboard } from '../../design-system/components/Keyboard';
import { spacing, typography, colors } from '../../design-system/tokens';
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

    const currentEmoji = round[currentIndex];

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
                });
            } else {
                setCurrentIndex(nextIndex);
                setInput('');
                setIsWrong(false);
            }
        },
        [correctCount, currentIndex, round.length, onCorrectItem, onRoundComplete],
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
        setInput((prev) => prev.slice(0, -1));
    }, []);

    const onConfirm = useCallback(() => {
        if (!currentEmoji || !input.trim()) return;

        if (validateAnswer(input, currentEmoji.words)) {
            advanceToNext(true);
        } else {
            setIsWrong(true);
        }
    }, [currentEmoji, input, advanceToNext]);

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
            <p style={{ fontSize: typography.fontSize.sm, color: colors.textSecondary }}>
                {currentIndex + 1} / {round.length}
            </p>

            <EmojiDisplay emoji={currentEmoji.emoji} index={currentIndex} />

            <AnswerInput value={input} isWrong={isWrong} />

            {isWrong && (
                <p style={{ fontSize: typography.fontSize.sm, color: colors.error }}>
                    Tente de novo! 💪
                </p>
            )}

            <Keyboard onKeyPress={onKeyPress} onBackspace={onBackspace} onConfirm={onConfirm} />
        </div>
    );
}
