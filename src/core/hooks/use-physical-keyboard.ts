import { useEffect } from 'react';
import { normalizeText } from '../text/normalize';

interface UsePhysicalKeyboardOptions {
    onKeyPress: (key: string) => void;
    onBackspace: () => void;
    onConfirm: () => void;
    enabled?: boolean;
}

export function usePhysicalKeyboard({
    onKeyPress,
    onBackspace,
    onConfirm,
    enabled = true,
}: UsePhysicalKeyboardOptions) {
    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't interfere with browser shortcuts
            if (e.ctrlKey || e.altKey || e.metaKey) return;

            if (e.key === 'Backspace') {
                e.preventDefault();
                onBackspace();
                return;
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                onConfirm();
                return;
            }

            // Only accept single character keys
            if (e.key.length !== 1) return;

            // Normalize: remove accents and convert to uppercase
            const normalized = normalizeText(e.key).toUpperCase();

            // Only accept alphabet characters, ignore everything else
            if (/^[A-Z]$/.test(normalized)) {
                e.preventDefault();
                onKeyPress(normalized);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onKeyPress, onBackspace, onConfirm, enabled]);
}
