import { colors } from '../../../design-system/tokens';

export function CrosswordIcon({ size = 64 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <rect x="4" y="4" width="56" height="56" rx="12" fill={colors.primaryLight} opacity="0.2" />
            <rect x="12" y="20" width="12" height="12" rx="2" fill={colors.primary} opacity="0.3" />
            <rect x="26" y="20" width="12" height="12" rx="2" fill={colors.primary} opacity="0.3" />
            <rect x="40" y="20" width="12" height="12" rx="2" fill={colors.primary} opacity="0.3" />
            <rect x="26" y="34" width="12" height="12" rx="2" fill={colors.primary} opacity="0.3" />
            <rect x="26" y="8" width="12" height="12" rx="2" fill={colors.primary} opacity="0.3" />
            <text x="15" y="30" fontSize="10" fontWeight="bold" fill={colors.primary}>C</text>
            <text x="29" y="30" fontSize="10" fontWeight="bold" fill={colors.primary}>A</text>
            <text x="43" y="30" fontSize="10" fontWeight="bold" fill={colors.primary}>R</text>
        </svg>
    );
}
