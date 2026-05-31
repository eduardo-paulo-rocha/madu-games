import { getDB } from './db';
import type { Difficulty } from '../registry/types';

export interface PlayerScoreRecord {
    id: string;
    gameId: string;
    difficulty: Difficulty;
    highScore: number;
    bestStars: number;
    totalGamesPlayed: number;
    lastPlayedAt: Date;
}

function makeScoreId(gameId: string, difficulty: Difficulty): string {
    return `${gameId}_${difficulty}`;
}

export async function getScoresByGameId(gameId: string): Promise<PlayerScoreRecord[]> {
    const db = await getDB();
    return db.getAllFromIndex('scores', 'by-game', gameId);
}

export async function getScore(
    gameId: string,
    difficulty: Difficulty,
): Promise<PlayerScoreRecord | undefined> {
    const db = await getDB();
    return db.get('scores', makeScoreId(gameId, difficulty));
}

export async function upsertHighScore(
    gameId: string,
    difficulty: Difficulty,
    score: number,
    stars: number,
): Promise<PlayerScoreRecord> {
    const db = await getDB();
    const id = makeScoreId(gameId, difficulty);
    const existing = await db.get('scores', id);

    const record: PlayerScoreRecord = {
        id,
        gameId,
        difficulty,
        highScore: existing ? Math.max(existing.highScore, score) : score,
        bestStars: existing ? Math.max(existing.bestStars, stars) : stars,
        totalGamesPlayed: existing ? existing.totalGamesPlayed + 1 : 1,
        lastPlayedAt: new Date(),
    };

    await db.put('scores', record);
    return record;
}

export async function getAllScores(): Promise<PlayerScoreRecord[]> {
    const db = await getDB();
    return db.getAll('scores');
}
