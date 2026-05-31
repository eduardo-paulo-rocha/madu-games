import { motion } from 'framer-motion';
import type { Difficulty } from '../../core/registry/types';
import { colors, radii, spacing, typography, shadows } from '../tokens';

interface DifficultySelectorProps {
    onSelect: (difficulty: Difficulty) => void;
}

const difficulties: { value: Difficulty; label: string; stars: string }[] = [
    { value: 'easy', label: 'Fácil', stars: '★' },
    { value: 'medium', label: 'Médio', stars: '★★' },
    { value: 'hard', label: 'Difícil', stars: '★★★' },
];

const difficultyColors: Record<Difficulty, string> = {
    easy: '#4CAF50',
    medium: '#FF9800',
    hard: '#FF5252',
};

export function DifficultySelector({ onSelect }: DifficultySelectorProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.md,
                width: '100%',
                maxWidth: '320px',
                margin: '0 auto',
            }}
        >
            <h2
                style={{
                    textAlign: 'center',
                    fontSize: typography.fontSize.xl,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.textPrimary,
                    marginBottom: spacing.sm,
                }}
            >
                Escolha a dificuldade
            </h2>
            {difficulties.map((d) => (
                <motion.button
                    key={d.value}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => onSelect(d.value)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: spacing.md,
                        padding: `${spacing.md} ${spacing.lg}`,
                        backgroundColor: colors.surface,
                        border: `2px solid ${difficultyColors[d.value]}`,
                        borderRadius: radii.lg,
                        cursor: 'pointer',
                        fontFamily: typography.fontFamily,
                        fontSize: typography.fontSize.lg,
                        fontWeight: typography.fontWeight.bold,
                        color: colors.textPrimary,
                        minHeight: '56px',
                        boxShadow: shadows.sm,
                    }}
                >
                    <span style={{ color: difficultyColors[d.value], fontSize: typography.fontSize.xl }}>
                        {d.stars}
                    </span>
                    <span>{d.label}</span>
                </motion.button>
            ))}
        </div>
    );
}
