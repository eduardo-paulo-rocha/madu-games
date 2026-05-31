import { useState, useCallback } from 'react';
import type { GameProps } from '../../core/registry/types';
import { generatePuzzle, type PlacedClue } from './logic/puzzle-generator';
import { normalizeText } from '../../core/text/normalize';
import { CrosswordGrid } from './components/CrosswordGrid';
import { ClueList } from './components/ClueList';
import { Keyboard } from '../../design-system/components/Keyboard';
import { spacing, typography, colors } from '../../design-system/tokens';
import cluesEasy from './data/clues-easy.json';
import cluesMedium from './data/clues-medium.json';
import cluesHard from './data/clues-hard.json';

const CLUE_LISTS = {
    easy: cluesEasy,
    medium: cluesMedium,
    hard: cluesHard,
} as const;

export default function CrosswordGame({
    difficulty,
    roundSize,
    onCorrectItem,
    onRoundComplete,
}: GameProps) {
    const clues = CLUE_LISTS[difficulty];
    const [puzzle] = useState(() =>
        generatePuzzle(clues as { word: string; clue: string }[], roundSize),
    );

    const [filledLetters, setFilledLetters] = useState<Map<string, string>>(new Map());
    const [activeClue, setActiveClue] = useState<PlacedClue | null>(puzzle.placedClues[0] ?? null);
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(
        puzzle.placedClues[0]
            ? { row: puzzle.placedClues[0].startRow, col: puzzle.placedClues[0].startCol }
            : null,
    );
    const [completedWords, setCompletedWords] = useState<Set<string>>(new Set());

    const cellKey = (r: number, c: number) => `${r},${c}`;

    const findClueForCell = useCallback(
        (row: number, col: number): PlacedClue | null => {
            for (const clue of puzzle.placedClues) {
                const dr = clue.direction === 'down' ? 1 : 0;
                const dc = clue.direction === 'across' ? 1 : 0;
                for (let i = 0; i < clue.normalizedWord.length; i++) {
                    if (clue.startRow + i * dr === row && clue.startCol + i * dc === col) {
                        return clue;
                    }
                }
            }
            return null;
        },
        [puzzle.placedClues],
    );

    const onCellClick = useCallback(
        (row: number, col: number) => {
            setSelectedCell({ row, col });
            const clue = findClueForCell(row, col);
            if (clue) setActiveClue(clue);
        },
        [findClueForCell],
    );

    const onClueClick = useCallback((clue: PlacedClue) => {
        setActiveClue(clue);
        setSelectedCell({ row: clue.startRow, col: clue.startCol });
    }, []);

    const checkWordCompletion = useCallback(
        (clue: PlacedClue, letters: Map<string, string>) => {
            const dr = clue.direction === 'down' ? 1 : 0;
            const dc = clue.direction === 'across' ? 1 : 0;

            let word = '';
            for (let i = 0; i < clue.normalizedWord.length; i++) {
                const key = cellKey(clue.startRow + i * dr, clue.startCol + i * dc);
                const letter = letters.get(key);
                if (!letter) return false;
                word += letter;
            }

            return normalizeText(word).toUpperCase() === clue.normalizedWord;
        },
        [],
    );

    const advanceCell = useCallback(() => {
        if (!selectedCell || !activeClue) return;
        const dr = activeClue.direction === 'down' ? 1 : 0;
        const dc = activeClue.direction === 'across' ? 1 : 0;
        setSelectedCell({
            row: selectedCell.row + dr,
            col: selectedCell.col + dc,
        });
    }, [selectedCell, activeClue]);

    const onKeyPress = useCallback(
        (key: string) => {
            if (!selectedCell || !activeClue) return;

            const newLetters = new Map(filledLetters);
            newLetters.set(cellKey(selectedCell.row, selectedCell.col), key.toUpperCase());
            setFilledLetters(newLetters);

            // Check if word is complete
            if (checkWordCompletion(activeClue, newLetters)) {
                const newCompleted = new Set(completedWords);
                if (!newCompleted.has(activeClue.normalizedWord)) {
                    newCompleted.add(activeClue.normalizedWord);
                    setCompletedWords(newCompleted);
                    onCorrectItem();

                    if (newCompleted.size === puzzle.placedClues.length) {
                        onRoundComplete({
                            totalItems: puzzle.placedClues.length,
                            correctItems: newCompleted.size,
                        });
                        return;
                    }
                }
            }

            advanceCell();
        },
        [
            selectedCell,
            activeClue,
            filledLetters,
            completedWords,
            checkWordCompletion,
            onCorrectItem,
            onRoundComplete,
            puzzle.placedClues,
            advanceCell,
        ],
    );

    const onBackspace = useCallback(() => {
        if (!selectedCell) return;
        const key = cellKey(selectedCell.row, selectedCell.col);
        const newLetters = new Map(filledLetters);

        if (newLetters.has(key)) {
            newLetters.delete(key);
            setFilledLetters(newLetters);
        } else if (activeClue) {
            // Move back
            const dr = activeClue.direction === 'down' ? 1 : 0;
            const dc = activeClue.direction === 'across' ? 1 : 0;
            const prevKey = cellKey(selectedCell.row - dr, selectedCell.col - dc);
            newLetters.delete(prevKey);
            setFilledLetters(newLetters);
            setSelectedCell({
                row: selectedCell.row - dr,
                col: selectedCell.col - dc,
            });
        }
    }, [selectedCell, activeClue, filledLetters]);

    const onConfirm = useCallback(() => {
        // No-op; words auto-validate
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing.md,
                width: '100%',
                maxWidth: '480px',
            }}
        >
            <p style={{ fontSize: typography.fontSize.sm, color: colors.textSecondary }}>
                {completedWords.size} / {puzzle.placedClues.length} palavras completas
            </p>

            <CrosswordGrid
                gridSize={puzzle.gridSize}
                placedClues={puzzle.placedClues}
                filledLetters={filledLetters}
                activeClue={activeClue}
                selectedCell={selectedCell}
                onCellClick={onCellClick}
            />

            <ClueList
                clues={puzzle.placedClues}
                activeClue={activeClue}
                completedWords={completedWords}
                onClueClick={onClueClick}
            />

            <Keyboard onKeyPress={onKeyPress} onBackspace={onBackspace} onConfirm={onConfirm} />
        </div>
    );
}
