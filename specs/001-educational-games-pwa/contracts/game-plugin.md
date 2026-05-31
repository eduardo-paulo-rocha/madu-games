# Contract: Game Plugin Interface

**Feature**: 001-educational-games-pwa
**Date**: 2026-05-31
**Type**: Internal module contract (TypeScript interface)

## Purpose

Defines the contract that every game module MUST implement to be registered in the application's game catalog. This is the primary extension point — adding a new game means implementing this interface.

## Contract Definition

```typescript
// src/core/registry/types.ts

/**
 * Difficulty levels available for all games.
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * The contract every game module must implement to register
 * itself in the game catalog.
 */
export interface GamePlugin {
  /** Unique identifier (kebab-case). Used as route param and storage key. */
  id: string;

  /** Display name in PT-BR shown on the home screen card. */
  name: string;

  /** Short description shown below the game name on the card. */
  description: string;

  /** Icon component rendered on the home screen card. */
  icon: React.ComponentType<{ size?: number }>;

  /** Lazy-loaded root component for the game screen. */
  component: React.LazyExoticComponent<React.ComponentType<GameProps>>;

  /** Default number of items per round (5-8). */
  defaultRoundSize: number;

  /** Available difficulty levels for this game. */
  difficulties: Difficulty[];

  /** Fixed points awarded per correct item. */
  pointsPerItem: number;
}

/**
 * Props injected into every game component by the GameShell.
 */
export interface GameProps {
  /** Selected difficulty for this session. */
  difficulty: Difficulty;

  /** Number of items in this round. */
  roundSize: number;

  /** Callback when the player completes an item correctly. */
  onCorrectItem: () => void;

  /** Callback when the game round is complete (all items attempted). */
  onRoundComplete: (results: RoundResults) => void;

  /** Callback to persist game state for resume. */
  onSaveState: (state: unknown) => void;

  /** Previously saved state for resume (null if new session). */
  savedState: unknown | null;
}

/**
 * Results reported by the game when the round ends.
 */
export interface RoundResults {
  /** Total items presented in the round. */
  totalItems: number;

  /** Items answered correctly. */
  correctItems: number;
}
```

## Registration Contract

Each game module exports a `plugin` constant from its `index.ts`:

```typescript
// src/games/word-search/index.ts
import { lazy } from 'react';
import type { GamePlugin } from '../../core/registry/types';
import { WordSearchIcon } from './components/WordSearchIcon';

export const plugin: GamePlugin = {
  id: 'word-search',
  name: 'Caça-Palavras',
  description: 'Encontre as palavras escondidas na grade de letras!',
  icon: WordSearchIcon,
  component: lazy(() => import('./WordSearchGame')),
  defaultRoundSize: 6,
  difficulties: ['easy', 'medium', 'hard'],
  pointsPerItem: 10,
};
```

## Registry Contract

The central registry collects all plugins:

```typescript
// src/core/registry/game-registry.ts
import type { GamePlugin } from './types';

class GameRegistry {
  private games: Map<string, GamePlugin> = new Map();

  register(plugin: GamePlugin): void {
    if (this.games.has(plugin.id)) {
      throw new Error(`Game "${plugin.id}" is already registered.`);
    }
    this.games.set(plugin.id, plugin);
  }

  getAll(): GamePlugin[] {
    return Array.from(this.games.values());
  }

  getById(id: string): GamePlugin | undefined {
    return this.games.get(id);
  }
}

export const gameRegistry = new GameRegistry();
```

## Adding a New Game (Extension Contract)

To add a new game, a developer MUST:

1. Create a new folder under `src/games/{game-id}/`
2. Implement the `GamePlugin` interface in `index.ts`
3. Import and register the plugin in `src/games/index.ts`

Files that MUST NOT be modified:
- Any file under `src/games/{other-game}/`
- Any file under `src/core/`
- Any file under `src/design-system/`
- `src/pages/HomePage.tsx` (reads from registry dynamically)

## Behavioral Contract

### GameShell responsibilities (what the shell provides):
- Renders difficulty selector before game starts
- Creates a GameSession in IndexedDB when game begins
- Passes `GameProps` to the game component
- Handles back navigation (saves state, marks session as abandoned if incomplete)
- Displays score screen with stars when `onRoundComplete` is called
- Updates PlayerScore high score if applicable

### Game component responsibilities (what the game MUST do):
- Accept `GameProps` and use `difficulty` and `roundSize` to configure the round
- Call `onCorrectItem()` each time the player gets an item right
- Call `onRoundComplete(results)` when all items are attempted or round ends
- Call `onSaveState(state)` periodically to enable resume
- Restore from `savedState` if non-null (resume scenario)
- Handle its own internal game logic (grid generation, validation, etc.)
- Use shared design system components for UI consistency

### What the game MUST NOT do:
- Directly access IndexedDB or storage
- Modify global state outside its scope
- Import from other game modules
- Render its own score screen or navigation
