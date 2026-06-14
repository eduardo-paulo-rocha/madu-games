import { colors } from '../../../design-system/tokens';

export function RhymeGameIcon({ size = 64 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <rect x="4" y="4" width="56" height="56" rx="12" fill={colors.primaryLight} opacity="0.2" />
            {/* Musical notes */}
            <circle cx="18" cy="40" r="5" fill={colors.accent} />
            <rect x="23" y="18" width="3" height="22" rx="1" fill={colors.accent} />
            <circle cx="38" cy="36" r="5" fill={colors.secondary} />
            <rect x="43" y="14" width="3" height="22" rx="1" fill={colors.secondary} />
            {/* Beam connecting notes */}
            <rect x="23" y="14" width="23" height="4" rx="1" fill={colors.primary} />
            {/* Text "AB" to hint at word matching */}
            <text x="16" y="22" fontSize="10" fontWeight="bold" fill={colors.primary}>A</text>
            <text x="36" y="54" fontSize="10" fontWeight="bold" fill={colors.primary}>A</text>
        </svg>
    );
}
