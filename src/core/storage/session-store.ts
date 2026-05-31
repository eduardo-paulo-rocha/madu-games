import { getDB } from './db';
import type { Difficulty, GameSession, SessionStatus } from '../registry/types';

export async function createSession(
    gameId: string,
    difficulty: Difficulty,
    totalItems: number,
): Promise<GameSession> {
    const db = await getDB();
    const session: GameSession = {
        id: crypto.randomUUID(),
        gameId,
        difficulty,
        status: 'in-progress',
        startedAt: new Date(),
        completedAt: null,
        score: 0,
        totalItems,
        correctItems: 0,
        stars: 0,
        state: null,
    };
    await db.add('sessions', session);
    return session;
}

export async function updateSession(
    id: string,
    updates: Partial<Pick<GameSession, 'score' | 'correctItems' | 'stars' | 'state' | 'status' | 'completedAt'>>,
): Promise<void> {
    const db = await getDB();
    const session = await db.get('sessions', id);
    if (!session) return;
    const updated = { ...session, ...updates };
    await db.put('sessions', updated);
}

export async function completeSession(
    id: string,
    score: number,
    correctItems: number,
    stars: number,
): Promise<void> {
    await updateSession(id, {
        status: 'completed',
        completedAt: new Date(),
        score,
        correctItems,
        stars,
    });
}

export async function abandonSession(id: string): Promise<void> {
    await updateSession(id, {
        status: 'abandoned',
        completedAt: new Date(),
    });
}

export async function getInProgressSessions(gameId: string): Promise<GameSession[]> {
    const db = await getDB();
    return db.getAllFromIndex('sessions', 'by-game-status', [gameId, 'in-progress' as SessionStatus]);
}

export async function getSessionsByGameId(gameId: string): Promise<GameSession[]> {
    const db = await getDB();
    const easy = await db.getAllFromIndex('sessions', 'by-game-difficulty', [gameId, 'easy']);
    const medium = await db.getAllFromIndex('sessions', 'by-game-difficulty', [gameId, 'medium']);
    const hard = await db.getAllFromIndex('sessions', 'by-game-difficulty', [gameId, 'hard']);
    return [...easy, ...medium, ...hard];
}
