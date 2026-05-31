# Contract: Connect Pairs Game Module

**Feature**: 006-connect-pairs | **Date**: 2026-05-31
**Type**: Internal module contract (Game Plugin implementation)

## Purpose

Defines the contract for the Connect Pairs game module — how it integrates with the existing GamePlugin system, what it provides, and what it expects from the shell and infrastructure.

## 1. Plugin Registration Contract

### `GamePlugin` Implementation

```typescript
// src/games/connect-pairs/index.ts
import { lazy } from 'react';
import type { GamePlugin } from '../../core/registry/types';
import { ConnectPairsIcon } from './components/ConnectPairsIcon';

export const plugin: GamePlugin = {
  id: 'connect-pairs',
  name: 'Conecte os Pares',
  description: 'Conecte elementos que se relacionam!',
  icon: ConnectPairsIcon,
  component: lazy(() => import('./ConnectPairsGame')),
  defaultRoundSize: 5,
  difficulties: ['easy', 'medium', 'hard'],
  pointsPerItem: 15,
};
```

**Behavioral notes**:
- `defaultRoundSize: 5` is a nominal value; the game internally maps difficulty → pair count (easy=4, medium=5, hard=6)
- `pointsPerItem: 15` rewards higher per-item value since matching pairs requires more cognitive effort than single-item games

### Registration

```typescript
// src/games/index.ts (modified)
import { plugin as connectPairs } from './connect-pairs';
gameRegistry.register(connectPairs);
```

---

## 2. Game Component Contract

### Props (received from GameShell)

```typescript
interface GameProps {
  difficulty: Difficulty;     // Determines pair count: easy=4, medium=5, hard=6
  roundSize: number;          // Nominal; game uses difficulty for actual pair count
  onCorrectItem: () => void;  // Called when a correct pair is matched
  onRoundComplete: (results: RoundResults) => void;  // Called when all pairs matched
  onSaveState: (state: unknown) => void;  // Called to persist game state
  savedState: unknown | null;  // Previously saved state for resume
}
```

### RoundResults Contract

```typescript
// What ConnectPairsGame reports when round completes
const results: RoundResults = {
  totalItems: pairCount,          // Total pairs in the round (4, 5, or 6)
  correctItems: firstTryMatches,  // Pairs matched on the first attempt
  hintCount: 0,                   // Reserved for future hint support
};
```

**Mapping**:
- `totalItems` = number of pairs (not individual items)
- `correctItems` = pairs where BOTH items had no prior failed attempt
- Stars are computed by GameShell: `calculateStars(correctItems, totalItems)`
- Score is computed by GameShell: `calculateScoreWithHints(correctItems, pointsPerItem, hintCount)`

---

## 3. Selection Behavior Contract

### User Interaction Rules

| Action | Behavior |
|--------|----------|
| Tap unmatched item (nothing selected) | Select the item, highlight it |
| Tap unmatched item (same column selected) | Replace selection in that column |
| Tap unmatched item (other column selected) | Select it → immediately validate pair |
| Tap already-selected item | Deselect it |
| Tap matched (disabled) item | No action (item is non-interactive) |

### Feedback Timing

| Event | Duration | Visual |
|-------|----------|--------|
| Correct match | 500ms | ✅ overlay, items turn green, then become disabled |
| Incorrect match | 500ms | ❌ overlay, items flash red with shake, then deselect |
| Round complete | Immediate | Calls `onRoundComplete`, GameShell shows results |

---

## 4. Pair Data Contract

### PairSet Structure

```typescript
interface PairItem {
  id: string;       // Unique within the set
  display: string;  // Emoji, word, or combination shown to player
}

interface Pair {
  left: PairItem;   // Displayed in left column
  right: PairItem;  // Displayed in right column
}

interface PairSet {
  id: string;             // Unique identifier
  category: string;       // Thematic category name (PT-BR)
  difficulty: Difficulty;  // Determines pair count
  pairs: Pair[];          // Length: easy=4, medium=5, hard=6
}
```

### Content Requirements

- Minimum 5 categories
- Minimum 6 pair sets per category (2 per difficulty)
- All text in Brazilian Portuguese
- Emojis MUST be universally supported (no platform-specific)
- Relationships MUST be unambiguous for children aged 6-10

### Categories

| Category | Left Column | Right Column | Example |
|----------|-------------|--------------|---------|
| Animais e Sons | Animal emojis | Onomatopeias | 🐄 ↔ "Muu" |
| Profissões e Ferramentas | Profession emojis | Tool/object words | 👨‍🍳 ↔ "Panela" |
| Alimentos e Origem | Food emojis | Origin/source words | 🍎 ↔ "Árvore" |
| Objetos e Funções | Object emojis | Action/function words | ✂️ ↔ "Cortar" |
| Emoji e Palavra | Emotion/concept emojis | Corresponding words | 😊 ↔ "Feliz" |

---

## 5. What the Game MUST Do

- Accept `GameProps` and use `difficulty` to determine pair count
- Call `onCorrectItem()` each time a correct pair is matched
- Call `onRoundComplete(results)` when all pairs are matched
- Call `onSaveState(state)` periodically for resume support
- Restore from `savedState` if non-null
- Randomize both column orders independently (FR-009)
- Provide immediate visual feedback per match attempt (FR-003)
- Disable matched items visually and functionally (FR-004)
- Use design system components (Button, StarRating, etc.) for consistency

## 6. What the Game MUST NOT Do

- Directly access IndexedDB or storage
- Modify global state outside its scope
- Import from other game modules
- Render its own score screen or navigation
- Modify any file under `src/core/` or `src/design-system/`
