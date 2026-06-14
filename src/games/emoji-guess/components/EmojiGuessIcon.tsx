import { colors } from '../../../design-system/tokens';

export function EmojiGuessIcon({ size = 64 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <rect x="4" y="4" width="56" height="56" rx="12" fill={colors.primaryLight} opacity="0.2" />
            {/* Smiley face */}
            <circle cx="24" cy="32" r="14" fill={colors.accent} />
            <circle cx="20" cy="28" r="2" fill={colors.textPrimary} />
            <circle cx="28" cy="28" r="2" fill={colors.textPrimary} />
            <path d="M18 35 Q24 41 30 35" stroke={colors.textPrimary} strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Question mark */}
            <text x="48" y="38" fontSize="22" fontWeight="bold" fill={colors.primary} textAnchor="middle">?</text>
        </svg>
    );
}
