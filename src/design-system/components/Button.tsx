import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { colors, radii, typography, spacing, shadows } from '../tokens';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'md' | 'lg';
}

const variantStyles = {
    primary: {
        backgroundColor: colors.primary,
        color: colors.textOnPrimary,
        border: 'none',
    },
    secondary: {
        backgroundColor: colors.surface,
        color: colors.primary,
        border: `2px solid ${colors.primary}`,
    },
    ghost: {
        backgroundColor: 'transparent',
        color: colors.primary,
        border: 'none',
    },
} as const;

const sizeStyles = {
    md: {
        padding: `${spacing.sm} ${spacing.lg}`,
        fontSize: typography.fontSize.md,
        minHeight: '44px',
        minWidth: '44px',
    },
    lg: {
        padding: `${spacing.md} ${spacing.xl}`,
        fontSize: typography.fontSize.lg,
        minHeight: '56px',
        minWidth: '56px',
    },
} as const;

export function Button({ children, variant = 'primary', size = 'md', style, ...props }: ButtonProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm,
                borderRadius: radii.lg,
                fontFamily: typography.fontFamily,
                fontWeight: typography.fontWeight.bold,
                cursor: 'pointer',
                boxShadow: variant === 'primary' ? shadows.md : 'none',
                ...variantStyles[variant],
                ...sizeStyles[size],
                ...style,
            }}
            {...props}
        >
            {children}
        </motion.button>
    );
}
