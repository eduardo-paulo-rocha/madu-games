import { AnimatePresence, motion } from 'framer-motion';
import { colors, typography, radii, spacing } from '../tokens';

interface HintPenaltyToastProps {
    visible: boolean;
    penalty?: number;
}

export function HintPenaltyToast({ visible, penalty = 5 }: HintPenaltyToastProps) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        position: 'fixed',
                        top: spacing.lg,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: `${colors.error}e6`,
                        color: '#FFFFFF',
                        padding: `${spacing.sm} ${spacing.lg}`,
                        borderRadius: radii.md,
                        fontSize: typography.fontSize.md,
                        fontWeight: typography.fontWeight.bold,
                        fontFamily: typography.fontFamily,
                        zIndex: 1000,
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap',
                    }}
                >
                    -{penalty} pontos (dica usada)
                </motion.div>
            )}
        </AnimatePresence>
    );
}
