import { colors } from '../../../design-system/tokens';

export function ConnectPairsIcon({ size = 64 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <rect x="4" y="4" width="56" height="56" rx="12" fill={colors.primaryLight} opacity="0.2" />
            {/* Left pair items */}
            <rect x="8" y="16" width="16" height="12" rx="4" fill={colors.accent} />
            <text x="16" y="25" fontSize="8" fontWeight="bold" fill={colors.textPrimary} textAnchor="middle">A</text>
            <rect x="8" y="36" width="16" height="12" rx="4" fill={colors.secondary} />
            <text x="16" y="45" fontSize="8" fontWeight="bold" fill={colors.textPrimary} textAnchor="middle">B</text>
            {/* Right pair items */}
            <rect x="40" y="16" width="16" height="12" rx="4" fill={colors.secondary} />
            <text x="48" y="25" fontSize="8" fontWeight="bold" fill={colors.textPrimary} textAnchor="middle">2</text>
            <rect x="40" y="36" width="16" height="12" rx="4" fill={colors.accent} />
            <text x="48" y="45" fontSize="8" fontWeight="bold" fill={colors.textPrimary} textAnchor="middle">1</text>
            {/* Connecting lines (crossed to show matching) */}
            <line x1="24" y1="22" x2="40" y2="42" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="42" x2="40" y2="22" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}
