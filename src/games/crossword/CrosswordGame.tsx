import { useState, useCallback, useRef, useEffect } from 'react';
import type { GameProps } from '../../core/registry/types';
import { generatePuzzle, type PlacedClue } from './logic/puzzle-generator';
import { normalizeText } from '../../core/text/normalize';
import { useHint } from '../../core/hooks/use-hint';
import { CrosswordGrid } from './components/CrosswordGrid';
import { ClueList } from './components/ClueList';
import { Keyboard } from '../../design-system/components/Keyboard';
import { HintButton } from '../../design-system/components/HintButton';
import { HintPenaltyToast } from '../../design-system/components/HintPenaltyToast';
import { usePhysicalKeyboard } from '../../core/hooks/use-physical-keyboard';
import { spacing, typography, colors, radii } from '../../design-system/tokens';
import cluesEasy from './data/clues-easy.json';
import cluesMedium from './data/clues-medium.json';
import cluesHard from './data/clues-hard.json';

const CLUE_LISTS = {
    easy: cluesEasy,
    medium: cluesMedium,
    hard: cluesHard,
} as const;

interface FilledCell {
    letter: string;
    isHint: boolean;
}

interface CompletedWordInfo {
    colorIndex: number;
    completedOrder: number;
}

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

    const [filledLetters, setFilledLetters] = useState<Map<string, FilledCell>>(new Map());
    const [activeClue, setActiveClue] = useState<PlacedClue | null>(puzzle.placedClues[0] ?? null);
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(
        puzzle.placedClues[0]
            ? { row: puzzle.placedClues[0].startRow, col: puzzle.placedClues[0].startCol }
            : null,
    );
    const [completedWords, setCompletedWords] = useState<Map<string, CompletedWordInfo>>(new Map());
    const [completionCounter, setCompletionCounter] = useState(0);
    const [showKeyboard, setShowKeyboard] = useState(true);
    const hintCountRef = useRef(0);

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
        (clue: PlacedClue, letters: Map<string, FilledCell>) => {
            const dr = clue.direction === 'down' ? 1 : 0;
            const dc = clue.direction === 'across' ? 1 : 0;

            let word = '';
            for (let i = 0; i < clue.normalizedWord.length; i++) {
                const key = cellKey(clue.startRow + i * dr, clue.startCol + i * dc);
                const cell = letters.get(key);
                if (!cell) return false;
                word += cell.letter;
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

    const handleWordCompletion = useCallback(
        (newLetters: Map<string, FilledCell>, currentHintCount: number) => {
            // Check all clues for completion
            const newCompleted = new Map(completedWords);
            let counter = completionCounter;
            let anyNewCompletion = false;

            for (const clue of puzzle.placedClues) {
                if (newCompleted.has(clue.normalizedWord)) continue;
                if (checkWordCompletion(clue, newLetters)) {
                    counter++;
                    newCompleted.set(clue.normalizedWord, {
                        colorIndex: (newCompleted.size) % 10,
                        completedOrder: counter,
                    });
                    anyNewCompletion = true;
                    onCorrectItem();
                }
            }

            if (anyNewCompletion) {
                setCompletedWords(newCompleted);
                setCompletionCounter(counter);

                if (newCompleted.size === puzzle.placedClues.length) {
                    onRoundComplete({
                        totalItems: puzzle.placedClues.length,
                        correctItems: newCompleted.size,
                        hintCount: currentHintCount,
                    });
                }
            }
        },
        [completedWords, completionCounter, puzzle.placedClues, checkWordCompletion, onCorrectItem, onRoundComplete],
    );

    const onHintCallback = useCallback((): boolean => {
        if (!selectedCell || !activeClue) return false;

        const key = cellKey(selectedCell.row, selectedCell.col);
        const existingCell = filledLetters.get(key);

        // Find the correct letter for this cell
        const dr = activeClue.direction === 'down' ? 1 : 0;
        const dc = activeClue.direction === 'across' ? 1 : 0;
        let letterIndex = -1;
        for (let i = 0; i < activeClue.normalizedWord.length; i++) {
            if (
                activeClue.startRow + i * dr === selectedCell.row &&
                activeClue.startCol + i * dc === selectedCell.col
            ) {
                letterIndex = i;
                break;
            }
        }
        if (letterIndex === -1) return false;

        const correctLetter = activeClue.normalizedWord[letterIndex]!;

        // If already correctly filled with hint, skip
        if (existingCell && existingCell.isHint && existingCell.letter === correctLetter) return false;

        const newLetters = new Map(filledLetters);
        newLetters.set(key, { letter: correctLetter, isHint: true });
        setFilledLetters(newLetters);

        // Check word completion with the new letters
        handleWordCompletion(newLetters, hintCountRef.current + 1);
        advanceCell();
        return true;
    }, [selectedCell, activeClue, filledLetters, advanceCell, handleWordCompletion]);

    const isHintDisabled = !selectedCell || !activeClue;

    const { hintCount, triggerHint, showPenalty, isHintDisabled: hintDisabled } = useHint({
        onHint: onHintCallback,
        isDisabled: isHintDisabled,
    });
    useEffect(() => { hintCountRef.current = hintCount; }, [hintCount]);

    const onKeyPress = useCallback(
        (key: string) => {
            if (!selectedCell || !activeClue) return;

            const currentKey = cellKey(selectedCell.row, selectedCell.col);
            const existingCell = filledLetters.get(currentKey);

            // Cannot overwrite hint cells
            if (existingCell?.isHint) {
                advanceCell();
                return;
            }

            const newLetters = new Map(filledLetters);
            newLetters.set(currentKey, { letter: key.toUpperCase(), isHint: false });
            setFilledLetters(newLetters);

            handleWordCompletion(newLetters, hintCount);
            advanceCell();
        },
        [selectedCell, activeClue, filledLetters, advanceCell, handleWordCompletion, hintCount],
    );

    const onBackspace = useCallback(() => {
        if (!selectedCell) return;
        const key = cellKey(selectedCell.row, selectedCell.col);
        const existingCell = filledLetters.get(key);

        // Cannot delete hint cells
        if (existingCell?.isHint) return;

        const newLetters = new Map(filledLetters);

        if (existingCell) {
            newLetters.delete(key);
            setFilledLetters(newLetters);
        } else if (activeClue) {
            // Move back, skipping hint cells
            const dr = activeClue.direction === 'down' ? 1 : 0;
            const dc = activeClue.direction === 'across' ? 1 : 0;
            const prevRow = selectedCell.row - dr;
            const prevCol = selectedCell.col - dc;
            const prevKey = cellKey(prevRow, prevCol);
            const prevCell = filledLetters.get(prevKey);

            if (prevCell?.isHint) return; // Don't delete hint cells

            newLetters.delete(prevKey);
            setFilledLetters(newLetters);
            setSelectedCell({ row: prevRow, col: prevCol });
        }
    }, [selectedCell, activeClue, filledLetters]);

    const onConfirm = useCallback(() => {
        // No-op; words auto-validate
    }, []);

    usePhysicalKeyboard({ onKeyPress, onBackspace, onConfirm });

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
            <HintPenaltyToast visible={showPenalty} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.textSecondary }}>
                    {completedWords.size} / {puzzle.placedClues.length} palavras completas
                </p>
                <HintButton onClick={triggerHint} disabled={hintDisabled} />
            </div>

            <CrosswordGrid
                gridSize={puzzle.gridSize}
                placedClues={puzzle.placedClues}
                filledLetters={filledLetters}
                activeClue={activeClue}
                selectedCell={selectedCell}
                completedWords={completedWords}
                onCellClick={onCellClick}
            />

            <ClueList
                clues={puzzle.placedClues}
                activeClue={activeClue}
                completedWords={completedWords}
                onClueClick={onClueClick}
            />

            <button
                onClick={() => setShowKeyboard((v) => !v)}
                style={{
                    background: 'none',
                    border: `1px solid ${colors.border}`,
                    borderRadius: radii.sm,
                    padding: `${spacing.xs} ${spacing.sm}`,
                    fontSize: typography.fontSize.sm,
                    color: colors.textSecondary,
                    cursor: 'pointer',
                    fontFamily: typography.fontFamily,
                }}
            >
                {showKeyboard ? '⌨️ Ocultar teclado' : '⌨️ Mostrar teclado'}
            </button>

            {showKeyboard && (
                <Keyboard onKeyPress={onKeyPress} onBackspace={onBackspace} onConfirm={onConfirm} />
            )}
        </div>
    );
}
