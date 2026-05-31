# Quickstart: Educational Games PWA

**Feature**: 001-educational-games-pwa
**Date**: 2026-05-31

## Prerequisites

- Node.js 20+ (LTS)
- npm 10+ or pnpm 9+
- Modern browser (Chrome 90+, Firefox 90+, Safari 15+, Edge 90+)

## Setup (first time)

```bash
# Clone and install
git clone <repo-url> madu-games
cd madu-games
npm install

# Start development server
npm run dev
```

The app opens at `http://localhost:5173` with hot-reload.

## Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server (HMR, no SW) |
| `npm run build` | Production build (optimized, SW generated) |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run Vitest unit/integration tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run lint` | Run ESLint (strict) |
| `npm run format` | Run Prettier |
| `npm run lighthouse` | Run Lighthouse CI (PWA score) |

## Testing Offline

1. Run `npm run build`
2. Run `npm run preview`
3. Open browser DevTools → Application → Service Workers → verify "Activated"
4. Toggle "Offline" in Network tab
5. Reload — app should work fully offline

## Adding a New Game

1. Create folder: `src/games/{game-id}/`
2. Create files:
   ```
   src/games/{game-id}/
   ├── index.ts              # Export GamePlugin
   ├── {GameName}Game.tsx    # Main game component
   ├── components/           # Game-specific UI
   ├── logic/                # Game algorithms
   └── data/                 # Static content (JSON)
   ```
3. Implement `GamePlugin` interface (see `contracts/game-plugin.md`)
4. Register in `src/games/index.ts`:
   ```typescript
   import { plugin as newGame } from './{game-id}';
   gameRegistry.register(newGame);
   ```
5. Run `npm run dev` — new game appears on home screen automatically

## Project Structure (key paths)

```
src/
├── core/registry/    → Game plugin system
├── core/storage/     → IndexedDB persistence
├── core/scoring/     → Score calculation
├── core/text/        → Diacritics normalization
├── design-system/    → Shared UI components
├── pages/            → App-level screens
└── games/            → One folder per game (self-contained)
```

## Performance Validation

- **Build budget**: Total bundle < 5MB (check with `npm run build`)
- **Lighthouse**: PWA score ≥ 95, Performance ≥ 90
- **FPS**: Use Chrome DevTools Performance tab during gameplay (target: 60fps)
- **Transitions**: Measure with Performance.mark() — target < 300ms

## Key Design Decisions

- No backend — everything runs client-side
- IndexedDB for persistence (scores, game state)
- Service Worker precaches all assets at install time
- Each game is lazy-loaded (code-split per game)
- Text normalization: NFD decomposition strips diacritics for comparison
- Scoring: fixed points × correct items (no time bonus)
- Stars: ≥50% = ★, ≥75% = ★★, 100% = ★★★
