# Data Model: Sequência Lógica

**Feature**: 005-logical-sequence
**Date**: 2026-05-31

## Entities

### PatternRule

Defines how to generate a specific type of emoji pattern. Used by the pattern generator to produce concrete instances.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (e.g., `"ab-alternation"`, `"abc-cycle"`, `"growth"`) |
| type | `"alternation" \| "cycle" \| "growth" \| "nested"` | The pattern family |
| emojiCount | number | Number of distinct emojis used in the rule (2 for alternation, 3 for cycle, etc.) |
| generate | `(emojis: string[], length: number) => string[]` | Function that produces a full sequence of `length` emojis from the given set |

**Validation rules**:
- `emojiCount` must be ≤ `emojis.length` passed to `generate`
- `generate` must be deterministic for the same inputs
- The sequence must have exactly one correct completion at `sequence[length]`

**State transitions**: N/A — stateless definition

---

### PatternInstance

A concrete sequence generated from a PatternRule, ready to be displayed to the player.

| Field | Type | Description |
|-------|------|-------------|
| sequence | string[] | The visible emojis in order (without the missing element) |
| answer | string | The correct emoji that completes the pattern |
| options | string[] | Shuffled array of 2–3 answer options (includes `answer`) |
| ruleId | string | Reference to the PatternRule that generated this instance |

**Validation rules**:
- `options` must contain `answer` exactly once
- `options.length` is 2 (easy) or 3 (medium/hard)
- All emojis in `options` belong to the same category as the pattern emojis

**State transitions**: N/A — immutable once generated

---

### Round (reuses existing core concept)

A sequence of 10 pattern questions for a selected difficulty. Managed by the game component state.

| Field | Type | Description |
|-------|------|-------------|
| patterns | PatternInstance[] | Array of 10 generated patterns |
| currentIndex | number | Index of the current pattern being played (0–9) |
| correctCount | number | Number of correct answers so far |
| difficulty | Difficulty | `"easy" \| "medium" \| "hard"` |

**Validation rules**:
- `patterns.length` is always equal to `roundSize` (default 10, from FR-004)
- `currentIndex` is in range `[0, patterns.length)`
- `correctCount` is in range `[0, currentIndex]`

**State transitions**:
- `idle` → `playing` (on round start)
- `playing` → `answered` (on option selection)
- `answered` → `playing` (advance to next pattern)
- `answered` → `complete` (when `currentIndex === patterns.length - 1`)

---

### EmojiSet

A curated collection of emojis from a single visual category, used to populate pattern rules.

| Field | Type | Description |
|-------|------|-------------|
| category | string | Category name (e.g., `"colors"`, `"animals"`, `"fruits"`) |
| emojis | string[] | Array of emoji characters in this category |

**Validation rules**:
- Minimum 4 emojis per set (supports growth patterns up to 4 distinct elements)
- All emojis must be from Unicode 9.0 or earlier (broad device support)

---

### RoundResult (reuses existing core type)

Passed to `onRoundComplete()` callback. Uses the existing `RoundResults` interface from `src/core/registry/types.ts`.

| Field | Type | Description |
|-------|------|-------------|
| totalItems | number | Total patterns in the round (always 10) |
| correctItems | number | Number of correct answers |
| hintCount | number \| undefined | Not used in this game (no hint system) |

## Relationships

```
EmojiSet ──(provides emojis to)──> PatternRule
PatternRule ──(generates)──> PatternInstance
PatternInstance[] ──(composes)──> Round
Round ──(produces)──> RoundResult
```

## Key Design Decisions

1. **No hint system**: Unlike emoji-guess, pattern sequences don't have a natural "hint" mechanic. The pattern itself is the clue. Omitting hints simplifies the game (Constitution Principle II).

2. **Algorithmic generation over data files**: Pattern rules are functions, not JSON data. This provides unlimited variety with minimal bundle size and satisfies FR-007.

3. **Immutable PatternInstance**: Once generated, a pattern instance doesn't change. This simplifies state management — the game component only tracks `currentIndex` and `correctCount`.

4. **Reuse of RoundResults interface**: The existing `RoundResults` type from the core registry is sufficient. No need for a game-specific result type.
