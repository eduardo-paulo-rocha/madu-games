import { Suspense, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gameRegistry } from '../core/registry/game-registry';
import { useGameSession } from '../core/hooks/use-game-session';
import { useScores } from '../core/hooks/use-scores';
import type { Difficulty, RoundResults } from '../core/registry/types';
import { DifficultySelector } from '../design-system/components/DifficultySelector';
import { ScoreDisplay } from '../design-system/components/ScoreDisplay';
import { CelebrationAnimation } from '../design-system/components/CelebrationAnimation';
import { Button } from '../design-system/components/Button';
import { NewRecordAnimation } from '../design-system/components/NewRecordAnimation';
import { colors, spacing, typography, shadows } from '../design-system/tokens';
import { pageTransition } from '../design-system/animations/presets';
import '../games';

type ShellPhase = 'select-difficulty' | 'playing' | 'results';

export function GameShell() {
    const { gameId } = useParams<{ gameId: string }>();
    const navigate = useNavigate();
    const game = gameId ? gameRegistry.getById(gameId) : undefined;

    const [phase, setPhase] = useState<ShellPhase>('select-difficulty');
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

    const { session, isNewRecord, startSession, handleCorrectItem, handleRoundComplete, handleSaveState, handleAbandon } =
        useGameSession({
            gameId: game?.id ?? '',
            pointsPerItem: game?.pointsPerItem ?? 10,
        });

    const { scores, refresh } = useScores(game?.id ?? '');

    const onSelectDifficulty = useCallback(
        async (difficulty: Difficulty) => {
            if (!game) return;
            setSelectedDifficulty(difficulty);
            await startSession(difficulty, game.defaultRoundSize);
            setPhase('playing');
        },
        [game, startSession],
    );

    const onRoundComplete = useCallback(
        async (results: RoundResults) => {
            await handleRoundComplete(results);
            await refresh();
            setPhase('results');
        },
        [handleRoundComplete, refresh],
    );

    const onBack = useCallback(async () => {
        if (phase === 'playing') {
            await handleAbandon();
        }
        navigate('/');
    }, [phase, handleAbandon, navigate]);

    const onPlayAgain = useCallback(async () => {
        if (selectedDifficulty && game) {
            await startSession(selectedDifficulty, game.defaultRoundSize);
            setPhase('playing');
        }
    }, [selectedDifficulty, game, startSession]);

    if (!game) {
        return (
            <div style={{ padding: spacing.xl, textAlign: 'center' }}>
                <p>Jogo não encontrado</p>
                <Button onClick={() => navigate('/')}>Voltar</Button>
            </div>
        );
    }

    const GameComponent = game.component;
    const currentScore = selectedDifficulty
        ? scores.find((s) => s.difficulty === selectedDifficulty)
        : undefined;

    return (
        <motion.div
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100dvh',
            }}
        >
            {/* Header */}
            <header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.md,
                    padding: `${spacing.md} ${spacing.lg}`,
                    backgroundColor: colors.surface,
                    boxShadow: shadows.sm,
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                }}
            >
                <Button variant="ghost" onClick={onBack} style={{ padding: spacing.sm }}>
                    ← Voltar
                </Button>
                <h2
                    style={{
                        flex: 1,
                        fontSize: typography.fontSize.lg,
                        fontWeight: typography.fontWeight.bold,
                        color: colors.textPrimary,
                        margin: 0,
                        textAlign: 'center',
                    }}
                >
                    {game.name}
                </h2>
                <div style={{ width: '80px' }} />
            </header>

            {/* Content */}
            <main
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: phase === 'playing' ? 'flex-start' : 'center',
                    padding: spacing.lg,
                    gap: spacing.lg,
                }}
            >
                {phase === 'select-difficulty' && (
                    <DifficultySelector onSelect={onSelectDifficulty} />
                )}

                {phase === 'playing' && (
                    <Suspense
                        fallback={
                            <div style={{ padding: spacing.xl, textAlign: 'center', color: colors.textSecondary }}>
                                Carregando...
                            </div>
                        }
                    >
                        <GameComponent
                            difficulty={selectedDifficulty!}
                            roundSize={game.defaultRoundSize}
                            onCorrectItem={handleCorrectItem}
                            onRoundComplete={onRoundComplete}
                            onSaveState={handleSaveState}
                            savedState={null}
                        />
                    </Suspense>
                )}

                {phase === 'results' && session && (
                    <>
                        {session.stars > 0 && <CelebrationAnimation />}
                        {isNewRecord && <NewRecordAnimation />}

                        <ScoreDisplay
                            score={session.score}
                            highScore={currentScore?.highScore}
                            stars={session.stars}
                            isNewRecord={isNewRecord}
                        />

                        <div style={{ display: 'flex', gap: spacing.md, marginTop: spacing.lg }}>
                            <Button variant="primary" size="lg" onClick={onPlayAgain}>
                                Jogar Novamente
                            </Button>
                            <Button variant="secondary" size="lg" onClick={() => navigate('/')}>
                                Voltar
                            </Button>
                        </div>
                    </>
                )}
            </main>
        </motion.div>
    );
}
