import { useState, useCallback, useRef, useEffect } from 'react';

interface UseHintOptions {
    onHint: () => boolean;
    isDisabled: boolean;
}

interface UseHintReturn {
    hintCount: number;
    triggerHint: () => void;
    showPenalty: boolean;
    isHintDisabled: boolean;
}

export function useHint({ onHint, isDisabled }: UseHintOptions): UseHintReturn {
    const [hintCount, setHintCount] = useState(0);
    const [showPenalty, setShowPenalty] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const triggerHint = useCallback(() => {
        if (isDisabled) return;
        const applied = onHint();
        if (applied) {
            setHintCount((c) => c + 1);
            setShowPenalty(true);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setShowPenalty(false), 2500);
        }
    }, [onHint, isDisabled]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return {
        hintCount,
        triggerHint,
        showPenalty,
        isHintDisabled: isDisabled,
    };
}
