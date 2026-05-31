# Implementation Plan: Educational Games PWA

**Branch**: `001-educational-games-pwa` | **Date**: 2026-05-31 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-educational-games-pwa/spec.md`

## Summary

PWA mobile-first e offline-capable com 3 jogos educativos infantis (Caça-Palavras, Cruzadinha, Adivinhe o Emoji) para crianças de até 10 anos. Arquitetura baseada em componentes com registro dinâmico de jogos (plugin pattern), pontuação individualizada por jogo e dificuldade, e sistema de estrelas por desempenho. Stack: React + TypeScript + Vite + Workbox (Service Worker), armazenamento local via IndexedDB, sem backend.

## Technical Context

**Language/Version**: TypeScript 5.5+ (strict mode)

**Primary Dependencies**: React 18+ (component-based architecture, hooks, lazy loading), Vite 6+ (build tool, PWA plugin), Workbox (service worker/offline cache), zustand (lightweight state management), framer-motion (animações performáticas)

**Storage**: IndexedDB via idb (pontuações, estado de partida, preferências) — sem backend, 100% local

**Testing**: Vitest (unit/integration), Playwright (E2E, PWA offline testing), Testing Library (component tests)

**Target Platform**: PWA instalável — smartphones Android 8+, iOS 14+ (Safari), Windows 10+ (Edge/Chrome). Mobile-first, responsivo 320px-1024px.

**Project Type**: PWA / Single Page Application (client-only, zero-backend)

**Performance Goals**: 60 fps em animações e interações; First Contentful Paint < 2s; Time to Interactive < 5s; transições < 300ms

**Constraints**: Offline-capable após primeiro load; < 5MB bundle total (inicial + todos os jogos); toque mínimo 44x44px; sem coleta de dados; sem dependência de rede

**Scale/Scope**: 3 jogos iniciais, ~8 telas (home + 3 jogos × 2 telas cada + resultado), ~50 componentes; arquitetura para suportar N jogos futuros

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Code Quality | ✅ PASS | TypeScript strict, Vitest + Playwright, ESLint strict config |
| II. Simplicity | ✅ PASS | Zero backend, minimal deps (React + Vite + Workbox), flat structure |
| III. UX Consistency | ✅ PASS | Single design system, shared animation library, consistent feedback patterns |
| IV. Performance | ✅ PASS | 60fps target, < 5MB budget, Lighthouse CI, lazy loading per game |
| V. Maintainability | ✅ PASS | Feature-based folder structure, single-responsibility modules, DI via React Context |
| VI. Extensibility | ✅ PASS | Game registry pattern, each game is an independent module, no cross-game coupling |

**Gate Result**: PASS — no violations detected. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-educational-games-pwa/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── game-plugin.md   # Game plugin interface contract
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Root component with router
├── service-worker.ts           # Workbox SW registration
├── manifest.json               # PWA manifest
├── index.html                  # HTML shell
├── core/                       # Shared infrastructure
│   ├── registry/               # Game registry (plugin system)
│   │   ├── game-registry.ts    # Registry singleton
│   │   └── types.ts            # GamePlugin interface
│   ├── storage/                # IndexedDB abstraction
│   │   ├── db.ts               # Database setup & migrations
│   │   ├── score-store.ts      # Score persistence
│   │   └── session-store.ts    # Game session persistence
│   ├── scoring/                # Scoring engine
│   │   └── scoring-engine.ts   # Points & stars calculation
│   ├── text/                   # Text utilities
│   │   └── normalize.ts        # Diacritics/case normalization
│   └── hooks/                  # Shared React hooks
│       ├── use-game-session.ts
│       └── use-scores.ts
├── design-system/              # UI design system
│   ├── tokens/                 # Colors, spacing, typography
│   ├── components/             # Shared UI components
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── StarRating.tsx
│   │   ├── CelebrationAnimation.tsx
│   │   ├── DifficultySelector.tsx
│   │   ├── ScoreDisplay.tsx
│   │   └── Keyboard.tsx        # Custom child-friendly keyboard
│   └── animations/             # Shared animation presets
├── pages/                      # App-level pages
│   ├── HomePage.tsx            # Game catalog grid
│   └── GameShell.tsx           # Wraps any game (header, back, scoring)
└── games/                      # Each game is a self-contained module
    ├── word-search/            # Caça-Palavras
    │   ├── index.ts            # Plugin registration export
    │   ├── WordSearchGame.tsx  # Main game component
    │   ├── components/         # Game-specific components
    │   ├── logic/              # Grid generation, word placement
    │   └── data/               # Word lists (easy/medium/hard)
    ├── crossword/              # Cruzadinha
    │   ├── index.ts
    │   ├── CrosswordGame.tsx
    │   ├── components/
    │   ├── logic/              # Puzzle generation, clue matching
    │   └── data/               # Word lists + clues
    └── emoji-guess/            # Adivinhe o Emoji
        ├── index.ts
        ├── EmojiGuessGame.tsx
        ├── components/
        ├── logic/              # Answer validation
        └── data/               # Emoji dictionary (emoji → words[])

tests/
├── unit/                       # Vitest unit tests
│   ├── core/
│   └── games/
├── integration/                # Component integration tests
│   ├── core/
│   └── games/
└── e2e/                        # Playwright E2E tests
    ├── navigation.spec.ts
    ├── offline.spec.ts
    └── games/

public/
├── icons/                      # PWA icons (various sizes)
├── splash/                     # Splash screens
└── fonts/                      # Child-friendly font files
```

**Structure Decision**: Single-project PWA with feature-based module organization. Each game is a self-contained folder under `src/games/` that exports a plugin registration. The `core/registry/` module discovers and loads games dynamically. No monorepo or backend project needed.

## Complexity Tracking

> No constitution violations detected — table not needed.
