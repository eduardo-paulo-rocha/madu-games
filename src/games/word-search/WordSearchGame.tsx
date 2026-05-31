import { useState, useCallback, useRef } from 'react';
import type { GameProps } from '../../core/registry/types';
import { generateGrid } from './logic/grid-generator';
import { validateWord } from './logic/word-validator';
import { useHint } from '../../core/hooks/use-hint';
import { WordList } from './components/WordList';
import { HintButton } from '../../design-system/components/HintButton';
import { HintPenaltyToast } from '../../design-system/components/HintPenaltyToast';
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
    const [hintedWordCells, setHintedWordCells] = useState<Map<string, CellCoord>>(new Map());
    const gridRef = useRef<HTMLDivElement>(null);
    const startCellRef = useRef<CellCoord | null>(null);

    const cellKey = (row: number, col: number) => `${row},${col}`;

    const onHintCallback = useCallback((): boolean => {
        const unhintedUnfound = placedWords.filter(
            (w) => !foundWords.has(w.normalizedWord) && !hintedWordCells.has(w.normalizedWord),
        );
        if (unhintedUnfound.length === 0) return false;
        const target = unhintedUnfound[Math.floor(Math.random() * unhintedUnfound.length)]!;
        const firstCell: CellCoord = { row: target.cells[0]!.row, col: target.cells[0]!.col };
        setHintedWordCells((prev) => new Map(prev).set(target.normalizedWord, firstCell));
        return true;
    }, [placedWords, foundWords, hintedWordCells]);

    const isHintDisabled =
        foundWords.size === placedWords.length ||
        placedWords.every(
            (w) => foundWords.has(w.normalizedWord) || hintedWordCells.has(w.normalizedWord),
        );

    const { hintCount, triggerHint, showPenalty, isHintDisabled: hintDisabled } = useHint({
        onHint: onHintCallback,
        isDisabled: isHintDisabled,
    });

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
                startCellRef.current = cell;
                (e.target as HTMLElement).setPointerCapture(e.pointerId);
            }
        },
        [getCellFromPoint],
    );

    const handlePointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!isSelecting || !startCellRef.current) return;
            const cell = getCellFromPoint(e.clientX, e.clientY);
            if (!cell) return;

            const start = startCellRef.current;
            if (start.row === cell.row && start.col === cell.col) {
                setSelectedCells([start]);
                return;
            }

            const rowDiff = cell.row - start.row;
            const colDiff = cell.col - start.col;
            const rowDist = Math.abs(rowDiff);
            const colDist = Math.abs(colDiff);

            let dr: number, dc: number, steps: number;

            if (colDist === 0) {
                // Vertical
                dr = Math.sign(rowDiff); dc = 0; steps = rowDist;
            } else if (rowDist === 0) {
                // Horizontal
                dr = 0; dc = Math.sign(colDiff); steps = colDist;
            } else {
                // Determine if intent is diagonal or axis-aligned
                const ratio = Math.min(rowDist, colDist) / Math.max(rowDist, colDist);
                if (ratio < 0.5) {
                    // Snap to horizontal or vertical
                    if (rowDist > colDist) {
                        dr = Math.sign(rowDiff); dc = 0; steps = rowDist;
                    } else {
                        dr = 0; dc = Math.sign(colDiff); steps = colDist;
                    }
                } else {
                    // Snap to diagonal
                    dr = Math.sign(rowDiff);
                    dc = Math.sign(colDiff);
                    steps = Math.max(rowDist, colDist);
                }
            }

            const cells: CellCoord[] = [];
            for (let i = 0; i <= steps; i++) {
                const r = start.row + i * dr;
                const c = start.col + i * dc;
                if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
                    cells.push({ row: r, col: c });
                } else {
                    break;
                }
            }

            setSelectedCells(cells);
        },
        [isSelecting, getCellFromPoint, gridSize],
    );

    const handlePointerUp = useCallback(() => {
        if (!isSelecting) return;
        setIsSelecting(false);
        startCellRef.current = null;

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
            // Clear hint highlight for this word
            if (hintedWordCells.has(match.normalizedWord)) {
                setHintedWordCells((prev) => {
                    const next = new Map(prev);
                    next.delete(match.normalizedWord);
                    return next;
                });
            }
            onCorrectItem();

            if (newFound.size === placedWords.length) {
                onRoundComplete({
                    totalItems: placedWords.length,
                    correctItems: newFound.size,
                    hintCount,
                });
            }
        }

        setSelectedCells([]);
    }, [isSelecting, selectedCells, placedWords, foundWords, onCorrectItem, onRoundComplete]);

    const selectedSet = new Set(selectedCells.map((c) => cellKey(c.row, c.col)));
    const hintedCellSet = new Set(
        Array.from(hintedWordCells.values()).map((c) => cellKey(c.row, c.col)),
    );
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
            <HintPenaltyToast visible={showPenalty} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <HintButton onClick={triggerHint} disabled={hintDisabled} />
            </div>

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
                        const isHintedCell = hintedCellSet.has(key);

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
                                            : isHintedCell
                                                ? `${colors.accent}20`
                                                : colors.surface,
                                    borderRadius: radii.sm,
                                    fontSize: Math.max(12, cellSizePx * 0.5),
                                    fontWeight: typography.fontWeight.bold,
                                    color: isFoundCell
                                        ? colors.success
                                        : isSelected
                                            ? colors.primary
                                            : colors.textPrimary,
                                    border: isHintedCell
                                        ? `2px solid ${colors.accent}`
                                        : isSelected
                                            ? `2px solid ${colors.primary}`
                                            : `1px solid ${colors.border}`,
                                    transition: 'background-color 0.1s, color 0.1s',
                                    animation: isHintedCell ? 'hintPulse 1.5s ease-in-out infinite' : undefined,
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
