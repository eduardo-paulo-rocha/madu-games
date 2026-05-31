# Feature Specification: Game Hints & Word Highlights

**Feature Branch**: `002-game-hints-highlights`

**Created**: 2026-05-31

**Status**: Draft

**Input**: User description: "Melhorias nos jogos: 1) Mecanismo de dicas (Caça-palavras: destaca primeira letra; Cruzadinha e Emoji Guess: revela letra na posição selecionada; penalidade de 5 pontos por dica com feedback visual). 2) Cruzadinha: destacar com cores diferentes para cada palavra encontrada."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Hint Usage in Word Search (Priority: P1)

As a player in the Word Search game, I want to use a hint that highlights the first letter of a word I haven't found yet, so I can get unstuck when I can't locate a word.

**Why this priority**: The hint mechanism is the core feature requested and Word Search is the simplest implementation — it highlights a cell without requiring selection context.

**Independent Test**: Can be tested by starting a Word Search game, tapping the hint button, and verifying a cell is highlighted corresponding to the first letter of an unfound word.

**Acceptance Scenarios**:

1. **Given** a Word Search game is in progress with unfound words, **When** the player taps the hint button, **Then** the first letter of one unfound word is visually highlighted on the grid and the highlight persists until that word is found.
2. **Given** a hint is used, **When** the score is updated, **Then** 5 points are deducted and a notification is displayed to the player showing "-5 points (hint used)".
3. **Given** all words have already been found, **When** the player taps the hint button, **Then** the hint button is disabled or a message indicates no hints are available.
4. **Given** the player's score is less than 5 points, **When** the player taps the hint button, **Then** the hint is still provided and the score can go negative (no blocking).
5. **Given** a hint highlight is visible for a word, **When** the player finds that word, **Then** the hint highlight is removed and replaced by the standard found-word styling.

---

### User Story 2 - Hint Usage in Crossword (Priority: P1)

As a player in the Crossword game, I want to use a hint that reveals the correct letter at my currently selected cell, so I can progress when I'm stuck on a specific position.

**Why this priority**: The Crossword is a core game and the hint mechanism requires integration with the cell selection system, making it a key interaction.

**Independent Test**: Can be tested by starting a Crossword game, selecting an empty cell, tapping the hint button, and verifying the correct letter appears in that cell.

**Acceptance Scenarios**:

1. **Given** a Crossword game is in progress and a cell is selected, **When** the player taps the hint button, **Then** the correct letter for that cell is revealed and locked (cannot be edited).
2. **Given** a hint is used, **When** the score is updated, **Then** 5 points are deducted and a notification is displayed to the player showing "-5 points (hint used)".
3. **Given** no cell is currently selected, **When** the player taps the hint button, **Then** a message prompts the player to select a cell first.
4. **Given** the selected cell already contains the correct letter, **When** the player taps the hint button, **Then** no points are deducted and the player is informed the cell is already correct.

---

### User Story 3 - Hint Usage in Emoji Guess (Priority: P1)

As a player in the Emoji Guess game, I want to use a hint that reveals the next letter in the answer sequentially, so I can get help when I can't figure out the full answer.

**Why this priority**: Completes the hint mechanism across all three games, ensuring consistent UX.

**Independent Test**: Can be tested by starting an Emoji Guess round, tapping the hint button, and verifying the next correct letter is appended to the input.

**Acceptance Scenarios**:

1. **Given** an Emoji Guess round is active, **When** the player taps the hint button, **Then** the correct letter at the next sequential position (current input length) is appended and locked.
2. **Given** a hint is used, **When** the score is updated, **Then** 5 points are deducted and a notification is displayed to the player showing "-5 points (hint used)".
3. **Given** the answer field is empty, **When** the player taps the hint button, **Then** the first letter of the answer is revealed.
4. **Given** all letters have already been revealed via hints, **When** the player taps the hint button, **Then** the hint button is disabled or a message indicates no more hints are available.

---

### User Story 4 - Crossword Found Words Color Coding (Priority: P2)

As a player in the Crossword game, I want each completed word to be highlighted with a distinct color, so I can easily see which words I've already solved and visually track my progress.

**Why this priority**: This is a visual enhancement that improves the game experience but is not blocking gameplay functionality.

**Independent Test**: Can be tested by completing words in a Crossword game and verifying each completed word's cells display a unique background color different from other completed words.

**Acceptance Scenarios**:

1. **Given** a Crossword game is in progress, **When** the player correctly completes a word, **Then** all cells belonging to that word are highlighted with a distinct color.
2. **Given** multiple words have been completed, **When** viewing the grid, **Then** each completed word has a visually different color from other completed words.
3. **Given** a cell belongs to two intersecting words and both are completed, **When** viewing the grid, **Then** the cell displays the color of the most recently completed word.
4. **Given** a word is completed, **When** the color is applied, **Then** the text remains readable against the background color.

---

### User Story 5 - Hint Penalty Feedback (Priority: P1)

As a player, I want to clearly see the point penalty when I use a hint, so I can make informed decisions about whether to use hints.

