import { useState, useCallback, useRef } from 'react';
import type { Difficulty, GameSession, RoundResults } from '../registry/types';
import { createSession, updateSession, completeSession, abandonSession } from '../storage/session-store';
import { calculateScoreWithHints, calculateStars } from '../scoring/scoring-engine';
import { upsertHighScore } from '../storage/score-store';

interface UseGameSessionOptions {
    gameId: string;
    pointsPerItem: number;
}

interface UseGameSessionReturn {
    session: GameSession | null;
    isNewRecord: boolean;
    startSession: (difficulty: Difficulty, totalItems: number) => Promise<void>;
    handleCorrectItem: () => void;
    handleRoundComplete: (results: RoundResults) => Promise<void>;
    handleSaveState: (state: unknown) => Promise<void>;
    handleAbandon: () => Promise<void>;
}

export function useGameSession({ gameId, pointsPerItem }: UseGameSessionOptions): UseGameSessionReturn {
    const [session, setSession] = useState<GameSession | null>(null);
    const [isNewRecord, setIsNewRecord] = useState(false);
    const correctCountRef = useRef(0);

    const startSession = useCallback(
        async (difficulty: Difficulty, totalItems: number) => {
            correctCountRef.current = 0;
            setIsNewRecord(false);
            const newSession = await createSession(gameId, difficulty, totalItems);
            setSession(newSession);
        },
        [gameId],
    );

    const handleCorrectItem = useCallback(() => {
        correctCountRef.current += 1;
    }, []);

    const handleRoundComplete = useCallback(
        async (results: RoundResults) => {
            if (!session) return;
            const score = calculateScoreWithHints(results.correctItems, pointsPerItem, results.hintCount ?? 0);
            const stars = calculateStars(results.correctItems, results.totalItems);

            await completeSession(session.id, score, results.correctItems, stars, results.hintCount ?? 0);

            const scoreRecord = await upsertHighScore(session.gameId, session.difficulty, score, stars);
            setIsNewRecord(scoreRecord.highScore === score && scoreRecord.totalGamesPlayed > 1);

            setSession((prev) =>
                prev
                    ? { ...prev, status: 'completed', score, correctItems: results.correctItems, stars, completedAt: new Date() }
                    : null,
            );
        },
        [session, pointsPerItem],
    );

    const handleSaveState = useCallback(
        async (state: unknown) => {
            if (!session) return;
            await updateSession(session.id, { state });
        },
        [session],
    );

    const handleAbandon = useCallback(async () => {
        if (!session) return;
        await abandonSession(session.id);
        setSession(null);
    }, [session]);

    return {
        session,
        isNewRecord,
        startSession,
        handleCorrectItem,
        handleRoundComplete,
        handleSaveState,
        handleAbandon,
    };
}
