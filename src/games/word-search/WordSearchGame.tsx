import { useState, useCallback, useRef } from 'react';
import type { GameProps } from '../../core/registry/types';
import { generateGrid } from './logic/grid-generator';
import { validateWord } from './logic/word-validator';
import { WordList } from './components/WordList';
import { colors, spacing, typography, radii } from '../../design-system/tokens';
import wordsEasy from './data/words-easy.json';
import wordsMedium from './data/words-medium.json';
import wordsHard from './data/words-hard.json';

const WORD_LISTS = {
    easy: wordsEasy,
    medium: wordsMedium,
    hard: wordsHard,
} as const;

interface CellCoord {
    row: number;
    col: number;
}

export default function WordSearchGame({
    difficulty,
    roundSize,
    onCorrectItem,
    onRoundComplete,
}: GameProps) {
    const words = WORD_LISTS[difficulty];

    const [{ grid, placedWords, gridSize }] = useState(() => generateGrid(words as string[], roundSize));
    const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
    const [selectedCells, setSelectedCells] = useState<CellCoord[]>([]);
    const [isSelecting, setIsSelecting] = useState(false);
    const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
    const gridRef = useRef<HTMLDivElement>(null);

    const cellKey = (row: number, col: number) => `${row},${col}`;

    const getCellFromPoint = useCallback(
        (clientX: number, clientY: number): CellCoord | null => {
            if (!gridRef.current) return null;
            const rect = gridRef.current.getBoundingClientRect();
            const cellSize = rect.width / gridSize;
            const col = Math.floor((clientX - rect.left) / cellSize);
            const row = Math.floor((clientY - rect.top) / cellSize);
            if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
                return { row, col };
            }
            return null;
        },
        [gridSize],
    );

    const handlePointerDown = useCallback(
        (e: React.PointerEvent) => {
            e.preventDefault();
            const cell = getCellFromPoint(e.clientX, e.clientY);
            if (cell) {
                setIsSelecting(true);
                setSelectedCells([cell]);
                (e.target as HTMLElement).setPointerCapture(e.pointerId);
            }
        },
        [getCellFromPoint],
    );

    const handlePointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!isSelecting) return;
            const cell = getCellFromPoint(e.clientX, e.clientY);
            if (cell) {
                setSelectedCells((prev) => {
                    const lastCell = prev[prev.length - 1];
                    if (lastCell && lastCell.row === cell.row && lastCell.col === cell.col) {
                        return prev;
                    }
                    // Check if going back
                    if (prev.length >= 2) {
                        const secondLast = prev[prev.length - 2];
                        if (secondLast && secondLast.row === cell.row && secondLast.col === cell.col) {
                            return prev.slice(0, -1);
                        }
                    }
                    return [...prev, cell];
                });
            }
        },
        [isSelecting, getCellFromPoint],
    );

    const handlePointerUp = useCallback(() => {
        if (!isSelecting) return;
        setIsSelecting(false);

        const match = validateWord(selectedCells, placedWords, foundWords);
        if (match) {
            const newFound = new Set(foundWords);
            newFound.add(match.normalizedWord);
            setFoundWords(newFound);
            setFoundCells((prev) => {
                const next = new Set(prev);
                match.cells.forEach((c) => next.add(cellKey(c.row, c.col)));
                return next;
            });
            onCorrectItem();

            if (newFound.size === placedWords.length) {
                onRoundComplete({
                    totalItems: placedWords.length,
                    correctItems: newFound.size,
                });
            }
        }

        setSelectedCells([]);
    }, [isSelecting, selectedCells, placedWords, foundWords, onCorrectItem, onRoundComplete]);

    const selectedSet = new Set(selectedCells.map((c) => cellKey(c.row, c.col)));
    const cellSizePx = Math.min(40, Math.floor(320 / gridSize));

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing.md,
                width: '100%',
                maxWidth: '480px',
                touchAction: 'none',
            }}
        >
            <WordList
                words={placedWords.map((w) => ({
                    word: w.word,
                    normalizedWord: w.normalizedWord,
                }))}
                foundWords={foundWords}
            />

            <div
                ref={gridRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridSize}, ${cellSizePx}px)`,
                    gridTemplateRows: `repeat(${gridSize}, ${cellSizePx}px)`,
                    gap: '2px',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                }}
            >
                {grid.map((row, r) =>
                    row.map((letter, c) => {
                        const key = cellKey(r, c);
                        const isSelected = selectedSet.has(key);
                        const isFoundCell = foundCells.has(key);

                        return (
                            <div
                                key={key}
                                style={{
                                    width: cellSizePx,
                                    height: cellSizePx,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: isFoundCell
                                        ? `${colors.success}30`
                                        : isSelected
                                            ? `${colors.primary}30`
                                            : colors.surface,
                                    borderRadius: radii.sm,
                                    fontSize: Math.max(12, cellSizePx * 0.5),
                                    fontWeight: typography.fontWeight.bold,
                                    color: isFoundCell
                                        ? colors.success
                                        : isSelected
                                            ? colors.primary
                                            : colors.textPrimary,
                                    border: isSelected
                                        ? `2px solid ${colors.primary}`
                                        : `1px solid ${colors.border}`,
                                    transition: 'background-color 0.1s, color 0.1s',
                                }}
                            >
                                {letter}
                            </div>
                        );
                    }),
                )}
            </div>

            <p style={{ fontSize: typography.fontSize.sm, color: colors.textSecondary }}>
                {foundWords.size} / {placedWords.length} palavras encontradas
            </p>
        </div>
    );
}
