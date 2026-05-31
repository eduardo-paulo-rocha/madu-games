import { colors } from '../../../design-system/tokens';

export function WordSearchIcon({ size = 64 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <rect x="4" y="4" width="56" height="56" rx="12" fill={colors.primaryLight} opacity="0.2" />
            <text x="12" y="24" fontSize="14" fontWeight="bold" fill={colors.primary}>A B C</text>
            <text x="12" y="40" fontSize="14" fontWeight="bold" fill={colors.primary}>D E F</text>
            <text x="12" y="56" fontSize="14" fontWeight="bold" fill={colors.primary}>G H I</text>
            <rect x="8" y="14" width="36" height="14" rx="4" fill={colors.accent} opacity="0.4" />
        </svg>
    );
}
