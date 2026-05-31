# Feature Specification: Found Words Highlighting

**Feature Branch**: `003-found-words-highlighting`

**Created**: 2026-05-31

**Status**: Draft

**Input**: User description: "1 - Cruzadinha: destacar com a mesma cor cada palavra encontrada. 2 - Caça-palavras: destacar com cores diferentes para cada palavra encontrada."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Word Search Multi-Color Highlighting (Priority: P1)

As a player of Word Search (Caça-Palavras), I want each found word to be highlighted with a distinct color so that I can easily see which cells belong to which word, especially at intersections or adjacent words.

**Why this priority**: Word Search is a visually dense game where multiple found words can share or neighbor cells. Using different colors for each word significantly improves the player's ability to distinguish individual words and track their progress.

**Independent Test**: Can be fully tested by finding 3+ words in a Word Search game and verifying each word displays in a unique color. Delivers immediate visual clarity value.

**Acceptance Scenarios**:

1. **Given** a Word Search game is in progress, **When** the player finds the first word, **Then** the word's cells are highlighted with the first color from the highlight palette.
2. **Given** a Word Search game has 2 found words, **When** the player finds a third word, **Then** the third word is highlighted with a color different from the first two.
3. **Given** a Word Search game where two found words share a cell (intersection), **When** both words are found, **Then** the shared cell displays the color of the most recently found word.
4. **Given** a Word Search game with all words found, **When** the player views the grid, **Then** each word is visually distinguishable from its neighbors by color.
5. **Given** a Word Search game where the number of found words exceeds the available colors in the palette, **When** additional words are found, **Then** colors cycle back to the beginning of the palette.

---

### User Story 2 - Crossword Uniform Highlighting (Priority: P2)

As a player of Crossword (Cruzadinha), I want all completed words to be highlighted with the same consistent color so that the visual feedback is clean and non-distracting, allowing me to focus on the remaining unsolved clues.

**Why this priority**: The Crossword game's structure already provides clear word boundaries through the grid layout and clue numbering. Multiple colors add visual noise without aiding comprehension. A single uniform color provides a cleaner indication of progress.

**Independent Test**: Can be fully tested by completing 3+ words in a Crossword game and verifying all completed cells share the same highlight color. Delivers a cleaner visual experience.

**Acceptance Scenarios**:

1. **Given** a Crossword game is in progress, **When** the player completes the first word, **Then** the word's cells are highlighted with the standard completion color.
2. **Given** a Crossword game has 2 completed words, **When** the player completes a third word, **Then** the third word is highlighted with the same color as the first two.
3. **Given** a Crossword game where two completed words share a cell (intersection), **When** both words are completed, **Then** the shared cell displays the same uniform completion color as all other completed cells.
4. **Given** a Crossword game with all words completed, **When** the player views the grid, **Then** all completed cells share the same highlight color, providing a uniform visual.

---

### Edge Cases

- What happens when a Word Search word overlaps with a previously found word at one or more cells? The shared cell takes the color of the most recently found word.
- How does the Word Search word list component reflect the per-word color? Each word in the list should display its corresponding highlight color as a visual indicator (e.g., colored dot or text color).
- What happens in Crossword when a hint fills a cell that belongs to an already-completed word? The cell retains the uniform completion color.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: In Word Search, each found word MUST be highlighted with a unique color from a predefined palette of visually distinct colors.
- **FR-002**: In Word Search, when the number of found words exceeds the palette size, colors MUST cycle back to the start of the palette.
- **FR-003**: In Word Search, when two found words share a cell, the cell MUST display the color of the most recently found word.
- **FR-004**: In Word Search, the word list MUST display a color indicator matching each found word's highlight color.
- **FR-005**: In Crossword, all completed word cells MUST be highlighted with a single uniform color.
- **FR-006**: In Crossword, the completion color MUST be consistent regardless of the order in which words are completed.
- **FR-007**: The highlight colors MUST be accessible and distinguishable against the game grid background.

### Key Entities

- **Highlight Palette**: An ordered set of visually distinct colors used to differentiate found words in Word Search. Colors cycle when exhausted.
- **Found Word Color Map**: Associates each found word with its assigned color index based on discovery order.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In Word Search, players can visually identify which cells belong to each found word without ambiguity when 3+ words are found.
- **SC-002**: In Crossword, all completed cells display a single consistent color across the entire game session.
- **SC-003**: 100% of highlight colors are distinguishable from the grid background and from the selection/active state colors.
- **SC-004**: Word Search word list entries display their assigned color indicator for 100% of found words.

## Assumptions

- The existing `wordHighlightColors` palette in the design system provides sufficient visually distinct colors for Word Search (currently 10 colors, which is adequate for typical round sizes).
- The uniform completion color for Crossword will use the existing success color from the design system tokens.
- No changes are needed to the game scoring, hint system, or round completion logic — only visual presentation changes.
- Touch/pointer interaction behavior remains unchanged; only the color rendering of found/completed cells is affected.
