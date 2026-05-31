# Data Model: Rima com o Quê?

**Feature**: 004-rhyme-game | **Date**: 2026-05-31

## Entities

### RhymeWordOption

A word paired with its illustrative emoji, used as either a target, correct answer, or distractor.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| word | string | non-empty, lowercase Brazilian Portuguese | The word text |
| emoji | string | single Unicode emoji | Illustrative emoji for the word |

### RhymeWordSet

A complete question unit: one target word, one correct rhyming answer, and 2-3 distractors.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| target | RhymeWordOption | required | The target word the player must find a rhyme for |
| correct | RhymeWordOption | required, must rhyme with target | The single correct rhyming answer |
| distractors | RhymeWordOption[] | length 2-3, must NOT rhyme with target | Non-rhyming distractor options |
| difficulty | Difficulty | 'easy' \| 'medium' \| 'hard' | Difficulty level for this word set |

**Validation rules**:
- `correct.word` must rhyme with `target.word` (same phonetic ending)
- Each distractor must NOT rhyme with `target.word`
- All options (correct + distractors) must have distinct words
- Total options per question: 3-4 (1 correct + 2-3 distractors)

### RhymeQuestion (runtime)

A prepared question with shuffled options, derived from a RhymeWordSet at round start.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| target | RhymeWordOption | from word set | The target word displayed to the player |
| options | RhymeWordOption[] | shuffled, length 3-4 | All answer options in randomized order |
| correctIndex | number | 0..options.length-1 | Index of the correct answer in shuffled options |

### RhymeRound (runtime)

A sequence of questions for one game session.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| questions | RhymeQuestion[] | length ≤ roundSize (default 10) | Ordered list of questions for this round |
| currentIndex | number | 0..questions.length-1 | Current question position |

## Relationships

```
RhymeWordSet (JSON) ──[filter by difficulty]──▶ RhymeQuestion[] (runtime)
                                                      │
                                                      ▼
                                              RhymeRound (runtime)
                                                      │
                                              ┌───────┴────────┐
                                              ▼                ▼
                                       GameSession       RoundResults
                                       (core/storage)   (core/registry)
```

## State Transitions

### Question State

```
PRESENTING ──[player selects option]──▶ FEEDBACK_CORRECT  ──[1.5s]──▶ NEXT_QUESTION
                                    └──▶ FEEDBACK_INCORRECT ──[1.5s]──▶ NEXT_QUESTION
                                                                            │
                                                                   [last question]
                                                                            ▼
                                                                     ROUND_COMPLETE
```

### Game State (managed by GameShell)

```
SELECT_DIFFICULTY ──▶ PLAYING ──▶ RESULTS
        ▲                              │
        └──────── [play again] ────────┘
```

## Data Storage

No new database tables or stores required. The game uses:
- **`sessions` store** (existing): Tracks game session lifecycle via `useGameSession`
- **`scores` store** (existing): Persists high scores and star ratings via `useScores`

The word bank is a static JSON file bundled at build time — no runtime persistence needed.

## Word Bank Size Requirements

| Difficulty | Minimum Word Sets | Target Word Sets |
|------------|-------------------|------------------|
| easy       | 30                | 35-40           |
| medium     | 30                | 35-40           |
| hard       | 30                | 35-40           |
| **Total**  | **90**            | **105-120**     |
