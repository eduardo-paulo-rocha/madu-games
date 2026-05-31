import { motion } from 'framer-motion';
import { colors, spacing, typography, radii } from '../../../design-system/tokens';

interface AnswerInputProps {
    value: string;
    isWrong: boolean;
}

export function AnswerInput({ value, isWrong }: AnswerInputProps) {
    return (
        <motion.div
            animate={isWrong ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            style={{
                padding: `${spacing.md} ${spacing.lg}`,
                backgroundColor: colors.surface,
                border: `2px solid ${isWrong ? colors.error : colors.border}`,
                borderRadius: radii.lg,
                minHeight: '56px',
                minWidth: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.textPrimary,
                fontFamily: typography.fontFamily,
                letterSpacing: '2px',
            }}
        >
            {value || (
                <span style={{ color: colors.textSecondary, fontWeight: typography.fontWeight.normal }}>
                    Digite a resposta...
                </span>
            )}
        </motion.div>
    );
}
