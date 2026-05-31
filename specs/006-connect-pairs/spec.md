# Feature Specification: Conecte os Pares

**Feature Branch**: `006-connect-pairs`

**Created**: 2026-05-31

**Status**: Draft

**Input**: User description: "A criança conecta elementos que se relacionam (animal ↔ som, objeto ↔ função, emoji ↔ palavra). Duas colunas: emojis vs palavras ou dois grupos de emojis relacionados. Selecionar um item de cada coluna para formar par. Pares conectados ficam destacados/desabilitados. 4-6 pares por rodada. Categorias variadas. Feedback imediato por par. Pontuação considerando acertos e tentativas."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Match Pairs in a Round (Priority: P1)

As a child player, I want to connect related items from two columns by selecting one from each side, so I can practice association skills and learn relationships between concepts.

**Why this priority**: This is the fundamental gameplay mechanic — matching related items. Without pair matching, the game doesn't function.

**Independent Test**: Can be fully tested by starting a Connect Pairs game, selecting one emoji from the left column and its matching word from the right column, and receiving positive feedback when the pair is correct.

**Acceptance Scenarios**:

1. **Given** a Connect Pairs round starts, **When** the game presents the items, **Then** two columns are displayed — the left with emojis and the right with words (or two groups of related emojis), with 4-6 pairs to match.
2. **Given** both columns are visible, **When** the player selects one item from the left column and one from the right column, **Then** the system checks if they form a correct pair.
3. **Given** the player selects a correct pair, **When** the match is confirmed, **Then** positive feedback is shown (✅/🎉), and both items are visually highlighted and disabled (cannot be selected again).
4. **Given** the player selects an incorrect pair, **When** the mismatch is detected, **Then** error feedback is shown (❌), both selections are cleared, and the player can try again.
5. **Given** a round is in progress, **When** all pairs have been successfully matched, **Then** the round ends and results are displayed.

---

### User Story 2 - Round Results and Scoring (Priority: P1)

As a child player, I want to see my score based on how well I matched pairs (considering accuracy and attempts), so I feel rewarded and motivated to improve.

**Why this priority**: Scoring that reflects both accuracy and efficiency teaches children that careful thinking is valued, which is a core educational goal.

**Independent Test**: Can be tested by completing a round and verifying the results screen shows score, star rating, and attempt count.

**Acceptance Scenarios**:

1. **Given** all pairs in a round are matched, **When** the results screen appears, **Then** the player sees their score, number of attempts, number of correct first-try matches, and a star rating (1-3 stars).
2. **Given** the player matched most pairs on the first attempt, **When** the score is calculated, **Then** the score is higher than if the player needed multiple attempts.
3. **Given** results are displayed, **When** the player wants to play again, **Then** they can start a new round with a different set of pairs.
4. **Given** the player achieves a high score, **When** results are displayed, **Then** a celebration animation plays.

---

### User Story 3 - Difficulty Levels with Varied Categories (Priority: P2)

As a child player (or parent), I want to choose a difficulty level and encounter different thematic categories, so the game stays fresh and appropriately challenging.

**Why this priority**: Variety in categories and difficulty scaling keep the game engaging over time, but the game is fully playable at a default difficulty with a single category.

**Independent Test**: Can be tested by selecting different difficulties and verifying the number of pairs and category complexity change accordingly.

**Acceptance Scenarios**:

1. **Given** the player is about to start a game, **When** the setup screen is shown, **Then** difficulty options are available (easy, medium, hard).
2. **Given** easy difficulty is selected, **When** the round starts, **Then** 4 pairs are presented with simple, direct associations (e.g., animal → animal name).
3. **Given** medium difficulty is selected, **When** the round starts, **Then** 5 pairs are presented with moderately related concepts (e.g., profession → tool).
4. **Given** hard difficulty is selected, **When** the round starts, **Then** 6 pairs are presented with more abstract associations (e.g., food → origin/place).
5. **Given** multiple rounds are played, **When** a new round begins, **Then** the category theme varies from previous rounds (e.g., animals, professions, food).

---

### User Story 4 - Game Selection from Home (Priority: P1)

As a player, I want to find and launch the Connect Pairs game from the home page, so I can easily access it alongside other games.

