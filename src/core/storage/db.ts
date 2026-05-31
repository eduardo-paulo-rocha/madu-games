import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Difficulty, SessionStatus } from '../registry/types';

interface MaduGamesDB extends DBSchema {
    sessions: {
        key: string;
        value: {
            id: string;
            gameId: string;
            difficulty: Difficulty;
            status: SessionStatus;
            startedAt: Date;
            completedAt: Date | null;
            score: number;
            totalItems: number;
            correctItems: number;
            stars: number;
            state: unknown;
        };
        indexes: {
            'by-game-difficulty': [string, Difficulty];
            'by-game-status': [string, SessionStatus];
        };
    };
    scores: {
        key: string;
        value: {
            id: string;
            gameId: string;
            difficulty: Difficulty;
            highScore: number;
            bestStars: number;
            totalGamesPlayed: number;
            lastPlayedAt: Date;
        };
        indexes: {
            'by-game': string;
        };
    };
}

let dbPromise: Promise<IDBPDatabase<MaduGamesDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<MaduGamesDB>> {
    if (!dbPromise) {
        dbPromise = openDB<MaduGamesDB>('madu-games', 1, {
            upgrade(db) {
                const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
                sessionStore.createIndex('by-game-difficulty', ['gameId', 'difficulty']);
                sessionStore.createIndex('by-game-status', ['gameId', 'status']);

                const scoreStore = db.createObjectStore('scores', { keyPath: 'id' });
                scoreStore.createIndex('by-game', 'gameId');
            },
        });
    }
    return dbPromise;
}

export type { MaduGamesDB };