**Why this priority**: Transparent scoring feedback is essential for user trust and informed gameplay decisions.

**Independent Test**: Can be tested by using a hint in any game and verifying a visible notification appears showing the penalty.

**Acceptance Scenarios**:

1. **Given** a player uses a hint in any game, **When** the hint is activated, **Then** a temporary notification/toast appears showing "-5 points" with a brief animation.
2. **Given** the penalty notification appears, **When** a short time passes (2-3 seconds), **Then** the notification fades away automatically.
3. **Given** the score display is visible, **When** a hint penalty is applied, **Then** the score updates immediately and the change is visually emphasized (e.g., brief color flash or animation on the score).

---

### Edge Cases

- What happens when the player uses multiple hints in rapid succession? Each hint should be processed individually with its own -5 penalty and notification.
- What happens in Word Search when only one unfound word remains and a hint was already given for it? The hint button should be disabled.
- What happens in Crossword when a hint-revealed letter is part of an intersecting word? The letter should count toward both words.
- What happens if the player uses a hint and then submits an incorrect answer (Emoji Guess)? The hint-revealed letters remain visible in the next attempt.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a hint button visible during active gameplay in all three games (Word Search, Crossword, Emoji Guess), positioned next to the score display at the top of the game area.
- **FR-002**: In Word Search, hint MUST highlight the first letter (grid position) of a randomly selected unfound word. The highlight MUST persist until the word is found or the game ends.
- **FR-003**: In Crossword, hint MUST reveal the correct letter at the currently selected cell position.
- **FR-004**: In Emoji Guess, hint MUST reveal the correct letter at the next sequential position (i.e., position equal to current input length), appending it to the existing input.
- **FR-005**: System MUST deduct exactly 5 points from the player's score each time a hint is used, computed centrally by the scoring engine (finalScore = baseScore - hintCount * 5).
- **FR-006**: System MUST display a visible notification to the player indicating the -5 point penalty immediately upon hint usage.
- **FR-007**: Hint-revealed letters in Crossword and Emoji Guess MUST be visually distinguishable from player-typed letters (e.g., different text color or style).
- **FR-008**: Hint-revealed letters MUST be locked and non-editable by the player.
- **FR-009**: In Crossword, each correctly completed word MUST be highlighted with a distinct background color.
- **FR-010**: The color coding system MUST support at least 8 distinct colors to accommodate multiple words in a puzzle.
- **FR-011**: Completed word colors MUST maintain sufficient contrast for text readability.
- **FR-012**: The hint button MUST be disabled when no valid hints are available (all words found in Word Search, all cells filled correctly in Crossword, all letters revealed in Emoji Guess).

### Key Entities

- **Hint**: Represents a single hint usage — associated with a game session, position/word targeted, and point penalty applied.
- **Completed Word (Crossword)**: A word whose all cells are correctly filled — has an assigned display color from the color palette.
- **Color Palette**: A predefined set of visually distinct colors used to differentiate completed words in the Crossword game.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can activate a hint and receive useful information within 1 second of tapping the hint button.
- **SC-002**: The -5 point penalty notification is visible for at least 2 seconds and clearly communicates the deduction.
- **SC-003**: In Word Search, the highlighted first letter correctly corresponds to an unfound word 100% of the time.
- **SC-004**: In Crossword and Emoji Guess, the revealed letter is always the correct answer letter for that position.
- **SC-005**: Completed words in Crossword are visually distinguishable from each other — no two adjacent completed words share the same color.
- **SC-006**: All hint interactions feel responsive — no perceptible delay between button press and visual feedback.
- **SC-007**: Players can complete any game using hints without encountering errors or inconsistent state.

## Clarifications

### Session 2026-05-31

- Q: How should the Emoji Guess hint determine which letter to reveal given the input is sequential (no cursor)? → A: Reveal next sequential letter at current input length position.
- Q: How long should the Word Search hint highlight persist? → A: Persists until the word is found or the game ends.
- Q: How should intersection cell color be determined when both words are completed? → A: Show color of the most recently completed word (last wins).
- Q: Where should the hint button be positioned in the game UI? → A: Next to the score display at the top of the game area.
- Q: Should hint penalties be tracked centrally in the scoring engine or per-game? → A: Centralized — scoring engine receives hint count and computes final score with deductions.

## Assumptions

- The existing scoring engine supports negative scores or scores below zero (no floor constraint).
- Hint deductions are computed centrally by the scoring engine; games report hint count rather than managing their own deduction logic.
- The existing cell selection mechanism in Crossword provides the currently selected cell position.
- The Emoji Guess input is sequential (append-only); hints reveal the next letter in order.
- A fixed palette of 8-10 colors is sufficient for Crossword word highlighting (puzzles don't typically exceed this number of words).
- Hint-revealed letters count toward word completion — there is no separate "fair completion" tracking.
- The hint button is placed next to the score display at the top of the game area, creating a natural association between hints and the point penalty.
- Hints are unlimited in quantity (the only cost is the point penalty).
