import { useReducer, useEffect, useRef, useState } from 'react';
import type { GameProps } from '../../core/registry/types';
import { colors, spacing, typography, radii } from '../../design-system/tokens';
import { roundReducer, createInitialState } from './logic/pair-matcher';
import { generateRound } from './logic/round-generator';
import { selectPairSet } from './data/pair-sets';
import { PairColumn } from './components/PairColumn';
import { MatchFeedback } from './components/MatchFeedback';
import type { RoundState } from './logic/types';

interface SerializedRoundState {
    leftColumn: RoundState['leftColumn'];
    rightColumn: RoundState['rightColumn'];
    selectedLeft: RoundState['selectedLeft'];
    selectedRight: RoundState['selectedRight'];
    matchedPairs: string[];
    failedItems: string[];
    attempts: RoundState['attempts'];
    firstTryMatches: RoundState['firstTryMatches'];
    phase: RoundState['phase'];
    currentPairSet: RoundState['currentPairSet'];
    lastCategory: string | null;
}

function serializeState(state: RoundState, lastCategory: string | null): SerializedRoundState {
    return {
        ...state,
        matchedPairs: Array.from(state.matchedPairs),
        failedItems: Array.from(state.failedItems),
        lastCategory,
    };
}

function deserializeState(saved: SerializedRoundState): { state: RoundState; lastCategory: string | null } {
    return {
        state: {
            ...saved,
            matchedPairs: new Set(saved.matchedPairs),
            failedItems: new Set(saved.failedItems),
        },
        lastCategory: saved.lastCategory,
    };
}

const PAIR_COUNT: Record<string, number> = { easy: 4, medium: 5, hard: 6 };

export default function ConnectPairsGame({
    difficulty,
    onCorrectItem,
    onRoundComplete,
    onSaveState,
    savedState,
}: GameProps) {
    const [lastCategory, setLastCategory] = useState<string | null>(() => {
        if (savedState) {
            try {
                return (savedState as SerializedRoundState).lastCategory ?? null;
            } catch {
                return null;
            }
        }
        return null;
    });

    const [state, dispatch] = useReducer(
        roundReducer,
        undefined as never,
        () => {
            if (savedState) {
                try {
                    return deserializeState(savedState as SerializedRoundState).state;
                } catch {
                    // fall through to fresh state
                }
            }
            const pairSet = selectPairSet(difficulty, undefined);
            const { leftColumn, rightColumn } = generateRound(pairSet);
            return createInitialState(pairSet, leftColumn, rightColumn);
        },
    );

    const completedRef = useRef(false);
    const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Auto-check result when both items are selected
    useEffect(() => {
        if (state.phase === 'checking') {
            dispatch({ type: 'CHECK_RESULT' });
        }
    }, [state.phase]);

    // Auto-dismiss feedback after 500ms, call onCorrectItem for correct matches
    useEffect(() => {
        if (state.phase === 'correct-feedback' || state.phase === 'incorrect-feedback') {
            if (state.phase === 'correct-feedback') {
                onCorrectItem();
            }
            feedbackTimerRef.current = setTimeout(() => {
                dispatch({ type: 'CLEAR_FEEDBACK' });
            }, 500);
        }
        return () => {
            if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
        };
    }, [state.phase, onCorrectItem]);

    // Handle round complete
    useEffect(() => {
        if (state.phase === 'complete' && !completedRef.current) {
            completedRef.current = true;
            setLastCategory(state.currentPairSet.category);
            onRoundComplete({
                totalItems: state.currentPairSet.pairs.length,
                correctItems: state.firstTryMatches,
                hintCount: 0,
            });
        }
    }, [state.phase, state.currentPairSet, state.firstTryMatches, onRoundComplete]);

    // Save state on every change
    useEffect(() => {
        onSaveState(serializeState(state, lastCategory));
    }, [state, lastCategory, onSaveState]);

    const handleSelect = (column: 'left' | 'right', id: string) => {
        dispatch({ type: 'SELECT_ITEM', column, id });
    };

    const feedbackPhase =
        state.phase === 'correct-feedback' || state.phase === 'incorrect-feedback'
            ? state.phase
            : null;

    // Map left matched IDs → right item IDs for right column
    const rightMatchedIds = new Set(
        state.currentPairSet.pairs
            .filter((p) => state.matchedPairs.has(p.left.id))
            .map((p) => p.right.id),
    );

    const pairCount = PAIR_COUNT[difficulty] ?? 5;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing.lg,
                width: '100%',
                maxWidth: '600px',
                padding: spacing.md,
                position: 'relative',
                boxSizing: 'border-box',
            }}
        >
            <MatchFeedback phase={feedbackPhase} />

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                }}
            >
                <p
                    style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.textSecondary,
                        fontFamily: typography.fontFamily,
                        margin: 0,
                        fontWeight: typography.fontWeight.medium,
                    }}
                >
                    {state.currentPairSet.category}
                </p>
                <p
                    style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.textSecondary,
                        fontFamily: typography.fontFamily,
                        margin: 0,
                    }}
                >
                    {state.matchedPairs.size} / {pairCount}
                </p>
            </div>

            <div
                style={{
                    display: 'flex',
                    gap: spacing.md,
                    width: '100%',
                    alignItems: 'flex-start',
                }}
            >
                <PairColumn
                    items={state.leftColumn}
                    selectedId={state.selectedLeft}
                    matchedIds={state.matchedPairs}
                    onSelectItem={(id) => handleSelect('left', id)}
                />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: `0 ${spacing.xs}`,
                        color: colors.border,
                        fontSize: typography.fontSize.xl,
                        alignSelf: 'center',
                        flexShrink: 0,
                    }}
                >
                    ↔
                </div>
                <PairColumn
                    items={state.rightColumn}
                    selectedId={state.selectedRight}
                    matchedIds={rightMatchedIds}
                    onSelectItem={(id) => handleSelect('right', id)}
                />
            </div>

            {state.phase === 'complete' && (
                <p
                    style={{
                        fontSize: typography.fontSize.xl,
                        color: colors.success,
                        fontFamily: typography.fontFamily,
                        fontWeight: typography.fontWeight.bold,
                        borderRadius: radii.md,
                        padding: spacing.md,
                        textAlign: 'center',
                        margin: 0,
                    }}
                >
                    🎉 Parabéns! Todos os pares encontrados!
                </p>
            )}
        </div>
    );
}
