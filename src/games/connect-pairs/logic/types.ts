import type { Difficulty } from '../../../core/registry/types';

export type { Difficulty };

export interface PairItem {
    id: string;
    display: string;
}

export interface Pair {
    left: PairItem;
    right: PairItem;
}

export interface PairSet {
    id: string;
    category: string;
    difficulty: Difficulty;
    pairs: Pair[];
}

export type RoundPhase =
    | 'idle'
    | 'one-selected'
    | 'checking'
    | 'correct-feedback'
    | 'incorrect-feedback'
    | 'complete';

export interface RoundState {
    leftColumn: PairItem[];
    rightColumn: PairItem[];
    selectedLeft: string | null;
    selectedRight: string | null;
    matchedPairs: Set<string>;
    failedItems: Set<string>;
    attempts: number;
    firstTryMatches: number;
    phase: RoundPhase;
    currentPairSet: PairSet;
}

export type RoundAction =
    | { type: 'SELECT_ITEM'; column: 'left' | 'right'; id: string }
    | { type: 'CHECK_RESULT' }
    | { type: 'CLEAR_FEEDBACK' }
    | { type: 'RESET'; pairSet: PairSet; leftColumn: PairItem[]; rightColumn: PairItem[] };
