import type { RoundState, RoundAction, PairSet, PairItem } from './types';
import { isFirstTry, addFailedItems } from './scoring';

function checkMatch(state: RoundState): boolean {
    if (!state.selectedLeft || !state.selectedRight) return false;
    const pair = state.currentPairSet.pairs.find((p) => p.left.id === state.selectedLeft);
    return pair?.right.id === state.selectedRight;
}

export function createInitialState(
    pairSet: PairSet,
    leftColumn: PairItem[],
    rightColumn: PairItem[],
): RoundState {
    return {
        leftColumn,
        rightColumn,
        selectedLeft: null,
        selectedRight: null,
        matchedPairs: new Set(),
        failedItems: new Set(),
        attempts: 0,
        firstTryMatches: 0,
        phase: 'idle',
        currentPairSet: pairSet,
    };
}

export function roundReducer(state: RoundState, action: RoundAction): RoundState {
    switch (action.type) {
        case 'SELECT_ITEM': {
            const { column, id } = action;
            if (state.matchedPairs.has(id)) return state;
            if (
                state.phase === 'checking' ||
                state.phase === 'correct-feedback' ||
                state.phase === 'incorrect-feedback' ||
                state.phase === 'complete'
            ) {
                return state;
            }

            if (column === 'left') {
                if (state.selectedLeft === id) {
                    return {
                        ...state,
                        selectedLeft: null,
                        phase: state.selectedRight ? 'one-selected' : 'idle',
                    };
                }
                const newState = { ...state, selectedLeft: id };
                if (newState.selectedRight) {
                    return { ...newState, phase: 'checking' };
                }
                return { ...newState, phase: 'one-selected' };
            } else {
                if (state.selectedRight === id) {
                    return {
                        ...state,
                        selectedRight: null,
                        phase: state.selectedLeft ? 'one-selected' : 'idle',
                    };
                }
                const newState = { ...state, selectedRight: id };
                if (newState.selectedLeft) {
                    return { ...newState, phase: 'checking' };
                }
                return { ...newState, phase: 'one-selected' };
            }
        }

        case 'CHECK_RESULT': {
            if (state.phase !== 'checking') return state;
            const correct = checkMatch(state);
            const attempts = state.attempts + 1;

            if (correct) {
                const firstTry = isFirstTry(state.failedItems, state.selectedLeft!, state.selectedRight!);
                const matchedPairs = new Set(state.matchedPairs).add(state.selectedLeft!);
                const firstTryMatches = firstTry ? state.firstTryMatches + 1 : state.firstTryMatches;
                return {
                    ...state,
                    matchedPairs,
                    attempts,
                    firstTryMatches,
                    phase: 'correct-feedback',
                };
            } else {
                const failedItems = addFailedItems(
                    state.failedItems,
                    state.selectedLeft!,
                    state.selectedRight!,
                );
                return {
                    ...state,
                    failedItems,
                    attempts,
                    phase: 'incorrect-feedback',
                };
            }
        }

        case 'CLEAR_FEEDBACK': {
            if (state.phase === 'correct-feedback') {
                const allMatched = state.matchedPairs.size === state.currentPairSet.pairs.length;
                if (allMatched) {
                    return { ...state, selectedLeft: null, selectedRight: null, phase: 'complete' };
                }
                return { ...state, selectedLeft: null, selectedRight: null, phase: 'idle' };
            }
            if (state.phase === 'incorrect-feedback') {
                return { ...state, selectedLeft: null, selectedRight: null, phase: 'idle' };
            }
            return state;
        }

        case 'RESET': {
            return createInitialState(action.pairSet, action.leftColumn, action.rightColumn);
        }

        default:
            return state;
    }
}
