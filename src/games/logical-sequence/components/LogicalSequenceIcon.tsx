import { colors } from '../../../design-system/tokens';

export function LogicalSequenceIcon({ size = 64 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <rect x="4" y="4" width="56" height="56" rx="12" fill={colors.primaryLight} opacity="0.2" />
            {/* Colored circles forming a pattern */}
            <circle cx="14" cy="32" r="7" fill={colors.error} />
            <circle cx="30" cy="32" r="7" fill={colors.primary} />
            <circle cx="46" cy="32" r="7" fill={colors.error} />
            {/* Question mark for the missing element */}
            <text x="46" y="37" fontSize="12" fontWeight="bold" fill={colors.textOnPrimary} textAnchor="middle">?</text>
            {/* Arrow hints */}
            <path d="M22 44 L26 48 L30 44" stroke={colors.textSecondary} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
