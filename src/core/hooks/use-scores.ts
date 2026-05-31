import { useState, useEffect, useCallback } from 'react';
import type { Difficulty } from '../registry/types';
import { getScoresByGameId, type PlayerScoreRecord } from '../storage/score-store';

interface UseScoresReturn {
    scores: PlayerScoreRecord[];
    getHighScore: (difficulty: Difficulty) => PlayerScoreRecord | undefined;
    refresh: () => Promise<void>;
}

export function useScores(gameId: string): UseScoresReturn {
    const [scores, setScores] = useState<PlayerScoreRecord[]>([]);

    const refresh = useCallback(async () => {
        const all = await getScoresByGameId(gameId);
        setScores(all);
    }, [gameId]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    const getHighScore = useCallback(
        (difficulty: Difficulty) => {
            return scores.find((s) => s.difficulty === difficulty);
        },
        [scores],
    );

    return { scores, getHighScore, refresh };
}
