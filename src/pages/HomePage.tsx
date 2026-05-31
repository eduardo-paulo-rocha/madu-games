import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gameRegistry } from '../core/registry/game-registry';
import { useScores } from '../core/hooks/use-scores';
import { Card } from '../design-system/components/Card';
import { colors, spacing, typography } from '../design-system/tokens';
import { staggerChildren, pageTransition } from '../design-system/animations/presets';
import '../games';

function GameCard({ game }: { game: ReturnType<typeof gameRegistry.getAll>[number] }) {
    const navigate = useNavigate();
    const { scores } = useScores(game.id);

    const bestScore = scores.reduce<{ highScore: number; bestStars: number } | null>((best, s) => {
        if (!best || s.highScore > best.highScore) {
            return { highScore: s.highScore, bestStars: s.bestStars };
        }
        return best;
    }, null);

    return (
        <Card
            title={game.name}
            description={game.description}
            icon={game.icon}
            scoreBadge={bestScore ? `⭐ ${bestScore.highScore}` : undefined}
            starCount={bestScore?.bestStars}
            onClick={() => navigate(`/game/${game.id}`)}
        />
    );
}

export function HomePage() {
    const games = gameRegistry.getAll();

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
                padding: spacing.lg,
                maxWidth: '600px',
                margin: '0 auto',
                width: '100%',
            }}
        >
            <header
                style={{
                    textAlign: 'center',
                    marginBottom: spacing.xl,
                    paddingTop: spacing.lg,
                }}
            >
                <h1
                    style={{
                        fontSize: typography.fontSize.xxxl,
                        fontWeight: typography.fontWeight.extraBold,
                        color: colors.primary,
                        margin: 0,
                    }}
                >
                    Madu Games
                </h1>
                <p
                    style={{
                        fontSize: typography.fontSize.md,
                        color: colors.textSecondary,
                        marginTop: spacing.sm,
                    }}
                >
                    Escolha um jogo para começar! 🎮
                </p>
            </header>

            <motion.div
                variants={staggerChildren}
                initial="initial"
                animate="animate"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: spacing.lg,
                    paddingBottom: spacing.xxl,
                }}
            >
                {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </motion.div>
        </motion.div>
    );
}
