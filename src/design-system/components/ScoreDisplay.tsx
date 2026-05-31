import { motion } from 'framer-motion';
import { StarRating } from './StarRating';
import { colors, spacing, typography, radii, shadows } from '../tokens';

interface ScoreDisplayProps {
    score: number;
    highScore?: number;
    stars: number;
    isNewRecord?: boolean;
}

export function ScoreDisplay({ score, highScore, stars, isNewRecord }: ScoreDisplayProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing.md,
                padding: spacing.xl,
                backgroundColor: colors.surface,
                borderRadius: radii.xl,
                boxShadow: shadows.lg,
                width: '100%',
                maxWidth: '320px',
            }}
        >
            <StarRating stars={stars} size={40} />

            <div style={{ textAlign: 'center' }}>
                <div
                    style={{
                        fontSize: typography.fontSize.xxxl,
                        fontWeight: typography.fontWeight.extraBold,
                        color: colors.primary,
                    }}
                >
                    {score}
                </div>
                <div style={{ fontSize: typography.fontSize.sm, color: colors.textSecondary }}>pontos</div>
            </div>

            {highScore !== undefined && (
                <div
                    style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.textSecondary,
                    }}
                >
                    Recorde: {highScore}
                </div>
            )}

            {isNewRecord && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.3, 1] }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    style={{
                        backgroundColor: colors.accent,
                        color: colors.textPrimary,
                        padding: `${spacing.xs} ${spacing.md}`,
                        borderRadius: radii.full,
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.bold,
                    }}
                >
                    🎉 Novo Recorde!
                </motion.div>
            )}
        </motion.div>
    );
}
