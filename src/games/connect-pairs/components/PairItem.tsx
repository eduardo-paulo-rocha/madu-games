import { motion } from 'framer-motion';
import { colors, spacing, radii, typography, shadows } from '../../../design-system/tokens';
import type { PairItem as PairItemType } from '../logic/types';

interface PairItemProps {
    item: PairItemType;
    isSelected: boolean;
    isMatched: boolean;
    onClick: (id: string) => void;
}

export function PairItem({ item, isSelected, isMatched, onClick }: PairItemProps) {
    const handleClick = () => {
        if (!isMatched) onClick(item.id);
    };

    return (
        <motion.button
            onClick={handleClick}
            animate={{
                scale: isSelected ? 1.05 : 1,
                opacity: isMatched ? 0.5 : 1,
            }}
            whileTap={isMatched ? {} : { scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{
                minHeight: '48px',
                padding: `${spacing.sm} ${spacing.md}`,
                borderRadius: radii.md,
                border: isSelected
                    ? `2px solid ${colors.primary}`
                    : `2px solid ${colors.border}`,
                background: isMatched
                    ? `${colors.success}22`
                    : isSelected
                      ? `${colors.primaryLight}22`
                      : colors.surface,
                cursor: isMatched ? 'default' : 'pointer',
                pointerEvents: isMatched ? 'none' : 'auto',
                fontSize: typography.fontSize.lg,
                fontFamily: typography.fontFamily,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
                width: '100%',
                textAlign: 'center',
                boxShadow: isSelected ? shadows.md : shadows.sm,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.xs,
                userSelect: 'none',
                WebkitUserSelect: 'none',
            }}
        >
            {item.display}
            {isMatched && ' ✓'}
        </motion.button>
    );
}
