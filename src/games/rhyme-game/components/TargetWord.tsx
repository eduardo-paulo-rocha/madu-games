import { motion, AnimatePresence } from 'framer-motion';
import { typography, colors, spacing } from '../../../design-system/tokens';
import { scaleIn } from '../../../design-system/animations/presets';

interface TargetWordProps {
    word: string;
    emoji: string;
    questionIndex: number;
}

export function TargetWord({ word, emoji, questionIndex }: TargetWordProps) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={questionIndex}
                variants={scaleIn}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: spacing.sm,
                }}
            >
                <span style={{ fontSize: typography.fontSize.xxxl }}>{emoji}</span>
                <span
                    style={{
                        fontSize: typography.fontSize.xxxl,
                        fontWeight: typography.fontWeight.extraBold,
                        color: colors.textPrimary,
                        fontFamily: typography.fontFamily,
                        textAlign: 'center',
                    }}
                >
                    {word}
                </span>
                <p
                    style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.textSecondary,
                        fontFamily: typography.fontFamily,
                        margin: 0,
                    }}
                >
                    O que rima com essa palavra?
                </p>
            </motion.div>
        </AnimatePresence>
    );
}
