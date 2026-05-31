import { motion } from 'framer-motion';
import type { ComponentType } from 'react';
import { colors, radii, spacing, typography, shadows } from '../tokens';
import { slideUp } from '../animations/presets';

interface CardProps {
    title: string;
    description: string;
    icon: ComponentType<{ size?: number }>;
    scoreBadge?: string;
    starCount?: number;
    onClick: () => void;
}

export function Card({ title, description, icon: Icon, scoreBadge, starCount, onClick }: CardProps) {
    return (
        <motion.button
            variants={slideUp}
            initial="initial"
            animate="animate"
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing.md,
                padding: spacing.lg,
                backgroundColor: colors.surface,
                borderRadius: radii.xl,
                border: `2px solid ${colors.border}`,
                boxShadow: shadows.md,
                cursor: 'pointer',
                width: '100%',
                textAlign: 'center',
                fontFamily: typography.fontFamily,
                position: 'relative',
            }}
        >
            <div style={{ fontSize: '3rem' }}>
                <Icon size={64} />
            </div>
            <h3
                style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.textPrimary,
                    margin: 0,
                }}
            >
                {title}
            </h3>
            <p
                style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.textSecondary,
                    margin: 0,
                }}
            >
                {description}
            </p>
            {scoreBadge && (
                <span
                    style={{
                        position: 'absolute',
                        top: spacing.sm,
                        right: spacing.sm,
                        backgroundColor: colors.accent,
                        color: colors.textPrimary,
                        padding: `${spacing.xs} ${spacing.sm}`,
                        borderRadius: radii.full,
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.bold,
                    }}
                >
                    {scoreBadge}
                </span>
            )}
            {starCount !== undefined && starCount > 0 && (
                <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3].map((i) => (
                        <span
                            key={i}
                            style={{
                                color: i <= starCount ? colors.starFilled : colors.starEmpty,
                                fontSize: typography.fontSize.md,
                            }}
                        >
                            ★
                        </span>
                    ))}
                </div>
            )}
        </motion.button>
    );
}
