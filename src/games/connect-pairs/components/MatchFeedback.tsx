import { AnimatePresence, motion } from 'framer-motion';
import { typography } from '../../../design-system/tokens';

interface MatchFeedbackProps {
    phase: 'correct-feedback' | 'incorrect-feedback' | null;
}

export function MatchFeedback({ phase }: MatchFeedbackProps) {
    const isVisible = phase === 'correct-feedback' || phase === 'incorrect-feedback';
    const emoji = phase === 'correct-feedback' ? '✅' : '❌';

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key={phase}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '80px',
                        lineHeight: 1,
                        pointerEvents: 'none',
                        zIndex: 100,
                        textAlign: 'center',
                        fontFamily: typography.fontFamily,
                    }}
                >
                    {emoji}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
