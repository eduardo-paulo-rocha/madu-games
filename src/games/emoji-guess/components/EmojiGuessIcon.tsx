import { colors } from '../../../design-system/tokens';

export function EmojiGuessIcon({ size = 64 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <rect x="4" y="4" width="56" height="56" rx="12" fill={colors.primaryLight} opacity="0.2" />
            <text x="16" y="38" fontSize="28" textAnchor="middle">🤔</text>
            <text x="48" y="38" fontSize="28" textAnchor="middle">💡</text>
        </svg>
    );
}
