import { colors, typography } from '../../../design-system/tokens';
import { wordHighlightColors } from '../../../design-system/tokens';
import type { PlacedClue } from '../logic/puzzle-generator';

interface FilledCell {
    letter: string;
    isHint: boolean;
}

interface CompletedWordInfo {
    colorIndex: number;
    completedOrder: number;
}

interface CrosswordGridProps {
    gridSize: number;
    placedClues: PlacedClue[];
    filledLetters: Map<string, FilledCell>;
    activeClue: PlacedClue | null;
    selectedCell: { row: number; col: number } | null;
    completedWords: Map<string, CompletedWordInfo>;
    onCellClick: (row: number, col: number) => void;
}

export function CrosswordGrid({
    gridSize,
    placedClues,
    filledLetters,
    activeClue,
    selectedCell,
    completedWords,
    onCellClick,
}: CrosswordGridProps) {
    const cellKey = (r: number, c: number) => `${r},${c}`;

    // Build a set of cells that belong to placed words
    const wordCells = new Set<string>();
    const cellNumbers = new Map<string, number>();

    // Map cells to which completed words they belong to (for coloring)
    const cellCompletedWord = new Map<string, CompletedWordInfo>();

    placedClues.forEach((clue) => {
        const dr = clue.direction === 'down' ? 1 : 0;
        const dc = clue.direction === 'across' ? 1 : 0;
        const wordInfo = completedWords.get(clue.normalizedWord);

        for (let i = 0; i < clue.normalizedWord.length; i++) {
            const key = cellKey(clue.startRow + i * dr, clue.startCol + i * dc);
            wordCells.add(key);

            if (wordInfo) {
                const existing = cellCompletedWord.get(key);
                // For intersections, pick the most recently completed word
                if (!existing || wordInfo.completedOrder > existing.completedOrder) {
                    cellCompletedWord.set(key, wordInfo);
                }
            }
        }
        const startKey = cellKey(clue.startRow, clue.startCol);
        if (!cellNumbers.has(startKey)) {
            cellNumbers.set(startKey, clue.number);
        }
    });

    // Active clue cells
    const activeCells = new Set<string>();
    if (activeClue) {
        const dr = activeClue.direction === 'down' ? 1 : 0;
        const dc = activeClue.direction === 'across' ? 1 : 0;
        for (let i = 0; i < activeClue.normalizedWord.length; i++) {
            activeCells.add(cellKey(activeClue.startRow + i * dr, activeClue.startCol + i * dc));
        }
    }

    const cellSizePx = Math.min(36, Math.floor(320 / gridSize));

    // Find bounding box of word cells to render only that area
    let minR = gridSize, maxR = 0, minC = gridSize, maxC = 0;
    wordCells.forEach((key) => {
        const [r, c] = key.split(',').map(Number);
        if (r! < minR) minR = r!;
        if (r! > maxR) maxR = r!;
        if (c! < minC) minC = c!;
        if (c! > maxC) maxC = c!;
    });

    const renderRows = maxR - minR + 1;
    const renderCols = maxC - minC + 1;

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${renderCols}, ${cellSizePx}px)`,
                gridTemplateRows: `repeat(${renderRows}, ${cellSizePx}px)`,
                gap: '1px',
            }}
        >
            {Array.from({ length: renderRows }, (_, ri) =>
                Array.from({ length: renderCols }, (_, ci) => {
                    const r = minR + ri;
                    const c = minC + ci;
                    const key = cellKey(r, c);
                    const isWordCell = wordCells.has(key);
                    const number = cellNumbers.get(key);
                    const isActive = activeCells.has(key);
                    const isSelected = selectedCell?.row === r && selectedCell?.col === c;
                    const filledCell = filledLetters.get(key);
                    const completedInfo = cellCompletedWord.get(key);

                    if (!isWordCell) {
                        return <div key={key} style={{ width: cellSizePx, height: cellSizePx }} />;
                    }

                    // Determine background color
                    let bgColor: string = colors.surface;
                    if (isSelected) {
                        bgColor = `${colors.primary}40`;
                    } else if (completedInfo) {
                        bgColor = wordHighlightColors[completedInfo.colorIndex] ?? colors.surface;
                    } else if (isActive) {
                        bgColor = `${colors.primary}15`;
                    }

                    return (
                        <div
                            key={key}
                            onClick={() => onCellClick(r, c)}
                            style={{
                                width: cellSizePx,
                                height: cellSizePx,
                                backgroundColor: bgColor,
                                border: isSelected
                                    ? `2px solid ${colors.primary}`
                                    : `1px solid ${colors.border}`,
                                borderRadius: '2px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                cursor: 'pointer',
                                fontSize: Math.max(12, cellSizePx * 0.5),
                                fontWeight: typography.fontWeight.bold,
                                color: filledCell?.isHint
                                    ? colors.primary
                                    : filledCell
                                        ? colors.textPrimary
                                        : colors.textSecondary,
                                fontStyle: filledCell?.isHint ? 'italic' : 'normal',
                            }}
                        >
                            {number && (
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: 1,
                                        left: 2,
                                        fontSize: '8px',
                                        color: colors.textSecondary,
                                        fontWeight: typography.fontWeight.normal,
                                    }}
                                >
                                    {number}
                                </span>
                            )}
                            {filledCell?.letter || ''}
                        </div>
                    );
                }),
            )}
        </div>
    );
}
