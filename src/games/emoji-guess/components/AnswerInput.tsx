import { motion } from 'framer-motion';
import { colors, spacing, typography, radii } from '../../../design-system/tokens';

interface AnswerInputProps {
    value: string;
    isWrong: boolean;
    lockedPositions?: Set<number>;
}

export function AnswerInput({ value, isWrong, lockedPositions }: AnswerInputProps) {
    const hasLockedPositions = lockedPositions && lockedPositions.size > 0;

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
                gap: '2px',
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.textPrimary,
                fontFamily: typography.fontFamily,
                letterSpacing: hasLockedPositions ? '0px' : '2px',
            }}
        >
            {value ? (
                hasLockedPositions ? (
                    value.split('').map((char, i) => (
                        <span
                            key={i}
                            style={{
                                color: lockedPositions.has(i) ? colors.accent : colors.textPrimary,
                                fontWeight: lockedPositions.has(i) ? typography.fontWeight.bold : typography.fontWeight.bold,
                                borderBottom: lockedPositions.has(i) ? `2px solid ${colors.accent}` : 'none',
                                padding: '0 1px',
                            }}
                        >
                            {char}
                        </span>
                    ))
                ) : (
                    value
                )
            ) : (
                <span style={{ color: colors.textSecondary, fontWeight: typography.fontWeight.normal }}>
                    Digite a resposta...
                </span>
            )}
        </motion.div>
    );
}
