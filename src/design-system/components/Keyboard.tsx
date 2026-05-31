import { motion } from 'framer-motion';
import { colors, radii, spacing, typography, shadows } from '../tokens';

interface KeyboardProps {
    onKeyPress: (key: string) => void;
    onBackspace: () => void;
    onConfirm: () => void;
    disabledKeys?: string[];
}

const ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export function Keyboard({ onKeyPress, onBackspace, onConfirm, disabledKeys = [] }: KeyboardProps) {
    const disabledSet = new Set(disabledKeys.map((k) => k.toUpperCase()));

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.xs,
                padding: spacing.sm,
                backgroundColor: colors.border,
                borderRadius: radii.lg,
                width: '100%',
                maxWidth: '480px',
                margin: '0 auto',
            }}
        >
            {ROWS.map((row, rowIdx) => (
                <div key={rowIdx} style={{ display: 'flex', justifyContent: 'center', gap: '3px' }}>
                    {rowIdx === 2 && (
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={onBackspace}
                            style={{
                                minWidth: '44px',
                                minHeight: '44px',
                                backgroundColor: colors.surface,
                                border: 'none',
                                borderRadius: radii.sm,
                                fontFamily: typography.fontFamily,
                                fontSize: typography.fontSize.lg,
                                fontWeight: typography.fontWeight.bold,
                                cursor: 'pointer',
                                boxShadow: shadows.sm,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            aria-label="Apagar"
                        >
                            ←
                        </motion.button>
                    )}
                    {row.map((key) => (
                        <motion.button
                            key={key}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onKeyPress(key)}
                            disabled={disabledSet.has(key)}
                            style={{
                                minWidth: '32px',
                                minHeight: '44px',
                                flex: 1,
                                maxWidth: '44px',
                                backgroundColor: disabledSet.has(key) ? colors.border : colors.surface,
                                color: disabledSet.has(key) ? colors.textSecondary : colors.textPrimary,
                                border: 'none',
                                borderRadius: radii.sm,
                                fontFamily: typography.fontFamily,
                                fontSize: typography.fontSize.md,
                                fontWeight: typography.fontWeight.bold,
                                cursor: disabledSet.has(key) ? 'default' : 'pointer',
                                boxShadow: shadows.sm,
                                opacity: disabledSet.has(key) ? 0.5 : 1,
                            }}
                        >
                            {key}
                        </motion.button>
                    ))}
                    {rowIdx === 2 && (
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={onConfirm}
                            style={{
                                minWidth: '44px',
                                minHeight: '44px',
                                backgroundColor: colors.primary,
                                color: colors.textOnPrimary,
                                border: 'none',
                                borderRadius: radii.sm,
                                fontFamily: typography.fontFamily,
                                fontSize: typography.fontSize.md,
                                fontWeight: typography.fontWeight.bold,
                                cursor: 'pointer',
                                boxShadow: shadows.sm,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            aria-label="Confirmar"
                        >
                            ✓
                        </motion.button>
                    )}
                </div>
            ))}
        </div>
    );
}
