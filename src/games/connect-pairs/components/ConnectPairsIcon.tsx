import { colors } from '../../../design-system/tokens';

export function ConnectPairsIcon({ size = 64 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <rect x="4" y="4" width="56" height="56" rx="12" fill={colors.primaryLight} opacity="0.2" />
            <text x="14" y="28" fontSize="18" textAnchor="middle">🐱</text>
            <text x="50" y="28" fontSize="18" textAnchor="middle">🔊</text>
            <line x1="24" y1="24" x2="40" y2="24" stroke={colors.primary} strokeWidth="2" strokeDasharray="3,2" />
            <text x="14" y="52" fontSize="18" textAnchor="middle">🐶</text>
            <text x="50" y="52" fontSize="18" textAnchor="middle">🦴</text>
            <line x1="24" y1="48" x2="40" y2="48" stroke={colors.primary} strokeWidth="2" strokeDasharray="3,2" />
        </svg>
    );
}
