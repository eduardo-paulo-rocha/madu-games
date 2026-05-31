import type { ComponentType, LazyExoticComponent } from 'react';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type SessionStatus = 'in-progress' | 'completed' | 'abandoned';

export interface GamePlugin {
    id: string;
    name: string;
    description: string;
    icon: ComponentType<{ size?: number }>;
    component: LazyExoticComponent<ComponentType<GameProps>>;
    defaultRoundSize: number;
    difficulties: Difficulty[];
    pointsPerItem: number;
}

export interface GameProps {
    difficulty: Difficulty;
    roundSize: number;
    onCorrectItem: () => void;
    onRoundComplete: (results: RoundResults) => void;
    onSaveState: (state: unknown) => void;
    savedState: unknown | null;
}

export interface RoundResults {
    totalItems: number;
    correctItems: number;
    hintCount?: number;
}

export interface GameSession {
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
    hintCount?: number;
    state: unknown;
}

export interface PlayerScore {
    id: string;
    gameId: string;
    difficulty: Difficulty;
    highScore: number;
    bestStars: number;
    totalGamesPlayed: number;
    lastPlayedAt: Date;
}
