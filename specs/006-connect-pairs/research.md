# Research: Conecte os Pares

**Feature**: 006-connect-pairs | **Date**: 2026-05-31

## Research Tasks

### 1. GamePlugin Adaptation for Pair-Based Games

**Context**: The existing `GamePlugin` interface uses `defaultRoundSize` and `pointsPerItem` for scoring. Connect Pairs has variable round sizes per difficulty (4/5/6 pairs) and needs attempt-based scoring rather than item-based.

**Decision**: Use `defaultRoundSize: 5` (medium default) and `pointsPerItem: 15` in the plugin config. The game component internally determines pair count based on `difficulty` prop (easy=4, medium=5, hard=6), ignoring `roundSize` for pair count. Scoring uses `correctItems` = number of pairs matched on first attempt and `totalItems` = total pairs, fitting the existing `RoundResults` interface.

**Rationale**: The `GamePlugin` interface already supports difficulty-based behavior — emoji-guess similarly adapts round behavior per difficulty. Keeping `RoundResults.correctItems` as first-try matches and `totalItems` as total pairs maps cleanly to the existing `calculateStars` function (ratio-based star rating).

**Alternatives considered**:
- Extend `GamePlugin` with custom round-size-per-difficulty config → rejected because it modifies core types for one game (violates Constitution VI).
- Report `correctItems = totalPairs` always since all pairs eventually match → rejected because it removes scoring differentiation and makes stars always 3.

---

### 2. Selection State Machine Design

**Context**: The game needs to manage selection of one item per column, validate pairs, and handle edge cases (same-column reselection, tapping matched items).

**Decision**: Implement a simple state machine with states: `idle` → `one-selected` → `two-selected` → `checking` → `idle`. States:
- `idle`: No selection active. Tap any unmatched item to select it.
- `one-selected`: One item selected (left or right column). Tap in same column = replace selection. Tap in other column = move to `two-selected`.
- `two-selected`: Both items selected, immediately transition to `checking`.
- `checking`: Validate pair. If correct → mark both as matched, show ✅, increment correct count if first attempt for both items. If incorrect → show ❌, clear selections after brief delay, increment attempt counter.

**Rationale**: This is the simplest correct model for two-column matching. No complex FSM library needed — a `useReducer` with discriminated union actions is sufficient.

**Alternatives considered**:
- XState or similar FSM library → rejected (YAGNI, Constitution II). A reducer with 4 states is trivially manageable.
- Allow multi-selection (select multiple from one side) → rejected per spec (FR-002, FR-012: one selection per column).

---

### 3. Scoring Formula Design

**Context**: FR-005 requires scoring that rewards accuracy (correct first-try matches) and efficiency (fewer total attempts). The spec notes that scoring formula is an implementation detail.

**Decision**: Use the existing scoring infrastructure:
- `correctItems` = number of pairs matched on the **first attempt** (both items in the pair were not previously involved in a failed match).
- `totalItems` = total number of pairs in the round.
- Score = `calculateScoreWithHints(correctItems, pointsPerItem, hintCount)` (hint support inherited).
- Stars = `calculateStars(correctItems, totalItems)` — ratio-based as existing.

First-try tracking: maintain a `Set<string>` of item IDs that have been part of a failed attempt. When a correct match is made, it counts as first-try only if neither item ID is in the failed set.

**Rationale**: Reuses the entire existing scoring pipeline without modification. The "first-try" concept maps naturally to `correctItems` vs `totalItems`, and the star/celebration logic works unchanged.

**Alternatives considered**:
- Custom scoring function with attempt-weighted formula → rejected because it would duplicate scoring logic and diverge from the centralized engine (Constitution V).
- Track attempts as hintCount penalty → rejected because hints and wrong guesses are conceptually different; hints are intentional help, wrong guesses are learning.

---

### 4. Pair Data Structure and Content Strategy

**Context**: FR-007 requires 5+ thematic categories with curated pairs. FR-008 requires 4/5/6 pairs per difficulty. SC-006 requires at least 6 pair sets per category.

**Decision**: Store pair data as a TypeScript module (`pair-sets.ts`) with the following structure:
```typescript
interface PairItem {
  id: string;
  display: string; // emoji, word, or emoji+text
}
interface PairSet {
  id: string;
  category: string;
  difficulty: Difficulty;
  pairs: Array<{ left: PairItem; right: PairItem }>;
}
```

