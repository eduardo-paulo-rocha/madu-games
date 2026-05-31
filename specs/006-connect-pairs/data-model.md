# Data Model: Conecte os Pares

**Feature**: 006-connect-pairs | **Date**: 2026-05-31

## Entities

### PairItem

An individual item displayed in one of the two columns.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier within the pair set (e.g., "cat-animal") |
| display | string | Text or emoji shown to the player (e.g., "🐱" or "Gato") |

### Pair

Two related items that form a correct match.

| Field | Type | Description |
|-------|------|-------------|
| left | PairItem | Item displayed in the left column |
| right | PairItem | Item displayed in the right column |

### PairSet

A collection of pairs for a single round, belonging to a thematic category.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (e.g., "animals-sounds-easy-01") |
| category | string | Thematic category (e.g., "Animais e Sons") |
| difficulty | Difficulty | "easy" (4 pairs), "medium" (5 pairs), "hard" (6 pairs) |
| pairs | Pair[] | Array of related pairs (length matches difficulty) |

### RoundState (runtime only — component state)

Managed by `ConnectPairsGame` component via `useReducer`.

| Field | Type | Description |
|-------|------|-------------|
| leftColumn | PairItem[] | Shuffled left column items |
| rightColumn | PairItem[] | Shuffled right column items |
| selectedLeft | string \| null | ID of currently selected left item |
| selectedRight | string \| null | ID of currently selected right item |
| matchedPairs | Set\<string\> | Set of pair IDs (left item IDs) that have been correctly matched |
| failedItems | Set\<string\> | Set of item IDs that have been involved in at least one failed attempt |
| attempts | number | Total match attempts made |
| firstTryMatches | number | Pairs matched where neither item was previously in a failed attempt |
| phase | RoundPhase | Current phase of the round state machine |
| currentPairSet | PairSet | The pair set used for this round |
| lastCategory | string \| null | Category of the previous round (for rotation) |

### RoundPhase (enum)

| Value | Description |
|-------|-------------|
| "idle" | No items selected, waiting for player input |
| "one-selected" | One item selected (left or right) |
| "checking" | Both items selected, validating the pair |
| "correct-feedback" | Showing positive feedback animation |
| "incorrect-feedback" | Showing negative feedback animation |
| "complete" | All pairs matched, round is over |

### GameSession (existing — no changes)

Uses existing `GameSession` entity from `core/storage/session-store.ts` without modification. The `hintCount` field (added by feature 002) is available if hints are integrated.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique session identifier (existing) |
| gameId | string | "connect-pairs" (existing) |
| difficulty | Difficulty | easy/medium/hard (existing) |
| totalItems | number | Total pairs in the round (existing) |
| correctItems | number | First-try matches (existing) |
| score | number | Final score (existing) |
| stars | number | 0-3 star rating (existing) |
| hintCount | number | Hints used (existing, default 0) |

## Relationships

```
PairSet 1──* Pair
Pair 1──1 PairItem (left)
Pair 1──1 PairItem (right)
RoundState 1──1 PairSet (currentPairSet)
RoundState 1──* PairItem (leftColumn, rightColumn)
GameSession 1──1 RoundState (runtime association, not persisted)
```

## State Transitions

### Selection State Machine

```
idle
  → [tap unmatched left item] → one-selected (selectedLeft set)
  → [tap unmatched right item] → one-selected (selectedRight set)

one-selected (left selected)
  → [tap different left item] → one-selected (selectedLeft replaced)
  → [tap right item] → checking
  → [tap same left item] → idle (deselect)

one-selected (right selected)
  → [tap different right item] → one-selected (selectedRight replaced)
  → [tap left item] → checking
  → [tap same right item] → idle (deselect)

checking
  → [pair is correct] → correct-feedback
  → [pair is incorrect] → incorrect-feedback

correct-feedback (500ms)
  → [all pairs matched] → complete
  → [pairs remaining] → idle (matchedPairs updated)

incorrect-feedback (500ms)
  → idle (selections cleared, failedItems updated)

complete
  → [onRoundComplete called with results]
```

### Match Validation

```
Given selectedLeft and selectedRight:
1. Find the pair in currentPairSet where pair.left.id === selectedLeft
2. If pair.right.id === selectedRight → CORRECT
3. Else → INCORRECT
```

## Validation Rules

- Each `PairSet` MUST have exactly the number of pairs matching its difficulty (easy=4, medium=5, hard=6)
- `PairItem.id` MUST be unique within a `PairSet`
- `PairItem.display` MUST be non-empty and unambiguous for children aged 6-10
- `matchedPairs` can only grow (pairs cannot be unmatched)
- `attempts` MUST increment by 1 for every completed check (correct or incorrect)
- `firstTryMatches` MUST only increment when BOTH items in the correct pair have no entry in `failedItems`
- Matched items (in `matchedPairs`) MUST be non-interactive (taps ignored)
- Only one selection per column at any time (FR-002, FR-012)
