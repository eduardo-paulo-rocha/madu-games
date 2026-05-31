import { colors } from '../../../design-system/tokens';

export function LogicalSequenceIcon({ size = 64 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <rect x="4" y="4" width="56" height="56" rx="12" fill={colors.primaryLight} opacity="0.2" />
            <text x="10" y="40" fontSize="16">🔴</text>
            <text x="24" y="40" fontSize="16">🔵</text>
            <text x="38" y="40" fontSize="16">🔴</text>
            <text x="52" y="40" fontSize="14">❓</text>
        </svg>
    );
}
