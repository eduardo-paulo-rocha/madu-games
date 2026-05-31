import { motion, AnimatePresence } from 'framer-motion';
import { scaleIn } from '../../../design-system/animations/presets';
import { spacing, typography, colors, radii, shadows } from '../../../design-system/tokens';

interface PatternDisplayProps {
    sequence: string[];
    answer: string;
    revealed: boolean;
    currentIndex: number;
}

export function PatternDisplay({ sequence, answer, revealed, currentIndex }: PatternDisplayProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: spacing.sm,
                padding: spacing.md,
                minHeight: '80px',
            }}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: spacing.sm,
                    }}
                >
                    {sequence.map((emoji, i) => (
                        <motion.span
                            key={`${currentIndex}-${i}`}
                            variants={scaleIn}
                            initial="initial"
                            animate="animate"
                            style={{
                                fontSize: typography.fontSize.xxxl,
                                lineHeight: 1.2,
                            }}
                            custom={i}
                        >
                            {emoji}
                        </motion.span>
                    ))}

                    <motion.span
                        key={`${currentIndex}-answer`}
                        variants={scaleIn}
                        initial="initial"
                        animate="animate"
                        style={{
                            fontSize: typography.fontSize.xxxl,
                            lineHeight: 1.2,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '44px',
                            minHeight: '44px',
                            borderRadius: radii.md,
                            background: revealed ? 'transparent' : `${colors.primary}15`,
                            boxShadow: revealed ? 'none' : shadows.sm,
                        }}
                    >
                        {revealed ? answer : '❓'}
                    </motion.span>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
