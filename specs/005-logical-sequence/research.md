# Research: Sequência Lógica

**Feature**: 005-logical-sequence
**Date**: 2026-05-31

## Research Tasks

### R1: Pattern Generation Algorithm — Unambiguous sequence completion

**Context**: The game presents emoji sequences with a missing last element. Patterns must have exactly one correct completion (FR-008). Need an algorithm that generates patterns deterministically from rules and guarantees uniqueness.

**Decision**: Define pattern rules as functions that map an index `i` to an emoji from a fixed set. The "answer" is always `rule(sequenceLength)`. Distractors are randomly chosen from the emoji pool excluding the correct answer. Pattern types:

- **Alternation (AB-AB)**: `rule(i) = set[i % 2]` — two-element cycle
- **Three-cycle (ABC-ABC)**: `rule(i) = set[i % 3]` — three-element cycle
- **Growth**: `rule(i) = set[i]` — each element is unique, sequence grows (e.g., 🟢🟡🔴🟣❓ → 🔵)
- **Nested/Multi-attribute**: Combine two independent cycles (e.g., shape cycles while color cycles at different rates)

Since the rule is deterministic, the correct answer is always `rule(lastIndex)` — exactly one solution.

**Rationale**: Function-based rules make correctness trivially verifiable. No need for AI or heuristics. The algorithm is simple (Constitution Principle II) and fast (O(1) per element).

**Alternatives considered**:
- Template strings with placeholders → less flexible, harder to add new pattern types
- Random generation with validation → risk of ambiguous patterns, violates FR-008
- Pre-built pattern database → limits variety (FR-007 requires algorithmic generation), larger bundle

---

### R2: Emoji Selection — Universally supported, child-friendly emojis

**Context**: FR-002 requires universally recognized Unicode emojis identifiable by children aged 6-10. Need to define emoji sets that render consistently across Android 8+, iOS 14+, and modern desktop browsers.

**Decision**: Use a curated set of ~40 emojis from Unicode 6.0–9.0 (widely supported) organized by category:

- **Colors/Shapes**: 🔴🟠🟡🟢🔵🟣⚫⚪🟤 (circle colors)
- **Animals**: 🐱🐶🐰🐸🐻🐼🐨🦁🐷🐮
- **Fruits**: 🍎🍊🍋🍇🍓🍌🍉🍑🍒🫐
- **Nature**: 🌸🌻🌺🌷🌹🍀🌿🌴🌲⭐
- **Objects**: ⚽🏀🎾🎲🔔🎵🎨📚✏️🎁

Each pattern rule draws from a single category to maintain visual coherence.

**Rationale**: These emojis are supported since Android 6.0+ and iOS 8.3+, well above our minimum targets. Category grouping makes patterns visually meaningful for children.

**Alternatives considered**:
- Allow cross-category mixing → confusing for young children, harder to identify the pattern
- Use only geometric shapes → too abstract, less engaging
- Use newer emojis (Unicode 14+) → risk of rendering issues on older devices

---

### R3: Difficulty Scaling — Pattern complexity per level

**Context**: FR-006 defines three difficulty levels with distinct pattern types. Need to map specific pattern generators to each level and define sequence lengths.

**Decision**:

| Difficulty | Pattern Types | Sequence Length | Options Count | Emoji Categories |
|-----------|--------------|-----------------|---------------|-----------------|
| Easy | Two-element alternation (AB-AB) | 4–5 visible + 1 missing | 2 options | Colors/Shapes |
| Medium | Three-element cycle (ABC-ABC), simple growth | 5–6 visible + 1 missing | 3 options | Animals, Fruits |
| Hard | Nested cycles, multi-attribute, longer growth | 6–8 visible + 1 missing | 3 options | Mixed categories |

Easy patterns always use 2 answer options (higher success chance for younger children). Medium and hard use 3 options.

**Rationale**: Aligns with FR-006 exactly. Two options for easy reduces cognitive load for 6-year-olds. Three options for medium/hard provides adequate challenge. Growth patterns in medium introduce non-repeating sequences. Hard-level nested patterns (e.g., shape alternates while color cycles in 3) are the most complex.

**Alternatives considered**:
- Same number of options across all difficulties → doesn't differentiate enough
- 4 options for hard → excessive for the 6-10 age range, risk of frustration

---

### R4: Distractor Generation — Plausible but incorrect options

**Context**: Answer options must include exactly one correct answer and 1-2 distractors (FR-001, FR-010). Distractors should be plausible to avoid trivially obvious answers.

**Decision**: Distractors are selected from the same emoji pool used by the pattern rule (same category) but excluding the correct answer. For alternation patterns, the "other" element in the cycle is always one distractor (it appears in the pattern but is wrong for this position). Remaining distractors are random from the same category. The correct answer position is randomized among options (FR-010).

**Rationale**: Same-category distractors ensure plausibility — the child must understand the pattern, not just recognize an out-of-place emoji. Using the pattern's own elements as distractors forces attention to position, not just membership.

**Alternatives considered**:
- Random emojis from any category → too easy to eliminate by visual mismatch
- Always use the immediately preceding element → predictable distractor pattern

---

### R5: Round Structure and Variety

**Context**: FR-004 requires 10 questions per round. FR-007 requires variety across rounds. SC-006 requires at least 20 distinct pattern variations per difficulty.

**Decision**: Each difficulty level defines a pool of pattern rule generators (functions parameterized by emoji sets). A round selects 10 patterns by:
1. Shuffling the available rule generators for the selected difficulty
2. For each selected generator, randomly choosing an emoji set from the available categories
3. Generating the concrete sequence

This produces `generators × emoji_sets` combinations. With 3+ generators and 3+ emoji categories per difficulty, we get 9+ base combinations, each with randomized emoji ordering within the set → effectively unlimited variety.

**Rationale**: Algorithmic approach guarantees variety without maintaining large datasets. Each round feels fresh because both the pattern structure and the emojis change.

**Alternatives considered**:
- Pre-built question bank → limits variety, requires maintenance, larger bundle
- Purely random generation → risk of repetitive or invalid patterns
