import { motion, AnimatePresence } from 'framer-motion';
import { celebrate } from '../../../design-system/animations/presets';
import { colors, typography, spacing, radii } from '../../../design-system/tokens';

interface FeedbackOverlayProps {
    visible: boolean;
    isCorrect: boolean;
    correctAnswer: string;
}

export function FeedbackOverlay({ visible, isCorrect, correctAnswer }: FeedbackOverlayProps) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: spacing.md,
                        backgroundColor: 'rgba(248, 247, 255, 0.9)',
                        borderRadius: radii.lg,
                        zIndex: 10,
                    }}
                >
                    <motion.div
                        variants={celebrate}
                        initial="initial"
                        animate="animate"
                        style={{ fontSize: '4rem', lineHeight: 1 }}
                    >
                        {isCorrect ? '✅' : '❌'}
                    </motion.div>

                    {isCorrect ? (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{
                                fontSize: typography.fontSize.xl,
                                fontWeight: typography.fontWeight.bold,
                                color: colors.success,
                                fontFamily: typography.fontFamily,
                            }}
                        >
                            Muito bem! 🎉
                        </motion.p>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: spacing.sm,
                            }}
                        >
                            <p
                                style={{
                                    fontSize: typography.fontSize.lg,
                                    fontWeight: typography.fontWeight.bold,
                                    color: colors.error,
                                    fontFamily: typography.fontFamily,
                                    margin: 0,
                                }}
                            >
                                Ops! A resposta era:
                            </p>
                            <span style={{ fontSize: typography.fontSize.xxxl }}>
                                {correctAnswer}
                            </span>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