**Why this priority**: The game must be discoverable in the app to be usable.

**Independent Test**: Can be tested by navigating to the home page and verifying the game card appears and launches correctly.

**Acceptance Scenarios**:

1. **Given** the player is on the home page, **When** viewing available games, **Then** the Connect Pairs game ("Conecte os Pares") appears with a representative icon.
2. **Given** the player taps the game card, **When** the game loads, **Then** the game setup screen (difficulty selection) is displayed.

---

### Edge Cases

- What happens if the player selects two items from the same column? Only one item per column can be selected at a time; selecting a second item in the same column replaces the previous selection.
- What happens if the player exits mid-round? Progress for the incomplete round is not saved.
- What happens if a category has fewer pairs than the difficulty requires? The system should fall back to a category with enough pairs or combine items from related categories.
- What happens if the player taps an already-matched item? Matched items are visually disabled and non-interactive.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display two columns of items — one with emojis and one with words (or two groups of related emojis) — with 4-6 pairs depending on difficulty.
- **FR-002**: System MUST allow the player to select one item from each column to attempt a match. Only one selection per column at a time.
- **FR-003**: System MUST provide immediate visual feedback per pair — positive (✅/🎉) for correct matches and negative (❌) for incorrect matches.
- **FR-004**: Successfully matched pairs MUST be visually highlighted (e.g., color change, checkmark) and disabled from further interaction.
- **FR-005**: System MUST track both correct matches and total attempts to compute a score that rewards accuracy.
- **FR-006**: System MUST display a results screen when all pairs are matched, showing score, attempts, correct first-try matches, and star rating (1-3 stars).
- **FR-007**: System MUST include curated pair sets across multiple thematic categories appropriate for children aged 6-10:
  - Animals and their young/sounds
  - Professions and their tools
  - Food and origin/type
  - Objects and their functions
  - Emoji and corresponding word
- **FR-008**: System MUST support three difficulty levels: easy (4 pairs), medium (5 pairs), hard (6 pairs).
- **FR-009**: System MUST randomize the order of items in both columns to prevent memorization of positions.
- **FR-010**: System MUST register the game in the app's game registry for home page visibility.
- **FR-011**: System MUST track the player's score and persist it through the existing scoring system.
- **FR-012**: Selecting a second item in the same column MUST replace the previous selection (not create a double-selection).

### Key Entities

- **Pair Set**: A collection of 4-6 related pairs belonging to a thematic category. Each pair has a left item (emoji or emoji+text) and a right item (word or emoji).
- **Pair**: Two related items that form a correct match (e.g., 🐄 ↔ "Vaca", 👨‍🍳 ↔ "Panela").
- **Round**: A single play session using one pair set at the selected difficulty level, tracking all match attempts.
- **Round Result**: The player's performance — correct first-try matches, total attempts, score, and star rating.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can complete a round of 4-6 pairs in under 3 minutes.
- **SC-002**: Feedback (correct/incorrect match) is displayed within 0.5 seconds of the player completing a pair selection.
- **SC-003**: 100% of pair sets have unambiguous, clear relationships that children aged 6-10 can understand.
- **SC-004**: The game is accessible from the home page and launches within 2 seconds.
- **SC-005**: Players see their results immediately upon matching all pairs in a round.
- **SC-006**: The game includes at least 5 thematic categories with at least 6 pair sets each, ensuring variety.
- **SC-007**: Scoring accurately reflects both accuracy (correct matches) and efficiency (fewer total attempts = higher score).

## Assumptions

- All pair content is in Brazilian Portuguese, targeting children aged 6-10.
- The existing game registry, scoring engine, and design system components (StarRating, CelebrationAnimation, DifficultySelector) will be reused.
- The two-column layout works well on both mobile (portrait) and desktop viewports. On narrow screens, columns may stack or scroll.
- Emojis used are universally supported and unambiguous for children.
- The game follows the same PWA architecture and plugin pattern as existing games.
- Internet connectivity is not required — pair data is bundled with the app.
- Scoring formula: base points per correct match, with a bonus multiplier for first-try matches and a penalty for excess attempts. Exact formula is an implementation detail.
