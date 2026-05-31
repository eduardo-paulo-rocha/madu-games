import { motion } from 'framer-motion';
import { colors, spacing, radii, typography, shadows } from '../../../design-system/tokens';

type OptionState = 'idle' | 'correct' | 'incorrect';

interface OptionCardProps {
    word: string;
    emoji: string;
    state: OptionState;
    disabled: boolean;
    onClick: () => void;
}

const stateStyles: Record<OptionState, { background: string; border: string; label: string }> = {
    idle: { background: colors.surface, border: colors.border, label: '' },
    correct: { background: '#E8F5E9', border: colors.success, label: ' ✅' },
    incorrect: { background: '#FFEBEE', border: colors.error, label: ' ❌' },
};

export function OptionCard({ word, emoji, state, disabled, onClick }: OptionCardProps) {
    const style = stateStyles[state];

    return (
        <motion.button
            whileTap={disabled ? undefined : { scale: 0.95 }}
            onClick={onClick}
            disabled={disabled}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.xs,
                padding: spacing.md,
                minHeight: '80px',
                width: '100%',
                border: `2px solid ${style.border}`,
                borderRadius: radii.md,
                backgroundColor: style.background,
                boxShadow: shadows.sm,
                cursor: disabled ? 'default' : 'pointer',
                opacity: disabled && state === 'idle' ? 0.6 : 1,
                fontFamily: typography.fontFamily,
                transition: 'background-color 0.2s, border-color 0.2s',
            }}
        >
            <span style={{ fontSize: typography.fontSize.xl }}>{emoji}</span>
            <span
                style={{
                    fontSize: typography.fontSize.md,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.textPrimary,
                }}
            >
                {word}{style.label}
            </span>
        </motion.button>
    );
}