Categories (minimum 5):
1. **Animais e Sons** (🐄↔"Muu", 🐱↔"Miau", etc.)
2. **Profissões e Ferramentas** (👨‍🍳↔"Panela", 👩‍⚕️↔"Estetoscópio", etc.)
3. **Alimentos e Origem** (🍎↔"Árvore", 🧀↔"Leite", etc.)
4. **Objetos e Funções** (✂️↔"Cortar", 🔑↔"Abrir", etc.)
5. **Emoji e Palavra** (😊↔"Feliz", 😢↔"Triste", etc.)

Each category has at least 6 pair sets across difficulties (2 easy, 2 medium, 2 hard) with unique pairs. Total minimum: 30 pair sets, ~150 unique pairs.

**Rationale**: Static TypeScript module (not JSON) enables type safety and tree-shaking. Categories chosen per spec FR-007 targeting 6-10 year olds with unambiguous relationships (SC-003). Emojis are universally supported.

**Alternatives considered**:
- JSON files with dynamic import → rejected because TypeScript gives compile-time validation of pair data and better IDE support.
- Database/IndexedDB storage → rejected because data is static and bundled (spec assumption: offline, no backend).

---

### 5. Two-Column Layout Strategy

**Context**: The game displays two columns of items. On mobile (portrait), space is limited. Items need to be large enough for children's touch targets (≥44x44px).

**Decision**: Use a CSS flexbox two-column layout:
- **Desktop/tablet (≥768px)**: Side-by-side columns with generous spacing, items ~60px tall.
- **Mobile portrait (<768px)**: Same side-by-side layout but with reduced horizontal padding. Items remain ≥48px tall to exceed touch target requirements. For 6 pairs (hard), items may need to be slightly smaller vertically but never below 44px.
- Columns are equal width with a gap between them for visual separation.
- Selected items get a highlighted border (primary color). Matched items get success color background and reduced opacity.

**Rationale**: Two-column layout is fundamental to the game concept and works on all viewports since pair count is small (max 6). No stacking/scrolling needed — 6 items × 48px = 288px, well within mobile viewport height minus header.

**Alternatives considered**:
- Stacked columns on mobile → rejected because it breaks the visual metaphor of connecting items across columns.
- Grid layout → rejected because flexbox is simpler for two equal columns (Constitution II).

---

### 6. Visual Feedback and Animation Patterns

**Context**: FR-003 requires immediate visual feedback per pair (✅/❌). FR-004 requires matched pairs to be highlighted and disabled.

**Decision**: Use framer-motion (already a dependency) for all animations:
- **Selection**: Scale up (1.05) + primary color border on tap. Spring animation for natural feel.
- **Correct match**: Both items flash green (`colors.success`), brief ✅ emoji overlay, then transition to muted/disabled state with checkmark badge. Connection line draws between the two items using a simple SVG path or CSS.
- **Incorrect match**: Both items flash red (`colors.error`), brief ❌ emoji overlay (500ms), then reset to unselected state with a shake animation.
- **Round complete**: Trigger existing `CelebrationAnimation` component via `onRoundComplete`.

All animations use the existing `framer-motion` animation presets where applicable.

**Rationale**: Consistent with existing game animations (emoji-guess uses similar feedback patterns). framer-motion's `AnimatePresence` handles enter/exit naturally. Keeping animations under 500ms meets SC-002.

**Alternatives considered**:
- CSS-only animations → rejected because framer-motion is already used everywhere and provides better spring physics and orchestration.
- Drawing SVG connection lines between matched pairs → will evaluate during implementation; may add visual richness but is optional for MVP.

---

### 7. Round Generation and Randomization

**Context**: FR-009 requires randomized order in both columns. Multiple rounds should vary categories.

**Decision**: Round generation logic:
1. Filter available pair sets by difficulty.
2. Select a random pair set, preferring categories not used in the immediately previous round (if tracking is simple).
3. Extract `pairs` array from the selected set.
4. Create `leftColumn` = shuffle(pairs.map(p => p.left)).
5. Create `rightColumn` = shuffle(pairs.map(p => p.right)).
6. Both columns are independently shuffled so positions don't correlate.

For category rotation: track `lastCategory` in component state. On new round, filter to different categories first; fall back to any category if only one exists for the difficulty.

**Rationale**: Simple Fisher-Yates shuffle on two independent arrays. No need for complex randomization or seed-based generation — the game is casual and rounds are short.

**Alternatives considered**:
- Seeded random for reproducibility → rejected (YAGNI — no replay or sharing feature).
- Weighted category selection → rejected (simple rotation/exclusion is sufficient for variety).
