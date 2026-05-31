# Feature Specification: Rima com o Quê?

**Feature Branch**: `004-rhyme-game`

**Created**: 2026-05-31

**Status**: Draft

**Input**: User description: "A criança identifica qual palavra rima com a palavra apresentada. Apresentar uma palavra-alvo com 3-4 opções de resposta (texto + emoji). Feedback imediato, progressão por rodadas de 10 palavras, pontuação/estrelas ao final. Banco de palavras com rimas validadas para 6-10 anos."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Play a Rhyme Round (Priority: P1)

As a child player, I want to see a target word and choose which option rhymes with it, so I can practice recognizing rhyming words in a fun and engaging way.

**Why this priority**: This is the core gameplay loop — without it, the game doesn't exist. It delivers immediate educational value by testing rhyme recognition.

**Independent Test**: Can be fully tested by starting a Rhyme Game session, seeing a target word with options, selecting the correct rhyming word, and receiving positive feedback.

**Acceptance Scenarios**:

1. **Given** a Rhyme Game round starts, **When** the game presents a word, **Then** the target word is displayed prominently along with 3-4 answer options, each with text and an illustrative emoji.
2. **Given** answer options are displayed, **When** the player selects the correct rhyming word, **Then** positive feedback is shown (✅/🎉) and the player advances to the next word.
3. **Given** answer options are displayed, **When** the player selects an incorrect option, **Then** error feedback is shown (❌), the correct answer is highlighted, and the player advances to the next word after a brief pause.
4. **Given** a round is in progress, **When** the player answers all 10 words, **Then** the round ends and the player sees their results.

---

### User Story 2 - Round Results and Scoring (Priority: P1)

As a child player, I want to see my score and star rating at the end of a round, so I feel motivated by my performance and want to play again.

**Why this priority**: Scoring and rewards are essential to engagement and replayability — a core requirement for educational games targeting children.

**Independent Test**: Can be tested by completing a full round of 10 words and verifying the results screen shows a score, star rating, and option to play again.

**Acceptance Scenarios**:

1. **Given** a round of 10 words is completed, **When** the results screen appears, **Then** the player sees their total score (correct answers) and a star rating (1-3 stars based on performance).
2. **Given** the results are displayed, **When** the player views the screen, **Then** they see how many answers were correct out of 10.
3. **Given** the results screen is visible, **When** the player wants to play again, **Then** they can start a new round with different words.
4. **Given** the player achieves a high score, **When** the results are displayed, **Then** a celebration animation plays to reward the player.

---

### User Story 3 - Difficulty Levels (Priority: P2)

As a child player (or parent), I want to choose a difficulty level before starting, so the game matches my reading ability and vocabulary level.

**Why this priority**: Difficulty selection ensures the game remains appropriately challenging for the 6-10 age range, but the game is still playable at a default difficulty without this.

**Independent Test**: Can be tested by selecting different difficulty levels and verifying the word complexity changes accordingly.

**Acceptance Scenarios**:

1. **Given** the player is about to start a Rhyme Game, **When** the game setup screen is shown, **Then** difficulty options are available (easy, medium, hard).
2. **Given** easy difficulty is selected, **When** the round starts, **Then** words are simple, common vocabulary with obvious rhyme patterns (e.g., "gato/sapato").
3. **Given** hard difficulty is selected, **When** the round starts, **Then** words have more complex or less obvious rhyme patterns.

---

### User Story 4 - Game Selection from Home (Priority: P1)

As a player, I want to find and launch the Rhyme Game from the home page, so I can easily access it alongside the other games in the app.

**Why this priority**: The game must be discoverable and launchable from the existing app navigation for it to be usable at all.

**Independent Test**: Can be tested by navigating to the home page and verifying the Rhyme Game card appears and launches the game when tapped.

**Acceptance Scenarios**:

1. **Given** the player is on the home page, **When** viewing available games, **Then** the Rhyme Game ("Rima com o Quê?") appears as a game card with a representative icon/emoji.
2. **Given** the player taps the Rhyme Game card, **When** the game loads, **Then** the game setup screen (difficulty selection) is displayed.

---

### Edge Cases

- What happens when the word bank for a difficulty level has fewer than 10 available words in a session? The round should use all available words and end early, displaying results for however many were played.
- What happens if the player exits mid-round? Progress for the incomplete round is not saved; the player starts fresh on return.
- What happens if two options could arguably rhyme with the target? The word bank must be curated to ensure only one unambiguous correct answer per question.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present one target word at a time with 3-4 answer options, where exactly one option rhymes with the target word.
- **FR-002**: Each answer option MUST display both text and an illustrative emoji (e.g., 🐱 gato, 👟 sapato, 🌳 árvore).
- **FR-003**: System MUST provide immediate visual feedback upon selection — positive (✅/🎉) for correct answers and negative (❌) for incorrect answers, with the correct answer highlighted.
- **FR-004**: A standard round MUST consist of 10 words. If fewer words are available, the round uses all available words.
- **FR-005**: System MUST display a results screen at the end of each round showing the number of correct answers and a star rating (1-3 stars).
- **FR-006**: System MUST include a curated word bank with validated rhyming pairs appropriate for children aged 6-10, using simple everyday vocabulary in Portuguese.
- **FR-007**: System MUST support three difficulty levels (easy, medium, hard) with word complexity appropriate to each level.
- **FR-008**: System MUST register the game in the app's game registry so it appears on the home page alongside existing games.
- **FR-009**: System MUST randomize the order of answer options for each question to prevent pattern memorization.
- **FR-010**: System MUST ensure answer options within a question are distinct and unambiguous — only one correct rhyming option per question.
- **FR-011**: System MUST track the player's score and persist it through the existing scoring system.

### Key Entities

- **Rhyme Word Set**: A target word paired with one correct rhyming answer and 2-3 distractor words, each annotated with an emoji. Organized by difficulty level.
- **Round**: A sequence of 10 rhyme questions drawn from the word bank for the selected difficulty level.
- **Round Result**: The player's performance for a completed round — correct count, total count, star rating, and final score.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can complete a full round of 10 rhyme questions in under 5 minutes.
- **SC-002**: Feedback (correct/incorrect) is displayed within 0.5 seconds of the player selecting an answer.
- **SC-003**: 100% of word sets in the bank have exactly one unambiguous correct rhyming answer.
- **SC-004**: The game is accessible from the home page and launches within 2 seconds.
- **SC-005**: Players see their star rating and score immediately upon completing a round.
- **SC-006**: The word bank contains at least 30 word sets per difficulty level, providing variety across multiple rounds.

## Assumptions

- The game targets Portuguese-speaking children aged 6-10, so all words and rhymes are in Brazilian Portuguese.
- The existing game registry, scoring engine, and design system components (StarRating, CelebrationAnimation, DifficultySelector) will be reused.
- Emojis used are from the Unicode standard and render consistently across modern browsers and devices.
- The game follows the same PWA architecture and plugin pattern established by existing games (Word Search, Crossword, Emoji Guess).
- Internet connectivity is not required for gameplay — the word bank is bundled with the app.
- No audio/pronunciation features are included in this version — the game is purely visual/text-based.
