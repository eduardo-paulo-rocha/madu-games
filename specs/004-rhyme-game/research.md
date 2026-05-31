# Research: Rima com o Quê?

**Feature**: 004-rhyme-game | **Date**: 2026-05-31

## R1: Multiple-Choice vs Free-Text Input for Rhyme Game

**Decision**: Multiple-choice (3-4 options with emoji + text)

**Rationale**: The spec explicitly defines the interaction as "3-4 answer options (text + emoji)" — not free-text. This is also superior for the target audience (6-10 year olds) because:
- Eliminates spelling errors that would frustrate young players
- Reduces cognitive load — recognition is easier than recall
- Allows emoji-enhanced options that make the game more engaging
- No need for keyboard/hint infrastructure — simpler implementation
- Immediate selection feedback without "confirm" step

**Alternatives considered**:
- Free-text input (Emoji Guess pattern): Rejected — requires spelling ability, adds hint system complexity, and the spec explicitly calls for multiple-choice
- Drag-and-drop matching: Rejected — more complex interaction model, harder on mobile, not specified

## R2: Word Bank Structure and Curation

**Decision**: Static JSON file (`rhyme-dictionary.json`) with pre-curated word sets organized by difficulty

**Rationale**: Follows the established pattern from `emoji-dictionary.json`. The word bank must guarantee exactly one correct rhyming answer per question (FR-010), which requires manual curation rather than algorithmic generation. Portuguese rhymes depend on phonetic endings, not just orthographic similarity, making automated generation unreliable.

**Data format**:
```json
[
  {
    "target": { "word": "gato", "emoji": "🐱" },
    "correct": { "word": "sapato", "emoji": "👟" },
    "distractors": [
      { "word": "árvore", "emoji": "🌳" },
      { "word": "boneca", "emoji": "🧸" }
    ],
    "difficulty": "easy"
  }
]
```

**Alternatives considered**:
- Runtime rhyme generation via NLP: Rejected — requires external dependency, not offline-capable, unreliable for Portuguese
- Single flat word list with rhyme suffixes: Rejected — doesn't ensure unambiguous single-correct-answer per question

## R3: Feedback Animation Pattern

**Decision**: Reuse framer-motion animation presets from design system; per-option feedback with color transition

**Rationale**: The design system already provides `scaleIn`, `fadeIn`, and `celebrate` presets. Correct answer shows green highlight (✅/🎉), incorrect shows red highlight (❌) with the correct answer revealed in green. After a brief pause (~1.5s), auto-advance to next question.

**Alternatives considered**:
- No pause, immediate advance: Rejected — children need time to see the correct answer, especially on wrong selections
- Manual "next" button: Rejected — adds unnecessary friction; auto-advance after feedback is standard for this game type

## R4: Scoring Integration

**Decision**: Use existing `calculateScore` (no hints) and `calculateStars` from scoring engine

**Rationale**: The rhyme game uses multiple-choice — there is no hint system. Each correct answer = `pointsPerItem` (10 points). Stars are based on percentage correct (same thresholds as other games). The `hintCount` in `RoundResults` is omitted or set to 0.

**Alternatives considered**:
- Custom scoring with time bonus: Rejected — not in spec, adds unnecessary complexity (YAGNI)
- Hint system (reveal one distractor): Rejected — not in spec; 3-4 options already provides sufficient guidance

## R5: Difficulty Level Implementation

**Decision**: Difficulty affects word complexity and distractor similarity

**Rationale**:
- **Easy**: Simple, common words with obvious rhyme patterns and phonetically distant distractors (e.g., "gato/sapato" with distractors "árvore", "boneca")
- **Medium**: Slightly less common words, distractors share some phonetic similarity but don't rhyme
- **Hard**: Less obvious rhyme patterns, distractors are phonetically close (near-rhymes) making discrimination harder

**Alternatives considered**:
- Difficulty affects number of options (3 for easy, 4 for hard): Rejected — simpler to keep consistent 4 options and vary word complexity
- Difficulty affects time limit: Rejected — no time limit in spec

## R6: Round Size and Word Availability Edge Case

**Decision**: Standard round = 10 words (FR-004). If fewer available, use all and end early.

**Rationale**: Matches spec requirement. The word bank targets 30+ sets per difficulty, so this edge case should be rare. Round selector filters by difficulty, shuffles, and takes `min(roundSize, available.length)`.

**Alternatives considered**:
- Pad with repeated words to always reach 10: Rejected — repetition is confusing and anti-educational
- Cross-difficulty fallback: Rejected — mixing difficulties breaks the pedagogical intent

## R7: Game Registration

**Decision**: Register as standard GamePlugin in `src/games/index.ts`

**Rationale**: Follows exact pattern of existing games. Plugin defines: `id: 'rhyme-game'`, `name: 'Rima com o Quê?'`, `defaultRoundSize: 10`, `difficulties: ['easy', 'medium', 'hard']`, `pointsPerItem: 10`.

**Alternatives considered**: None — the registry pattern is mandatory per the architecture.
