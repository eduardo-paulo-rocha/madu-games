# Research: Educational Games PWA

**Feature**: 001-educational-games-pwa
**Date**: 2026-05-31
**Purpose**: Resolve technical unknowns and validate technology choices

## 1. Framework Choice: React vs Alternatives

### Decision: React 18+ with TypeScript

### Rationale:
- **Component-based architecture**: React's component model maps directly to the game plugin requirement — each game is a tree of components that can be lazy-loaded independently.
- **Ecosystem maturity**: Largest ecosystem for PWA tooling, testing libraries, and animation frameworks. Well-documented patterns for offline-first apps.
- **Performance**: React 18's concurrent features (Suspense, transitions) enable smooth UI without blocking the main thread. Lazy loading via `React.lazy()` ensures only the active game is in memory.
- **Developer familiarity**: Most widely known frontend framework, reducing onboarding friction for future contributors.
- **PWA compatibility**: First-class support via Vite PWA plugin + Workbox integration.

### Alternatives Considered:
- **Svelte/SvelteKit**: Smaller bundle, but smaller ecosystem for complex PWA patterns and animation libraries. Less battle-tested for offline-first apps.
- **Vue 3**: Strong component model, but smaller ecosystem for game-like interactions (gesture libraries, canvas integration). Composition API is excellent but React hooks have broader community support.
- **Preact**: React-compatible with smaller footprint, but loses some React 18 features (concurrent mode, Suspense) that benefit game loading UX.
- **Solid.js**: Best raw performance, but very small ecosystem and fewer developers familiar with it.

---

## 2. Build Tool & PWA Strategy

### Decision: Vite 6+ with vite-plugin-pwa (Workbox)

### Rationale:
- **Vite**: Fastest DX (instant HMR), native ESM, tree-shaking, code splitting per route/game. Production builds are optimized with Rollup.
- **vite-plugin-pwa**: Zero-config PWA generation — manifest, service worker, precaching, offline fallback. Uses Workbox under the hood.
- **Workbox**: Industry standard for service worker management. Supports precaching (all game assets cached on install), runtime caching strategies, and background sync.
- **Offline strategy**: `precacheAndRoute` for all static assets (HTML, JS, CSS, game data JSONs). No runtime network requests needed — fully offline after install.

### Alternatives Considered:
- **Next.js**: Server-oriented, overkill for a client-only PWA with no backend. Adds unnecessary complexity.
- **Create React App**: Deprecated, no longer maintained.
- **Webpack**: Slower DX, more config overhead. Vite surpasses in all metrics relevant here.

---

## 3. State Management

### Decision: Zustand (minimal global state) + React Context (dependency injection)

### Rationale:
- **Zustand**: Tiny (~1KB), no boilerplate, works with React DevTools. Perfect for global state that persists (current game session, scores). No providers needed — avoids re-render cascading.
- **React Context**: Used only for dependency injection (passing the game registry, storage adapters to components). NOT for frequently-changing state.
- **Why not Redux**: Overkill for this scope. Redux adds boilerplate and indirection without benefit for an app with ~3-5 global state slices.
- **Why not Jotai/Recoil**: Atomic state is useful for complex forms but unnecessary here. Game state is hierarchical (session → game → round), better modeled as stores.

---

## 4. Storage: IndexedDB via `idb`

### Decision: IndexedDB with the `idb` wrapper library

