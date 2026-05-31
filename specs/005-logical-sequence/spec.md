# Feature Specification: Sequência Lógica

**Feature Branch**: `005-logical-sequence`

**Created**: 2026-05-31

**Status**: Draft

**Input**: User description: "A criança identifica o próximo elemento que completa uma sequência/padrão de emojis. Apresentar sequência com padrão repetitivo (ex: 🔴🔵🔴🔵❓). Escolher entre 2-3 opções de emoji. Padrões: alternância, repetição, crescimento, cores, categorias. Dificuldade progressiva. Feedback imediato e pontuação/estrelas ao final."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Solve a Pattern Sequence (Priority: P1)

As a child player, I want to see a sequence of emojis with a missing element and choose which emoji completes the pattern, so I can practice logical thinking and pattern recognition.

**Why this priority**: This is the core gameplay mechanic — identifying and completing patterns. Without it, the game has no function.

**Independent Test**: Can be fully tested by starting a Logical Sequence game, viewing a pattern like 🔴🔵🔴🔵❓, selecting the correct emoji (🔴), and receiving positive feedback.

**Acceptance Scenarios**:

1. **Given** a Logical Sequence round starts, **When** a pattern is presented, **Then** the player sees a sequence of emojis with the last element replaced by ❓ and 2-3 answer options below.
2. **Given** a pattern is displayed with answer options, **When** the player selects the correct emoji that completes the pattern, **Then** positive feedback is shown (✅/🎉), the ❓ is replaced with the correct emoji, and the player advances.
3. **Given** a pattern is displayed with answer options, **When** the player selects an incorrect emoji, **Then** error feedback is shown (❌), the correct answer is highlighted, and the player advances after a brief pause.
4. **Given** a round is in progress, **When** the player completes all patterns in the round, **Then** the round ends and results are displayed.

---

### User Story 2 - Round Results and Scoring (Priority: P1)

As a child player, I want to see my score and star rating after completing a round of patterns, so I feel rewarded and motivated to improve.

**Why this priority**: Scoring and progression feedback are essential for engagement in educational games for children.

**Independent Test**: Can be tested by completing a full round and verifying the results screen shows score, star rating, and a play-again option.

**Acceptance Scenarios**:

1. **Given** a round is completed, **When** the results screen appears, **Then** the player sees their total correct answers and a star rating (1-3 stars).
2. **Given** the player performed well, **When** results are displayed, **Then** a celebration animation plays.
3. **Given** the results are visible, **When** the player wants to continue, **Then** they can start a new round with different patterns.

---

### User Story 3 - Progressive Difficulty (Priority: P2)

As a child player (or parent), I want to choose a difficulty level that matches my ability, so the patterns are neither too easy nor too frustrating.

**Why this priority**: Difficulty scaling ensures the game serves the full 6-10 age range effectively, but the game is playable at a default difficulty without this.

**Independent Test**: Can be tested by selecting different difficulties and verifying pattern complexity changes accordingly.

**Acceptance Scenarios**:

1. **Given** the player is about to start a game, **When** the setup screen is shown, **Then** difficulty options are available (easy, medium, hard).
2. **Given** easy difficulty is selected, **When** patterns are generated, **Then** patterns use simple two-element alternation (AB-AB) with 4-5 elements visible.
3. **Given** medium difficulty is selected, **When** patterns are generated, **Then** patterns use three-element cycles (ABC-ABC) or simple growth sequences.
4. **Given** hard difficulty is selected, **When** patterns are generated, **Then** patterns include variations such as nested cycles, growing sequences, or multi-attribute patterns.

---

### User Story 4 - Game Selection from Home (Priority: P1)

As a player, I want to find and launch the Logical Sequence game from the home page, so I can easily access it alongside other games.

**Why this priority**: The game must be discoverable in the app to be usable.

**Independent Test**: Can be tested by navigating to the home page and verifying the game card appears and launches correctly.

**Acceptance Scenarios**:

1. **Given** the player is on the home page, **When** viewing available games, **Then** the Logical Sequence game ("Sequência Lógica") appears as a game card with a representative icon.
2. **Given** the player taps the game card, **When** the game loads, **Then** the game setup screen (difficulty selection) is displayed.

---

### Edge Cases

- What happens if a pattern could have multiple valid completions? Patterns must be constructed so that only one answer is logically correct within the defined pattern rule.
- What happens if the player exits mid-round? Progress for the incomplete round is not saved.
- What happens if the emoji set for a pattern doesn't render on the player's device? Only universally supported Unicode emojis should be used in pattern construction.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present one emoji pattern at a time with the last element replaced by ❓, and display 2-3 answer options.
- **FR-002**: Patterns MUST be constructed using universally recognized Unicode emojis that are clear and identifiable by children aged 6-10.
- **FR-003**: System MUST provide immediate visual feedback upon selection — positive (✅/🎉) for correct answers and negative (❌) for incorrect answers, with the correct answer highlighted.
- **FR-004**: A standard round MUST consist of 10 pattern questions.
- **FR-005**: System MUST display a results screen at the end of each round with correct count and star rating (1-3 stars).
- **FR-006**: System MUST support three difficulty levels with distinct pattern types:
  - Easy: two-element alternation (AB-AB), sequences of 4-5 visible elements
  - Medium: three-element cycles (ABC-ABC) or simple growth, sequences of 5-6 elements
  - Hard: nested patterns, multi-attribute variations, or growth sequences, 6-8 elements
- **FR-007**: System MUST generate patterns algorithmically based on defined pattern rules, ensuring variety across rounds.
- **FR-008**: System MUST ensure exactly one correct answer per pattern — no ambiguous completions.
- **FR-009**: System MUST register the game in the app's game registry for home page visibility.
- **FR-010**: System MUST randomize the position of the correct answer among the options.
- **FR-011**: System MUST track the player's score and persist it through the existing scoring system.

### Key Entities

- **Pattern Rule**: Defines a sequence type (alternation, cycle, growth) with specific emoji sets and the expected completion. Used to generate pattern instances.
- **Pattern Instance**: A concrete sequence of emojis generated from a pattern rule, with the missing element and answer options.
- **Round**: A sequence of 10 pattern questions for the selected difficulty level.
- **Round Result**: The player's performance — correct count, total count, star rating, and final score.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can complete a full round of 10 patterns in under 5 minutes.
- **SC-002**: Feedback (correct/incorrect) is displayed within 0.5 seconds of selection.
- **SC-003**: 100% of generated patterns have exactly one unambiguous correct completion.
- **SC-004**: The game is accessible from the home page and launches within 2 seconds.
- **SC-005**: Players see results immediately upon completing a round.
- **SC-006**: Each difficulty level offers at least 20 distinct pattern variations, preventing repetitive gameplay across multiple rounds.
- **SC-007**: All emojis used render correctly on modern browsers and mobile devices.

## Assumptions

- Patterns use only emoji characters — no text labels needed in the sequence itself.
- The pattern generation algorithm produces sequences deterministically from a defined set of rules, ensuring reproducibility and testability.
- The existing game registry, scoring engine, and design system components (StarRating, CelebrationAnimation, DifficultySelector) will be reused.
- The game follows the same PWA architecture and plugin pattern as existing games.
- Internet connectivity is not required — pattern rules and emoji sets are bundled with the app.
- The game is language-agnostic in its core mechanic (emoji-only patterns), though UI labels are in Portuguese.
