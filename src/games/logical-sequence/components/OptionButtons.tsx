import { motion } from 'framer-motion';
import { spacing, typography, colors, radii, shadows } from '../../../design-system/tokens';

interface OptionButtonsProps {
    options: string[];
    correctAnswer: string;
    selectedOption: string | null;
    onSelect: (emoji: string) => void;
}

export function OptionButtons({ options, correctAnswer, selectedOption, onSelect }: OptionButtonsProps) {
    const isDisabled = selectedOption !== null;

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                gap: spacing.lg,
                padding: spacing.md,
            }}
        >
            {options.map((emoji) => {
                const isSelected = selectedOption === emoji;
                const isCorrect = emoji === correctAnswer;
                const showResult = isDisabled;

                let backgroundColor: string = colors.surface;
                let borderColor: string = colors.border;

                if (showResult && isCorrect) {
                    backgroundColor = `${colors.success}20`;
                    borderColor = colors.success;
                } else if (showResult && isSelected && !isCorrect) {
                    backgroundColor = `${colors.error}20`;
                    borderColor = colors.error;
                }

                return (
                    <motion.button
                        key={emoji}
                        onClick={() => !isDisabled && onSelect(emoji)}
                        disabled={isDisabled}
                        whileTap={isDisabled ? undefined : { scale: 0.9 }}
                        whileHover={isDisabled ? undefined : { scale: 1.05 }}
                        style={{
                            fontSize: typography.fontSize.xxxl,
                            lineHeight: 1,
                            padding: spacing.md,
                            minWidth: '72px',
                            minHeight: '72px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `3px solid ${borderColor}`,
                            borderRadius: radii.lg,
                            backgroundColor,
                            cursor: isDisabled ? 'default' : 'pointer',
                            boxShadow: shadows.md,
                            transition: 'background-color 0.2s, border-color 0.2s',
                            fontFamily: 'inherit',
                        }}
                    >
                        {emoji}
                    </motion.button>
                );
            })}
        </div>
    );
}