### Rationale:
- **Capacity**: IndexedDB supports megabytes of structured data (vs localStorage's ~5MB string limit). Future-proof for saving game state, word lists, and analytics.
- **Async API**: Non-blocking reads/writes won't jank animations. `idb` provides a clean Promise-based wrapper over the raw IndexedDB API.
- **Structured data**: Supports object stores with indexes — ideal for querying scores by game + difficulty + date.
- **PWA-friendly**: IndexedDB persists across sessions, survives cache clearing (unless explicit user action), and works fully offline.
- **Why not localStorage**: String-only, synchronous (blocks main thread), 5MB limit, no structured queries.
- **Why not SQLite/WASM**: Adds ~1MB to bundle for SQL support we don't need. IndexedDB is sufficient for key-value and simple indexed queries.

---

## 5. Animation Library

### Decision: Framer Motion 11+

### Rationale:
- **Declarative**: Animations defined as React props (`animate`, `exit`, `whileTap`). No imperative timeline management.
- **Performance**: Hardware-accelerated (transforms + opacity), uses WAAPI under the hood, respects `prefers-reduced-motion`.
- **Gesture support**: Built-in drag, tap, pan gesture recognition — useful for Caça-Palavras swipe interaction.
- **Layout animations**: `AnimatePresence` handles enter/exit transitions automatically. `layoutId` enables shared element transitions between pages.
- **Bundle size**: ~15KB gzipped for the features we need. Supports tree-shaking.
- **Why not CSS-only**: CSS animations are less composable, harder to orchestrate (sequences, stagger), and cannot react to gesture input.
- **Why not GSAP**: Imperative API, larger bundle, commercial license concerns for some use cases.
- **Why not react-spring**: Similar capability but less active maintenance and worse docs.

---

## 6. Game Plugin Architecture

### Decision: Module registry with dynamic imports

### Rationale:
- **Pattern**: Each game exports a `GamePlugin` object conforming to a shared interface (id, name, icon, component, metadata). A central `GameRegistry` collects all plugins at build time.
- **Lazy loading**: Game components are wrapped in `React.lazy()` so only the selected game's code is loaded into memory. Other games remain as separate chunks.
- **No runtime plugin loading**: Since all games are bundled with the app (offline requirement), plugins are registered at build time via static imports in a registry file. No dynamic fetch needed.
- **Extension mechanism**: Adding a new game = create folder in `src/games/`, implement the `GamePlugin` interface, add one import line to the registry. No other file modifications required.
- **Constitution compliance**: Satisfies Principle VI (Standalone Extensibility) — adding a game doesn't modify existing game code.

### Interface sketch:
```typescript
interface GamePlugin {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType;
  component: React.LazyExoticComponent<React.ComponentType>;
  defaultRoundSize: number;
  difficulties: Difficulty[];
  pointsPerItem: number;
}
```

---

## 7. Text Normalization (Diacritics)

### Decision: Unicode NFD decomposition + regex strip

### Rationale:
- **Approach**: Normalize both the expected answer and user input using `String.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()`. This strips all combining diacritical marks.
- **Why NFD**: Standard Unicode normalization form that separates base characters from combining marks. Works for all Portuguese diacritics (ã, é, ç, ô, ü, etc.).
- **No external library needed**: Native JavaScript `String.normalize()` is supported in all modern browsers.
- **Case-insensitive**: `toLowerCase()` ensures "Maçã" matches "maca".

---

## 8. Gesture Detection (Word Search swipe)

### Decision: Framer Motion pan gestures + custom grid logic

### Rationale:
- **Framer Motion `onPan`**: Provides pan start, pan move, pan end events with velocity and offset data. No additional gesture library needed.
- **Grid mapping**: Convert pan coordinates to grid cell indices using element positions. Track the sequence of cells traversed during the pan.
- **Validation**: On pan end, check if the cell sequence forms a valid word from the word list.
- **Why not a separate gesture library (Hammer.js, use-gesture)**: Framer Motion already includes gesture support — adding another library violates Principle II (Simplicity).

---

## 9. PWA Install & Offline Verification

### Decision: `beforeinstallprompt` + Lighthouse CI

### Rationale:
- **Installability**: The app uses a valid `manifest.json` with icons, name, start_url, and display: standalone. Browsers auto-detect installability.
- **Install prompt**: Capture the `beforeinstallprompt` event to show a custom "Instalar" button if the user hasn't installed yet. Non-intrusive — only shows after first game completion.
- **Offline testing**: Playwright tests with network disabled verify all games load and function. Lighthouse CI in the pipeline verifies PWA score ≥ 95.
- **iOS limitations**: iOS Safari doesn't support `beforeinstallprompt`. The app will show a manual "Add to Home Screen" instruction for iOS users.

---

## 10. Content Data Format

### Decision: Static JSON files bundled with the app

### Rationale:
- **Word lists**: `words-easy.json`, `words-medium.json`, `words-hard.json` — arrays of strings, one per difficulty level.
- **Crossword clues**: `clues-easy.json`, etc. — array of `{ word, clue }` objects.
- **Emoji dictionary**: `emoji-dictionary.json` — array of `{ emoji, words: string[], difficulty }` objects.
- **Why JSON**: Native parsing, tree-shakeable if imported statically, easily editable, no build step for content updates.
- **Content size estimate**: ~50KB total for all game data (well within the 5MB budget).
- **Future**: Content can be expanded by editing JSON files without code changes.
